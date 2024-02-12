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

<script lang="ts">
import { defineComponent, ref } from "vue";
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
import { useUserStore } from "@/stores/user";

// import { UserUpdateDTO } from "@/classes/user-dto";

interface ModelType {
  oldPassword: string | null;
  password: string | null;
  reenteredPassword: string | null;
}

export default defineComponent({
  name: "ChangePassword",
  setup() {
    const { t } = useI18n({ useScope: "global", inheritLocale: true });
    const formRef = ref<FormInst | null>(null);
    const rPasswordFormItemRef = ref<FormItemInst | null>(null);
    const user = useUserStore();
    const message = useMessage();
    const modelRef = ref<ModelType>({
      oldPassword: null,
      password: null,
      reenteredPassword: null,
    });
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

    return {
      t,
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      handlePasswordInput() {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
        }
      },
      handleValidateButtonClick(e: MouseEvent) {
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
                  message.success(t("profile.changeOK"));
                })
                .catch(() => {
                  message.success(t("profile.changeError"));
                });
            }
          }
        );
      },
    };
  },
});
</script>
