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
    type: Object as PropType<Option>,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
})
const emits = defineEmits(["saveDisabledTrue", "saveDisabledFalse", "update:value"])
const { t } = useI18n({ useScope: "global", inheritLocale: true });

const showSpin = ref(false);
const disabled = ref(true);

// const dailyToWeekly = () => {
//   del.scheduling_type = "weekly";
//   del.options = [
//     /*{
//       cadence: 0,
//       max_delay: props.data.delivery.options[0].max_delay,
//       time: props.data.delivery.options[0].time
//     }*/
//   ];
//   for(let i=0; i < 7; i++){
//     del.options.push({
//       cadence: i,
//       max_delay: props.schedule[0].max_delay,
//       time: props.schedule[0].time
//     })
//     tm.push(props.schedule[0].time);
//   }
//   console.log(tm[0])
// }

const disabledMode = computed(() => {
  return props.disabled === true;
})

//
// const time = computed({
//   get: () => {
//     if (props.schedule.time) {
//       const time = new Date(Date.now());
//       time.setHours(Number(props.schedule.time.split(":")[0]));
//       time.setMinutes(Number(props.schedule.time.split(":")[1]));
//       console.log(time.getTime())
//       return time.getTime();
//     } else return Date.now();
//   },
//   set: (value) => {
//     const time = value ? new Date(value) : new Date(Date.now());
//     const temp: Option = {
//       cadence: props.schedule.cadence,
//       max_delay: props.schedule.max_delay,
//       time: `${time.getHours().toLocaleString("en-US", {
//         minimumIntegerDigits: 2,
//         useGrouping: false,
//       })}:${time.getMinutes().toLocaleString("en-US", {
//         minimumIntegerDigits: 2,
//         useGrouping: false,
//       })}`,
//     };
//     console.log('Updated time: ' + temp.time)
//     emits("update:value", temp);
//     //emit("saveDisabledFalse")
//   },
// });
// const weekDay = computed({
//   get: () => {
//     return props.schedule.cadence;
//   },
//   set: (value) => {
//     const temp: Option = {
//       cadence: props.schedule.cadence,
//       max_delay: props.schedule.max_delay,
//       time: props.schedule.time,
//     };
//     emits("update:value", temp);
//   },
// });

const isDayInSchedule = (day: string) => {
  return props.schedule.cadence.includes(day);
}

const onTimeValueChanged = (value: number) => {
  /**
   * Function called when the user confirms the change in the time picker.
   * @param value The new time formatted HH:mm.
   */
  const time = value ? new Date(value) : new Date(Date.now());
  const temp: Option = {
    cadence: props.schedule.cadence,
    max_delay: props.schedule.max_delay,
    time: `${time.getHours().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })}:${time.getMinutes().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })}`,
  };
  console.log('Updated time: ' + temp.time)
  // emits("update:value", temp);
  //emit("saveDisabledFalse")
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
</script>

<template>
  <n-card embedded :bordered="false" style="background-color: #e4efef">
    <n-space justify="space-between" align="center">
      <!-- Weekday Selector -->
      <n-grid cols="7">
        <n-gi>
          <n-tag checkable :checked="isDayInSchedule('MO')" :disabled="disabled">
            {{ t('weekDays.MO', 2) }}
          </n-tag>
        </n-gi>
        <n-gi>
          <n-tag checkable :checked="isDayInSchedule('TU')" :disabled="disabled">
            {{ t('weekDays.TU', 2) }}
          </n-tag>
        </n-gi>
        <n-gi>
          <n-tag checkable :checked="isDayInSchedule('WE')" :disabled="disabled">
            {{ t('weekDays.WE', 2) }}
          </n-tag>
        </n-gi>
        <n-gi>
          <n-tag checkable :checked="isDayInSchedule('TH')" :disabled="disabled">
            {{ t('weekDays.TH', 2) }}
          </n-tag>
        </n-gi>
        <n-gi>
          <n-tag checkable :checked="isDayInSchedule('FR')" :disabled="disabled">
            {{ t('weekDays.FR', 2) }}
          </n-tag>
        </n-gi>
        <n-gi>
          <n-tag checkable :checked="isDayInSchedule('SA')" :disabled="disabled">
            {{ t('weekDays.SA', 2) }}
          </n-tag>
        </n-gi>
        <n-gi>
          <n-tag checkable :checked="isDayInSchedule('SU')" :disabled="disabled">
            {{ t('weekDays.SU', 2) }}
          </n-tag>
        </n-gi>
      </n-grid>
      <!-- Time Picker -->
      <n-space align="center">
        <n-text> {{ t("therapies.at") }}: </n-text>
        <n-time-picker
            format="HH:mm"
            :default-formatted-value="props.schedule.time"
            :disabled="!disabledMode"
            @confirm="onTimeValueChanged"
        />
      </n-space>
    </n-space>
  </n-card>
</template>
