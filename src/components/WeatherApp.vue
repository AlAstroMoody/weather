<template>
  <div class="weather-app animate-fade-in">
    <WeatherBackgroundDev
      v-if="isDev"
      :weather-type="currentWeatherType"
      client:only
    />
    <WeatherBackground v-else :weather-type="currentWeatherType" client:only />

    <div class="app-controls">
      <div class="app-header">
        <h1 class="app-title">
          <span class="title-icon">🌤️</span>
          WeatherFlow
        </h1>
      </div>
      <LocationButton @weather-updated="updateWeatherData" />
    </div>

    <div v-if="isInitialLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>Загружаем погоду...</span>
    </div>

    <template v-else>
      <WeatherCard v-show="currentWeather" :weather="currentWeather" />
      <WeatherForecast
        v-show="forecast.length > 0"
        :forecast="forecast"
        :is-updating="isUpdatingForecast"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import LocationButton from "./LocationButton.vue";
import WeatherCard from "./WeatherCard.vue";
import WeatherForecast from "./WeatherForecast.vue";
import WeatherBackground from "./WeatherBackground.vue";
import WeatherBackgroundDev from "./WeatherBackground.dev.vue";
import { getCurrentWeather, getWeatherForecast } from "../lib/weatherApi";

const currentWeather = ref<any>(null);
const forecast = ref<any[]>([]);
const isUpdatingForecast = ref(false);
const isInitialLoading = ref(true);

const currentWeatherType = computed(() => {
  if (!currentWeather.value) return "sunny";
  return currentWeather.value.icon || "sunny";
});

const isDev = computed(() => import.meta.env.DEV);

async function updateWeatherData(weatherData: any) {
  currentWeather.value = weatherData;

  // Сохраняем местоположение в localStorage
  localStorage.setItem(
    "lastLocation",
    JSON.stringify({
      city: weatherData.city,
      timestamp: Date.now(),
    })
  );

  try {
    isUpdatingForecast.value = true;
    const cityName = weatherData.city;
    forecast.value = await getWeatherForecast(cityName, 10);
  } catch (err) {
    // Ошибка обновления прогноза
  } finally {
    isUpdatingForecast.value = false;
  }
}

onMounted(async () => {
  try {
    // Проверяем сохраненное местоположение
    const savedLocation = localStorage.getItem("lastLocation");
    const city = savedLocation ? JSON.parse(savedLocation).city : "Красноярск";

    // Загружаем данные параллельно
    const [weatherData, forecastData] = await Promise.all([
      getCurrentWeather(city),
      getWeatherForecast(city, 10),
    ]);

    currentWeather.value = weatherData;
    forecast.value = forecastData;
  } catch (err) {
    // Ошибка загрузки погоды - пробуем Красноярск
    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather("Красноярск"),
        getWeatherForecast("Красноярск", 10),
      ]);

      currentWeather.value = weatherData;
      forecast.value = forecastData;
    } catch (fallbackErr) {
      // Ошибка загрузки погоды по умолчанию
    }
  } finally {
    isInitialLoading.value = false;
  }
});
</script>

<style scoped>
.weather-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
  min-height: 100vh;
  color: var(--text-primary);
  position: relative;
  z-index: 1;
}

/* Состояния загрузки */
.weather-app > *[style*="display: none"] {
  opacity: 0;
}

.weather-app > *:not([style*="display: none"]) {
  opacity: 1;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: var(--text-secondary);
  gap: 20px;
}

.loading-container .loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(79, 70, 229, 0.3);
  border-top: 4px solid var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.app-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  min-height: 44px;
}

.app-header {
  flex: 1;
}

.app-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-secondary);
  opacity: 0.8;
  transition: opacity 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  line-height: 1;
}

.app-title:hover {
  opacity: 1;
}

.title-icon {
  font-size: 1.6rem;
  opacity: 0.7;
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .weather-app {
    padding: 10px 5px;
    min-height: 100vh;
  }

  .app-controls {
    flex-direction: row;
    gap: 8px;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px 0;
    min-height: 40px;
  }

  .app-title {
    font-size: 1.2rem;
    justify-content: flex-start;
    gap: 6px;
  }

  .title-icon {
    font-size: 1.2rem;
  }

  .loading-container {
    min-height: 200px;
    gap: 15px;
  }

  .loading-container .loading-spinner {
    width: 30px;
    height: 30px;
    border-width: 3px;
  }
}

@media (max-width: 480px) {
  .weather-app {
    padding: 8px 3px;
  }

  .app-controls {
    gap: 6px;
    margin-bottom: 8px;
    min-height: 36px;
  }

  .app-title {
    font-size: 1.1rem;
    gap: 4px;
  }

  .title-icon {
    font-size: 1rem;
  }
}
</style>
