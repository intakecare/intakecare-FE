<template>
  <n-spin :show="showSpin">
    <n-grid :x-gap="10" :y-gap="10" cols="1 1000:2" item-responsive>
      <n-gi>
        <n-scrollbar :style="computedStyle">
          <n-card :title="t('doses.doses')">
            <delivery-options 
            :deliveries="intakes" @changed="intakesChange" />
          </n-card>
        </n-scrollbar>
      </n-gi>
      <n-gi>
        <n-space vertical>
          <n-scrollbar :style="computedStyle">
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

                <n-gi>
                  <n-space align="center">
                    <n-text>{{ t("therapies.hiringTime") }}</n-text>
                    <n-radio-group
                      v-model:value="hiringTime"
                      name="radiobuttongroup2"
                    >
                      <n-radio-button
                        v-for="hiringTimeOption in hiringTimeOptions"
                        :key="hiringTimeOption.value"
                        :value="hiringTimeOption.value"
                      >
                        {{ hiringTimeOption.label }}
                      </n-radio-button>
                    </n-radio-group>
                  </n-space>
                </n-gi>
              </n-grid>
            </n-card>
          </n-scrollbar>
        </n-space>
      </n-gi>
    </n-grid>
    <n-space align="center" justify="end">
      <n-switch v-model:value="state" size="large">
        <template #checked>{{ t("therapies.active") }}</template>
        <template #unchecked>{{ t("therapies.suspended") }}</template>
      </n-switch>
      <n-button type="primary" @click="saveTherapy" :disabled="disableSave">
        <template #icon>
          <n-icon>
            <save-icon />
          </n-icon>
        </template>
        {{ t("general.save") }}
      </n-button></n-space
    >
  </n-spin>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, onMounted } from "vue";
import DeliveryOptions from "@/components/DeliveryOptions.vue";
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
export default defineComponent({
  name: "TherapyForm",
  components: { DeliveryOptions, AddIcon, CloseIcon, SaveIcon },
  emits: ["changed"],
  props: {
    therapy: { type: Object as PropType<Therapy> },
    patient_id: { type: String, required: true },
  },
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: "global", inheritLocale: true });
    const { width, height } = useWindowResize();
    const showSpin = ref(false);
    const showAddDrug = ref(false);
    const substance = Object.keys(Drugs).map((e) => {
      return { label: e, value: e };
    });
    const selectedSubstance = ref(null);
    const selectedDrug = ref(null as string | null);
    const drug = computed(() => {
      var tmp: { label: string; value: string }[] = [];
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
    const drugValue = ref(null as string | null);
    const handleUpdateValue = () => {
      drugValue.value = selectedDrug.value;
    };
    const posology = ref(null as string | null);
    const delay = ref(30);
    const timeEnd = ref("range");
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
        label: t("therapies.before"),
      },
      {
        value: "during",
        label: t("therapies.during"),
      },
      {
        value: "after",
        label: t("therapies.after"),
      },
      {
        value: "no",
        label: "X",
      },
    ]);
    const meals = ref("before");

    const hiringTimeOptions = computed(() => [
      {
        value: "morning",
        label: t("therapies.morning"),
      },
      {
        value: "afternoon",
        label: t("therapies.afternoon"),
      },
      {
        value: "evening",
        label: t("therapies.evening"),
      },
      {
        value: "no",
        label: "X",
      },
    ]);
    const hiringTime = ref("no");

    const h = computed(() => {
      if ( hiringTime.value === "morning" ) {
            return "10:00"
        } else if ( hiringTime.value === "afternoon" ) {
          return "13:00"
        } else {
          return "20:00"
        }
    })

    const disableSave = computed(() => {
      if (!drugValue.value) return true;
      if (!posology.value) return true;
      if (!delay.value) return true;
      if (
        !props.therapy &&
        dateRange.value.length &&
        dateRange.value[0] < Date.now() - 24 * 60 * 60 * 1000
      )
        return true;
      if (timeEnd.value === "range" && !dateRange.value[1]) return true;
      if (timeEnd.value === "range" && dateRange.value[1] < dateRange.value[0])
        return true;
      if (timeEnd.value === "intakes" && !intakeNumber.value) return true;
      if (!intakesOutput.value) return true;

      return false;
    });
    const intakes = ref(
      null as null | {
        scheduling_type: string;
        options: {
          time: string;
          max_delay: number;
          cadence: number | string[];
        }[];
      }
    );
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
    const intakesChange = (data: {
      scheduling_type: string;
      options: {
        weekdays: string[];
        time: string;
        cadence: number;
      }[];
    }) => {
      intakesOutput.value = {
        scheduling_type: data.scheduling_type,
        options: data.options.map((e) => {

          if ( hiringTime.value === "morning" ) {
            e.time = "10:00"
          } else if ( hiringTime.value === "afternoon" ) {
            e.time = "13:00"
          } else if ( hiringTime.value === "evening" ){
            e.time = "20:00"
          } 

          if (
            data.scheduling_type === "daily" ||
            data.scheduling_type === "once"
          )
            return { cadence: 1, max_delay: delay.value, time: e.time};//e.time
          else if (data.scheduling_type === "weekly")
            return {
              cadence: e.weekdays,
              max_delay: delay.value,
              time: e.time,
            };
          else
            return { cadence: e.cadence, max_delay: delay.value, time: e.time };
        }),
      };
    };
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
        hiring_time: hiringTime.value as "morning" | "afternoon" | "evening",
        //validation: validation.value as "alexa" | "phone" | "web",//"photo" | "band",
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
            emit("changed");
          })
          .catch(() => {
            showSpin.value = false;
          });
      } else {
        api.therapies
          .save(therapyToSave)
          .then(() => {
            showSpin.value = false;
            emit("changed");
          })
          .catch(() => {
            showSpin.value = false;
          });
      }
    };

    onMounted(() => {
      if (props.therapy) {
        drugValue.value = props.therapy.drug;
        intakes.value = props.therapy.delivery;
        intakeNumber.value = props.therapy.duration
          ? props.therapy.duration
          : 1;
        //validation.value = props.therapy.validation;
        state.value = props.therapy.state;
        posology.value = props.therapy.posology;
        meals.value = props.therapy.meals ? props.therapy.meals : "no ";
        hiringTime.value = props.therapy.hiring_time ? props.therapy.hiring_time : "morning";
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
    const computedStyle = computed(() => {
      return `max-height: ${height.value - 170}px`;
    });
    return {
      t,
      h,
      days: ref(["MO", "FR"]),
      substance,
      selectedSubstance,
      selectedDrug,
      drug,
      state,
      drugValue,
      handleUpdateValue,
      showAddDrug,
      timeEnd,
      intakesOutput,
      posology,
      disablePreviousDate,
      endOptions,
      dateRange,
      intakeNumber,
      //validationOptions,
      //validation,
      mealsOptions,
      meals,
      hiringTimeOptions,
      hiringTime,
      disableSave,
      intakesChange,
      intakes,
      delay,
      delayChange,
      saveTherapy,
      showSpin,
      computedStyle,
      width,
    };
  },
});
</script>
