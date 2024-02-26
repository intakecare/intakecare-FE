<script setup lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useI18n } from "vue-i18n";

/**
 * @component WeekDaySelector
 * @description Component to select the days of the week
 *
 * @param {Array} value - Array of strings with the selected days
 * @param {Boolean} disabled - Boolean to disable the component
 *
 * @emits {Array} update:value - Emits the updated array of strings with the selected days
 *
 * @example
 * <week-day-selector v-model:value="['MO', 'TU']" :disabled="false" />
 */

// Props and emits
const props = defineProps({
  value: { type: Array, required: true },
  disabled: {type:Boolean, required: true}
})
const emits = defineEmits(["update:value"]);

// i18n initialization
const { t } = useI18n({ useScope: "global", inheritLocale: true });

// Computed variables
const disabledMode = computed(() => {
  return props.disabled;
})

const MO = computed({
  get: () => props.value.includes("MO"),
  set: (value) => {
    if (value) {
      props.value.push("MO");
    } else {
      removeDayFromList("MO");
    }
  },
});

const TU = computed({
  get: () => props.value.includes("TU"),
  set: (value) => {
    if (value) {
      props.value.push("TU");
    } else {
      removeDayFromList("TU");
    }
  },
});

const WE = computed({
  get: () => props.value.includes("WE"),
  set: (value) => {
    if (value) {
      props.value.push("WE");
    } else {
      removeDayFromList("WE");
    }
  },
});

const TH = computed({
  get: () => props.value.includes("TH"),
  set: (value) => {
    if (value) {
      props.value.push("TH");
    } else {
      removeDayFromList("TH");
    }
  },
});

const FR = computed({
  get: () => props.value.includes("FR"),
  set: (value) => {
    if (value) {
      props.value.push("FR");
    } else {
      removeDayFromList("FR");
    }
  },
});

const SA = computed({
  get: () => props.value.includes("SA"),
  set: (value) => {
    if (value) {
      props.value.push("SA");
    } else {
      removeDayFromList("SA");
    }
  },
});

const SU = computed({
  get: () => props.value.includes("SU"),
  set: (value) => {
    if (value) {
      props.value.push("SU");
    } else {
      removeDayFromList("SU");
    }
  },
});

const removeDayFromList = (day) => {
  const index = props.value.indexOf(day);
  if (index > -1) {
    props.value.splice(index, 1);
  }
}
</script>

<template>
  <n-grid cols="7">
    <n-gi>
      <n-tag checkable v-model:checked="MO" :disabled="disabledMode">
        {{ t('weekDays.MO', 2) }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="TU" :disabled="disabledMode">
        {{ t('weekDays.TU', 2) }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="WE" :disabled="disabledMode">
        {{ t('weekDays.WE', 2) }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="TH" :disabled="disabledMode">
        {{ t('weekDays.TH', 2) }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="FR" :disabled="disabledMode">
        {{ t('weekDays.FR', 2) }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="SA" :disabled="disabledMode">
        {{ t('weekDays.SA', 2) }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="SU" :disabled="disabledMode">
        {{ t('weekDays.SU', 2) }}
      </n-tag>
    </n-gi>
  </n-grid>
</template>


