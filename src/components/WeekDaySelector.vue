<template>
  <n-grid cols="7">
    <n-gi>
      <n-tag checkable v-model:checked="MO" :disabled="disabledMode">
        {{ weekDays[0].label }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="TU" :disabled="disabledMode">
        {{ weekDays[1].label }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="WE" :disabled="disabledMode">
        {{ weekDays[2].label }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="TH" :disabled="disabledMode">
        {{ weekDays[3].label }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="FR" :disabled="disabledMode">
        {{ weekDays[4].label }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="SA" :disabled="disabledMode">
        {{ weekDays[5].label }}
      </n-tag>
    </n-gi>
    <n-gi>
      <n-tag checkable v-model:checked="SU" :disabled="disabledMode">
        {{ weekDays[6].label }}
      </n-tag>
    </n-gi>
  </n-grid>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "WeekDaySelector",
  props: { 
    value: { type: Array, required: true },
    disabled: {type:Boolean, required: true}
   },
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: "global", inheritLocale: true });
    const disabledMode = computed(() => {
      if(props.disabled === true){
        return true
      } else
      return false
    })
    const weekDays = computed(() => [
      {
        label: t("weekDays.MO", 2),
        value: "MO",
      },
      {
        label: t("weekDays.TU", 2),
        value: "TU",
      },
      {
        label: t("weekDays.WE", 2),
        value: "WE",
      },
      {
        label: t("weekDays.TH", 2),
        value: "TH",
      },
      {
        label: t("weekDays.FR", 2),
        value: "FR",
      },
      {
        label: t("weekDays.SA", 2),
        value: "SA",
      },
      {
        label: t("weekDays.SU", 2),
        value: "SU",
      },
    ]);
    const days = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

    const MO = computed({
      get: () => props.value.includes("MO"),
      set: (value) => {
        var temp = props.value.slice(0);
        if (value) {
          temp.push("MO");
        } else {
          temp = temp.filter((v) => {
            return v !== "MO";
          });
        }
        emit("update:value", temp);
      },
    });

    const TU = computed({
      get: () => props.value.includes("TU"),
      set: (value) => {
        var temp = props.value.slice(0);
        if (value) {
          temp.push("TU");
        } else {
          temp = temp.filter((v) => {
            return v !== "TU";
          });
        }
        emit("update:value", temp);
      },
    });

    const WE = computed({
      get: () => props.value.includes("WE"),
      set: (value) => {
        var temp = props.value.slice(0);
        if (value) {
          temp.push("WE");
        } else {
          temp = temp.filter((v) => {
            return v !== "WE";
          });
        }
        emit("update:value", temp);
      },
    });

    const TH = computed({
      get: () => props.value.includes("TH"),
      set: (value) => {
        var temp = props.value.slice(0);
        if (value) {
          temp.push("TH");
        } else {
          temp = temp.filter((v) => {
            return v !== "TH";
          });
        }
        emit("update:value", temp);
      },
    });

    const FR = computed({
      get: () => props.value.includes("FR"),
      set: (value) => {
        var temp = props.value.slice(0);
        if (value) {
          temp.push("FR");
        } else {
          temp = temp.filter((v) => {
            return v !== "FR";
          });
        }
        emit("update:value", temp);
      },
    });

    const SA = computed({
      get: () => props.value.includes("SA"),
      set: (value) => {
        var temp = props.value.slice(0);
        if (value) {
          temp.push("SA");
        } else {
          temp = temp.filter((v) => {
            return v !== "SA";
          });
        }
        emit("update:value", temp);
      },
    });

    const SU = computed({
      get: () => props.value.includes("SU"),
      set: (value) => {
        var temp = props.value.slice(0);
        if (value) {
          temp.push("SU");
        } else {
          temp = temp.filter((v) => {
            return v !== "SU";
          });
        }
        emit("update:value", temp);
      },
    });

    return { disabledMode, weekDays, MO, TU, WE, TH, FR, SA, SU };
  },
});
</script>
