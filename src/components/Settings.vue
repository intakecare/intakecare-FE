<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  Save as SaveIcon,
  Settings as SettingsIcon,
  PhonePortrait as PhoneIcon
} from "@vicons/ionicons5";
import * as api from "@/api";
import PatientDTO, { patientUpdateDTO } from "@/classes/patient-dto";
import { useUserStore } from "@/stores/user";
import registerSW from "@/registerServiceWorker"
import { UserDTO } from "@/classes/user-dto";

// TODO: RIPARTI DA QUI. Refactor totale del codice.
// TODO: Metti Alexa di default.

/**
 * @name Settings
 * @description This component displays and allows the user to change the default setting for
 * the confirmation of intakes.
 *
 * @param {String} patient_id The id of the patient.
 *
 * @example
 * <Settings patient_id="1234" />
 */

const props = defineProps({
  patient_id: {
    type: String,
    required: true,
  }
})

const { t } = useI18n({ useScope: "global", inheritLocale: true });
const user = useUserStore();
const showSpin = ref(false);
const data = ref({} as PatientDTO);//{} as PatientDTO

const getData = async () => {
  if(user._id) {
    await api.patients.findByUserId(user._id as string)
        .then((value) => {
          data.value.validationAlexaDefault = value.data.validationAlexaDefault;
          data.value.validationPhoneDefault = value.data.validationPhoneDefault;
          data.value.validationWebDefault = value.data.validationWebDefault;
          console.log(data.value)

          //showSpin.value = true;
        })
        .catch((error) => {
          showSpin.value = false;
          console.log(user._id as string)
          console.log(error)
        });
  }
}

const emailAlexa = computed(() => {
  return user.email_alexa
})

const alexaDisable = computed(() => {
  return !emailAlexa.value;
})

const phone = computed(() => {
  return user.phone
})

const phoneDisable = computed(() => {
  return (!user.phone);
})

const alexaState = computed(() => {
  return data.value.validationAlexaDefault === true;
})

const phoneState = computed(() => {
  return data.value.validationPhoneDefault === true;
})

const webState = computed(() => {
  return data.value.validationWebDefault === true;
})

const alexaChanged = () => {
  if(alexaState.value === true){
    //data.value.validation_alexa = false
    data.value.validationAlexaDefault = false;
  } else {
    //data.value.validation_alexa = true
    data.value.validationAlexaDefault = true;
  }
}

const webChanged = () => {
  if(webState.value === true){
    //data.value.validation_web = false
    data.value.validationWebDefault = false;
  } else {
    //data.value.validation_web = true
    data.value.validationWebDefault = true;
    if (!user.endpoint) {
      registerSW();
    }
  }
}

const phoneChanged = () => {
  if(phoneState.value === true){
    //data.value.validation_phone = false
    data.value.validationPhoneDefault = false;
  } else {
    //data.value.validation_phone = true
    data.value.validationPhoneDefault = true;
  }
}

const messageErrorAlexa = (() => {
  if (alexaDisable.value) {
    return 'Email account Amazon non registrata'
  }
})

const messageErrorPhone = (() => {
  if (phoneDisable.value) {
    return 'Numero di telefono non registrato'
  }
})

const patientId = computed (() => {
  return props.patient_id as string
})

const save = async () => {
  showSpin.value = true;
  await api.patients.edit(
      patientId.value, {
        patient: {
          validationAlexaDefault: alexaState.value,
          validationPhoneDefault: phoneState.value,
          validationWebDefault: webState.value,
        }})
      .then(() => {
        showSpin.value = false;
      });
}

onMounted(() => {
  getData();
  console.log(user.email, user.email_alexa, user.phone)
})
</script>


<template>
    <n-spin :show="showSpin">
        <div > {{t("settings.setDefaultValidation")}}
            <n-grid
                style="margin-top: 10px; margin-bottom: 10px"
                cols="1"
                :x-gap="10"
                :y-gap="10">

                    <n-gi vertical>
                        <img height="13" alt="amazonalexa" src="@/assets/icons/amazonalexa.svg"> 
                        {{ t("therapies.alexa") }} 
                        <n-switch :title="messageErrorAlexa()" v-model:value="alexaState" @change="alexaChanged()" size="large"  :disabled="alexaDisable">
                            <template #checked>{{ t("therapies.active") }}</template>
                            <template #unchecked>{{ t("therapies.inactive") }}</template>
                        </n-switch>
                    </n-gi>

                    <div style="visibility: hidden">
                        {{t("Settings.message")}}
                    </div>

                <n-gi vertical>
                    {{ t("therapies.web") }}
                    <n-switch  v-model:value="webState" @change="webChanged()" size="large">
                        <template #checked>{{ t("therapies.active") }}</template>
                        <template #unchecked>{{ t("therapies.inactive") }}</template>
                    </n-switch>
                </n-gi>

                <n-gi vertical>
                    <n-icon>
                        <phone-icon />
                    </n-icon>{{ t("therapies.phone") }}
                    <n-switch :title="messageErrorPhone()" v-model:value="phoneState" @change="phoneChanged()" size="large" :disabled="phoneDisable" >
                        <template #checked>{{ t("therapies.active") }}</template>
                        <template #unchecked>{{ t("therapies.inactive") }}</template>
                    </n-switch>
                </n-gi>
            </n-grid>

            <n-space vertical>
                <n-space justify="end">
                    <n-button size="small" type="primary" @click="save()">
                        <template #icon>
                            <n-icon>
                                <save-icon />
                            </n-icon>
                        </template>{{t("general.save")}}
                    </n-button>
                </n-space>
            </n-space>
            
        </div>
    </n-spin>
  </template>
  
