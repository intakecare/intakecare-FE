<script setup lang="ts">
import {computed, ref} from "vue";
import ResponsiveView from "../ResponsiveView.vue";
import { useI18n } from "vue-i18n";
import {useUserStore} from "@/stores/user";
import {useLanguageStore} from "@/stores/language";
import { Menu as MenuIcon } from "@vicons/ionicons5";
import {useRouter} from "vue-router";

// i18n and router setup
const { t, locale } = useI18n({ useScope: "global", inheritLocale: true });
const router = useRouter();

// Store retrieval and setup
const userModule = useUserStore();
const languageModel = useLanguageStore();
const isLogged = computed(() => userModule.username);
const firstName = computed(() => userModule.name);
const userType = computed(() => userModule.user_type);
const newUser = computed(() => userModule.new_user);
const languageOptions = languageModel.getLocaleNames();

// Variable to show the mobile menu
const show = ref(false);

// Definition of the menu options
const menuOptions = computed(() => {
  const menu = [
    { label: t("navigation.aboutUs"), key: "About" },
    { label: t("navigation.project"), key: "Project" },
  ];
  // If the user is not logged, add login
  if (!isLogged.value) {
    menu.push({ label: t("navigation.login"), key: "Login" });
  }
  // If the user is logged but is a new user, do not add anything else
  else if (newUser.value){
    return menu;
  }
  // If the user is logged and not new, add the relevant buttons
  else {
    if (userType.value === "doctor") {
      menu.push({ label: t("general.patient", 2), key: "Patients" });
    }
    if (userType.value === "admin_itc") {
      menu.push({ label: t("navigation.dashboard"), key: "Dashboard" });
    }
    if (userType.value === "patient") {
      menu.push({ label:  t("patientDetail.myTherapies"), key: "PatientTherapies" });
    }
  }
  return menu;
});

// Definition of the login options
const loginOptions = computed(() => {
  const option: ({ label: string; key: string })[] = [];
  // If the user is new, add the complete profile button
  // Otherwise, add the normal profile button
  if (newUser.value){
    option.push({label: t("navigation.completeProfile"), key: "CompleteProfile"});
  }
  else {
    option.push({label: t("navigation.profile"), key: "Profile"});
  }
  // Add the logout button
  option.push({label: t("navigation.logout"), key: "Logout" });
  return option
})

const clickNav = (destination: string) => {
  // Redirect to the selected page
  console.log("click")
  router.push({ name: destination });
  console.log(destination)
};


const changeLanguage = (lang: string) => {
  // Change the language of the application
  locale.value = lang;
  languageModel.setLocale(lang);
};

const logout = () => {
  // Remove the user from the store and redirect to the home page
  userModule.logout()
  router.push({ name: "Home" });
};

const handleSelect = (key: string) => {
  // Handle the selection of the dropdowns
  const NavElems = ["About", "Login", "Profile", "CompleteProfile", "Project"];
  const LangElems = languageOptions.map((value) => value.key);
  if (NavElems.includes(key)) clickNav(key);
  if (LangElems.includes(key)) changeLanguage(key);
  if (key === "Logout") logout();
};
</script>

<template>
  <n-space
    justify="space-between"
    style="max-width: 1260px; margin:auto"
    item-style="margin-top: auto; margin-bottom: auto; padding-top:4px"
  >
    <!-- HOME LOGO -->
    <responsive-view>
      <template v-slot:m+>
        <n-button text>
          <img
            height="40"
            alt="ITC logo"
            src="../../assets/logo.svg"
            @click="clickNav('Home')"
          />
        </n-button>
      </template>
      <template v-slot:small>
        <n-button text>
          <img
            height="40"
            alt="ITC logo"
            src="../../assets/logo-small.svg"
            @click="clickNav('Home')"
          />
        </n-button>
      </template>
    </responsive-view>

    <!-- NAVIGATION MENU -->
    <responsive-view>
      <template v-slot:large>
        <n-space
          justify="end"
          item-style="margin: auto;"
        >
          <n-dropdown @select="handleSelect" :options="languageOptions">
            <n-button type="primary">{{ t("language") }}</n-button>
          </n-dropdown>
          <span v-for="v in menuOptions" :key="v.key">
            <n-button type="primary" @click="clickNav(v.key)">{{
              v.label
            }}</n-button>
          </span>

          <n-dropdown
            v-if="isLogged"
            @select="handleSelect"
            :options="loginOptions"
          >
            <n-button type="primary">{{ firstName || isLogged }}</n-button>
          </n-dropdown>
        </n-space>
      </template>

      <!-- MOBILE NAVIGATION MENU -->
      <template v-slot:m->
        <div>
          <n-button text style="font-size: 40px" @click="show = true"
            ><n-icon color="#fafafa"> <menu-icon /> </n-icon
          ></n-button>
          <n-drawer v-model:show="show" :width="280">
            <n-drawer-content closable>
              <template #header>
                <div v-if="isLogged" style="padding-right: 2px">
                  <n-h2 style="margin: auto"
                    ><n-text type="primary"
                      >{{ t("general.greeting") }} {{ firstName }}!</n-text
                    ></n-h2
                  >
                </div>
                <div v-else style="padding-right: 2px">
                  <n-h2 style="margin: auto"
                    ><n-text type="primary">{{
                      t("navigation.menu")
                    }}</n-text></n-h2
                  >
                </div>
              </template>
              <div v-if="isLogged">
                <n-space vertical>
                  <n-button
                    v-if="newUser"
                    text
                    size="medium"
                    @click="handleSelect('CompleteProfile')"
                    style="margin-top: 5px">
                    {{ t("navigation.completeProfile") }}
                  </n-button>

                  <n-button
                      v-else
                    text
                    size="medium"
                    @click="handleSelect('Profile')"
                    style="margin-top: 5px">
                    {{ t("navigation.profile") }}
                  </n-button>

                  <n-button
                    text
                    size="medium"
                    @click="handleSelect('Logout')"
                    style="margin-top: 5px"
                    >{{ t("navigation.logout") }}</n-button
                  >
                  <n-divider />
                </n-space>
              </div>
              <div
                v-for="v in menuOptions"
                :key="v.key"
                style="margin-top: 5px"
              >
                <n-button text size="medium" @click="clickNav(v.key)">{{
                  v.label
                }}</n-button>
              </div>

              <n-divider />
              <div
                v-for="v in languageOptions"
                :key="v.key"
                style="margin-top: 5px"
              >
                <n-button text size="medium" @click="changeLanguage(v.key)">{{
                  v.label
                }}</n-button>
              </div>
            </n-drawer-content>
          </n-drawer>
        </div>
      </template>

    </responsive-view>
  </n-space>
</template>


<style scoped></style>
