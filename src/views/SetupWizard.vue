<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/user";
import OTP from "@/components/OTP.vue";
import ChangePassword from "@/components/user-profile/ChangePassword.vue";
import {useRouter} from "vue-router";
/**
 * This view is used to guide the user through the setup process.
 * It is used to connect the user to Alexa and to set up the first therapy.
 */
// i18n, router, and store setup
const user = useUserStore();
const { t } = useI18n({ useScope: "global", inheritLocale: true });
const router = useRouter();

// Reactive variables
const steps = ["OTP", "Password"];
// type Step = typeof steps[number]; //Default syntax that creates a literal typing from an array
const currentStep = ref(0 as number);

onMounted(() => {
  console.log("Mounted");
});

const onPasswordChanged = () => {
  /**
   *  This function is called when the password is changed in the corresponding component.
   * It logs out the user and redirects to the home page.
   * */
  // Logout
  user.logout();
  // Redirect to home page
  router.push({ name: "Home" });
}

</script>

<template>
  <n-card class="content">
    <!-- Welcome message -->
    <n-space justify="center">
      <n-h1>{{t('setupWizard.welcome')}}</n-h1>
      <n-h2>{{t('setupWizard.intro')}}</n-h2>
    </n-space>
    <n-divider />
    <!-- Step Definition -->
    <Transition name="slide" mode="out-in">
      <!-- Step 1: OTP for Alexa connection -->
      <n-space v-if="steps[currentStep] === 'OTP'" justify="center">
        <div>{{t('setupWizard.OTPMessage')}}</div>
        <OTP patient_id="user._id"/>
      </n-space>
      <!-- Step FINAL: Change Password -->
      <n-space v-else-if="steps[currentStep] === 'Password'" justify="center">
        <div>{{t('setupWizard.changePassword')}}</div>
        <change-password @password-changed="onPasswordChanged"/>
      </n-space>

    </Transition>
    <!-- Navigation buttons -->
    <n-divider />
    <n-space justify="end">
      <n-button
          v-if="currentStep < 1 >"
          @click="currentStep--"
          type="primary"
      >{{t('general.back')}}</n-button>
      <n-button
          v-if="currentStep !== steps.length - 1"
          @click="currentStep++"
          type="primary"
      >{{t('general.next')}}
      </n-button>
    </n-space>
  </n-card>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>