<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  FormInst,
  FormItemInst,
  FormItemRule,
  FormValidationError,
  FormRules,
  useMessage,
} from "naive-ui";
import { FormItemRuleValidator } from "naive-ui/lib/form/src/interface";
import * as api from "@/api";


// noinspection JSValidateJSDoc
/**
 * @name ChangePassword
 * @description
 * This component is used to change the password of the user.
 *
 * @emits passwordChanged - When the password is changed, this event is emitted.
 *
 */

interface ModelType {
  oldPassword: string | null;
  password: string | null;
  reenteredPassword: string | null;
}

const { t } = useI18n({ useScope: "global", inheritLocale: true });
const formRef = ref<FormInst | null>(null);
const rPasswordFormItemRef = ref<FormItemInst | null>(null);
const message = useMessage();
const modelRef = ref<ModelType>({
  oldPassword: null,
  password: null,
  reenteredPassword: null,
});
const model = modelRef.value;
const emit = defineEmits(["passwordChanged"]);

function validatePasswordStartWith(
    rule: FormItemRule,
    value: string
): boolean {
  return (
      !!modelRef.value.password &&
      !!modelRef.value.oldPassword &&
      modelRef.value.password.startsWith(value) &&
      modelRef.value.password.length >= value.length
  );
}

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === modelRef.value.password;
}

const rules: FormRules = {
  oldPassword: [
    {
      required: true,
      message: t("profile.oldPwRequired"),
    },
  ],
  password: [
    {
      required: true,
      message: t("profile.newPwRequired"),
    },
  ],
  reenteredPassword: [
    {
      required: true,
      message: t("profile.repeatPassword"),
      trigger: ["input", "blur"],
    },
    {
      validator: validatePasswordStartWith as FormItemRuleValidator,
      message: t("profile.passwordMismatch"),
      trigger: "input",
    },
    {
      validator: validatePasswordSame as FormItemRuleValidator,
      message: t("profile.passwordMismatch"),
      trigger: ["blur", "password-input"],
    },
  ],
};

function handlePasswordInput() {
  if (modelRef.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
  }
}

function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault();
  console.log("click");
  formRef.value?.validate(
      (errors: Array<FormValidationError> | undefined) => {
        if (!errors) {
          api.login
              .changePassword(
                  modelRef.value.oldPassword as string,
                  modelRef.value.password as string
              )
              .then((value) => {
                modelRef.value = {
                  oldPassword: null,
                  password: null,
                  reenteredPassword: null,
                };
                message.success(t("profile.changeOK"), {duration: 10000, closable: true});
                // Emit event to parent
                emit("passwordChanged");
              })
              .catch(() => {
                message.success(t("profile.changeError"));
              });
        }
      }
  );
}
</script>

<template>
  <n-form ref="formRef" label-placement="left" :model="model" :rules="rules">
    <n-form-item path="oldPassword" :label="t('profile.oldPassword')">
      <n-input
        v-model:value="model.oldPassword"
        type="password"
        @input="handlePasswordInput"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item path="password" :label="t('profile.newPassword')">
      <n-input
        v-model:value="model.password"
        type="password"
        @input="handlePasswordInput"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item
      ref="rPasswordFormItemRef"
      first
      path="reenteredPassword"
      :label="t('profile.repeatPassword')"
    >
      <n-input
        v-model:value="model.reenteredPassword"
        :disabled="!model.password"
        type="password"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
            :disabled="
              model.password === null ||
              model.oldPassword === null ||
              model.reenteredPassword === null
            "
            type="primary"
            @click="handleValidateButtonClick"
          >
            {{ t("profile.changePassword") }}
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>
</template>

