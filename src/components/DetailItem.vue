<template>
  <div class="detail-item">
    <div class="detail-icon">{{ icon }}</div>
    <div class="detail-text">
      <span class="detail-value">{{ value }}{{ unit }}</span>
      <span class="detail-label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  value: string | number;
  unit?: string;
  label: string;
}

defineProps<Props>();
</script>

<style scoped>
.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2),
    inset -2px -2px 4px rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.detail-item:hover {
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.25),
    inset -3px -3px 6px rgba(255, 255, 255, 0.1);
  background: var(--bg-secondary);
}

.detail-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.detail-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
