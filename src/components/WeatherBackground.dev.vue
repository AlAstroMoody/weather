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
let raindropFx: any = null;
let canvas: HTMLCanvasElement | null = null;

async function loadRaindropFX() {
  return new Promise((resolve, reject) => {
    if (window.RaindropFX) {
      resolve(window.RaindropFX);
      return;
    }

    const script = document.createElement("script");
    script.src = "/raindrop-fx-master/bundle/index.js";
    script.onload = () => {
      if (window.RaindropFX) {
        resolve(window.RaindropFX);
      } else {
        reject(new Error("RaindropFX not found"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load RaindropFX"));
    document.head.appendChild(script);
  });
}

function initRaindropFX() {
  if (!canvas) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  if (window.RaindropFX) {
    raindropFx = new window.RaindropFX({
      canvas: canvas,
      background: "/rain.webp",
    });

    window.addEventListener("resize", handleResize);
    raindropFx.start();
  }
}

function handleResize() {
  if (raindropFx && canvas && raindropFx.resize) {
    const rect = canvas.getBoundingClientRect();
    raindropFx.resize(rect.width, rect.height);
  }
}

function stopRaindropFX() {
  if (raindropFx) {
    raindropFx.stop();
    raindropFx = null;
  }
  window.removeEventListener("resize", handleResize);
}

watch(
  () => props.weatherType,
  (newType) => {
    if (!raindropFx) {
      initRaindropFX();
    }
  }
);

onMounted(async () => {
  try {
    await loadRaindropFX();
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas) {
      // Устанавливаем размеры canvas
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initRaindropFX();
    }
  } catch (error) {
    // Ошибка загрузки RaindropFX
  }
});

onUnmounted(() => {
  stopRaindropFX();
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
  pointer-events: none;
}

#root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
}

#canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
