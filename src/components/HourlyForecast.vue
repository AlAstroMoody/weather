<template>
  <div class="hourly-forecast">
    <div class="hourly-header">
      <h3 class="hourly-title">Почасовая погода</h3>
      <div class="hourly-subtitle">Сегодня</div>
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
</template>

<script setup lang="ts">
import HourlyCard from "./HourlyCard.vue";

interface HourlyData {
  time: string;
  temp: number;
  icon: string;
  chanceOfRain: number;
}

interface Props {
  hourlyData: HourlyData[];
}

defineProps<Props>();
</script>

<style scoped>
.hourly-forecast {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
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
  .hourly-forecast {
    padding: 12px;
    margin-top: 12px;
  }

  .hourly-container {
    gap: 6px;
  }
}
</style>
