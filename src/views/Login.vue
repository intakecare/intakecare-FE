<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import ResponsiveView from "@/components/ResponsiveView.vue";
import router from "@/router/index";
import {useUserStore} from "@/stores/user";
import { useI18n } from "vue-i18n";
import * as api from "@/api";

/**
 * This is the login page of the application. It contains a form to login.
 */

// Definition of useful components and variables
const { t } = useI18n({ useScope: "global", inheritLocale: true });
const user = useUserStore();
const showSpin = ref(false);
const showError = ref(false);
const formRef = ref(null);
const modelRef = ref({
  username: null as string | null,
  password: null as string | null,
});
const model = modelRef.value;

// Placeholder for username and password
const placeholder = computed(() => {
  return {
    username: t("login.username"),
    password: t("login.password"),
  };
});

// Rules for the form
const rules = computed(() => {
  return {
    username: [
      {
        required: true,
        message: t("login.usernameValidation"),
        trigger: ["input", "blur"],
      },
    ],
    password: [
      {
        required: true,
        message: t("login.passwordValidation"),
        trigger: ["input", "blur"],
      },
    ],
  };
});

// Redirect to home page if user is already logged in
onMounted(() => {
  if (user.username) {
    router.push({ name: "Home" });
  }
});

// Function to disable login button if username or password is empty
const loginButtonDisable = () => {
  return !modelRef.value.username || !modelRef.value.password;
};

// Login function
const login = async () => {
  showSpin.value = true;

  api.login
      .byUsername(
          modelRef.value.username as string,
          modelRef.value.password as string
      )
      .then((value) => {
        value.data.user['access_token'] = value.data.access_token
        user.set_user(value.data.user);
        console.log(user)

        showSpin.value = false;
        showError.value = false;

        // Check if user is new
        if (user.new_user) {
          router.push({ name: "Profile" });
        } else if (user.user_type === 'admin_itc'){
          router.push({ name: "Dashboard" });
        } else {
          router.push({ name: "Home" });
        }
      })
      .catch((error) => {
        showSpin.value = false;
        showError.value = true;
        console.log(error);
      });
};

</script>

<template>
  <responsive-view>
    <template v-slot:m+>
      <n-card
        class="content"
        style="max-width: 400px; margin-bottom: 10px; padding: 10px"
        title="Login"
        :bordered="false"
        size="huge"
      >
        <template #cover>
          <img
            height="100"
            src="@/assets/logo-round-bow.svg"
            style="margin-top: 20px"
          />
        </template>
        <n-spin :show="showSpin" style="marign: auto">
          <n-form
            :model="model"
            ref="formRef"
            :rules="rules"
            :show-label="false"
          >
            <n-form-item path="username" label="Username">
              <n-input
                :placeholder="placeholder.username"
                v-model:value="model.username"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item path="password" label="Password">
              <n-input
                :placeholder="placeholder.password"
                v-model:value="model.password"
                show-password-on="mousedown"
                type="password"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-alert v-if="showError" type="error" style="margin: 5px">
              {{ t("login.usernamePasswordError") }}
            </n-alert>
            <n-space justify="space-between">
              <n-button
                :disabled="loginButtonDisable()"
                type="primary"
                attr-type="submit"
                @click="login()"
                >{{ t("navigation.login") }}</n-button
              >
            </n-space>
          </n-form>
        </n-spin>

        <template #footer> {{ t("login.forgottenPassword") }} </template>
      </n-card>
    </template>

    <template v-slot:small>
      <n-card
        class="content"
        style="
          max-width: 400px;
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 0px;
        "
        title="Login"
        :bordered="false"
        size="huge"
      >
        <template #cover>
          <img
            height="100"
            src="@/assets/logo-round-bow.svg"
            style="margin-top: 20px"
          />
        </template>
        <n-spin :show="showSpin" style="marign: auto">
          <n-form
            :model="model"
            ref="formRef"
            :rules="rules"
            :show-label="false"
          >
            <n-form-item path="username" label="Username">
              <n-input
                :placeholder="placeholder.username"
                v-model:value="model.username"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item path="password" label="Password">
              <n-input
                :placeholder="placeholder.password"
                v-model:value="model.password"
                show-password-on="mousedown"
                type="password"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-alert v-if="showError" type="error" style="margin: 5px">
              {{ t("login.usernamePasswordError") }}
            </n-alert>
            <n-space vertical>
              <n-button
                :disabled="loginButtonDisable()"
                type="primary"
                attr-type="submit"
                style="width: 100%"
                @click="login()"
                >{{ t("navigation.login") }}</n-button
              >
            </n-space>
          </n-form>
        </n-spin>

        <template #footer> {{ t("login.forgottenPassword") }} </template>
      </n-card>
    </template>
  </responsive-view>
</template>


<style scoped>
.n-button {
  margin-top: 10px;
}
</style>
