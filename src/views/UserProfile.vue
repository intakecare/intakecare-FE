<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Pencil as PencilIcon } from "@vicons/ionicons5";
import { Save as SaveIcon } from "@vicons/ionicons5";
import { Close as CloseIcon } from "@vicons/ionicons5";
import {useUserStore} from "@/stores/user";
import * as api from "@/api";
import ChangePassword from "@/components/user-profile/ChangePassword.vue";
import {FormItemRule, MessageReactive, useMessage} from "naive-ui";
import {UserUpdateDTO} from "@/classes/user-dto";
import {useRouter} from "vue-router";

/**
 * This view is used to display the profile of the user.
 */

const { t } = useI18n({ useScope: "global", inheritLocale: true });
const showSpin = ref(false);
const user = useUserStore();
const message = useMessage();
const router = useRouter();
let requirePasswordChangeMessage: MessageReactive | null = null;

onMounted(() => {
  showSpin.value = true;
  formModel.value = {
    cf: user.cf as null | string,
    email: user.email as null | string,
    email_alexa: user.email_alexa as null | string,
    phone: user.phone as null | string,
    userType: user.user_type as null | string
  }
  if (user.new_user){
    createRequirePasswordChangeMessage();
  }
});

// Check if the user is a new user
const new_user = computed(() => {
  return user.user_type === 'patient_new' || user.new_user;
})

const formRef = ref(null);

const formModel = ref({
  cf: user.cf as null | string,
  email: user.email as null | string,
  email_alexa: user.email_alexa as null | string,
  phone: user.phone as null | string,
  userType: user.user_type as null | string,
});

// const phoneValidator = (rule: FormItemRule, value: string) => {};
const rules = computed(() => {
  return {
    phone: {
      required: true,
      message: t("profile.phoneRequired"),
      trigger: ["input", "blur"],
    },
    email: [
      {
        required: true,
        message: t("profile.emailRequired"),
        trigger: ["input", "blur"],
      },
    ],
  };
});

const editMode = ref(false);
const toggleEdit = () => {
  editMode.value = !editMode.value;
};

const revertChanges = () => {
  formModel.value = {
    cf: user.cf as null | string,
    email: user.email as null | string,
    email_alexa: user.email_alexa as null | string,
    phone: user.phone as null | string,
    userType: user.user_type as null | string,
  };
};

const updateProfile = async () => {
  showSpin.value = true;
  console.log(user)
  const userToUpdate: Partial<UserUpdateDTO> = {}; /*Partial<UserUpdateDTO> = {
        email: formModel.value.email as string | undefined,
        email_alexa: formModel.value.email_alexa as string | undefined,
        phone: formModel.value.phone as string | undefined,
    }*/
  if (formModel.value.email) {
    userToUpdate.email = formModel.value.email as string
  } else {
    userToUpdate.email = undefined
  }
  if (formModel.value.email_alexa) {
    userToUpdate.email_alexa = formModel.value.email_alexa as string
  } else {
    userToUpdate.email_alexa = undefined
  }
  if (formModel.value.phone) {
    userToUpdate.phone = formModel.value.phone as string
  } else {
    userToUpdate.phone = undefined
  }
  console.log(userToUpdate)
  await api.user
      .update(userToUpdate)
      .then(() => {
        user.patch(userToUpdate)
        editMode.value = false;
      })
      .catch((error) => {
        showSpin.value = false;
        console.log(error);
      })
};

const createRequirePasswordChangeMessage = () => {
  if (!requirePasswordChangeMessage) {
    requirePasswordChangeMessage = message.warning(
      t("profile.requirePasswordChange"),{
      duration: 0,
      closable: true,
    });
  }
}

const onPasswordChanged = () => {
  /** This function is called when the password is changed in the corresponding component.
   * It destroys the message requiring the password change, logouts the user and redirects to the home page. */
  // If the message is present, destroy it
  if (requirePasswordChangeMessage) {
    requirePasswordChangeMessage.destroy();
    requirePasswordChangeMessage = null;
  }
  // Logout
  user.logout();
  // Redirect to home page
  router.push({ name: "Home" });
}

</script>


<template>
  <n-card class="content">
    <n-space justify="center">
      <n-space vertical>
        <n-h1>
          <n-text>
          {{t('general.greeting')}} {{ user.name }} {{ user.surname }}
          </n-text>
        </n-h1>

        <n-form
          :model="formModel"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="180"
          :style="{
            maxWidth: '700px',
          }"
        >
          <n-form-item :label="t('profile.cf')" path="cf">
            <n-input
              placeholder=" "
              v-model:value="formModel.cf"
              :disabled="true"
            />
          </n-form-item>

          <n-form-item :label="t('profile.email')" path="inputValue">
            <n-input
              placeholder=" "
              v-model:value="formModel.email"
              :disabled="!editMode"
            />
          </n-form-item>

          <n-space v-if="editMode"
            :label-width="180"
            :y-gap="100"
            :style="{
              maxWidth: '700px',
            }">
            <n-p
              ><n-text type="secondary"
                >Inserendo questo dato acconsenti all'utilizzo</n-text
              ></n-p
            >
          </n-space>

          <n-form-item :label="t('profile.AlexaEmail')" path="inputValue">
            <n-input
              placeholder=" "
              v-model:value="formModel.email_alexa"
              :disabled="!editMode"
            />
          </n-form-item>

          <n-space v-if="editMode"
            :label-width="180"
            :y-gap="100"
            :style="{
              maxWidth: '700px',
            }">
            <n-p
              ><n-text type="secondary"
                >Inserendo questo dato acconsenti all'utilizzo</n-text
              ></n-p
            >
          </n-space>

          <n-form-item :label="t('profile.phone')" path="inputValue">
            <n-input
              placeholder=" "
              v-model:value="formModel.phone"
              :disabled="!editMode"
            />
          </n-form-item>

          <n-form-item :label="t('profile.userType')" path="inputValue">
            <n-input
              placeholder=" "
              v-model:value="formModel.userType"
              :disabled="true"
            />
          </n-form-item>
        </n-form>

        <n-space v-if="!editMode" justify="end">
          <n-button type="primary" icon-placement="right" @click="toggleEdit()">
            <template #icon>
              <n-icon>
                <pencil-icon />
              </n-icon>
            </template>
            {{ t("general.edit") }}
          </n-button>
        </n-space>

        <n-space v-else justify="end">
          <n-button
            type="error"
            ghost
            icon-placement="right"
            @click="
              toggleEdit();
              revertChanges();
            "
          >
            <template #icon>
              <n-icon>
                <close-icon />
              </n-icon>
            </template>
            {{ t("general.undo") }}
          </n-button>

          <n-button type="primary" icon-placement="right" @click="updateProfile()">
            <template #icon>
              <n-icon>
                <save-icon />
              </n-icon>
            </template>
            {{ t("general.save") }}
          </n-button>
        </n-space>
        <n-divider />
        <change-password @password-changed="onPasswordChanged"/>
      </n-space>
    </n-space>
  </n-card>
</template>

<style scoped>
.content {
  margin-bottom: 10px;
}
</style>
