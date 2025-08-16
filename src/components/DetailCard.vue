<template>
  <div class="detail-card">
    <h4 class="detail-title">
      <span class="detail-icon">{{ icon }}</span>
      {{ title }}
    </h4>
    <div class="detail-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  icon: string;
}

defineProps<Props>();
</script>

<style scoped>
.detail-card {
  background: var(--bg-tertiary);
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
    inset -2px -2px 4px rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.detail-card:hover {
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.25),
    inset -3px -3px 6px rgba(255, 255, 255, 0.1);
  background: var(--bg-secondary);
}

.detail-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-primary);
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-icon {
  font-size: 1.2rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-content .detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.detail-content .detail-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.detail-content .detail-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}
</style>
