<script setup lang="ts">
import { ref } from "vue";
import QRCode from "qrcode";
import { generateKhqrApi } from "../api/generatekhqr.api";

const loading = ref(false);
const error = ref<string | null>(null);
const qrImage = ref<string | null>(null);
const md5 = ref<string | null>(null);
const qrString = ref<string | null>(null);

async function generate() {
  loading.value = true;
  error.value = null;

  try {
    const response = await generateKhqrApi();

    if (response.status.code !== 0 || !response.data) {
      throw new Error(response.status.message ?? "Failed to generate QR code");
    }

    qrString.value = response.data.qr;
    md5.value = response.data.md5;
    qrImage.value = await QRCode.toDataURL(response.data.qr, {
      width: 280,
      margin: 2,
    });
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Something went wrong";
    qrImage.value = null;
    md5.value = null;
    qrString.value = null;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="generator">
    <header class="header">
      <h1>KHQR Generator</h1>
      <p>Generate a Bakong KHQR payment code</p>
    </header>

    <section class="card">
      <button class="generate-btn" :disabled="loading" @click="generate">
        {{ loading ? "Generating…" : "Generate QR Code" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="qrImage" class="result">
        <img :src="qrImage" alt="KHQR payment code" class="qr-image" />
        <dl class="details">
          <div>
            <dt>MD5</dt>
            <dd>{{ md5 }}</dd>
          </div>
          <div>
            <dt>QR String</dt>
            <dd class="qr-string">{{ qrString }}</dd>
          </div>
        </dl>
      </div>
    </section>
  </main>
</template>

<style scoped>
.generator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 3rem 1.5rem;
  min-height: 100svh;
  box-sizing: border-box;
}

.header h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  color: var(--text-h);
}

.header p {
  margin: 0;
  color: var(--text);
}

.card {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.generate-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.generate-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin: 0;
  color: #e53e3e;
  font-size: 0.9rem;
  text-align: center;
}

.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
}

.qr-image {
  display: block;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.details {
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.details dt {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.details dd {
  margin: 0;
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--text-h);
  word-break: break-all;
}

.qr-string {
  max-height: 4.5rem;
  overflow-y: auto;
}
</style>
