import {defineStore} from "pinia";

export const useLanguageStore = defineStore('language', {
    state: () => ({
        locale: "it-IT",
        fallbackLocale: "en-US"
    }),
    actions: {
        setLocale(locale: string) {
            this.locale = locale;
        },
        setFallbackLocale(locale: string) {
            this.fallbackLocale = locale;
        },
        removeStore() {
            this.$reset();
        }
    }
})