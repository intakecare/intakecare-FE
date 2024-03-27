<template>
  <!-- Card component containing upper and lower sections -->
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
          <!-- Display current date -->
          <p class="current-date large-font">{{ currentDate }}</p>
        </div>
        <!-- Input section for entering therapy information -->
        <div class="input-section">
          <!-- Adjustable input field -->
          <n-input v-model:value="inputContent" placeholder="Miao" :autosize="true" type="textarea" class="autosizable-input" />
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
              <n-button secondary type="primary" @click="editMode = true" class="edit-button">
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
              <div class="message-content">"{{ item.msg }}"</div>
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
</template>

<script setup lang="ts">
// Import necessary libraries and components
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import * as api from '@/api';
import axios from 'axios';
import { Pencil as PencilIcon } from "@vicons/ionicons5";

// Use global i18n instance
const { t } = useI18n({ useScope: 'global', inheritLocale: true });

// Initialize router
const router = useRouter();

// Reference variables for reactive data
const therapyName = ref('');
const inputContent = ref('');
const timelineItems = ref([]);

// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(t('code'), options);
};

// Computed property for current date
const currentDate = computed(() => {
  const today = new Date();
  return formatDate(today);
});

// Function to get therapy ID from router
const getId = () => router.currentRoute.value.query.id;

// Function to fetch data from API
const getData = async () => {
  const therapyId = getId();
  if (therapyId) {
    try {
      // Fetch therapy logs
      const response = await axios.get('/local-api/therapylogs/');
      const therapyLogs = response.data;
      const filteredLogs = therapyLogs.filter(log => log.therapy_id === therapyId);
      timelineItems.value = filteredLogs;

      // Fetch therapy information
      const therapyResponse = await api.therapies.get(therapyId);
      if (therapyResponse && therapyResponse.data) {
        therapyName.value = therapyResponse.data.drug;
      } else {
        console.error('Failed to fetch therapy information');
      }

      updateCardHeight();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
};

// Function to send message
// Function to send message
const sendMessage = async () => {
  try {
    const trimmedInput = inputContent.value.trim();
    if (!trimmedInput) {
      console.error('Input content cannot be empty.');
      return;
    }

    const newMessage = {
      therapy_id: getId(),
      msg: trimmedInput,
      date: new Date().toISOString()
    };

    await axios.post('/local-api/therapylogs', newMessage);

    // Refresh data after sending message
    await getData();

    // Clear input content after successful message send
    inputContent.value = '';

  } catch (error) {
    console.error('Error sending message:', error);
  }
};


// Initialize data retrieval
getData();

// Reference for card height
const cardHeight = ref('auto');
const maxTimelineHeight = ref('');

// Function to calculate max height
const calculateMaxHeight = () => {
  const viewportHeight = window.innerHeight;
  maxTimelineHeight.value = `${viewportHeight * 0.8 - 140}px`;
};

// Call calculateMaxHeight
calculateMaxHeight();

// Function to update card height
const updateCardHeight = () => {
  cardHeight.value = timelineItems.value.length > 0 ? 'auto' : maxTimelineHeight.value;
};

// Watch for changes in timelineItems
watch(timelineItems, () => {
  updateCardHeight();
});

// Computed property for reversed timeline items
const reversedTimelineItems = computed(() => {
  return timelineItems.value.slice().reverse();
});
</script>

<!-- Styles -->
<style scoped>
/* Styles for upper section */
.upper-section {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

/* Styles for lower section */
.lower-section {
  max-height: calc(80vh - 140px);
  overflow-y: auto;
  padding-left: 10px;
}

/* Separator style */
.separator {
  height: 0px;
}

/* Page heading style */
.page-heading {
  margin-bottom: 20px;
}

/* Input section style */
.input-section {
  display: flex;
  flex-direction: column;
}

/* Styles for autosizable input */
.autosizable-input {
  height: 80px;
}

/* Styles for send button container */
.send-button-container {
  margin-top: 10px;
  align-self: flex-end;
}

/* Send button style */
.send-button {
  margin-left: 10px;
}

/* Current date style */
.current-date {
  font-size: 17px;
}

/* Message container style */
.message-container {
  display: flex;
  align-items: center;
}

/* Message content style */
.message-content {
  margin-left: 10px;
}

/* Item header style */
.item-header {
  display: flex;
  align-items: center;
}

/* Edit button style */
.edit-button {
  margin-left: 10px;
  padding: 2px 4px;
  font-size: 12px;
}

/* Edit icon style */
.edit-icon svg {
  width: 15px;
  height: 15px;
}

/* Edit icon container style */
.edit-icon {
  display: flex;
  align-items: center;
}
</style>
