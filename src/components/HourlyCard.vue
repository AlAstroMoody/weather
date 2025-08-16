<template>
  <div class="hourly-card" :class="size">
    <div class="hour-time">{{ formatTime(time) }}</div>
    <div class="hour-icon">
      <span class="weather-emoji">{{ icon }}</span>
    </div>
    <div class="hour-temp">{{ Math.round(temp) }}°</div>
    <div class="hour-rain" v-if="chanceOfRain > 0">
      <span class="rain-icon">💧</span>
      {{ chanceOfRain }}%
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  time: string;
  temp: number;
  icon: string;
  chanceOfRain: number;
  size?: "default" | "modal";
}

defineProps<Props>();

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
</script>

<style scoped>
.hourly-card {
  flex-shrink: 0;
  background: var(--bg-primary);
  border-radius: 10px;
  padding: 10px 6px;
  text-align: center;
  min-width: 60px;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
    inset -2px -2px 4px rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.hourly-card:hover {
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.25),
    inset -3px -3px 6px rgba(255, 255, 255, 0.1);
  background: var(--bg-secondary);
}

.hour-time {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.hour-icon {
  margin-bottom: 4px;
}

.weather-emoji {
  font-size: 20px;
  display: block;
}

.hour-temp {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.hour-rain {
  font-size: 0.6rem;
  color: #60a5fa;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.rain-icon {
  font-size: 0.7rem;
}

/* Стили для модального размера */
.hourly-card.modal {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 16px 12px;
  min-width: auto;
}

.hourly-card.modal .hour-time {
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.hourly-card.modal .hour-icon {
  margin-bottom: 8px;
}

.hourly-card.modal .weather-emoji {
  font-size: 32px;
}

.hourly-card.modal .hour-temp {
  font-size: 1.2rem;
  margin-bottom: 6px;
}

.hourly-card.modal .hour-rain {
  font-size: 0.7rem;
}

.hourly-card.modal .rain-icon {
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .hourly-card {
    min-width: 50px;
    padding: 8px 4px;
  }

  .weather-emoji {
    font-size: 16px;
  }

  .hour-temp {
    font-size: 0.8rem;
  }

  .hour-time {
    font-size: 0.6rem;
  }
}
</style>
