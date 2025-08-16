<template>
  <div class="weather-card">
    <!-- Основная информация -->
    <div class="weather-main">
      <div class="weather-info">
        <div class="main-info-section">
          <div class="location-section">
            <h2 class="city-name">{{ weather.city }}</h2>
            <div class="weather-status">
              <span class="condition">{{ weather.condition }}</span>
              <span class="feels-like"
                >Ощущается как {{ weather.feelsLike }}°C</span
              >
            </div>
          </div>

          <div class="temperature-section">
            <div class="temp-display">
              <span class="temp-value">{{ weather.temperature }}</span>
              <span class="temp-unit">°C</span>
            </div>
          </div>
        </div>
      </div>

      <div class="weather-visual">
        <div class="weather-icon">
          <span v-if="weatherIcon">{{ weatherIcon }}</span>
        </div>
      </div>
    </div>

    <!-- Компактные детали -->
    <div class="weather-details">
      <div class="details-row">
        <DetailItem
          v-for="detail in mainDetails"
          :key="detail.label"
          :icon="detail.icon"
          :value="detail.value"
          :label="detail.label"
        />
      </div>
    </div>

    <!-- Кнопка расширенной информации -->
    <div class="expand-section">
      <button
        class="expand-button"
        @click="isExpanded = !isExpanded"
        :title="isExpanded ? 'Скрыть детали' : 'Подробнее'"
      >
        <span class="expand-icon">{{ isExpanded ? "−" : "⌄" }}</span>
      </button>
    </div>

    <!-- Расширенная информация -->
    <div class="expanded-details" :class="{ expanded: isExpanded }">
      <div class="details-grid">
        <!-- Основные детали -->
        <DetailCard
          v-for="(detail, index) in expandedDetails"
          :key="detail.title"
          :title="detail.title"
          :icon="detail.icon"
          :style="{ '--card-index': index }"
        >
          <div
            v-for="item in detail.items"
            :key="item.label"
            class="detail-row"
          >
            <span class="detail-label">{{ item.label }}</span>
            <span class="detail-value">{{ item.value }}</span>
          </div>
        </DetailCard>

        <!-- Астрономические данные -->
        <DetailCard
          v-if="astronomicalDetails"
          :title="astronomicalDetails.title"
          :icon="astronomicalDetails.icon"
          :style="{ '--card-index': expandedDetails.length }"
        >
          <div
            v-for="item in astronomicalDetails.items"
            :key="item.label"
            class="detail-row"
          >
            <span class="detail-label">{{ item.label }}</span>
            <span class="detail-value">{{ item.value }}</span>
          </div>
        </DetailCard>

        <!-- Луна -->
        <DetailCard
          v-if="moonDetails"
          :title="moonDetails.title"
          :icon="moonDetails.icon"
          :style="{
            '--card-index':
              expandedDetails.length + (astronomicalDetails ? 1 : 0),
          }"
        >
          <div
            v-for="item in moonDetails.items"
            :key="item.label"
            class="detail-row"
          >
            <span class="detail-label">{{ item.label }}</span>
            <span class="detail-value">{{ item.value }}</span>
          </div>
        </DetailCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import DetailCard from "./DetailCard.vue";
import DetailItem from "./DetailItem.vue";

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDegree: number;
  windDir: string;
  pressure: number;
  feelsLike: number;
  uv: number;
  isDay: boolean;
  visibility: number;
  gustSpeed: number;
  precipitation: number;
  cloudCover: number;
  lat?: number;
  lon?: number;
}

interface AstronomicalData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moonPhase: string;
  moonIllumination: number;
}

const props = defineProps<{
  weather: WeatherData;
  astro?: AstronomicalData | null;
}>();

const isExpanded = ref(false);

const weatherIcon = computed(() => {
  const iconMap: Record<string, string> = {
    sunny: "☀️",
    cloudy: "☁️",
    rainy: "🌧️",
    "partly-cloudy": "⛅",
    snowy: "❄️",
    stormy: "⛈️",
  };
  return iconMap[props.weather.icon] || "🌤️";
});

// Массив для основных деталей
const mainDetails = computed(() => [
  {
    icon: "💧",
    value: `${props.weather.humidity}%`,
    label: "Влажность",
  },
  {
    icon: "💨",
    value: props.weather.windSpeed,
    label: "км/ч",
  },
  {
    icon: "🌡️",
    value: props.weather.pressure,
    label: "гПа",
  },
  {
    icon: "☀️",
    value: props.weather.uv,
    label: "UV",
  },
]);

// Массив для расширенных деталей
const expandedDetails = computed(() => [
  {
    icon: "💨",
    title: "Ветер",
    items: [
      { label: "Направление:", value: props.weather.windDir },
      { label: "Порывы:", value: `${props.weather.gustSpeed} км/ч` },
    ],
  },
  {
    icon: "🌫️",
    title: "Атмосфера",
    items: [
      { label: "Видимость:", value: `${props.weather.visibility} км` },
      { label: "Облачность:", value: `${props.weather.cloudCover}%` },
    ],
  },
  {
    icon: "🌧️",
    title: "Осадки",
    items: [
      { label: "Количество:", value: `${props.weather.precipitation} мм` },
    ],
  },
]);

// Астрономические данные
const astronomicalDetails = computed(() => {
  if (!props.astro) return null;

  return {
    icon: "☀️",
    title: "Солнце",
    items: [
      { label: "Восход:", value: props.astro.sunrise },
      { label: "Закат:", value: props.astro.sunset },
    ],
  };
});

const moonDetails = computed(() => {
  if (!props.astro) return null;

  return {
    icon: "🌙",
    title: "Луна",
    items: [
      { label: "Фаза:", value: translateMoonPhase(props.astro.moonPhase) },
      { label: "Освещенность:", value: `${props.astro.moonIllumination}%` },
    ],
  };
});

function translateMoonPhase(phase: string): string {
  const translations: Record<string, string> = {
    "New Moon": "Новая",
    "Waxing Crescent": "Серп",
    "First Quarter": "1/4",
    "Waxing Gibbous": "Растущая",
    "Full Moon": "Полная",
    "Waning Gibbous": "Убывающая",
    "Last Quarter": "3/4",
    "Waning Crescent": "Серп",
  };

  return translations[phase] || phase;
}
</script>

<style scoped>
.weather-card {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: var(--neumorphism);
  position: relative;
  overflow: hidden;
}

.weather-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    rgba(79, 70, 229, 0.3),
    rgba(124, 58, 237, 0.3)
  );
  border-radius: 24px 24px 0 0;
}

.weather-card:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.08);
}

.weather-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.weather-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-info-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.location-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.city-name {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  background: linear-gradient(
    135deg,
    var(--text-primary),
    var(--accent-primary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.weather-status {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.condition {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}

.feels-like {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.temperature-section {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.temp-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.temp-value {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.temp-unit {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.weather-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.weather-icon {
  font-size: 4rem;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.05);
  }
}

.weather-details {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 10px;
}

.details-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

/* Расширенная информация */
.expand-section {
  display: flex;
  justify-content: center;
}

.expand-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.expand-button:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  transform: scale(1.1);
}

.expand-icon {
  font-size: 1.2rem;
  font-weight: 600;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-button:hover .expand-icon {
  transform: scale(1.1);
}

.expanded-details {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.expanded-details.expanded {
  grid-template-rows: 1fr;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  min-height: 0;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.expanded-details.expanded .details-grid {
  opacity: 1;
  transform: translateY(0);
}

.expanded-details.expanded :deep(.detail-card) {
  animation: cardSlideIn 0.4s ease forwards;
  animation-delay: calc(var(--card-index, 0) * 0.1s);
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Стили для строк в DetailCard */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.detail-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Адаптивность */
@media (max-width: 768px) {
  .weather-card {
    padding: 15px;
    margin-bottom: 10px;
  }

  .weather-main {
    flex-direction: row;
    text-align: left;
    gap: 15px;
  }

  .weather-info {
    gap: 10px;
  }

  .main-info-section {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .weather-visual {
    min-width: 80px;
  }

  .weather-icon {
    font-size: 2.5rem;
  }

  .city-name {
    font-size: 1.3rem;
  }

  .temp-value {
    font-size: 2.5rem;
  }

  .temp-unit {
    font-size: 1.2rem;
  }

  .condition {
    font-size: 0.9rem;
  }

  .feels-like {
    font-size: 0.8rem;
  }

  .details-row {
    flex-wrap: wrap;
    gap: 8px;
  }

  .detail-item {
    flex: 1 1 calc(50% - 4px);
    min-width: 120px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .weather-card {
    padding: 20px;
  }

  .city-name {
    font-size: 1.6rem;
  }

  .temp-value {
    font-size: 3rem;
  }

  .weather-icon {
    font-size: 3.5rem;
  }

  .details-row {
    flex-direction: column;
    gap: 10px;
  }

  .detail-item {
    flex: none;
    padding: 12px;
  }

  .detail-icon {
    font-size: 1.2rem;
  }

  .detail-value {
    font-size: 1rem;
  }
}
</style>
