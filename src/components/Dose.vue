<template>
  <n-card embedded :bordered="false" style="background-color: #e4efef">
    <n-space justify="space-between" align="center">
      <span v-if="schedule === 'interval'">
        <n-space align="center">
          <n-text> {{ t("doses.every") }}: </n-text>
          <n-input-number
            style="max-width: 100px"
            v-model:value="cadence"
            :min="2"
          />
          <n-text>
            {{ t("general.day", cadence) }}
          </n-text>
        </n-space>
      </span>

      <span v-else-if="schedule === 'weekly'">
        <week-day-selector 
        v-model:value="weekDay"
        :disabled="false" />
      </span>

      <span>
        <n-space align="center">
          <n-text> {{ t("therapies.at") }}: </n-text>
          <n-time-picker format="HH:mm" v-model:value="time" />
        </n-space>
      </span>
    </n-space>
  </n-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import { useI18n } from "vue-i18n";
import WeekDaySelector from "@/components/WeekDaySelector.vue";
import { OptionExt } from "@/classes/therapy-dto";

export default defineComponent({
  name: "Dose",
  components: { WeekDaySelector },
  props: {
    schedule: { type: String, required: true },
    value: { type: Object as PropType<OptionExt>, required: true },
  },
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: "global", inheritLocale: true });
    
    const cadence = computed({
      get: () => props.value.cadence,
      set: (value) => {
        const temp: OptionExt = {
          cadence: value > 1 ? value : 2,
          weekdays: props.value.weekdays,
          time: props.value.time,
        };
        emit("update:value", temp);
      },
    });
    const time = computed({
      get: () => {
        if (props.value.time) {
          const time = new Date(Date.now());
          time.setHours(Number(props.value.time.split(":")[0]));
          time.setMinutes(Number(props.value.time.split(":")[1]));
          return time.getTime();
        } else return Date.now();
      },
      set: (value) => {
        const time = value ? new Date(value) : new Date(Date.now());
        const temp: OptionExt = {
          cadence: props.value.cadence,
          weekdays: props.value.weekdays,
          time: `${time.getHours().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}:${time.getMinutes().toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })}`,
        };
        emit("update:value", temp);
      },
    });
    const weekDay = computed({
      get: () => {
        return props.value.weekdays;
      },
      set: (value) => {
        const temp: OptionExt = {
          cadence: props.value.cadence,
          weekdays: value.length > 0 ? value : ["MO"],
          time: props.value.time,
        };
        emit("update:value", temp);
      },
    });

    return { t, time, cadence, weekDay };
  },
});
</script>
