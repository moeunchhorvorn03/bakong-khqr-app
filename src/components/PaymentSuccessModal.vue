<template>
  <Transition name="overlay">
    <div class="success-overlay" @click.self="emit('close')">
      <Transition name="popup" appear>
        <div class="success-popup">
          <div class="success-icon" v-html="checkmarkSvg" />
          <h2>Payment Successful!</h2>
          <p>Your payment has been confirmed.</p>
          <p v-if="successHash" class="success-hash">
            <span>Transaction hash</span>
            {{ successHash }}
          </p>
          <button class="close-btn" @click="emit('close')">Done</button>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import checkmarkSvg from "../assets/checkmark.svg?raw";

defineProps<{
  successHash?: string | null;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<style scoped>
.success-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.success-popup {
  width: 100%;
  max-width: 360px;
  padding: 2rem 1.75rem;
  border-radius: 16px;
  background: var(--bg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.popup-enter-active {
  animation: popup-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.popup-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.popup-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

@keyframes popup-in {
  from {
    opacity: 0;
    transform: scale(0.6) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.success-icon {
  margin: 0 auto 1.25rem;
  width: 72px;
  height: 72px;
}

.success-icon :deep(.checkmark) {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #22c55e;
  stroke-miterlimit: 10;
}

.success-icon :deep(.checkmark-circle) {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke: #22c55e;
  fill: rgba(34, 197, 94, 0.1);
  animation: stroke-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.success-icon :deep(.checkmark-check) {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-width: 3;
  animation: stroke-check 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
}

@keyframes stroke-circle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes stroke-check {
  to {
    stroke-dashoffset: 0;
  }
}

.success-popup h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: var(--text-h);
}

.success-popup p {
  margin: 0;
  color: var(--text);
  font-size: 0.95rem;
}

.success-hash {
  margin-top: 1rem !important;
  padding: 0.75rem;
  border-radius: 8px;
  background: var(--code-bg);
  font-family: var(--mono);
  font-size: 0.75rem !important;
  word-break: break-all;
  text-align: left;
}

.success-hash span {
  display: block;
  font-family: var(--sans);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.close-btn {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background: #22c55e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 0.9;
}
</style>
