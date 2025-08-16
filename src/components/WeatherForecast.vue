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
            <div class="forecast-icon-section">
              <div class="forecast-icon">
                {{ getWeatherIcon(day.icon) }}
              </div>
              <!-- Кнопка деталей -->
              <button
                class="details-toggle"
                :class="{ active: selectedDay === day.date }"
                @click="toggleDayDetails(day.date)"
                :title="
                  selectedDay === day.date ? 'Скрыть детали' : 'Подробнее'
                "
              >
                <span class="toggle-icon">{{
                  selectedDay === day.date ? "−" : "⌄"
                }}</span>
              </button>
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

    <!-- Почасовая погода для выбранного дня (только на десктопе) -->
    <div
      v-if="selectedDayData && hourlyData.length > 0 && !isMobile"
      class="selected-day-details"
    >
      <div class="hourly-forecast">
        <div class="hourly-header">
          <h3 class="hourly-title">Почасовая погода</h3>
          <div class="hourly-subtitle">{{ getDayName(selectedDayData) }}</div>
        </div>
        <div class="hourly-container">
          <HourlyCard
            v-for="hour in hourlyData"
            :key="hour.time"
            :time="hour.time"
            :temp="hour.temp"
            :icon="hour.icon"
            :chance-of-rain="hour.chanceOfRain"
          />
        </div>
      </div>
    </div>

    <!-- Модальное окно для мобильных -->
    <HourlyModal
      :is-open="isModalOpen"
      :day-name="selectedDayData ? getDayName(selectedDayData) : ''"
      :hourly-data="hourlyData"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import HourlyModal from "./HourlyModal.vue";
import HourlyCard from "./HourlyCard.vue";

interface ForecastDay {
  date: string;
  day: string;
  temp: number;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
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

const props = defineProps<{
  forecast: ForecastDay[];
  isUpdating?: boolean;
}>();

const selectedDay = ref<string | null>(null);
const isModalOpen = ref(false);
const isMobile = ref(false);

// Определяем размер экрана
onMounted(() => {
  isMobile.value = window.innerWidth <= 768;
  const handleResize = () => {
    isMobile.value = window.innerWidth <= 768;
  };
  window.addEventListener("resize", handleResize);

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });
});

const selectedDayData = computed(() => {
  if (!selectedDay.value) return null;
  return props.forecast.find((day) => day.date === selectedDay.value);
});

const hourlyData = computed(() => {
  if (!selectedDayData.value?.hourly) return [];

  return selectedDayData.value.hourly.map((hour) => ({
    time: hour.time,
    temp: hour.temp,
    icon: hour.icon,
    chanceOfRain: hour.chanceOfRain,
  }));
});

function toggleDayDetails(date: string) {
  if (selectedDay.value === date) {
    selectedDay.value = null;
    isModalOpen.value = false;
  } else {
    selectedDay.value = date;

    // На мобильных открываем модальное окно
    if (isMobile.value) {
      isModalOpen.value = true;
    } else {
      // На десктопе показываем встроенную почасовую погоду
      setTimeout(() => {
        const detailsElement = document.querySelector(".selected-day-details");
        if (detailsElement) {
          detailsElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }, 100);
    }
  }
}

function closeModal() {
  isModalOpen.value = false;
  selectedDay.value = null;
}

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

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
  margin: 20px 0;
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
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
    inset -2px -2px 4px rgba(255, 255, 255, 0.05);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
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
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.25),
    inset -3px -3px 6px rgba(255, 255, 255, 0.1);
  background: var(--bg-secondary);
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

.forecast-icon-section {
  display: flex;
  align-items: center;
  gap: 8px;
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
    flex-direction: row;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .forecast-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .forecast-card {
    padding: 12px;
    min-height: 120px;
  }

  .forecast-icon {
    font-size: 1.8rem;
  }

  .temp-max {
    font-size: 1.1rem;
  }

  .temp-min {
    font-size: 0.9rem;
  }

  .date-day {
    font-size: 0.7rem;
  }
}

/* Кнопка деталей */
.details-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.details-toggle:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  transform: scale(1.1);
}

.details-toggle.active {
  background: var(--accent-primary);
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.toggle-icon {
  font-size: 1rem;
  font-weight: 600;
  transition: transform 0.3s ease;
}

/* Почасовая погода для выбранного дня */
.selected-day-details {
  margin-top: 20px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hourly-forecast {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 16px;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
    inset -2px -2px 4px rgba(255, 255, 255, 0.05);
}

.hourly-header {
  text-align: center;
  margin-bottom: 16px;
}

.hourly-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.hourly-subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.hourly-container {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: thin;
  scrollbar-color: var(--bg-tertiary) transparent;
}

.hourly-container::-webkit-scrollbar {
  height: 4px;
}

.hourly-container::-webkit-scrollbar-track {
  background: transparent;
}

.hourly-container::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 2px;
}

@media (max-width: 768px) {
  .selected-day-details {
    margin-top: 12px;
  }

  .hourly-forecast {
    padding: 8px;
  }

  .hourly-header {
    margin-bottom: 8px;
  }

  .hourly-title {
    font-size: 0.9rem;
  }

  .hourly-subtitle {
    font-size: 0.7rem;
  }

  .hourly-container {
    gap: 4px;
  }

  .hour-rain {
    font-size: 0.5rem;
  }

  .rain-icon {
    font-size: 0.6rem;
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

  /* Еще более компактная почасовая погода */
  .hourly-item {
    min-width: 40px;
    padding: 4px 2px;
  }

  .weather-emoji {
    font-size: 12px;
  }

  .hour-temp {
    font-size: 0.7rem;
  }

  .hour-time {
    font-size: 0.5rem;
  }

  .hour-rain {
    font-size: 0.45rem;
  }

  .rain-icon {
    font-size: 0.55rem;
  }
}
</style>
