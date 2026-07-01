<template>
    <router-view />

    <component
        v-if="modalService.state.isOpen && modalService.state.component"
        :is="modalService.state.component"
        v-bind="modalService.state.props"
        @close="modalService.close"
    />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { modalService } from "./services/ModalService";
</script>