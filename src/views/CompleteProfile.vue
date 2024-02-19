<script setup lang="ts">
import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {Save as SaveIcon} from "@vicons/ionicons5";
import * as api from "@/api";
import ChangePassword from "@/components/user-profile/ChangePassword.vue";
import {FormItemRule, FormRules, FormInst, FormItemInst, FormValidationError, useMessage} from "naive-ui";
import {useUserStore} from "@/stores/user";
import {useRouter} from "vue-router";
import {UserUpdateDTO} from "@/classes/user-dto";

/**
 * This view is used when a new PATIENT user is created and needs to complete the profile.
 * The user is asked to insert the email for Alexa and change the password.
 */

// i18n, router and store setup
const user = useUserStore();
const router = useRouter();
const { t } = useI18n({ useScope: "global", inheritLocale: true });

// Reactive variables
const showSpin = ref(false);
const collectingData = ref(true);
const formRef = ref(null as FormInst | null);
const model = ref({
  email_alexa: undefined as string | undefined,
  r_email_alexa: undefined as string | undefined,
  phone: undefined as string | undefined,
})
const rEmailAlexaFormItemRef = ref(null as FormItemInst | null);

// Message setup
const message = useMessage();

// Definition of the rules and validations for the form
function validateEmailSame(rule: FormItemRule, value: string): boolean {
  return value === model.value.email_alexa;
}

const rules: FormRules = {
  email_alexa: {
    required: true,
    message: t("newPatient.emailRequired"),
  },
  r_email_alexa: [{
    required: true,
    message: t("newPatient.emailRequired"),
    trigger: ["input", "blur"],
  },
  {
    validator: validateEmailSame,
    message: t("newPatient.emailNotMatch"),
    trigger: ["input", "blur"],
  },
  ],
}

// Functions
const onPasswordChanged = () => {
  /**
   * This function is called when the password is changed in the corresponding component.
   */
  // Logout
  user.logout();
  // Redirect to home page
  router.push({ name: "Home" });
}

const updateProfile = async () => {
  /**
   * This function is used to update the attributes in the user profile
   */
  //TODO: Implement the updateProfile function
  showSpin.value = true;
  console.log(user);
  const userToUpdate: Partial<UserUpdateDTO> = {};
  if (model.value.email_alexa) {
    userToUpdate.email_alexa = model.value.email_alexa as string;
  } else {
    userToUpdate.email_alexa = undefined;
  }
  console.log(userToUpdate)
  await api.user
      .update(userToUpdate)
      .then(() => {
        user.patch(userToUpdate);
        collectingData.value = false;
        console.log(user)
        showSpin.value = false;
      })
      .catch((error) => {
        showSpin.value = false;
        console.log(error);
      });
}

function handleEmailInput() {
  /**
   * This function is called when the user inserts the email for Alexa.
   * It validates the email and triggers the validation of the repeat email field.
   */
  if (model.value.r_email_alexa) {
    rEmailAlexaFormItemRef.value?.validate({ trigger: "email-alexa-input" });
  }
}

function handleValidateButtonClick(e: MouseEvent) {
  /**
   * This function is called when the user clicks the save button.
   * It validates the form and, if there are no errors, it updates the profile.
   */
  e.preventDefault();
  formRef.value?.validate(
      (errors: Array<FormValidationError> | undefined) => {
        if (!errors) {
          updateProfile();
          message.info(t("newPatient.formSaved"));
        } else {
          message.error(t("newPatient.formError"));
        }
      }
  );
}

</script>

<template>
    <n-card class="content">
        <n-space justify="center">
          <n-text style="text-align: center">
            <n-h2>
              {{ t('newPatient.welcome') }}
            </n-h2>
          </n-text>
          <Transition mode="out-in">
            <n-spin :show="showSpin">
            <n-form
                v-if="collectingData"
                ref="formRef"
                :model="model"
                :rules="rules"
                label-placement="left">
              <n-h3 style="margin-bottom: 10px">
                {{ t('newPatient.insertData') }}
              </n-h3>
              <n-form-item :label="t('profile.AlexaEmail')" path="email_alexa">
                <n-input
                    :placeholder="t('newPatient.emailPlaceholder')"
                    v-model:value="model.email_alexa"
                    @input="handleEmailInput"
                    style="margin-left: 5px"
                />
              </n-form-item>
              <n-form-item
                  ref = "rEmailAlexaFormItemRef"
                  :label="t('profile.repeatEmail')"
                  path="r_email_alexa">
                <n-input
                    :placeholder="t('newPatient.emailPlaceholder')"
                    v-model:value="model.r_email_alexa"
                    :disabled="!model.email_alexa"
                    style="margin-left: 5px"
                />
              </n-form-item>
              <n-space justify="end">
                <n-button
                    type="primary"
                    :disabled="model.r_email_alexa === undefined"
                    @click="handleValidateButtonClick">
                  <template #icon>
                    <n-icon>
                      <save-icon />
                    </n-icon>
                  </template>
                  {{ t("general.save") }}
                </n-button>
              </n-space>
            </n-form>
            <n-space v-else justify="center">
              <n-h3 class="advice">
                {{ t('newPatient.changePassword') }}
              </n-h3>
            <change-password @password-changed="onPasswordChanged"/>
            </n-space>
            </n-spin>
          </Transition>
        </n-space>
    </n-card>
</template>


<style scoped>
.n-card {
  max-width: 600px;
}
.advice {
  text-align: center;
  align-items: center;
}
</style>