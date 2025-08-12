<template>
  <div class="weather-background" :class="weatherType">
    <div id="root">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";

interface Props {
  weatherType: string;
}

const props = defineProps<Props>();
let weatherFx: any = null;
let canvas: HTMLCanvasElement | null = null;

async function loadWeatherFX() {
  return new Promise((resolve, reject) => {
    if (window.WeatherFX) {
      resolve(window.WeatherFX);
      return;
    }

    const script = document.createElement("script");
    const isGithubPages = window.location.hostname.includes("github.io");
    const basePath = isGithubPages ? "/weather" : "";
    script.src = `${basePath}/weather.js`;

    // Добавляем таймаут для предотвращения бесконечного ожидания
    const timeout = setTimeout(() => {
      reject(new Error("WeatherFX load timeout"));
    }, 10000);

    script.onload = () => {
      clearTimeout(timeout);
      if (window.WeatherFX) {
        resolve(window.WeatherFX);
      } else {
        reject(new Error("WeatherFX not found"));
      }
    };

    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error("Failed to load WeatherFX"));
    };

    document.head.appendChild(script);
  });
}

async function initWeatherFX() {
  if (!canvas) {
    return;
  }

  try {
    const WeatherFXClass = (await loadWeatherFX()) as any;
    const isGithubPages = window.location.hostname.includes("github.io");
    const basePath = isGithubPages ? "/weather" : "";

    weatherFx = new WeatherFXClass({
      canvas: canvas,
      background: `${basePath}/rain.webp`,
    });

    window.addEventListener("resize", handleResize);
    await weatherFx.start();
  } catch (error) {
    // WeatherFX initialization failed
  }
}

function handleResize() {
  if (weatherFx && canvas && weatherFx.resize) {
    const rect = canvas.getBoundingClientRect();
    weatherFx.resize(rect.width, rect.height);
  }
}

function stopWeatherFX() {
  if (weatherFx) {
    weatherFx.stop();
    weatherFx = null;
  }
  window.removeEventListener("resize", handleResize);
}

watch(
  () => props.weatherType,
  (newType) => {
    if (!weatherFx) {
      initWeatherFX();
    }
  }
);

onMounted(async () => {
  try {
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Определяем производительность устройства
      const isLowEndDevice = () => {
        // Проверяем количество ядер CPU
        const cores = navigator.hardwareConcurrency || 1;

        // Проверяем память (если доступно)
        const memory = (navigator as any).deviceMemory || 4;

        // Проверяем соединение
        const connection = (navigator as any).connection;
        const isSlowConnection =
          connection &&
          (connection.effectiveType === "slow-2g" ||
            connection.effectiveType === "2g" ||
            connection.effectiveType === "3g");

        return cores <= 2 || memory <= 2 || isSlowConnection;
      };

      // Загружаем WeatherFX с задержкой только для слабых устройств
      const isLowEnd = isLowEndDevice();

      // Проверяем, загружена ли уже страница
      if (document.readyState === "complete") {
        if (isLowEnd) {
          setTimeout(async () => {
            try {
              await initWeatherFX();
            } catch (error) {
              // WeatherFX initialization failed
            }
          }, 2000);
        } else {
          await initWeatherFX();
        }
      } else {
        window.addEventListener("load", async () => {
          if (isLowEnd) {
            setTimeout(async () => {
              try {
                await initWeatherFX();
              } catch (error) {
                // WeatherFX initialization failed
              }
            }, 2000);
          } else {
            await initWeatherFX();
          }
        });
      }
    }
  } catch (error) {
    // WeatherFX initialization failed
  }
});

onUnmounted(() => {
  stopWeatherFX();
});
</script>

<style scoped>
.weather-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

#root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

#canvas {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
