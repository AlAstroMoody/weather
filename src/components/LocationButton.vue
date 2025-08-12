<template>
  <div class="location-button-container">
    <button
      class="location-button"
      :class="{ loading: isLoading, success: statusType === 'success' }"
      :disabled="isLoading"
      @click="getLocation"
    >
      <div class="button-content">
        <div class="button-icon">
          <span v-if="!isLoading && statusType !== 'success'">📍</span>
          <span v-else-if="statusType === 'success'" class="success-icon"
            >✓</span
          >
          <div v-else class="loading-spinner"></div>
        </div>
        <span class="button-text">
          {{
            isLoading
              ? "Определяем..."
              : statusType === "success"
              ? "Найдено!"
              : "Моё местоположение"
          }}
        </span>
      </div>
    </button>

    <div
      v-if="statusMessage && statusType !== 'success'"
      class="location-status"
      :class="statusType"
    >
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getWeatherByCoords } from "../lib/weatherApi";

const emit = defineEmits<{
  "weather-updated": [weatherData: any];
}>();

const isLoading = ref(false);
const statusMessage = ref("");
const statusType = ref<"loading" | "success" | "error" | "">("");

function showStatus(message: string, type: "loading" | "success" | "error") {
  statusMessage.value = message;
  statusType.value = type;

  if (type === "success") {
    setTimeout(() => {
      statusMessage.value = "";
      statusType.value = "";
      isLoading.value = false;
    }, 2000);
  }
}

async function getLocation() {
  if (!navigator.geolocation) {
    showStatus("Геолокация не поддерживается вашим браузером", "error");
    return;
  }

  showStatus("Определяем ваше местоположение...", "loading");
  isLoading.value = true;

  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const { latitude, longitude } = position.coords;
      showStatus("Местоположение определено!", "success");

      try {
        const weatherData = await getWeatherByCoords(latitude, longitude);
        emit("weather-updated", weatherData);
        showStatus("Погода обновлена!", "success");
      } catch (error) {
        showStatus("Ошибка получения погоды", "error");
        isLoading.value = false;
      }
    },
    function (error) {
      let errorMessage = "Не удалось определить местоположение";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Доступ к геолокации запрещен";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Информация о местоположении недоступна";
          break;
        case error.TIMEOUT:
          errorMessage = "Превышено время ожидания";
          break;
      }

      showStatus(errorMessage, "error");
      isLoading.value = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }
  );
}
</script>

<style scoped>
.location-button-container {
  margin-bottom: 0;
  text-align: right;
  position: relative;
}

.location-button {
  background: var(--bg-secondary);
  border: none;
  border-radius: 50px;
  padding: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  box-shadow: var(--neumorphism);
  display: inline-flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.location-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.location-button:hover::before {
  left: 100%;
}

.location-button:hover:not(:disabled) {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.08);
  background: var(--bg-tertiary);
}

.location-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: inset var(--shadow-light), inset var(--shadow-dark);
}

.location-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.location-button.loading {
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
  border: 1px solid rgba(79, 70, 229, 0.3);
}

.location-button.success {
  background: linear-gradient(
    135deg,
    var(--bg-secondary),
    rgba(34, 197, 94, 0.1)
  );
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  position: relative;
  z-index: 1;
}

.button-icon {
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.success-icon {
  color: #22c55e;
  font-weight: bold;
  font-size: 1.1rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-top: 2px solid var(--accent-primary);
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

.button-text {
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
}

.location-status {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  box-shadow: var(--neumorphism);
  animation: slideIn 0.3s ease;
  z-index: 1000;
  max-width: 200px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.location-status.loading {
  background: rgba(79, 70, 229, 0.1);
  color: var(--accent-primary);
  border: 1px solid rgba(79, 70, 229, 0.3);
}

.location-status.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Адаптивность */
@media (max-width: 768px) {
  .location-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
