<script setup lang="ts">
import { IntakeDTO } from "@/classes/intake-dto";
import {
  onMounted,
  ref,
  computed,
  watch,
} from "vue";
import IntakeDot from "@/components/IntakeDot.vue";
import { useI18n } from "vue-i18n";
import { changeColor } from "seemly";
import { useThemeVars } from "naive-ui";
import AdherenceConfig from "@/assets/adherence-config.json";
import ResponsiveView from "@/components/ResponsiveView.vue";
import * as api from "@/api";

// Define variables
const { t } = useI18n({ useScope: "global", inheritLocale: true });
const showSpin = ref(false);
const dateRange = ref([
  new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
  new Date().getTime() + 24 * 60 * 60 * 1000,
]);

// Define props
const props = defineProps({
  therapyId: { type: String },
  therapyDrug: { type: String },
  patientId: { type: String, required: true },
});

// Define intakes
const intakes = ref([] as IntakeDTO[]);
const getData = () => {
  if (dateRange.value[0] && dateRange.value[1]) {
    showSpin.value = true;
    api.intakes
        .getIntakes(
            new Date(
                dateRange.value[0] - new Date().getTimezoneOffset() * 60 * 1000
            ),
            new Date(
                dateRange.value[1] - new Date().getTimezoneOffset() * 60 * 1000
            ),
            props.therapyId,
            props.therapyId ? undefined : props.patientId
        )
        .then((value) => {
          intakes.value = (value.data as any[] as IntakeDTO[]).sort(
              (a, b) => {
                return (
                    new Date(a.programmed_date).getTime() -
                    new Date(b.programmed_date).getTime()
                );
              }
          );
          showSpin.value = false;
        })
        .catch(() => {
          showSpin.value = false;
        });
  }
};

const adherence = computed(() => {
  if (intakes.value.length) {
    const tot = intakes.value.filter(
        (e) => e.status === "missed" || e.status === "taken"
    ).length;
    if (tot > 0)
      return Number(
          (
              (intakes.value.filter((e) => e.status === "taken").length / tot) *
              100
          ).toFixed(2)
      );
    else return null;
  } else return null;
});

const shiftDates = (daysShift: number) => {
  dateRange.value = [
    dateRange.value[0] + daysShift * 24 * 60 * 60 * 1000,
    dateRange.value[1] + daysShift * 24 * 60 * 60 * 1000,
  ];
};

const getLastXDays = (daysShift: number) => {
  dateRange.value = [
    new Date().getTime() - daysShift * 24 * 60 * 60 * 1000,
    new Date().getTime() + 60 * 60 * 1000,
  ];
};

const color = computed(() => {
  if (adherence.value !== null && adherence.value > AdherenceConfig.warning)
    return {
      color: useThemeVars().value.primaryColor,
      railColor: changeColor(useThemeVars().value.primaryColor, {
        alpha: 0.2,
      }),
    };
  else if (
      adherence.value !== null &&
      adherence.value <= AdherenceConfig.warning &&
      adherence.value > AdherenceConfig.danger
  )
    return {
      color: useThemeVars().value.warningColor,
      railColor: changeColor(useThemeVars().value.warningColor, {
        alpha: 0.2,
      }),
    };
  else if (
      adherence.value !== null &&
      adherence.value <= AdherenceConfig.danger
  )
    return {
      color: useThemeVars().value.errorColor,
      railColor: changeColor(useThemeVars().value.errorColor, {
        alpha: 0.2,
      }),
    };
  else return null;
});

const dotStyleT = computed(() => {
  return `height: 15px; width: 15px; margin-left: 5px; background-color: ${
      useThemeVars().value.primaryColor
  }; border-radius: 50%; display: inline-block;`;
});

const dotStyleM = computed(() => {
  return `height: 15px; width: 15px; margin-left: 5px; background-color: ${
      useThemeVars().value.errorColor
  }; border-radius: 50%; display: inline-block;`;
});

const dotStyleP = computed(() => {
  return `height: 15px; width: 15px; margin-left: 5px; background-color: #CCCCCC; border-radius: 50%; display: inline-block;`;
});

onMounted(() => {
  getData();
});

watch(
    [() => props.therapyId, dateRange],
    () => {
      getData();
    },
    { deep: true }
);
</script>

<template>
  <n-card>
    <n-spin :show="showSpin">
      <n-h1
        ><n-text v-if="therapyDrug" type="primary"> {{ therapyDrug }}</n-text>
        <n-text v-else type="primary">
          {{ t("patientDetail.allTherapies") }}</n-text
        ></n-h1
      >
      <n-space vertical>
        <responsive-view>
          <template v-slot:m+>
            <n-space justify="center">
              <n-input-group>
                <n-button @click="shiftDates(-28)">&lt; &lt;</n-button>
                <n-button @click="shiftDates(-7)">&lt;</n-button>
                <n-date-picker
                  v-model:value="dateRange"
                  type="daterange"
                  clearable
                />

                <n-button @click="shiftDates(+7)">&gt;</n-button>
                <n-button @click="shiftDates(+28)">&gt; &gt;</n-button>
              </n-input-group>
            </n-space>
          </template>

          <template v-slot:small>
            <n-space justify="center">
              <n-date-picker
                v-model:value="dateRange"
                type="daterange"
                clearable
              />
            </n-space>
            <n-space justify="center">
              <n-button-group>
                <n-button circle @click="shiftDates(-28)">&lt; &lt;</n-button>
                <n-button circle @click="shiftDates(-7)">&lt;</n-button>

                <n-button circle @click="shiftDates(+7)">&gt;</n-button>
                <n-button circle @click="shiftDates(+28)">&gt; &gt;</n-button>
              </n-button-group>
            </n-space>
          </template>
        </responsive-view>
        <n-space justify="center">
          <n-button @click="getLastXDays(7)">{{
            t("therapies.lastWeek")
          }}</n-button>
          <n-button @click="getLastXDays(28)">{{
            t("therapies.lastMonth")
          }}</n-button>
        </n-space>
        <n-grid
          style="margin-top: 10px"
          :x-gap="10"
          :y-gap="10"
          cols="5 400:10 500:15 750:20 1000:25"
        >
          <n-gi
            style="text-align: center"
            v-for="i in intakes"
            v-bind:key="i._id"
          >
            <intake-dot :intake="i" />
          </n-gi>
        </n-grid>
      </n-space>

      <n-divider> {{ t("patients.adherence") }} </n-divider>
      <responsive-view>
        <template v-slot:m+>
          <n-space justify="space-between" align="center">
            <n-space justify="center">
              <n-progress
                v-if="adherence !== null"
                style="width: 120px; margin: 0 8px 12px 0"
                :stroke-width="10"
                type="circle"
                :percentage="adherence"
                :indicator-placement="'inside'"
                :color="color.color"
                :rail-color="color.railColor"
                :indicator-text-color="color.color"
            /></n-space>

            <n-card v-if="adherence !== null" :bordered="false">
              <div style="text-align: center">
                <n-h2
                  ><n-text
                    >{{ t("patientDetail.missedIntakes") }}
                  </n-text></n-h2
                >
                <n-h1
                  ><n-text :style="`color:${color.color};`"
                    >{{
                      intakes.filter((e) => e.status === "missed").length
                    }}/{{
                      intakes.filter(
                        (e) => e.status === "missed" || e.status === "taken"
                      ).length
                    }}</n-text
                  ></n-h1
                >
              </div>
            </n-card>
            <n-space vertical align="center">
              <n-grid cols="6" :x-gap="10" :y-gap="10">
                <n-gi span="5">
                  <n-text>{{ t("intakes.taken") }}:</n-text> </n-gi
                ><n-gi><span :style="dotStyleT" /> </n-gi>
                <n-gi span="5"
                  ><n-text>{{ t("intakes.missed") }}:</n-text> </n-gi
                ><n-gi><span :style="dotStyleM" /> </n-gi>
                <n-gi span="5"
                  ><n-text>{{ t("intakes.programmed") }}:</n-text> </n-gi
                ><n-gi><span :style="dotStyleP" /></n-gi>
              </n-grid>
            </n-space>
          </n-space>
        </template>
        <template v-slot:small>
          <n-space vertical justify="center">
            <n-space justify="center">
              <n-progress
                v-if="adherence !== null"
                style="width: 120px; margin: 0 8px 12px 0"
                :stroke-width="10"
                type="circle"
                :percentage="adherence"
                :indicator-placement="'inside'"
                :color="color.color"
                :rail-color="color.railColor"
                :indicator-text-color="color.color"
            /></n-space>

            <n-card v-if="adherence !== null" :bordered="false">
              <div style="text-align: center">
                <n-h2
                  ><n-text>
                    {{ t("patientDetail.missedIntakes") }}</n-text
                  ></n-h2
                >
                <n-h1
                  ><n-text :style="`color:${color.color};`"
                    >{{
                      intakes.filter((e) => e.status === "missed").length
                    }}/{{
                      intakes.filter(
                        (e) => e.status === "missed" || e.status === "taken"
                      ).length
                    }}</n-text
                  ></n-h1
                >
              </div>
            </n-card>
            <n-space vertical align="center">
              <n-grid cols="6" :x-gap="10" :y-gap="10">
                <n-gi span="5">
                  <n-text>{{ t("intakes.taken") }}:</n-text> </n-gi
                ><n-gi><span :style="dotStyleT" /> </n-gi>
                <n-gi span="5"
                  ><n-text>{{ t("intakes.missed") }}:</n-text> </n-gi
                ><n-gi><span :style="dotStyleM" /> </n-gi>
                <n-gi span="5"
                  ><n-text>{{ t("intakes.programmed") }}:</n-text> </n-gi
                ><n-gi><span :style="dotStyleP" /></n-gi>
              </n-grid>
            </n-space>
          </n-space>
        </template>
      </responsive-view>
    </n-spin>
  </n-card>
</template>

