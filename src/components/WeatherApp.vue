<template>
  <div class="weather-app animate-fade-in">
    <WeatherBackground :weather-type="currentWeatherType" client:only />

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
import { getCurrentWeather, getWeatherForecast } from "../lib/weatherApi";

const currentWeather = ref<any>(null);
const forecast = ref<any[]>([]);
const isUpdatingForecast = ref(false);
const isInitialLoading = ref(true);

const currentWeatherType = computed(() => {
  if (!currentWeather.value) return "sunny";
  return currentWeather.value.icon || "sunny";
});

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
    console.error("Ошибка обновления прогноза:", err);
  } finally {
    isUpdatingForecast.value = false;
  }
}

onMounted(async () => {
  try {
    // Проверяем сохраненное местоположение
    const savedLocation = localStorage.getItem("lastLocation");

    if (savedLocation) {
      const locationData = JSON.parse(savedLocation);
      currentWeather.value = await getCurrentWeather(locationData.city);
      forecast.value = await getWeatherForecast(locationData.city, 10);
    } else {
      // Загружаем Красноярск по умолчанию
      currentWeather.value = await getCurrentWeather("Красноярск");
      forecast.value = await getWeatherForecast("Красноярск", 10);
    }
  } catch (err) {
    console.error("Ошибка загрузки погоды:", err);
    // В случае ошибки загружаем Красноярск
    try {
      currentWeather.value = await getCurrentWeather("Красноярск");
      forecast.value = await getWeatherForecast("Красноярск", 10);
    } catch (fallbackErr) {
      console.error("Ошибка загрузки погоды по умолчанию:", fallbackErr);
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
  gap: 10px;
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
    padding: 15px;
  }

  .app-controls {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .app-title {
    font-size: 1.6rem;
    justify-content: center;
  }

  .title-icon {
    font-size: 1.4rem;
  }
}
</style>
