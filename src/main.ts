import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {createI18n} from "vue-i18n";
import naive from 'naive-ui'
import App from './App.vue'
import enUs from "./languages/locales/en-US.json";
import itIt from "./languages/locales/it-IT.json";
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
    locale: 'it-IT',
    fallbackLocale: 'en-US',
    legacy: false,
    messages: {
        "en-US": enUs,
        "it-IT": itIt
    }
}
const i18n = createI18n(options);

// App configuration
app.use(i18n)
app.use(naive)
app.mount('#app')
