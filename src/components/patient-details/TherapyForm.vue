<script setup lang="ts">
import {ref, computed, PropType, onMounted, onUpdated} from "vue";
import DeliveryOptions from "@/components/patient-details/DeliveryOptions.vue";
import { useI18n } from "vue-i18n";
import Drugs from "@/assets/Lista_farmaci_equivalenti.json";
import titleCase from "@/use/titleCase";
import { Dose, Therapy } from "@/classes/therapy-dto";
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
const delay = ref(120);
const timeEnd = ref("range");
const meals = ref("indifferent");

let delivery = ref({
  scheduling_type: "weekly",
  options: [
    {
      time: "12:00",
      max_delay: 120,
      cadence: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
      rangeStartTime: null as string | null,
      rangeEndTime: null as string | null,
    },
  ],
} as Dose);

// let delivery = computed(() => props.therapy?.delivery);

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

const substance = Object.keys(Drugs).map((e) => {
  return { label: e, value: e };
});

const drug = computed(() => {
  let tmp: { label: string; value: string }[] = [];
  if (!selectedSubstance.value) {
    Object.values(Drugs).forEach((e) => {
      e.forEach((v) => {
        tmp.push({
          label: titleCase(
              `${v["Farmaco"]} - ${
                  v["Confezione di riferimento"].split("-")[0]
              }`
          ),
          value: titleCase(
              `${v["Farmaco"]}  - ${v["Confezione di riferimento"]} - ${v["AIC"]}`
          ),
        });
      });
    });
  } else {
    // eslint-disable-next-line
    (Drugs as Record<string, any[]>)[
        selectedSubstance.value as unknown as string
        ].forEach((v) => {
      tmp.push({
        label: titleCase(
            `${v["Farmaco"]} - ${
                v["Confezione di riferimento"].split("-")[0]
            }`
        ),
        value: titleCase(
            `${v["Farmaco"]} - ${v["Confezione di riferimento"]} - ${v["AIC"]}`
        ),
      });
    });
  }
  return tmp;
});

const handleUpdateValue = () => {
  drugValue.value = selectedDrug.value;
};

const endOptions = computed(() => [
  {
    value: "range",
    label: t("therapies.dateRange"),
  },
  {
    value: "intakes",
    label: t("therapies.numberIntakes"),
  },
  {
    value: "no",
    label: t("therapies.endless"),
  },
]);

const dateRange = ref([Date.now(), Date.now() + 24 * 60 * 60 * 1000]);

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
  // Check if the start date is in the past
  if (dateRange.value[0] < Date.now() - 24 * 60 * 60 * 1000){
    errorStartDatePast.value = true;
    return true;
  }
  // Check if the end date is before the start date
  if (timeEnd.value === "range" && dateRange.value[1] < dateRange.value[0]){
    errorEndDateBeforeStart.value = true;
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
    delivery: intakesOutput.value as Dose,
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

const onDeliveryChanged = (value: { scheduling_type: string; options: any[] }) => {
  intakesOutput.value = value;
};
</script>


<template>
  <n-spin :show="showSpin">
    <n-grid :x-gap="10" :y-gap="10" cols="1 1000:2" item-responsive>
      <!-- First Column: delivery options (daily, weekly, timing) -->
      <n-gi>
        <n-scrollbar :style="computedStyle">
          <n-card :title="t('doses.doses')">
            <delivery-options
                :delivery="delivery" @changed="onDeliveryChanged"/>
          </n-card>
        </n-scrollbar>
      </n-gi>
      <!-- Second Column: everything else -->
      <n-gi>
        <n-space vertical>
          <n-scrollbar :style="computedStyle">
            <!-- Drug selection -->
            <n-card :title="t('therapies.drug')">
              <n-collapse-transition :show="showAddDrug">
                <n-space vertical item-style="margin-top:5px">
                  <div>
                    <n-text>
                      {{ t("general.select") }}
                      {{ t("therapies.drug") }}:</n-text
                    >
                    <n-select
                      v-model:value="selectedDrug"
                      filterable
                      clearable
                      :placeholder="`${t('general.select')} ${t(
                        'therapies.drug'
                      )}`"
                      :options="drug"
                      @update:value="handleUpdateValue()"
                    />
                  </div>
                  <div>
                    <n-text>
                      {{ t("general.filter") }}
                      {{ t("therapies.activeSubstance") }}:</n-text
                    >
                    <n-select
                      v-model:value="selectedSubstance"
                      filterable
                      clearable
                      :placeholder="`${t('general.filter')} ${t(
                        'therapies.activeSubstance'
                      )}`"
                      :options="substance"
                    />
                  </div>
                </n-space>
              </n-collapse-transition>
              <n-grid
                cols="5 500:10"
                :x-gap="10"
                :y-gap="10"
                style="margin-top: 10px"
              >
                <n-gi>
                  <n-space align="center">
                    <n-button
                      v-if="!showAddDrug"
                      circle
                      type="primary"
                      @click="showAddDrug = true"
                    >
                      <template #icon>
                        <n-icon>
                          <add-icon />
                        </n-icon> </template
                    ></n-button>
                    <n-button
                      v-else
                      circle
                      ghost
                      type="primary"
                      @click="showAddDrug = false"
                    >
                      <template #icon>
                        <n-icon>
                          <close-icon />
                        </n-icon> </template
                    ></n-button>
                  </n-space>
                </n-gi>
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
              </n-grid>
            </n-card>
            <n-card :bordered="false">
              <n-grid cols="1 450:2" :x-gap="10" :y-gap="10">
                <!-- Posology -->
                <n-gi>
                  <n-space align="center" vertical style="width: 100%">
                    <n-text> {{ t("therapies.posology") }} </n-text>
                    <n-input
                      style="width: 100%"
                      clearable
                      v-model:value="posology"
                      :placeholder="t('therapies.posology')"
                    />
                  </n-space>
                </n-gi>
                <!-- Max Delay -->
                <n-gi>
                  <n-space align="center" vertical style="width: 100%">
                    <n-text> {{ t("therapies.maxDelay") }} </n-text>
                    <n-input-number
                      style="width: 100%"
                      @update:value="delayChange"
                      v-model:value="delay"
                      :min="1"
                    >
                      <template #suffix>
                        {{ t("general.minute", delay) }}
                      </template>
                    </n-input-number>
                  </n-space>
                </n-gi>
                <n-gi span="1 450:2">
                  <n-divider />
                </n-gi>
                <!-- Date Picker (start and end | number of administrations | endless) -->
                <n-gi span="1 450:2">
                  <n-space justify="center" align="center" vertical>
                    <n-radio-group
                      v-model:value="timeEnd"
                      name="radiobuttongroup1"
                      v-if="width > 600"
                    >
                      <n-radio-button
                        v-for="endOption in endOptions"
                        :key="endOption.value"
                        :value="endOption.value"
                      >
                        {{ endOption.label }}
                      </n-radio-button>
                    </n-radio-group>

                    <n-select
                      style="width: 100%"
                      v-else
                      v-model:value="timeEnd"
                      :options="endOptions"
                    />
                  </n-space>
                </n-gi>
                <n-gi span="1 450:2" v-if="timeEnd === 'range'">
                  <n-date-picker
                    v-model:value="dateRange"
                    type="daterange"
                    clearable
                    :is-date-disabled="disablePreviousDate"
                  />
                </n-gi>
                <n-gi span="1 450:2" v-else-if="timeEnd === 'intakes'">
                  <n-space justify="space-between" align="center">
                    <n-date-picker
                      v-model:value="dateRange[0]"
                      type="date"
                      clearable
                      :is-date-disabled="disablePreviousDate"
                    />
                    <n-input-number
                      style="max-width: 100px"
                      v-model:value="intakeNumber"
                      placeholder="Min"
                      :min="1"
                    />
                  </n-space>
                </n-gi>
                <n-gi span="1 450:2" v-else>
                  <n-date-picker
                    v-model:value="dateRange[0]"
                    type="date"
                    clearable
                    :is-date-disabled="disablePreviousDate"
                  />
                </n-gi>
                <n-gi span="1 450:2">
                  <n-divider />
                </n-gi>
                <!-- Meals -->
                <n-gi>
                  <n-space align="center">
                    <n-text>{{ t("therapies.meals") }}</n-text>
                    <n-radio-group
                      v-model:value="meals"
                      name="radiobuttongroup2"
                    >
                      <n-radio-button
                        v-for="mealsOption in mealsOptions"
                        :key="mealsOption.value"
                        :value="mealsOption.value"
                      >
                        {{ mealsOption.label }}
                      </n-radio-button>
                    </n-radio-group>
                  </n-space>
                </n-gi>

                <n-gi span="1 450:2">
                  <n-divider />
                </n-gi>
              </n-grid>
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
