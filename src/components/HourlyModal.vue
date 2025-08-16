<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Почасовая погода</h3>
          <div class="modal-subtitle">{{ dayName }}</div>
          <button class="modal-close" @click="closeModal">
            <span class="close-icon">×</span>
          </button>
        </div>

        <div class="modal-body">
          <div class="hourly-grid">
            <HourlyCard
              v-for="hour in hourlyData"
              :key="hour.time"
              :time="hour.time"
              :temp="hour.temp"
              :icon="hour.icon"
              :chance-of-rain="hour.chanceOfRain"
              size="modal"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import HourlyCard from "./HourlyCard.vue";

interface HourlyData {
  time: string;
  temp: number;
  icon: string;
  chanceOfRain: number;
}

interface Props {
  isOpen: boolean;
  dayName: string;
  hourlyData: HourlyData[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

function closeModal() {
  emit("close");
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

// Блокировка скролла при открытом модале
function preventScroll() {
  document.body.style.overflow = "hidden";
}

function allowScroll() {
  document.body.style.overflow = "";
}

onMounted(() => {
  if (props.isOpen) {
    preventScroll();
  }
});

onUnmounted(() => {
  allowScroll();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 10px;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  height: 90vh;
  max-height: 600px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 20px 20px 0 20px;
  text-align: center;
  position: relative;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.modal-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  opacity: 0.7;
  margin-bottom: 16px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: var(--bg-tertiary);
  border: none;
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: var(--accent-primary);
  transform: scale(1.1);
}

.close-icon {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
}

.modal-body {
  padding: 0 20px 20px 20px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
  min-height: 300px;
  scrollbar-width: thin;
  scrollbar-color: var(--bg-tertiary) transparent;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 3px;
}

.hourly-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 5px;
  }

  .modal-content {
    border-radius: 16px;
    height: 95vh;
    max-height: none;
  }

  .modal-header {
    padding: 20px 20px 0 20px;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .modal-subtitle {
    font-size: 1rem;
  }

  .modal-body {
    padding: 0 20px 20px 20px;
    max-height: calc(95vh - 140px);
    min-height: 250px;
  }

  .hourly-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 12px;
  }

  .hourly-item {
    padding: 14px 10px;
    border-radius: 14px;
  }

  .weather-emoji {
    font-size: 28px;
  }

  .hour-temp {
    font-size: 1.1rem;
  }

  .hour-time {
    font-size: 0.8rem;
  }

  .hour-rain {
    font-size: 0.8rem;
  }

  .rain-icon {
    font-size: 0.9rem;
  }
}
</style>
