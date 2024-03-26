<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
// Import your api, ResponsiveView, Option, Therapy, etc.
import { CashOutline as CashIcon } from '@vicons/ionicons5';

const { t } = useI18n({ useScope: "global", inheritLocale: true });

// Vue Router
const router = useRouter();

// Refs
const therapyName = ref("");
const inputContent = ref("");
const timelineItems = ref([]);

// Computed property for current date
const currentDate = computed(() => {
  const today = new Date();
  return today.toLocaleDateString(t('code'), { year: 'numeric', month: 'long', day: 'numeric' });
});

// Function to get therapy ID from router query
const getId = () => {
  const id = router.currentRoute.value.query.id;
  console.log("Raw ID:", id); // Debugging output
  return id;
};

// Function to send message and add it to timeline
const sendMessage = () => {
  if (inputContent.value.trim() !== "") {
    timelineItems.value.push(inputContent.value.trim());
    inputContent.value = ""; // Pulisce il contenuto dell'input dopo l'aggiunta alla timeline
  }
};

// Fetch therapy data
const getData = async () => {
  if (getId()) {
    try {
      const response = await api.therapies.get(getId() as string);
      const fetchedData = response.data;
      therapyName.value = fetchedData.drug;
    } catch (error) {
      console.error("Error fetching therapy data:", error);
    }
  }
};

// Fetch data on component mount
getData();
</script>

<template>
  <n-card class="content-wide">
    <!-- Page heading -->
    <div class="page-heading">
      <n-h1><n-text type="primary">{{ t("therapies.therapydiary") }}</n-text></n-h1>
      <h2 class="subheading">{{ therapyName }}</h2>
    </div>

    <!-- Top section -->
    <div class="top-section">
      <!-- Therapy info -->
      <div class="therapy-info justify-between items-center">
        <!-- Increase font size for the current date -->
        <p class="current-date large-font">{{ currentDate }}</p>
      </div>

      <!-- Input section -->
      <div class="input-section">
        <n-input v-model="inputContent" placeholder="Ciao Ric" autosize type="textarea" class="autosizable-input" />
      </div>

      <!-- Send button -->
      <div class="send-button-container">
        <n-button
            type="primary"
            @click="sendMessage"
            class="send-button"
        >
          <!-- Icona di invio -->
          <img
              height="18"
              alt="Send"
              src="/icons/send.svg"
          />
          <!-- Testo del pulsante -->
          {{ t("general.send") }}
        </n-button>
      </div>

      <!-- Timeline -->
      <div class="timeline">
        <h3>{{ t('ItemList') }}</h3>
        <n-timeline>
          <n-timeline-item
              title="Primo Item"
              time="2018-04-03 20:46"
          >
            <template #icon>
              <n-icon>
                <img src="/icons/item.svg" />
              </n-icon>
            </template>
          </n-timeline-item>
          <n-timeline-item
              title="Secondo Item"
          >
            <template #icon>
              <n-icon>
                <img src="/icons/item.svg" />
              </n-icon>
            </template>
          </n-timeline-item>
          <n-timeline-item
              title="Terzo Item"
              time="2018-04-03 20:46"
          >
            <template #icon>
              <n-icon>
                <img src="/icons/item.svg" />
              </n-icon>
            </template>
          </n-timeline-item>
          <n-timeline-item
              title="Quarto Item"
              time="2018-04-03 20:46"
          >
            <template #icon>
              <n-icon>
                <img src="/icons/item.svg" />
              </n-icon>
            </template>
          </n-timeline-item>
        </n-timeline>

      </div>
    </div>
  </n-card>
</template>

<style scoped>
/* Scoped styles */
.subheading {
  margin-top: 1px;
  color: #666; /* Adjust color as needed */
}

.current-date {
  margin-top: 20px; /* Add space between input and button */
  font-size: 16px; /* Set font size to 24px */
}

.autosizable-input {
  width: calc(100%); /* Input width 100% minus width of the button and margin */
  resize: vertical; /* Allow vertical resizing */
  min-height: 100px; /* Minimum height */
  max-height: 100px; /* Maximum height */
  margin-bottom: 10px; /* Add space between input and button */
}

.send-button-container {
  display: flex;
  justify-content: flex-end;
}
</style>
