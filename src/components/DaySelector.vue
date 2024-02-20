<template>
    <n-space horizontal>
        <div horizontal>
            <n-tag checkable disabled="true">
                {{ weekDays[0].label }}
            </n-tag>
        </div>
        <n-space align="center">
            <n-text> {{ t("therapies.at") }}: </n-text>
            <n-time-picker format="HH:mm" v-model:value="timeM"/>
        </n-space>
        
    </n-space>
    <n-space>
        <div>
            <n-tag checkable disabled="true">
                {{ weekDays[1].label }}
            </n-tag>
        </div>
        <n-space align="center">
            <n-text> {{ t("therapies.at") }}: </n-text>
            <n-time-picker format="HH:mm"/>
        </n-space>    
    </n-space>
    <n-space>
        <div>
            <n-tag checkable disabled="true">
                {{ weekDays[2].label }}
            </n-tag>
        </div>
        <n-space align="center">
            <n-text> {{ t("therapies.at") }}: </n-text>
            <n-time-picker format="HH:mm"/>
        </n-space>
    </n-space>
    <n-space>
        <div>
            <n-tag checkable disabled="true">
                {{ weekDays[3].label }}
            </n-tag>
        </div>
        <n-space align="center">
            <n-text> {{ t("therapies.at") }}: </n-text>
            <n-time-picker format="HH:mm"/>
        </n-space>
    </n-space>
    <n-space>
        <div>
            <n-tag checkable disabled="true">
                {{ weekDays[4].label }}
            </n-tag>
        </div>
        <n-space align="center">
            <n-text> {{ t("therapies.at") }}: </n-text>
            <n-time-picker format="HH:mm"/>
        </n-space>
    </n-space>
    <n-space>
        <div>
            <n-tag checkable disabled="true">
                {{ weekDays[5].label }}
            </n-tag>
        </div>
        <n-space align="center">
            <n-text> {{ t("therapies.at") }}: </n-text>
            <n-time-picker format="HH:mm"/>
        </n-space>
    </n-space>
    <n-space>
        <div>
            <n-tag checkable disabled="true">
                {{ weekDays[6].label }}
            </n-tag>
        </div>
        <n-space align="center">
            <n-text> {{ t("therapies.at") }}: </n-text>
            <n-time-picker format="HH:mm"/>
        </n-space>
    </n-space>
  </template>

  <style scoped>
  .n-tag {
    align-content: center;
    height: 28px;
    width: 28px;
  }
  .n-time-picker {
    padding-left: 10px;
  }
  </style>
  
  <script lang="ts">
  import { defineComponent, computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  
  export default defineComponent({
    name: "DaySelector",
    props: { 
        value: { type: String, required: true},
        time: {type: Number, required: true},
        disabled: {type: Boolean, required: true}
     },
    emits: ['update:value'],
    setup(props, { emit }) {
      const { t } = useI18n({ useScope: "global", inheritLocale: true });

      const del = computed(() => {
        return props.value
      })

      const timeM = computed({
        get: () => {
          //console.log(props.value)
          const time = new Date(Date.now());
          // time.setHours(Number(props.value.split(":")[0]));
          // time.setMinutes(Number(props.value.split(":")[1]));
          return time.getTime();
        },
        set: (value) => {
          //console.log(value)
          const time = value ? new Date(value) : new Date(Date.now());
          const timeUp = `${time.getHours().toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}:${time.getMinutes().toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}`;
          //del.value.options[0] = opt;
          //props.value = 
        console.log('post set '+timeUp)
        emit("update:value", timeUp);
        //emit("saveDisabledFalse")
        },
      });

      const disabledMode = computed(() => {
        if (props.disabled === true) {
            return true
        } else {
            return false
        }
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

      return { t, //timeMOM, display,
        timeM, //timeTU, //timeWE, timeTH, timeFR, timeSA, timeSU, 
        disabledMode,  weekDays,};// MO, TU, WE, TH, FR, SA, SU};
    },
    
  });
  </script>
  