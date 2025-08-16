import { getApiKey } from "./crypto";

const API_KEY = getApiKey();

if (!API_KEY) {
  console.warn("⚠️ API ключ не найден или неверный!");
}
const BASE_URL = "https://api.weatherapi.com/v1";

function handleApiError(status: number): never {
  if (status === 400) {
    throw new Error(
      `Ошибка API: Неверный запрос. Проверьте API ключ и название города.`
    );
  } else if (status === 401) {
    throw new Error(`Ошибка API: Неверный API ключ. Проверьте файл .env`);
  } else if (status === 403) {
    throw new Error(`Ошибка API: Превышен лимит запросов. Попробуйте позже.`);
  } else {
    throw new Error(`Ошибка API: HTTP ${status}`);
  }
}

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
    tz_id: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    humidity: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    uv: number;
    is_day: number;
    vis_km: number;
    gust_kph: number;
    precip_mm: number;
    cloud: number;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        uv: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: number;
        is_moon_up: number;
        is_sun_up: number;
      };
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        humidity: number;
        will_it_rain: number;
        chance_of_rain: number;
        vis_km: number;
        uv: number;
        is_day: number;
      }>;
    }>;
  };
}

export interface ProcessedWeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDegree: number;
  windDir: string;
  pressure: number;
  icon: string;
  uv: number;
  isDay: boolean;
  visibility: number;
  gustSpeed: number;
  precipitation: number;
  cloudCover: number;
  lat?: number;
  lon?: number;
}

export interface ProcessedForecastData {
  day: string;
  date: string;
  temp: number;
  icon: string;
  condition: string;
  maxTemp: number;
  minTemp: number;
  maxWind: number;
  totalPrecip: number;
  avgHumidity: number;
  willItRain: boolean;
  chanceOfRain: number;
  uv: number;
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moonPhase: string;
    moonIllumination: number;
  };
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
    icon: string;
    windSpeed: number;
    windDir: string;
    humidity: number;
    willItRain: boolean;
    chanceOfRain: number;
    visibility: number;
    uv: number;
    isDay: boolean;
  }>;
}

// Удаляем неиспользуемую функцию

const translateWeatherCondition = (text: string): string => {
  const translations: Record<string, string> = {
    // Ясная погода
    Clear: "Ясно",
    Sunny: "Солнечно",
    "Partly cloudy": "Переменная облачность",
    "Partly Cloudy": "Переменная облачность",
    Cloudy: "Облачно",
    Overcast: "Пасмурно",

    // Дождь
    "Patchy rain possible": "Возможен небольшой дождь",
    "Patchy light drizzle": "Местами легкая морось",
    "Light drizzle": "Легкая морось",
    "Patchy rain nearby": "Местами дождь поблизости",
    "Light rain": "Легкий дождь",
    "Moderate rain at times": "Временами умеренный дождь",
    "Moderate rain": "Умеренный дождь",
    "Heavy rain at times": "Временами сильный дождь",
    "Heavy rain": "Сильный дождь",
    "Light rain shower": "Легкий ливень",
    "Moderate or heavy rain shower": "Умеренный или сильный ливень",
    "Torrential rain shower": "Проливной дождь",

    // Снег
    "Patchy snow possible": "Возможен небольшой снег",
    "Patchy light snow": "Местами легкий снег",
    "Light snow": "Легкий снег",
    "Patchy moderate snow": "Местами умеренный снег",
    "Moderate snow": "Умеренный снег",
    "Patchy heavy snow": "Местами сильный снег",
    "Heavy snow": "Сильный снег",
    Blizzard: "Метель",
    "Blowing snow": "Поземка",

    // Смешанные осадки
    "Patchy sleet possible": "Возможен мокрый снег",
    "Light sleet": "Легкий мокрый снег",
    "Moderate or heavy sleet": "Умеренный или сильный мокрый снег",
    "Light sleet showers": "Легкий мокрый снег",
    "Moderate or heavy sleet showers": "Умеренный или сильный мокрый снег",

    // Лед
    "Light freezing rain": "Легкий ледяной дождь",
    "Moderate or heavy freezing rain": "Умеренный или сильный ледяной дождь",
    "Light freezing drizzle": "Легкая ледяная морось",
    "Heavy freezing drizzle": "Сильная ледяная морось",
    "Light showers of ice pellets": "Легкий град",
    "Moderate or heavy showers of ice pellets": "Умеренный или сильный град",

    // Туман
    Mist: "Туман",
    Fog: "Туман",
    "Freezing fog": "Ледяной туман",

    // Гроза
    "Thundery outbreaks possible": "Возможны грозы",
    "Patchy light rain with thunder": "Местами легкий дождь с грозой",
    "Moderate or heavy rain with thunder":
      "Умеренный или сильный дождь с грозой",
    "Patchy light snow with thunder": "Местами легкий снег с грозой",
    "Moderate or heavy snow with thunder":
      "Умеренный или сильный снег с грозой",

    // Общие
    Unknown: "Неизвестно",
  };

  return translations[text] || text;
};

const getWeatherTypeByCode = (code: number): string => {
  if (code >= 1000 && code <= 1003) return "☀️";
  if (code >= 1006 && code <= 1009) return "☁️";
  if (code === 1030) return "🌫️";
  if (code >= 1063 && code <= 1087) return "🌧️";
  if (code >= 1114 && code <= 1117) return "❄️";
  if (code >= 1135 && code <= 1147) return "🌫️";
  if (code >= 1150 && code <= 1282) return "🌧️";
  return "☁️";
};

export async function getCurrentWeather(
  city: string
): Promise<ProcessedWeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(
        city
      )}&aqi=no`
    );

    if (!response.ok) {
      handleApiError(response.status);
    }

    const data: WeatherData = await response.json();

    return {
      city: data.location.name,
      temperature: Math.round(data.current.temp_c),
      feelsLike: Math.round(data.current.feelslike_c),
      condition: translateWeatherCondition(data.current.condition.text),
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_kph),
      windDegree: data.current.wind_degree,
      windDir: data.current.wind_dir,
      pressure: data.current.pressure_mb,
      icon: getWeatherTypeByCode(data.current.condition.code),
      uv: data.current.uv,
      isDay: data.current.is_day === 1,
      visibility: data.current.vis_km,
      gustSpeed: Math.round(data.current.gust_kph),
      precipitation: data.current.precip_mm,
      cloudCover: data.current.cloud,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export async function getWeatherForecast(
  city: string,
  days: number = 5
): Promise<ProcessedForecastData[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
        city
      )}&days=${days}&aqi=no&alerts=no`
    );

    if (!response.ok) {
      handleApiError(response.status);
    }

    const data: WeatherData = await response.json();

    if (!data.forecast) {
      throw new Error("No forecast data available");
    }

    return data.forecast.forecastday.map((day, index) => {
      const date = new Date(day.date);
      const dayNames = [
        "Сегодня",
        "Завтра",
        "Послезавтра",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье",
      ];
      const dayName =
        index < 3
          ? dayNames[index]
          : date.toLocaleDateString("ru-RU", { weekday: "long" });

      const formattedDate = date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
      });

      // Обрабатываем почасовые данные
      const hourly = day.hour.map((hour) => ({
        time: hour.time,
        temp: Math.round(hour.temp_c),
        condition: translateWeatherCondition(hour.condition.text),
        icon: getWeatherTypeByCode(hour.condition.code),
        windSpeed: Math.round(hour.wind_kph),
        windDir: hour.wind_dir,
        humidity: hour.humidity,
        willItRain: hour.will_it_rain === 1,
        chanceOfRain: hour.chance_of_rain,
        visibility: hour.vis_km,
        uv: hour.uv,
        isDay: hour.is_day === 1,
      }));

      return {
        day: dayName,
        date: day.date,
        dateFormatted: formattedDate,
        temp: Math.round(day.day.avgtemp_c),
        icon: getWeatherTypeByCode(day.day.condition.code),
        condition: translateWeatherCondition(day.day.condition.text),
        maxTemp: Math.round(day.day.maxtemp_c),
        minTemp: Math.round(day.day.mintemp_c),
        maxWind: Math.round(day.day.maxwind_kph),
        totalPrecip: day.day.totalprecip_mm,
        avgHumidity: day.day.avghumidity,
        willItRain: day.day.daily_will_it_rain === 1,
        chanceOfRain: day.day.daily_chance_of_rain,
        uv: day.day.uv,
        astro: {
          sunrise: day.astro.sunrise,
          sunset: day.astro.sunset,
          moonrise: day.astro.moonrise,
          moonset: day.astro.moonset,
          moonPhase: day.astro.moon_phase,
          moonIllumination: day.astro.moon_illumination,
        },
        hourly,
      };
    });
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
}

export async function getWeatherByCoords(
  lat: number,
  lon: number
): Promise<ProcessedWeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`
    );

    if (!response.ok) {
      handleApiError(response.status);
    }

    const data: WeatherData = await response.json();

    return {
      city: data.location.name,
      temperature: Math.round(data.current.temp_c),
      feelsLike: Math.round(data.current.feelslike_c),
      condition: translateWeatherCondition(data.current.condition.text),
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_kph),
      windDegree: data.current.wind_degree,
      windDir: data.current.wind_dir,
      pressure: data.current.pressure_mb,
      icon: getWeatherTypeByCode(data.current.condition.code),
      uv: data.current.uv,
      isDay: data.current.is_day === 1,
      visibility: data.current.vis_km,
      gustSpeed: Math.round(data.current.gust_kph),
      precipitation: data.current.precip_mm,
      cloudCover: data.current.cloud,
      lat: data.location.lat,
      lon: data.location.lon,
    };
  } catch (error) {
    console.error("Error fetching weather data by coordinates:", error);
    throw error;
  }
}

export async function getWeatherForecastByCoords(
  lat: number,
  lon: number,
  days: number = 5
): Promise<ProcessedForecastData[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=${days}&aqi=no&alerts=no`
    );

    if (!response.ok) {
      handleApiError(response.status);
    }

    const data: WeatherData = await response.json();

    if (!data.forecast) {
      throw new Error("No forecast data available");
    }

    return data.forecast.forecastday.map((day, index) => {
      const date = new Date(day.date);
      const dayNames = [
        "Сегодня",
        "Завтра",
        "Послезавтра",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье",
      ];
      const dayName =
        index < 3
          ? dayNames[index]
          : date.toLocaleDateString("ru-RU", { weekday: "long" });

      const formattedDate = date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
      });

      // Обрабатываем почасовые данные
      const hourly = day.hour.map((hour) => ({
        time: hour.time,
        temp: Math.round(hour.temp_c),
        condition: translateWeatherCondition(hour.condition.text),
        icon: getWeatherTypeByCode(hour.condition.code),
        windSpeed: Math.round(hour.wind_kph),
        windDir: hour.wind_dir,
        humidity: hour.humidity,
        willItRain: hour.will_it_rain === 1,
        chanceOfRain: hour.chance_of_rain,
        visibility: hour.vis_km,
        uv: hour.uv,
        isDay: hour.is_day === 1,
      }));

      return {
        day: dayName,
        date: day.date,
        dateFormatted: formattedDate,
        temp: Math.round(day.day.avgtemp_c),
        icon: getWeatherTypeByCode(day.day.condition.code),
        condition: translateWeatherCondition(day.day.condition.text),
        maxTemp: Math.round(day.day.maxtemp_c),
        minTemp: Math.round(day.day.mintemp_c),
        maxWind: Math.round(day.day.maxwind_kph),
        totalPrecip: day.day.totalprecip_mm,
        avgHumidity: day.day.avghumidity,
        willItRain: day.day.daily_will_it_rain === 1,
        chanceOfRain: day.day.daily_chance_of_rain,
        uv: day.day.uv,
        astro: {
          sunrise: day.astro.sunrise,
          sunset: day.astro.sunset,
          moonrise: day.astro.moonrise,
          moonset: day.astro.moonset,
          moonPhase: day.astro.moon_phase,
          moonIllumination: day.astro.moon_illumination,
        },
        hourly,
      };
    });
  } catch (error) {
    console.error("Error fetching forecast data by coordinates:", error);
    throw error;
  }
}

export async function getFullWeatherData(
  city: string,
  days: number = 3
): Promise<any> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
        city
      )}&days=${days}&aqi=no&alerts=no`
    );

    if (!response.ok) {
      handleApiError(response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching full weather data:", error);
    throw error;
  }
}
