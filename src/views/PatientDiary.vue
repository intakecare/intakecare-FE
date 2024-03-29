<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import * as api from "@/api";
import axios from 'axios';
import { Pencil as PencilIcon } from "@vicons/ionicons5";

const { t } = useI18n({ useScope: 'global', inheritLocale: true });
const router = useRouter();

const defaultValue = new Date();
const therapyName = ref('');
const inputContent = ref('');
const timelineItems = ref([]);
const selectedDate = ref(new Date().toISOString().substr(0, 10));
const timestamp = ref(new Date().getTime());
const isModifyTherapyLogsVisible = ref(false);
const editedDate = ref('');
const editedMessage = ref('');
const old_date = ref('');
const old_msg = ref('');
const cardHeight = ref('auto');
const maxTimelineHeight = ref('');

const getId = () => router.currentRoute.value.query.id;

const getData = async () => {
  const therapyId = getId();
  if (therapyId) {
    try {
      const response = await axios.get('/local-api/therapylogs/');
      const therapyLogs = response.data;
      const filteredLogs = therapyLogs.filter(log => log.therapy_id === therapyId);
      const sortedLogs = filteredLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
      timelineItems.value = sortedLogs;

      const therapyResponse = await api.therapies.get(therapyId);
      if (therapyResponse && therapyResponse.data) {
        therapyName.value = therapyResponse.data.drug;
      } else {
        console.error('Failed to fetch therapy information');
      }

      selectedDate.value = new Date();

      updateCardHeight();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
};

getData();

const getCurrentDate = () => {
  return selectedDate.value;
};


const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(t('code'), options);
};


const handleDateChange = (newDate: Date) => {
  selectedDate.value = newDate;
};

const sendMessage = async () => {
  try {
    const trimmedInput = inputContent.value.trim();
    if (!trimmedInput) {
      console.error('Input content cannot be empty.');
      return;
    }

    const currentDate = getCurrentDate();

    const newMessage = {
      therapy_id: getId(),
      msg: trimmedInput,
      date: currentDate,
    };

    await axios.post('/local-api/therapylogs', newMessage);

    await getData();

    inputContent.value = '';

  } catch (error) {
    console.error('Error sending message:', error);
  }
};

const updateCardHeight = () => {
  cardHeight.value = timelineItems.value.length > 0 ? 'auto' : maxTimelineHeight.value;
};

watch(timelineItems, () => {
  updateCardHeight();
});

const reversedTimelineItems = computed(() => {
  return timelineItems.value.slice().reverse();
});

const openModifyTherapyLogs = (index: number, message: string, date: string, oldMsg: any = old_msg) =>{
  editedDate.value = date;
  editedMessage.value = message;

  old_date.value = date;
  old_msg.value = message;
  isModifyTherapyLogsVisible.value = true;
};

const confirmEdit = async () => {
  await patchTherapyLogs();
};

const patchTherapyLogs = async () => {
  try {
    const response = await axios.get('/local-api/therapylogs/');
    const therapyLogs = response.data;
    const logToUpdate = therapyLogs.find(log => log.msg === old_msg.value && log.date === old_date.value);

    if (!logToUpdate) {
      console.error('Log not found for update');
      return;
    }
    const logId = logToUpdate.id;

    const editedData = {
      msg: editedMessage.value,
      date: new Date(editedDate.value),
    };

    await axios.patch(`/local-api/therapylogs/${logId}`, editedData);

    // Aggiorna la timeline dopo aver aggiornato il log
    await getData();
    isModifyTherapyLogsVisible.value = false;
  } catch (error) {
    console.error('Error patching therapy logs:', error);
  }
};

const cancelEdit = () => {
  isModifyTherapyLogsVisible.value = false;
};
const handleDatePickerChange = (newDate) => {
  console.log('New Date:', newDate);
  editedDate.value = newDate;
};


</script>

<template>
  <div>
    <n-card class="content-wide">
      <!-- Upper section - Fixed header -->
      <div class="upper-section">
        <!-- Page heading -->
        <div class="page-heading">
          <!-- Therapy Diary heading -->
          <n-h1><n-text type="primary">{{ t("therapies.therapydiary") }}</n-text></n-h1>
          <!-- Therapy name subheading -->
          <h2 class="subheading">{{ therapyName }}</h2>
        </div>

        <!-- First section -->
        <div class="first-section">
          <div class="therapy-info justify-between items-center">
            <!-- Date picker container -->
            <div class="date-picker-container" style="margin-bottom: 5px;">
              <!-- Include the date picker component here -->
              <n-date-picker v-model="selectedDate" @change="handleDateChange" :default-value="defaultValue" type="date" class="small-date-picker" />
            </div>
          </div>
          <!-- Input section for entering therapy information -->
          <div class="input-section">
            <!-- Adjustable input field -->
            <n-input v-model:value="inputContent" placeholder="Scrivi qua note sulla tua terapia" :autosize="true" type="textarea" class="autosizable-input" />
            <!-- Send button -->
            <div class="send-button-container">
              <n-button type="primary" class="send-button" @click="sendMessage" :disabled="inputContent.trim().length === 0">
                <!-- Send icon -->
                <img height="18" alt="Send" src="/icons/send.svg" />
                &nbsp;
                {{ t("general.send") }}
              </n-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add space between upper and lower section -->
      <div class="separator"></div>

      <!-- Lower section - make this section scrollable -->
      <div class="lower-section" :style="{ maxHeight: maxTimelineHeight, height: cardHeight }">
        <!-- Timeline -->
        <n-timeline>
          <!-- Loop through timeline items -->
          <template v-for="(item, index) in reversedTimelineItems" :key="index">
            <!-- Timeline item -->
            <n-timeline-item class="timeline-item">
              <!-- Item header with date and edit button -->
              <div class="item-header">
                <!-- Date tag -->
                <n-tag round>{{ formatDate(item.date) }}</n-tag>
                <!-- Edit button -->
                <n-button secondary type="primary" @click="openModifyTherapyLogs(index, item.msg, item.date)" class="edit-button">
                  <!-- Edit icon -->
                  <template #icon>
                    <n-icon class="edit-icon">
                      <PencilIcon />
                    </n-icon>
                  </template>
                </n-button>
              </div>
              <!-- Message content -->
              <div class="message-container">
                <!-- Display message content -->
                <div class="message-content">{{ item.msg }}</div>
              </div>
              <!-- Icon placeholder -->
              <template #icon>
                <n-icon>
                  <!-- Item icon -->
                  <img src="/icons/item.svg" />
                </n-icon>
              </template>
            </n-timeline-item>
          </template>
        </n-timeline>
      </div>
    </n-card>

    <!-- Popup for editing therapy logs -->
    <div class="overlay" v-if="isModifyTherapyLogsVisible">
      <div class="popup-container">
        <n-card class="popup-card">
          <div class="popup-content">
            <n-h1><n-text type="primary">Edit your note</n-text></n-h1>
            <n-date-picker v-model="editedDate" type="date" :default-value="new Date(editedDate)" @change="handleDatePickerChange" class="popup-date-picker" />
            <n-input v-model:value="editedMessage" placeholder="Scrivi qui il tuo messaggio" :autosize="true" type="textarea" class="popup-input" />
            <div class="popup-buttons">
              <n-button @click="cancelEdit">Cancel</n-button>
              <n-button type="primary" @click="confirmEdit">Confirm Changes</n-button>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upper-section {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

.lower-section {
  max-height: calc(80vh - 140px);
  overflow-y: auto;
  padding-left: 10px;
}

.separator {
  height: 0px;
}

.page-heading {
  margin-bottom: 20px;
}

.input-section {
  display: flex;
  flex-direction: column;
}

.autosizable-input {
  height: 80px;
}

.send-button-container {
  margin-top: 10px;
  align-self: flex-end;
}

.send-button {
  margin-left: 20px;
}

.message-container {
  display: flex;
  align-items: center;
}

.message-content {
  margin-left: 10px;
  font-size: 15px;
}

.item-header {
  display: flex;
  align-items: center;
}

.edit-button {
  margin-left: 10px;
  padding: 2px 8px;
  font-size: 12px;
}

.edit-icon svg {
  width: 20px;
  height: 20px;
}

.edit-icon {
  display: flex;
  align-items: center;
}

.small-date-picker {
  width: 140px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.popup-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.popup-card {
  width: 600px;
  height: 330px;
}

.popup-content {
  padding: 10px;
  max-height: 20px;
}

.popup-date-picker {
  margin-bottom: 10px;
}

.popup-input {
  margin-bottom: 15px;
  height: 100px;
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
  offset-distance: 3px;
}

</style>
