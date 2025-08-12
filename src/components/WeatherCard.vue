<template>
  <div class="weather-card neumorphism">
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
        <div class="detail-item">
          <div class="detail-icon">💧</div>
          <div class="detail-text">
            <span class="detail-value">{{ weather.humidity }}%</span>
            <span class="detail-label">Влажность</span>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-icon">💨</div>
          <div class="detail-text">
            <span class="detail-value">{{ weather.windSpeed }}</span>
            <span class="detail-label">км/ч</span>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-icon">🌡️</div>
          <div class="detail-text">
            <span class="detail-value">{{ weather.pressure }}</span>
            <span class="detail-label">гПа</span>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-icon">☀️</div>
          <div class="detail-text">
            <span class="detail-value">{{ weather.uv }}</span>
            <span class="detail-label">UV</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  uv: number;
  isDay: boolean;
}

const props = defineProps<{
  weather: WeatherData;
}>();

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
</script>

<style scoped>
.weather-card {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
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
  margin-bottom: 20px;
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
  padding-top: 15px;
}

.details-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
    inset -2px -2px 4px rgba(255, 255, 255, 0.05);
}

.detail-item:hover {
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.25),
    inset -3px -3px 6px rgba(255, 255, 255, 0.1);
  background: var(--bg-secondary);
}

.detail-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.detail-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
