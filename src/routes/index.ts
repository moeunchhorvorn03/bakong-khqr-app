import { createRouter, createWebHistory } from "vue-router";
import KhqrGenerator from "../components/KhqrGenerator.vue";

const routes = [
    {
        path: '/',
        component: KhqrGenerator,
    }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});