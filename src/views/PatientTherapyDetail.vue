<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { Pencil as PencilIcon, Close as CloseIcon } from "@vicons/ionicons5";
import * as api from "@/api";
import ResponsiveView from "@/components/ResponsiveView.vue";
import TherapyDetailDose from "@/components/TherapyDetailDose.vue";
import { Option, Therapy } from "@/classes/therapy-dto";

const { t } = useI18n({ useScope: "global", inheritLocale: true });
const router = useRouter();

const therapyName = ref("");
const editMode = ref(false);
const data = ref({} as Therapy);
const effectiveSchedule = ref([] as Option[]);

const posology = computed(() => {
  let mealsSection = "";
  if (data.value.meals) {
    mealsSection = t("therapies.mealTiming." + data.value.meals) + " " + t("therapies.meals");
  }
  return data.value.posology + " " + mealsSection;
});

const dateFormatter = (date: any) => {
  return new Date(date).toLocaleDateString(t('code'), { year: 'numeric', month: 'long', day: 'numeric' });
};

type Row = {
  key: string | null;
  therapy: string;
  validation: boolean;
  adherence: number;
};

const open = (row:Row) => {
  router.push({ name: 'PatientDiary', query: { id: row.key } });
};

const undoEdits = () => {
  editMode.value = false;
};

const getData = async () => {
  if (getId()) {
    // Assuming `getId()` is a function to get therapy id
    try {
      const response = await api.therapies.get(getId() as string);
      const fetchedData = response.data;
      data.value = {
        _id: fetchedData._id,
        drug: fetchedData.drug,
        adherence: fetchedData.adherence,
        hiring_time: fetchedData.hiring_time,
        validation_alexa: fetchedData.validation_alexa,
        validation_phone: fetchedData.validation_phone,
        validation_web: fetchedData.validation_web,
        edit: fetchedData.edit,
        posology: fetchedData.posology,
        meals: fetchedData.meals,
        start_date: fetchedData.start_date,
        end_date: fetchedData.end_date,
        duration: fetchedData.duration,
        delivery: fetchedData.delivery,
        patient_id: fetchedData.patient_id
      };
      effectiveSchedule.value = data.value.delivery.options;

      // Assign drug name to therapyName
      therapyName.value = fetchedData.drug; // Assuming fetchedData.drug contains the drug name
    } catch (error) {
      console.error("Error fetching therapy data:", error);
    }
  }
};

const onScheduleChanged = async (value: Option[]) => {
  const therapyToUpdate: Partial<Therapy> = {
    delivery: {
      scheduling_type: "weekly", // Assuming the scheduling type is always 'weekly' for now
      options: value
    }
  };
  try {
    if (data.value._id) {
      const response = await api.therapies.update(data.value._id, therapyToUpdate);
      console.log("Data updated!", response.data);
    }
  } catch (error) {
    console.error("Error updating therapy data:", error);
  }
};

const getId = () => {
  console.log("The ID is: " + JSON.stringify(router.currentRoute.value.query));
  return router.currentRoute.value.query.id;
};

const goToPatientDiary = () => {
  if (data.value._id) {
    router.push({ name: 'PatientDiary', query: { id: data.value._id } });
  }
};

getData(); // Fetch therapy data on component mount
</script>

<template>
  <n-card class="content-wide">
    <!-- Top bar with therapy name and Diary button -->
    <n-space justify="space-between">
      <n-h1><n-text type="primary">{{ therapyName }}</n-text></n-h1>
      <!-- Diary Button -->
      <n-button
          type="primary"
          @click="goToPatientDiary"
          class="diary-button"
      >
        <template #icon>
          <!-- Replace the pencil icon with the diary icon -->
          <img
              height="18"
              alt="Diary"
              src="/icons/diary.svg"
          />
        </template>
        <responsive-view>
          <!-- Change the button text to match the Diary action -->
          <template v-slot:m+>{{ t("therapyLogs.diary") }}</template>
        </responsive-view>
      </n-button>
    </n-space>
    <!-- Therapy details -->
    <n-divider>{{ t("therapies.detail") }}</n-divider>
    <n-scrollbar>
      <n-descriptions label-placement="left" :model="data" :columns="2">
        <n-descriptions-item :label="t('general.start')" :span="1">
          <n-tag round>{{ dateFormatter(data.start_date) }}</n-tag>
        </n-descriptions-item>
        <n-descriptions-item v-if="data.end_date" :label="t('general.end')" :content="dateFormatter(data.end_date)" :span="1">
          <n-tag round>{{ dateFormatter(data.end_date) }}</n-tag>
        </n-descriptions-item>
        <n-descriptions-item :label="t('therapies.posology')" :span="2">
          <n-tag round>{{ posology }}</n-tag>
        </n-descriptions-item>
      </n-descriptions>
      <n-divider>{{ t("therapies.delivery") }}</n-divider>
      <!-- Therapy delivery -->
      <n-button v-if="!editMode" secondary type="primary" @click="editMode = true">
        <template #icon>
          <n-icon>
            <pencil-icon />
          </n-icon>
        </template>
        <responsive-view>
          <template v-slot:m+>{{ t("general.edit") }}</template>
        </responsive-view>
      </n-button>
      <n-button v-else secondary type="primary" @click="undoEdits">
        <template #icon>
          <n-icon>
            <close-icon />
          </n-icon>
        </template>
        <responsive-view>
          <template v-slot:m+>{{ t("general.undo") }}</template>
        </responsive-view>
      </n-button>
      <therapy-detail-dose v-model:schedule="effectiveSchedule" :disabled="!editMode" @schedule-changed="onScheduleChanged" />
    </n-scrollbar>
  </n-card>
</template>

<style scoped>
.diary-button {
  /* Set border color to dark green */
  border: 1px solid #ccc;
  /* Set text color to white */
  color: #fff; /* White text */
  /* Make the text bold */
  font-weight: bold;
  /* Ensure cursor changes to pointer on hover */
  cursor: pointer;
}
</style>