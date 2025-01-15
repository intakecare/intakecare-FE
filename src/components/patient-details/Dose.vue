<script setup lang="ts">
import {computed, PropType, ref, watch} from "vue";
import { useI18n } from "vue-i18n";
import WeekDaySelector from "@/components/patient-details/WeekDaySelector.vue";
import { Option } from "@/classes/therapy-dto";


// Props and emits
const props = defineProps({
  scheduling_type: { type: String, required: true },
  option: {type: Object as PropType<Option>, required: true},
})
const emits = defineEmits(["update:value"]);

// i18n initialization
const { t } = useI18n({ useScope: "global", inheritLocale: true });

// Reactive variables
const selectedTime = ref(props.option.time);
const maxDelay = ref(props.option.max_delay);
const rangeStartTime = ref(props.option?.rangeStartTime);
const rangeEndTime = ref(props.option?.rangeEndTime);
const errorTimeNotInRange = ref(false);

// Computed variables
const cadence = computed({
  get: () => props.option.cadence,
  set: (value) => {
    const temp: Option = {
      cadence: value.length > 0 ? value : ["MO"],
      time: selectedTime.value,
      max_delay: maxDelay.value,
    };
    emits("update:value", temp);
    console.log(temp);
  },
});

const rangeOptions = [
  {
    label: t("therapies.timeRange.morning"),
    key: "morning",
  },
  {
    label: t("therapies.timeRange.lunch"),
    key: "lunch",
  },
  {
    label: t("therapies.timeRange.afternoon"),
    key: "afternoon",
  },
  {
    label: t("therapies.timeRange.dinner"),
    key: "dinner",
  },
  {
    label: t("therapies.timeRange.evening"),
    key: "evening"
  }
];


const onSelectTimeRangeTemplate = (value: string | number) => {
  switch (value){
    case "morning":
      rangeStartTime.value = "05:00";
      rangeEndTime.value = "12:00";
      break;
    case "lunch":
      rangeStartTime.value = "11:00";
      rangeEndTime.value = "15:00";
      break;
    case "afternoon":
      rangeStartTime.value = "14:00";
      rangeEndTime.value = "20:00";
      break;
    case "dinner":
      rangeStartTime.value = "18:00";
      rangeEndTime.value = "22:00";
      break;
    case "evening":
      rangeStartTime.value = "18:00";
      rangeEndTime.value = "23:59";
      break;
  }
};

// Watch functions
watch([selectedTime, rangeStartTime, rangeEndTime], ([newTime, newRangeStartTime, newRangeEndTime])  => {
  /**
   * Function to check if the time is within the range.
   */
  // Convert passed strings (HH:mm) to dates
  const newTimeDate = new Date("1970-01-01T" + newTime + ":00");
  const newRangeStartTimeDate = new Date("1970-01-01T" + newRangeStartTime + ":00");
  const newRangeEndTimeDate = new Date("1970-01-01T" + newRangeEndTime + ":00");

  // Check if the time is NOT within the range
  if (newTimeDate < newRangeStartTimeDate || newTimeDate > newRangeEndTimeDate){
    errorTimeNotInRange.value = true;
  }
  else {
    props.option.time = newTime;
    props.option.rangeStartTime = newRangeStartTime;
    props.option.rangeEndTime = newRangeEndTime;
    errorTimeNotInRange.value = false;
  }
});
</script>


<template>
  <n-card embedded :bordered="false" style="background-color: #e4efef">
    <n-space justify="space-between" align="center">
      <span v-if="scheduling_type === 'weekly'">
        <week-day-selector v-model:value="cadence" :disabled="false" />
      </span>
      <span>
        <n-space align="center">
          <n-text> {{ t("therapies.at") }}: </n-text>
          <n-time-picker format="HH:mm" value-format="HH:mm" v-model:formatted-value="selectedTime"/>
        </n-space>
      </span>
      <span>
        <n-text> {{ t("therapies.maxDelay") }}: </n-text>
        <n-input-number v-model:value="maxDelay" :min="1" style="width: 200px">
        <template #suffix>{{ t("general.minute", 2)}}</template>
        </n-input-number>
      </span>
      <span>
        <n-text> {{ t("therapies.changeableWithin") }}: </n-text>
        <n-space justify="space-between" align="center">
          <n-time-picker format="HH:mm" value-format="HH:mm" v-model:formatted-value="rangeStartTime"/>
          <n-text> - </n-text>
          <n-time-picker format="HH:mm" value-format="HH:mm" v-model:formatted-value="rangeEndTime"/>
          <n-dropdown trigger="hover" :options="rangeOptions" @select="onSelectTimeRangeTemplate">
            <n-button>{{t("therapies.template")}}</n-button>
          </n-dropdown>
        </n-space>
        <n-text v-if="errorTimeNotInRange" style="color: #510045FF">{{t('therapies.errorTimeRange')}}</n-text>
      </span>
    </n-space>
  </n-card>
</template>