<script setup lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Save as SaveIcon } from "@vicons/ionicons5";
import * as api from "@/api";

const { t } = useI18n({ useScope: "global", inheritLocale: true });
const showSpin = ref(false);
const formRef = ref(null);
const props = defineProps({
  id: String,
  name: String,
  surname: String,
  cf: String,
  email: String,
  phone: String,
  sex: String,
  dob: Date,
  residence: String,
});
const emits = defineEmits(["saved"]);
const model = ref({
  name: props.name,
  surname: props.surname,
  cf: props.cf,
  email: props.email,
  phone: props.phone,
  sex: props.sex,
  dob: props.dob
      ? new Date(props.dob).getTime() - new Date().getTimezoneOffset() * 60000
      : null,
  residence: props.residence,
});

const disableSave = computed(() => {
  return !model.value.email;
});

const onSave = () => {
  showSpin.value = true;
  const updateModel = {
    user: {
      name: model.value.name,
      surname: model.value.surname,
      cf: model.value.cf,
      email: model.value.email as string,
      phone: model.value.phone,
      dob: model.value.dob? new Date(model.value.dob) : undefined,
      sex: model.value.sex,
      residence: model.value.residence
    }
  };
  console.log(props.id, updateModel);
  api.patients
      .edit(props.id ? props.id : "", updateModel)
      .then(() => {
        showSpin.value = false;
        emits("saved");
      });
};
const rules = computed(() => {
  return {
    email: [
      {
        required: true,
        message: t("patients.emailValidation"),
        trigger: ["input", "blur"],
      },
    ],
  };
});
</script>

<template>
  <n-spin :show="showSpin">
    <n-form label-placement="left" :model="model" :rules="rules" ref="formRef">
      <n-grid cols="1 s:1 m:2 l:2 xl:2 2xl:2" :x-gap="24" responsive="screen">
        <n-form-item-gi :label="t('patients.name')">
          <n-input
            :placeholder="t('patients.name')"
            path="name"
            v-model:value="model.name"
          />

          <n-input
            :placeholder="t('patients.surname')"
            v-model:value="model.surname"
            path="surname"
            style="margin-left: 5px"
          />
        </n-form-item-gi>

        <n-form-item-gi :label="t('patients.cf')" path="cf">
          <n-input :placeholder="t('patients.cf')" v-model:value="model.cf" />
        </n-form-item-gi>

        <n-form-item-gi :label="t('profile.email')" path="email">
          <n-input
            :placeholder="t('profile.email')"
            v-model:value="model.email"
          />
        </n-form-item-gi>

        <n-form-item-gi :label="t('profile.phone')" path="phone">
          <n-input
            :placeholder="t('profile.phone')"
            v-model:value="model.phone"
          />
        </n-form-item-gi>

        <n-form-item-gi :label="t('profile.residence')" path="residence">
          <n-input
            :placeholder="t('profile.residence')"
            v-model:value="model.residence"
          />
        </n-form-item-gi>

        <n-form-item-gi :label="t('patients.sex')" path="sex">
          <n-select
            v-model:value="model.sex"
            placeholder="Select"
            :options="[
              { label: t('patients.male'), value: 'Male' },
              { label: t('patients.female'), value: 'Female' },
            ]"
          />
        </n-form-item-gi>

        <n-form-item-gi :label="t('patients.dob')" path="dob">
          <n-date-picker
            v-model:value="model.dob"
            :placeholder="t('patients.dob')"
            type="date"
            format="dd-MM-yyyy"
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>

    <n-space justify="end">
      <n-button type="primary" @click="onSave" :disabled="disableSave">
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
