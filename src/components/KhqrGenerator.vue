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
            <button class="generate-btn" :disabled="loading" @click="openSuccessPopup">
                Open Success Popup
            </button>

            <p v-if="error" class="error">{{ error }}</p>

            <div v-if="qrImage" class="result">
                <div v-if="paymentStatus === 'pending'" class="status status--pending">
                    <span class="status-dot" />
                    Waiting for payment… {{ formattedCountdown }}
                </div>
                <div v-else-if="paymentStatus === 'expired'" class="status status--expired">
                    QR code expired. Please generate a new one.
                </div>

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

<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import QRCode from "qrcode";
import { generateKhqrApi } from "../api/generate-khqr.api";
import { checkPaymentApi } from "../api/check-payment.api";
import { modalService } from "../services/ModalService";
import PaymentSuccessModal from "./PaymentSuccessModal.vue";

let pollTimer: ReturnType<typeof setInterval> | null         =   null;
let countdownTimer: ReturnType<typeof setInterval> | null    =   null;

const POLL_INTERVAL_MS   =   3000;
const QR_EXPIRY_MS       =   5 * 60 * 1000;

const loading            =   ref(false);
const error              =   ref<string | null>(null);
const qrImage            =   ref<string | null>(null);
const md5                =   ref<string | null>(null);
const qrString           =   ref<string | null>(null);
const paymentStatus      =   ref<"pending" | "paid" | "expired" | null>(null);
const countdown          =   ref(0);

const formattedCountdown = computed(() => {
    const minutes = Math.floor(countdown.value / 60);
    const seconds = countdown.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

const showPaymentSuccess = () => {
    modalService.open(PaymentSuccessModal, {});
};

const generate = async () => {

    loading.value = true;
    error.value = null;
    paymentStatus.value = null;

    try {
        const response = await generateKhqrApi();

        if (response.status.code !== 0 || !response.data) {
            throw new Error(response.status.message ?? "Failed to generate QR code");
        }

        qrString.value = response.data.qr;
        md5.value = response.data.md5;
        qrImage.value = await QRCode.toDataURL(response.data.qr, { width: 280, margin: 2 });
        paymentStatus.value = "pending";

        startPaymentPolling();
    } catch (e) {
        error.value = e instanceof Error ? e.message : "Something went wrong";
        qrImage.value = null;
        md5.value = null;
        qrString.value = null;
    } finally {
        loading.value = false;
    }
};

const clearTimers = () => {
    if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
    }
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
};

const checkPayment = async () => {
    if (!md5.value || paymentStatus.value !== "pending") return;

    try {
        const result = await checkPaymentApi(md5.value);
        if (result.success && result.data?.bakongHash) {
            paymentStatus.value = "paid";
            showPaymentSuccess();
            clearTimers();
        }
    } catch {
        // Keep polling on transient errors
    }
};

const startPaymentPolling = () => {
    clearTimers();

    countdown.value = QR_EXPIRY_MS / 1000;

    countdownTimer = setInterval(() => {
        countdown.value -= 1;
        if (countdown.value <= 0) {
            paymentStatus.value = "expired";
            clearTimers();
        }
    }, 1000);

    checkPayment();

    pollTimer = setInterval(checkPayment, POLL_INTERVAL_MS);
};

const openSuccessPopup = () => {
    showPaymentSuccess();
};

onUnmounted(clearTimers);
</script>

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

.status {
    width: 100%;
    padding: 0.625rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    text-align: center;
}

.status--pending {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--accent-bg);
    color: var(--accent);
    border: 1px solid var(--accent-border);
}

.status--expired {
    background: rgba(229, 62, 62, 0.1);
    color: #e53e3e;
    border: 1px solid rgba(229, 62, 62, 0.3);
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.4;
        transform: scale(0.85);
    }
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
