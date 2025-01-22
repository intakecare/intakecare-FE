<script setup lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Close as CloseIcon } from "@vicons/ionicons5";
import { Save as SaveIcon } from "@vicons/ionicons5";
import * as api from "@/api";

/**
 * @name NewPatientForm
 * @description
 * This component...
 *
 */

const emit = defineEmits(["onSaved"])
const { t } = useI18n({ useScope: "global", inheritLocale: true });
const showSpin = ref(false);
const formRef = ref(null);
const model = ref({
  username: undefined as string | undefined,
  name: undefined as string | undefined,
});

const revertChanges = () => {
  model.value = {
    username: "",
    name: "",
  };
};

const disableSave = computed(() => {
  return !model.value.username || !model.value.name;
});

const save = async () => {
  showSpin.value = true;
  console.log("Creating patient");
  try{
    await api.administration.createPatient({
      username: model.value.username as string,
      user: {
        name: model.value.name,
      },
      patient: {}
    })
    console.log("Patient created")
    emit("onSaved")
  } catch (error) {
    console.error(error);
  } finally {
    showSpin.value = false;
  }
};

const rules = ref({
    username: [
      {
        required: true,
        message: t("login.usernameValidation"),
        trigger: ["input", "blur"],
      },
    ],
    name: [
      {
        required: true,
        message: t("login.nameValidation"),
        trigger: ["input", "blur"]
      }
    ]
  });
</script>


<template>
<n-spin :show="showSpin">
  <n-form label-placement="left" :model="model" :rules="rules" ref="formRef">
    <n-grid cols="1 s:1 m:2 l:2 xl:2 2xl:2" :x-gap="24" responsive="screen">
      <n-form-item-gi :label="t('patients.username')" path="username">
        <n-input
          :placeholder="t('patients.username')"
          v-model:value="model.username"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('patients.name')" path="name">
        <n-input
          :placeholder="t('patients.name')"
          v-model:value="model.name"
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>

  <n-space justify="end">
    <n-button type="error" ghost @click="revertChanges">
      <template #icon>
        <n-icon>
          <close-icon />
        </n-icon>
      </template>
      {{ t("general.undo") }}
    </n-button>

    <n-button type="primary" @click="save" :disabled="disableSave">
      <template #icon>
        <n-icon>
          <save-icon />
        </n-icon>
      </template>
      {{ t("general.save") }}
    </n-button>
  </n-space>
</n-spin>
</template>