<script setup lang="ts">
import {ref, computed, PropType, onMounted, onUpdated} from "vue";
import { useI18n } from "vue-i18n";
import Drugs from "@/assets/Lista_farmaci_equivalenti.json";
import titleCase from "@/use/titleCase";
import { Delivery, Therapy } from "@/classes/therapy-dto";
import Dose from "@/components/PatientDetailDoctor/Dose.vue";
import * as api from "@/api";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from "@vicons/ionicons5";
import useWindowResize from "@/use/useWindowResize";

/**
 * @component TherapyForm
 * @description This component is used to create or edit a therapy
 * @param {Therapy} therapy - The therapy to edit
 * @param {string} patient_id - The patient id
 *
 * @emits changed - When the therapy is saved
 *
 * @example
 * <TherapyForm :therapy="therapy" patient_id="123" @changed="getData()" />
 * */

// Define props and emits
const props = defineProps({
  therapy: {
    type: Object as PropType<Therapy>,
    default: null,
  },
  patient_id: {
    type: String,
    required: true,
  },
})
const emits = defineEmits(["changed"])

// i18n and window initialization
const { t } = useI18n({ useScope: "global", inheritLocale: true });
const { width, height } = useWindowResize();

// Reactive variables
const showSpin = ref(false);
const showAddDrug = ref(false);
const selectedSubstance = ref(null);
const selectedDrug = ref(null as string | null);
const drugValue = ref(null as string | null);
const posology = ref(null as string | null);
const timeEnd = ref("range");
const meals = ref("indifferent");
const scheduling_type = ref("weekly");

let delivery = ref({
  scheduling_type: "weekly",
  options: [
    {
      time: "12:00",
      max_delay: 960,
      cadence: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
      rangeStartTime: null as string | null,
      rangeEndTime: null as string | null,
    },
  ],
} as Delivery);

const deliveryComputed = computed({
  get() {
    if (props.therapy) {
      return props.therapy.delivery;
    } else {
      return delivery.value;
    }
  },
  set(value: Delivery){
    delivery.value = value;
  }
})

// Error variables
const errorStartDatePast = ref(false);
const errorEndDateBeforeStart = ref(false);
const errorDrugNotSelected = ref(false);
const errorPosologyNotSelected = ref(false);

onMounted(() => {
  if (props.therapy) {
    drugValue.value = props.therapy.drug;
    delivery.value = props.therapy.delivery;
    intakeNumber.value = props.therapy.duration
        ? props.therapy.duration
        : 1;
    state.value = props.therapy.state;
    posology.value = props.therapy.posology;
    meals.value = props.therapy.meals ? props.therapy.meals : "no ";
    dateRange.value = [
      new Date(props.therapy.start_date).getTime() +
      new Date().getTimezoneOffset() * 60000,
      props.therapy.end_date
          ? new Date(props.therapy.end_date).getTime() +
          new Date().getTimezoneOffset() * 60000
          : Date.now(),
    ];
  }
});

onUpdated(() => {
  if (props.therapy) {
    drugValue.value = props.therapy.drug;
    delivery.value = props.therapy.delivery;
    intakeNumber.value = props.therapy.duration
        ? props.therapy.duration
        : 1;
    state.value = props.therapy.state;
    posology.value = props.therapy.posology;
    meals.value = props.therapy.meals ? props.therapy.meals : "no ";
    dateRange.value = [
      new Date(props.therapy.start_date).getTime() +
      new Date().getTimezoneOffset() * 60000,
      props.therapy.end_date
          ? new Date(props.therapy.end_date).getTime() +
          new Date().getTimezoneOffset() * 60000
          : Date.now(),
    ];
  }
});


const endOptions = computed(() => [
  {
    value: "range",
    label: t("therapies.dateRange"),
  },
  // {
  //   value: "intakes",
  //   label: t("therapies.numberIntakes"),
  // },
  // {
  //   value: "no",
  //   label: t("therapies.endless"),
  // },
]);

// Set the date range from tomorrow to 120 days from tomorrow
const dateRange = ref([Date.now() + 24 * 60 * 60 * 1000, Date.now() + (120 + 1) * 24 * 60 * 60 * 1000]);

const disablePreviousDate = (ts: number): boolean => {
  return !props.therapy && ts < Date.now() - 24 * 60 * 60 * 1000;
};
const intakeNumber = ref(1);

const mealsOptions = computed(() => [
  {
    value: "before",
    label: t("therapies.mealTiming.before"),
  },
  {
    value: "during",
    label: t("therapies.mealTiming.during"),
  },
  {
    value: "after",
    label: t("therapies.mealTiming.after"),
  },
  {
    value: "indifferent",
    label: t("therapies.mealTiming.indifferent"),
  },
]);

const disableSave = computed(() => {
  /**
   * This function is used to disable the save button if some fields are not filled or correct
   */
  // Check if drug is selected
  if (!drugValue.value) {
    errorDrugNotSelected.value = true;
    return true;
  }
  // Check if posology is filled
  if (!posology.value) {
    errorPosologyNotSelected.value = true;
    return true;
  }
  // Check if the start date is in the past -> ONLY FOR NEW THERAPIES
  if (!props.therapy) {
    if (dateRange.value[0] < Date.now() - 24 * 60 * 60 * 1000){
      errorStartDatePast.value = true;
      return true;
    }
  }
  // Check if the end date is before the start date
  if (timeEnd.value === "range" && dateRange.value[1] < dateRange.value[0]){
    errorEndDateBeforeStart.value = true;
    return true;
  }
  // Check if there is at least one delivery option
  if (deliveryComputed.value.options.length === 0){
    return true;
  }
  // If all the checks are passed, enable the save button
  return false;
});

const intakesOutput = ref(
    null as null | {
      scheduling_type: string;
      options: {
        time: string;
        max_delay: number;
        cadence: number | string[];
      }[];
    }
);

const delayChange = (value: number) => {
  if (intakesOutput.value)
    intakesOutput.value.options.forEach((e) => {
      e.max_delay = value;
    });
};
const state = ref(true);


const saveTherapy = () => {
  const therapyToSave: Partial<Therapy> = {
    patient_id: props.patient_id,
    drug: drugValue.value as string,
    posology: posology.value as string,
    validation_alexa: true,
    start_date: new Date(
        dateRange.value[0] - new Date().getTimezoneOffset() * 60000
    ),
    delivery: deliveryComputed.value as Delivery,
    state: state.value,
  };
  if (meals.value !== "no")
    therapyToSave.meals = meals.value as "before" | "during" | "after";
  if (timeEnd.value === "range") {
    therapyToSave.end_date = new Date(
        dateRange.value[1] - new Date().getTimezoneOffset() * 60000
    );
  }
  if (timeEnd.value === "intakes") {
    therapyToSave.duration = intakeNumber.value;
  }
  showSpin.value = true;
  console.log(therapyToSave);

  if (props.therapy && props.therapy._id) {
    api.therapies
        .update(props.therapy._id, therapyToSave)
        .then(() => {
          showSpin.value = false;
          emits("changed");
        })
        .catch(() => {
          showSpin.value = false;
        });
  } else {
    api.therapies
        .save(therapyToSave)
        .then(() => {
          showSpin.value = false;
          emits("changed");
        })
        .catch(() => {
          showSpin.value = false;
        });
  }
};


const computedStyle = computed(() => {
  return `max-height: ${height.value - 170}px`;
});

const addDelivery = () => {
  deliveryComputed.value.options.push({
    time: "12:00",
    max_delay: 960,
    cadence: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    rangeStartTime: undefined,
    rangeEndTime: undefined,
  });
};
</script>


<template>
  <n-spin :show="showSpin">
    <n-grid :x-gap="10" :y-gap="10" cols="1 1000:2" item-responsive>
      <!-- First Column: delivery options (daily, weekly, timing) + Max Delay -->
      <n-gi>
        <n-scrollbar :style="computedStyle">
          <n-card :title="t('therapyForm.insertDoses')">
            <n-space justify="center" align="center" vertical>
              <dose
                  v-for="(intake, index) in deliveryComputed.options"
                  v-bind:key="index"
                  :scheduling_type="scheduling_type"
                  v-model:option="deliveryComputed.options[index]"
                  @delete="deliveryComputed.options.splice(index, 1)"
              />
              <n-button ghost circle type="primary" @click="addDelivery()">
                <template #icon>
                  <n-icon>
                    <add-icon />
                  </n-icon>
                </template>
              </n-button>
            </n-space>
          </n-card>
        </n-scrollbar>
      </n-gi>

      <!-- Second Column: everything else -->
      <n-gi>
        <n-space vertical>
          <n-scrollbar :style="computedStyle">
            <n-card :bordered="false">
              <!-- Drug selection -->
              <n-card :bordered="false" :title="t('therapyForm.insertDrug')">
                  <n-gi span="4 500:9">
                    <n-input
                      :placeholder="t('therapies.drug')"
                      type="textarea"
                      size="medium"
                      clearable
                      v-model:value="drugValue"
                      :autosize="{
                        minRows: 1,
                        maxRows: 3,
                      }"
                    />
                  </n-gi>
              </n-card>
              <n-divider />
              <!-- Posology -->
              <n-card :bordered="false" :title="t('therapyForm.insertPosology')">
                <n-gi span="4 500:9">
                  <n-input
                    style="width: 100%"
                    clearable
                    v-model:value="posology"
                    :placeholder="t('therapies.posology')"
                  />
                </n-gi>
              </n-card>
              <n-divider />
            <!-- Date Picker (start and end) -->
              <n-card :bordered="false" :title="t('therapyForm.insertDateInterval')">
                <n-date-picker
                    v-model:value="dateRange"
                    type="daterange"
                    clearable
                    :is-date-disabled="disablePreviousDate"
                />
              </n-card>
            </n-card>
          </n-scrollbar>
        </n-space>
      </n-gi>
    </n-grid>
    <!-- Footer -->
    <n-space align="center" justify="end">
      <!-- Active or Suspended -->
      <n-switch v-model:value="state" size="large">
        <template #checked>{{ t("therapies.active") }}</template>
        <template #unchecked>{{ t("therapies.suspended") }}</template>
      </n-switch>
      <!-- Save Button -->
      <n-button type="primary" @click="saveTherapy" :disabled="disableSave">
        <template #icon>
          <n-icon>
            <save-icon />
          </n-icon>
        </template>
        {{ t("general.save") }}
      </n-button></n-space>
  </n-spin>
</template>
