import {defineStore} from "pinia";
import enUs from "@/languages/locales/en-US.json";
import itIt from "@/languages/locales/it-IT.json";

/** Store for the language
* It contains the list of locales and the corresponding messages.
* To add a new language: import the corresponding JSON file from the locales folder,
* add it to the list of available locales and locale messages. */

export const useLanguageStore = defineStore('language', {
    state: () => ({
        locale: "it-IT",
        fallbackLocale: "en-US",
        availableLocales: ["it-IT", "en-US"],
        localeMessages: {
            "it-IT": itIt,
            "en-US": enUs
        }
    }),
    actions: {
        // Setters
        setLocale(locale: string) {
            this.locale = locale;
        },
        setFallbackLocale(locale: string) {
            this.fallbackLocale = locale;
        },
        // Remove the store
        removeStore() {
            this.$reset();
        },
        // Returns the available locales
        getLocaleNames() {
            return this.availableLocales.map((locale) => {
                return {
                    key: locale,
                    label: this.localeMessages[locale].languageName
                }
            })
        }
    }
})
