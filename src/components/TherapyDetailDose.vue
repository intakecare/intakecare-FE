<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Option } from "@/classes/therapy-dto";

/**
 * Component to manage the delivery options of a therapy.
 * TODO: CONTINUA DA QUI. Definisci emits e valida il nuovo orario.
 * @param schedule The delivery options of the therapy.
 * @param disabled Whether the component is disabled or not.
 */

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
const emits = defineEmits(["scheduleChanged"])
const { t } = useI18n({ useScope: "global", inheritLocale: true });
const days = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const showSpin = ref(false);
const disabled = ref(true);

const timeMO = ref([] as string[]);
const timeTU = ref([] as string[]);
const timeWE = ref([] as string[]);
const timeTH = ref([] as string[]);
const timeFR = ref([] as string[]);
const timeSA = ref([] as string[]);
const timeSU = ref([] as string[]);

const editableTherapies = computed(() => {
  /**
   * Function to transform the therapy delivery options to the editable format.
   * Returns an array of objects with the following structure:
   * {
   *   weekday: string, // The day of the week.
   *   times: string[], // The times of the day formatted as HH:mm.
   * }
   */

  const temp_result: {
    weekday: string,
    times: string[],
  }[] = [];
  for (const day of days) {
    for (const singleSchedule of props.schedule) {
      if (singleSchedule.cadence.includes(day)) {
        // If the day is in the schedule, add the time to the array of times.
        const index = temp_result.findIndex((e) => e.weekday === day);
        if (index !== -1) {
          temp_result[index].times.push(singleSchedule.time);
        } else {
          // Else create a new object with the day and the time.
          temp_result.push({
            weekday: day,
            times: [singleSchedule.time],
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


// const errorMessage = () => {
//   if ( props.data?.hiring_time === 'morning' && (parseInt(props.value.time) < 5 || parseInt(props.value.time) > 12)) { //props.schedule === 'daily' &&
//     emit('saveDisabledTrue')
//     return alert('Questa terapia è impostata per la Mattina, imposta un orario tra le 5:00 e le 11:59')
//   } else if (props.data?.hiring_time === 'morning' && (parseInt(props.value.time) >= 5 || parseInt(props.value.time) <= 12)) {
//     emit('saveDisabledFalse')
//     //console.log(time.value)
//     //console.log('props.time '+props.value.time)
//     props.data.delivery.options.map((e) => {
//       return {
//         time: e.time,
//         weekdays: typeof e.cadence === "number" ? ["MO"] : e.cadence,
//         cadence: typeof e.cadence === "number" ? e.cadence : 1,
//       };
//     });
//     /*console.log(`${time.value.getHours().toLocaleString("en-US", {
//     minimumIntegerDigits: 2,
//     useGrouping: false,
//   })}:${time.getMinutes().toLocaleString("en-US", {
//     minimumIntegerDigits: 2,
//     useGrouping: false,
//   })}`)*/
//   } else if (props.data?.hiring_time === 'afternoon' && (parseInt(props.value.time) < 12 || parseInt(props.value.time) > 18)) {
//     emit('saveDisabledTrue')
//     return alert('Questa terapia è impostata per il Pomeriggio, imposta un orario tra le 12:00 e le 17:59')
//   } else if (props.data?.hiring_time === 'afternoon' && (parseInt(props.value.time) >= 12 || parseInt(props.value.time) <= 18)) {
//     emit('saveDisabledFalse')
//     props.data.delivery.options.map((e) => {
//       return {
//         time: e.time,
//         weekdays: typeof e.cadence === "number" ? ["MO"] : e.cadence,
//         cadence: typeof e.cadence === "number" ? e.cadence : 1,
//       };
//     });
//   } else if (props.data?.hiring_time === 'evening' && (parseInt(props.value.time) < 18 || parseInt(props.value.time) > 23.59)) {
//     emit('saveDisabledTrue')
//     return alert('Questa terapia è impostata per la Sera, imposta un orario tra le 18:00 e le 23:59')
//   } else if (props.data?.hiring_time === 'evening' && (parseInt(props.value.time) >= 18 || parseInt(props.value.time) <= 23.59)) {
//     emit('saveDisabledFalse')
//     props.data.delivery.options.map((e) => {
//       return {
//         time: e.time,
//         weekdays: typeof e.cadence === "number" ? ["MO"] : e.cadence,
//         cadence: typeof e.cadence === "number" ? e.cadence : 1,
//       };
//     });
//   }
// }

const onTimeValueChanged = (dayArray) => {
  /**
   * Function called when the user confirms the change in the time picker.
   * @param dayArray The array of times for the day.
   */
  console.log('Updated time: ' + dayArray)
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