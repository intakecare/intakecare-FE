<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Option } from "@/classes/therapy-dto";
import {edit} from "@/api/v1/patients";

/**
 * Component to manage the delivery options of a therapy.
 * @param schedule The delivery options of the therapy.
 * @param disabled Whether the component is disabled or not.
 */

// Define props and emits
const props = defineProps({
  schedule: {
    type: Array as PropType<Option[]>,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
})
const emits = defineEmits(["scheduleChanged"]);

// i18n initialization
const { t } = useI18n({ useScope: "global", inheritLocale: true });

// Constants and types
const days = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
type Range = {
  startTime: string | null,
  endTime: string | null,
}

// Reactive variables
const showSpin = ref(false);
const disabled = ref(true);

const timeMO = ref([] as string[]);
const timeTU = ref([] as string[]);
const timeWE = ref([] as string[]);
const timeTH = ref([] as string[]);
const timeFR = ref([] as string[]);
const timeSA = ref([] as string[]);
const timeSU = ref([] as string[]);

// Computed variables
const editableTherapies = computed(() => {
  /**
   * Function to transform the therapy delivery options to the editable format.
   * Returns an array of objects with the following structure:
   * {
   *   weekday: string, // The day of the week.
   *   times: string[], // The times of the day formatted as HH:mm.
   *   range: Object[] // The range of hours in which the therapy can be delivered.
   * }
   */

  const temp_result: {
    weekday: string,
    times: string[],
    range: Range[],
  }[] = [];
  for (const day of days) {
    for (const singleSchedule of props.schedule) {
      if (singleSchedule.cadence.includes(day)) {
        // If the day is in the schedule, add the time to the array of times and the range to the array of ranges.
        const index = temp_result.findIndex((e) => e.weekday === day);
        if (index !== -1) {
          temp_result[index].times.push(singleSchedule.time);
          // If the range is defined, add it to the range array.
          if (singleSchedule.rangeStartTime && singleSchedule.rangeEndTime) {
            temp_result[index].range.push({
              startTime: singleSchedule.rangeStartTime,
              endTime: singleSchedule.rangeEndTime,
            });
          } else {
            temp_result[index].range.push({
              startTime: null,
              endTime: null,
            });
          }
        } else {
          // Else create a new object with the day, time and range (if available).
          temp_result.push({
            weekday: day,
            times: [singleSchedule.time],
            range: singleSchedule.rangeStartTime && singleSchedule.rangeEndTime ? [{
              startTime: singleSchedule.rangeStartTime,
              endTime: singleSchedule.rangeEndTime,
            }] : [{
              startTime: null,
              endTime: null,
            }],
          });
        }
      }
    }
  }
  timeMO.value = temp_result.filter(e => e.weekday === 'MO').map(e => e.times).flat() as string[]
  timeTU.value = temp_result.filter(e => e.weekday === 'TU').map(e => e.times).flat() as string[]
  timeWE.value = temp_result.filter(e => e.weekday === 'WE').map(e => e.times).flat() as string[]
  timeTH.value = temp_result.filter(e => e.weekday === 'TH').map(e => e.times).flat() as string[]
  timeFR.value = temp_result.filter(e => e.weekday === 'FR').map(e => e.times).flat() as string[]
  timeSA.value = temp_result.filter(e => e.weekday === 'SA').map(e => e.times).flat() as string[]
  timeSU.value = temp_result.filter(e => e.weekday === 'SU').map(e => e.times).flat() as string[]

  return temp_result;
});

const disabledMode = computed(() => {
  return props.disabled === true;
})

const onConfirmTimeChange = () => {
  /**
   * Function called when the user confirms the change in the time picker.
   */
  // Define the new schedule
  const updatedSchedule: Option[] = [];

  // Find the unique string values among all the time arrays.
  const uniqueTimes = [
    ...new Set([
      ...timeMO.value,
      ...timeTU.value,
      ...timeWE.value,
      ...timeTH.value,
      ...timeFR.value,
      ...timeSA.value,
      ...timeSU.value,
    ]),
  ];

  // For each unique time, create a new Option object and add it to the updatedSchedule array.
  for (const time of uniqueTimes) {
    // Get all the days in which the time is present.
    const days = [
      ...timeMO.value.includes(time) ? ["MO"] : [],
      ...timeTU.value.includes(time) ? ["TU"] : [],
      ...timeWE.value.includes(time) ? ["WE"] : [],
      ...timeTH.value.includes(time) ? ["TH"] : [],
      ...timeFR.value.includes(time) ? ["FR"] : [],
      ...timeSA.value.includes(time) ? ["SA"] : [],
      ...timeSU.value.includes(time) ? ["SU"] : [],
    ];
    // If there is at least one day, create the new Option object and add it to the updatedSchedule array.
    if (days.length > 0) {
      updatedSchedule.push({
        time: time,
        max_delay: props.schedule[0].max_delay,
        cadence: days,
      });
    }
  }
  emits("scheduleChanged", updatedSchedule);
}

const isDayInSchedule = (day: string) => {
  /**
   * Function to check if a day is in the schedule of editableTherapies.
   */
  return editableTherapies.value.some((e) => e.weekday === day);
}

const onTimeValueChanged = (dayArray) => {
  /**
   * Function called when the user confirms the change in the time picker.
   * @param dayArray The array of times for the day.
   */
  console.log('Updated time: ' + dayArray)
}

function isHourDisabled(hour: number, day: string, index: number): boolean {
  /**
   * This function disables the hours that are outside the range given by the physician.
   * Returns true if the hour is disabled, false otherwise.
   *
   */
  // Convert the hour string to a number
  console.log(hour)
  // Fetch the range of hours for the day
  if (editableTherapies.value.find(e => e.weekday === day)) {
    let t = editableTherapies.value.find(e => e.weekday === day).range[index];

    if (t) {
      console.log(t)
    }
    // If the range is NOT defined, disable all the hours and minutes but the current one.
    if (t.startTime === null || t.endTime === null) {
      return hour !== parseInt(editableTherapies.value.find(e => e.weekday === day).times[index].split(":")[0]);
    } else {
      // If the range is defined, check if the hour is outside the range.
      return hour < parseInt(t.startTime.split(":")[0]) || hour > parseInt(t.endTime.split(":")[0]);
    }
  }
}

function isMinuteDisabled(minute: number, selectedHour: number, day: string, index: number): boolean {
  /**
   * This function disables the minutes that are outside the range given by the physician.
   * Returns true if the minute is disabled, false otherwise.
   */
  // If no hour is selected, return false
  if (selectedHour === null) return false;
  // Fetch the range of hours for the day
  let t = editableTherapies.value.find(e => e.weekday === day).range[index];
  // If the range is NOT defined, disable all the hours and minutes but the current one.
  if (t.startTime === null || t.endTime === null) {
    return minute !== parseInt(editableTherapies.value.find(e => e.weekday === day).times[index].split(":")[1]);
  } else {
    // If the range is defined the minute is not important, always return false.
    return false;
  }
}

</script>

<template>
  <n-space horizontal justify="start"
      v-show="isDayInSchedule('MO')"
      style="margin-top: 10px; margin-bottom: 10px">
    <n-text>{{ t('weekDays.MO') }}</n-text>
    <n-time-picker
        v-for="(time,index) in timeMO"
        format="HH:mm"
        v-model:formatted-value="timeMO[index]"
        value-format="HH:mm"
        :disabled="disabledMode"
        :is-hour-disabled="hour => isHourDisabled(hour, 'MO', index)"
        :is-minute-disabled="(minute, selectedHour) => isMinuteDisabled(minute, selectedHour, 'MO', index)"
        @confirm="onTimeValueChanged(timeMO)"
    />
  </n-space>
  <n-space v-show="isDayInSchedule('TU')">
    <n-text>
      {{ t('weekDays.TU') }}
    </n-text>
    <n-time-picker
        v-for="(time, index) in timeTU"
        format="HH:mm"
        v-model:formatted-value="timeTU[index]"
        value-format="HH:mm"
        :disabled="disabledMode"
        :is-hour-disabled="hour => isHourDisabled(hour, 'TU', index)"
        :is-minute-disabled="(minute, selectedHour) => isMinuteDisabled(minute, selectedHour, 'TU', index)"
        @confirm="onTimeValueChanged(timeTU)"
    />
  </n-space>
  <n-space v-show="isDayInSchedule('WE')">
    <n-text>
      {{ t('weekDays.WE') }}
    </n-text>
    <n-time-picker
        v-for="(time, index) in timeWE"
        format="HH:mm"
        v-model:formatted-value="timeWE[index]"
        value-format="HH:mm"
        :disabled="disabledMode"
        :is-hour-disabled="hour => isHourDisabled(hour, 'WE', index)"
        :is-minute-disabled="(minute, selectedHour) => isMinuteDisabled(minute, selectedHour, 'WE', index)"
        @confirm="onTimeValueChanged(timeWE)"
    />
  </n-space>
  <n-space v-show="isDayInSchedule('TH')">
    <n-text>
      {{ t('weekDays.TH') }}
    </n-text>
    <n-time-picker
        v-for="(time, index) in timeTH"
        format="HH:mm"
        v-model:formatted-value="timeTH[index]"
        value-format="HH:mm"
        :disabled="disabledMode"
        :is-hour-disabled="hour => isHourDisabled(hour, 'TH', index)"
        :is-minute-disabled="(minute, selectedHour) => isMinuteDisabled(minute, selectedHour, 'TH', index)"
        @confirm="onTimeValueChanged(timeTH)"
    />
  </n-space>
  <n-space v-show="isDayInSchedule('FR')">
    <n-text>
      {{ t('weekDays.FR') }}
    </n-text>
    <n-time-picker
        v-for="(time, index) in timeFR"
        format="HH:mm"
        v-model:formatted-value="timeFR[index]"
        value-format="HH:mm"
        :disabled="disabledMode"
        :is-hour-disabled="hour => isHourDisabled(hour, 'FR', index)"
        :is-minute-disabled="(minute, selectedHour) => isMinuteDisabled(minute, selectedHour, 'FR', index)"
        @confirm="onTimeValueChanged(timeFR)"
    />
  </n-space>
  <n-space v-show="isDayInSchedule('SA')">
    <n-text>
      {{ t('weekDays.SA') }}
    </n-text>
    <n-time-picker
        v-for="(time, index) in timeSA"
        format="HH:mm"
        v-model:formatted-value="timeSA[index]"
        value-format="HH:mm"
        :disabled="disabledMode"
        :is-hour-disabled="hour => isHourDisabled(hour, 'SA', index)"
        :is-minute-disabled="(minute, selectedHour) => isMinuteDisabled(minute, selectedHour, 'SA', index)"
        @confirm="onTimeValueChanged(timeSA)"
    />
  </n-space>
  <n-space v-show="isDayInSchedule('SU')">
    <n-text>
      {{ t('weekDays.SU') }}
    </n-text>
    <n-time-picker
        v-for="(time, index) in timeSU"
        format="HH:mm"
        v-model:formatted-value="timeSU[index]"
        value-format="HH:mm"
        :disabled="disabledMode"
        :is-hour-disabled="hour => isHourDisabled(hour, 'SU', index)"
        :is-minute-disabled="(minute, selectedHour) => isMinuteDisabled(minute, selectedHour, 'SU', index)"
        @confirm="onTimeValueChanged(timeSU)"
    />
  </n-space>
  <n-space justify="start">
    <n-button
        v-if="!disabledMode"
        type="primary"
        @click="onConfirmTimeChange"
    >
      {{ t("general.save") }}
    </n-button>
  </n-space>
</template>

<style>
.n-space {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>