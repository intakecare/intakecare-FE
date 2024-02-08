import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {createI18n} from "vue-i18n";
import naive from 'naive-ui'
import router from './router'
import App from './App.vue'
import "@/assets/global.css";
import { useLanguageStore } from "./stores/language";
import { useUserStore } from "./stores/user";

// App initialization
const app = createApp(App)

// Store definition and initialization
const pinia = createPinia()
app.use(pinia)
const userStore = useUserStore();
userStore.initializeStore();
const languageStore = useLanguageStore();

// Store subscription
// Enable the information about the user (if present) to be stored in the local storage
userStore.$subscribe((mutation, state) => {
    localStorage.setItem("userStore", JSON.stringify(state));
    },
    {detached: true}
);

// i18n initialization
const options = {
    locale: languageStore.locale,
    fallbackLocale: languageStore.fallbackLocale,
    global: true,
    legacy: false,
    messages: languageStore.localeMessages
}
const i18n = createI18n(options);

// App configuration and mounting
app.use(i18n)
app.use(naive)
app.use(router)
app.mount('#app')
