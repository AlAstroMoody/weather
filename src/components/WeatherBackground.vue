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
    script.src = "/weather/raindrop-fx-master/bundle/index.js";
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
    console.error("Canvas not found");
    return;
  }

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  if (window.RaindropFX) {
    raindropFx = new window.RaindropFX({
      canvas: canvas,
      background: "/weather/rain.webp",
    });

    window.addEventListener("resize", handleResize);
    raindropFx.start();
  } else {
    console.error("RaindropFX not available");
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
    } else {
      console.error("Canvas element not found");
    }
  } catch (error) {
    console.error("Failed to load RaindropFX:", error);
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

declare global { interface Window { RaindropFX: any; } }
