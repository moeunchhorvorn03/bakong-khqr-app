import { createRouter, createWebHistory } from "vue-router";
import KHQRGenerator from "../components/KHQRGenerator.vue";

const routes = [
    {
        path: '/',
        component: KHQRGenerator,
    }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});