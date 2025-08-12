<template>
  <div class="forecast-section">
    <div class="section-header">
      <h2 class="section-title">Прогноз погоды</h2>
      <div class="forecast-summary">
        <span class="summary-text">{{ forecast.length }} дней</span>
      </div>
    </div>

    <div class="forecast-container">
      <div v-if="isUpdating" class="forecast-loading">
        <div class="loading-spinner"></div>
        <span>Обновляем прогноз...</span>
      </div>
      <div v-else class="forecast-grid">
        <div
          v-for="(day, index) in forecast"
          :key="day.date"
          class="forecast-card"
          :class="{ today: index === 0 }"
        >
          <div class="forecast-header">
            <div class="forecast-date">
              <span class="date-day">{{ getDayName(day) }}</span>
              <span class="date-full">{{ getDateFull(day) }}</span>
            </div>
            <div class="forecast-icon">
              {{ getWeatherIcon(day.icon) }}
            </div>
          </div>

          <div class="forecast-temps">
            <div class="temp-range">
              <span class="temp-max">{{ day.maxTemp }}°</span>
              <span class="temp-min">{{ day.minTemp }}°</span>
            </div>
          </div>

          <div class="forecast-condition">{{ day.condition }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ForecastDay {
  date: string;
  dateFormatted: string;
  day: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
}

const props = defineProps<{
  forecast: ForecastDay[];
  isUpdating?: boolean;
}>();

function getWeatherIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    sunny: "☀️",
    cloudy: "☁️",
    rainy: "🌧️",
    "partly-cloudy": "⛅",
    snowy: "❄️",
    stormy: "⛈️",
  };
  return iconMap[icon] || "🌤️";
}

function getDayName(day: ForecastDay): string {
  return day.day;
}

function getDateFull(day: ForecastDay): string {
  const date = new Date(day.date);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}
</script>

<style scoped>
.forecast-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  background: linear-gradient(
    135deg,
    var(--text-primary),
    var(--accent-primary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.forecast-summary {
  background: var(--bg-tertiary);
  padding: 8px 16px;
  border-radius: 25px;
  box-shadow: var(--neumorphism);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.forecast-container {
  position: relative;
}

.forecast-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  gap: 15px;
}

.forecast-loading .loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(79, 70, 229, 0.3);
  border-top: 3px solid var(--accent-primary);
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

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.forecast-card {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--neumorphism);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.forecast-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgba(79, 70, 229, 0.3),
    rgba(124, 58, 237, 0.3)
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.forecast-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.08);
  background: var(--bg-tertiary);
}

.forecast-card:hover::before {
  opacity: 1;
}

.forecast-card.today {
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
  border: 1px solid rgba(79, 70, 229, 0.3);
}

.forecast-card.today::before {
  opacity: 1;
}

.forecast-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.forecast-date {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-day {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-full {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-primary);
}

.forecast-icon {
  font-size: 2.2rem;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-5px) scale(1.05);
  }
}

.forecast-temps {
  margin-bottom: 10px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.temp-range {
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: baseline;
}

.temp-max {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.temp-min {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.forecast-condition {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.3;
  text-align: center;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Адаптивность */
@media (max-width: 1400px) {
  .forecast-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .forecast-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .forecast-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .forecast-card {
    padding: 20px;
    min-height: 160px;
  }

  .forecast-icon {
    font-size: 2.2rem;
  }

  .temp-max {
    font-size: 1.4rem;
  }

  .temp-min {
    font-size: 1rem;
  }

  .date-day {
    font-size: 0.8rem;
  }

  .date-full {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .forecast-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .forecast-card {
    padding: 18px;
    min-height: 140px;
  }

  .forecast-icon {
    font-size: 2rem;
  }

  .temp-max {
    font-size: 1.3rem;
  }

  .temp-min {
    font-size: 0.9rem;
  }

  .forecast-condition {
    font-size: 0.8rem;
  }

  .date-day {
    font-size: 0.75rem;
  }

  .date-full {
    font-size: 0.8rem;
  }
}
</style>
