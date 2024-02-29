<script setup lang="ts">
import {computed, ref, onMounted, onBeforeMount, PropType} from "vue";
import { useI18n } from "vue-i18n";
import {
  Pencil as PencilIcon,
  Close as CloseIcon } from "@vicons/ionicons5";
import {Option, Therapy} from "@/classes/therapy-dto";
import {useRouter} from "vue-router";
import * as api from "@/api";
import ResponsiveView from "@/components/ResponsiveView.vue";
import TherapyDetailDose from "@/components/TherapyDetailDose.vue";

/**
 * This view is used to display details of a therapy of a user.
 * TODO: Continua da qui sistemando DaySelector e controllando come funziona il passaggio di parametri al backend.
 */

// Router, i18n and store initialization
const { t } = useI18n({ useScope: "global", inheritLocale: true });
const router = useRouter();

// Reactive variables
const editMode = ref(false);
const data = ref({} as Therapy);
const showSpin = ref(false);
const value = ref("monday");
const schedule = ref({
      "cadence": ["MO", "FR"],
      "max_delay": 30,
      "time": "12:10"
    });
const effectiveSchedule = ref([] as Option[]);
const trueRef = ref(true); //This is for debugging purpose ONLY
// Computed variables
const posology = computed(() => {
  let mealsSection = ""
  // Check if the therapy has a relation to meals
  if (data.value.meals){
    // If yes, find the translated object related to the before/during/after meals
    mealsSection = t("therapies.mealTiming." + data.value.meals) + " " + t("therapies.meals");
  }
  return data.value.posology + " " + mealsSection;
});

// Functions
onMounted(async() => {
  await getData();
});

const undoEdits = () => {
  /**
   * This function is used to undo the edits made to the therapy.
   */
  editMode.value = false;
};

const getData = async () => {
  if (getId()) {
    showSpin.value = true;
    await api.therapies
        .get(getId() as string)
        .then((value) => {
          data.value._id = value.data._id;
          data.value.drug = value.data.drug;
          data.value.adherence = value.data.adherence;
          data.value.hiring_time = value.data.hiring_time;
          data.value.validation_alexa = value.data.validation_alexa;
          data.value.validation_phone = value.data.validation_phone;
          data.value.validation_web = value.data.validation_web;
          data.value.edit = value.data.edit;
          data.value.posology = value.data.posology;
          data.value.meals = value.data.meals;
          data.value.start_date = value.data.start_date;
          data.value.end_date = value.data.end_date;
          data.value.duration = value.data.duration;
          data.value.delivery = value.data.delivery;
          data.value.patient_id = value.data.patient_id;
          showSpin.value = false;
          effectiveSchedule.value = data.value.delivery.options
          console.log(data.value)
          console.log(effectiveSchedule.value)
        })
        .catch(() => {
          showSpin.value = false;
        });
  }
};

const getId = () => {
  return router.currentRoute.value.query.id;
}

const dateFormatter = (date: any) => {
  /**
   * This function is used to format the date of start and end therapy.
   */
  return new Date(date).toLocaleDateString(
      t('code'),
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
  );
}

const onScheduleChanged = async (value: Option[]) => {
  /**
   * This function is used to update the schedule of the therapy.
   */
  // Create an object with the updated schedule
  const therapyToUpdate: Partial<Therapy> = {
    delivery: {
      scheduling_type: "weekly", // The scheduling type is cast to weekly due to how the options are defined.
      options: value
    }
  };
  // Call the api to update the therapy
  if (data.value._id) {
    await api.therapies
      .update(data.value._id, therapyToUpdate)
      .then((value) => {
        console.log("Data updated!")
        console.log(value.data)
      })
      .catch((error) => {
        console.log(error)
      });
  }
}
</script>

<template>
  <n-card class="content-wide">
    <!-- Top bar with therapy name -->
    <n-space justify="space-between">
      <n-h1><n-text type="primary">{{data.drug}}</n-text></n-h1>
    </n-space>
    <!-- Therapy details -->
    <n-divider>{{ t("therapies.detail") }}</n-divider>
    <n-scrollbar>
      <n-descriptions label-placement="left" :model="data" :columns="2">
        <n-descriptions-item
            :label="t('general.start')"
            :span="1">
          <n-tag round>{{dateFormatter(data.start_date)}}</n-tag>
        </n-descriptions-item>
        <n-descriptions-item
            v-if="data.end_date"
            :label="t('general.end')"
            :content="dateFormatter(data.end_date)"
            :span="1">
          <n-tag round>{{dateFormatter(data.end_date)}}</n-tag>
        </n-descriptions-item>
        <n-descriptions-item
            :label="t('therapies.posology')"
            :span="2">
          <n-tag round>{{posology}}</n-tag>
        </n-descriptions-item>
      </n-descriptions>
      <n-divider>{{ t("therapies.delivery") }}</n-divider>
      <!-- Therapy delivery -->
      <n-button
          v-if="!editMode"
          secondary
          type="primary"
          @click="editMode = true">
        <template #icon>
          <n-icon>
            <pencil-icon />
          </n-icon>
        </template>
        <responsive-view> <!-- For medium and large screens shows also the writing in the button -->
          <template v-slot:m+>{{ t("general.edit") }}</template>
        </responsive-view>
      </n-button>
      <n-button
          v-else
          secondary
          type="primary"
          @click="undoEdits">
        <template #icon>
          <n-icon>
            <close-icon />
          </n-icon>
        </template>
        <responsive-view> <!-- For medium and large screens shows also the writing in the button -->
          <template v-slot:m+>{{ t("general.undo") }}</template>
        </responsive-view>
      </n-button>
      <therapy-detail-dose
          v-model:schedule="effectiveSchedule"
          :disabled="!editMode"
          @schedule-changed="onScheduleChanged"
      />
    </n-scrollbar>
  </n-card>
</template>
<style>
</style>