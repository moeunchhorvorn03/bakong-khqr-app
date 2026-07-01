import { reactive, type Component } from "vue";

const state = reactive({
    isOpen: false,
    component: null as Component | null,
    props: {},
});

export const modalService = {
    state,

    open(component: Component, props: Record<string, any> = {}) {
        state.component = component;
        state.props = props;
        state.isOpen = true;
    },

    close() {
        state.isOpen = false;
        state.component = null;
        state.props = {};
    },
};
