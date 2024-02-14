<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import * as api from "@/api";

/**
 * @name OTP
 * @description
 * This component is used to generate and display the OTP for the patient.
 * It is used in the patient details page.
 *
 * @param {String} patient_id - The id of the patient.
 *
 * @example
 * <OTP patient_id="1234" />
 */

const props = defineProps({
  patient_id: {
    type: String,
    required: true,
  },
})
const { t } = useI18n({ useScope: "global", inheritLocale: true });
const value = ref(1);
const OTP = ref({
  otp: null as string | null,
  expire_by: null as string | null,
});
const period = ref(86400000);
const showSpin = ref(false);

const validator = (x) => x > 0;

const options = computed(() => {
  return [
    { label: t("general.minute", value.value), value: 60000 },
    { label: t("general.hour", value.value), value: 360000 },
    { label: t("general.day", value.value), value: 86400000 },
  ];
});
const generate = () => {
  // This function is used to generate the OTP by passing the patient id and the wanted duration.
  showSpin.value = true;
  api.login
      .generate(props.patient_id, value.value * period.value)
      .then((data) => {
        OTP.value = data.data;
        showSpin.value = false;
      })
      .catch(() => {
        showSpin.value = false;
      });
};
</script>

<template>
  <n-spin :show="showSpin">
    <div v-if="!OTP.otp">
      {{ t("OTP.setExpiration") }}
      <n-grid
        style="margin-top: 10px; margin-bottom: 10px"
        cols="2"
        :x-gap="10"
        :y-gap="10"
      >
        <n-gi>
          <n-input-number v-model:value="value" :validator="validator" />
        </n-gi>
        <n-gi>
          <n-select :options="options" v-model:value="period" />
        </n-gi>
      </n-grid>
      <n-space vertical>
        {{ t("OTP.OTPWarning") }}
        <n-space justify="end">
          <n-button size="small" type="primary" @click="generate()">{{
            t("general.genOTP")
          }}</n-button>
        </n-space>
      </n-space>
    </div>
    <div v-else>
      <n-space vertical item-style="text-align:center">
        <n-h1>{{ OTP ? OTP.otp : null }}</n-h1>
        <n-h3
          >{{ t("patientDetail.expiry") }}
          {{
            OTP ? new Date(OTP.expire_by).toLocaleString("it-IT") : null
          }}
        </n-h3>
      </n-space>
    </div>
  </n-spin>
</template>

