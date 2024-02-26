<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  PropType, watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { Add as AddIcon, Remove as RemoveIcon } from "@vicons/ionicons5";
import Dose from "@/components/patient-details/Dose.vue";
import { Dose as Delivery } from "@/classes/therapy-dto";
import useWindowResize from "@/use/useWindowResize";

/**
 * @component DeliveryOptions
 * @description Component to manage the delivery options of a therapy.
 *
 * @param {Object} delivery - The delivery options of the therapy.
 *
 * @emits {Object} changed - Emits the updated delivery options.
 *
 * @example
 * <delivery-options :delivery="delivery" @changed="updateDelivery" />
 */

// Props and emits
const props = defineProps({
  delivery: { type: Object as PropType<Delivery> }, // It is called deliveries to avoid conflict with the Dose component
})
const emits = defineEmits(["changed"]);

// Window and i18n initialization
const { t } = useI18n({ useScope: "global", inheritLocale: true });
const { width, height } = useWindowResize();

// Reactive variables
const scheduling_type = ref("weekly");
const intakes = ref([
  {
    cadence: ["MO"],
    time: "10:00",
  },
]);

const add = () => {
  intakes.value.push({
    cadence: ["MO"],
    time: "10:00",
  });
};

const doseOptions = computed(() => {
  return [
    // {
    //   label: t("doses.daily"),
    //   value: "daily",
    // },
    // {
    //   label: t("doses.weekly"),
    //   value: "weekly",
    // },
    // {
    //   label: t("doses.interval"),
    //   value: "interval",
    // },
    // {
    //   label: t("doses.once"),
    //   value: "once",
    // },
  ];
});

onMounted(() => {
  if (!props.delivery) {
    emits("changed", {
      scheduling_type: scheduling_type.value,
      options: intakes.value,
    });
  }
});

watch ([scheduling_type, intakes], () => {
  emits("changed", {
    scheduling_type: scheduling_type.value,
    options: intakes.value,
  });
});

</script>

<template>
  <n-space justify="center" vertical>
    <n-space justify="center" align="center" vertical>
      <n-radio-group
        v-if="width > 600"
        v-model:value="scheduling_type"
        name="radiobuttongroup1"
      >
        <n-radio-button
          v-for="option in doseOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </n-radio-button>
      </n-radio-group>

      <n-select
        style="width: 100%"
        v-else
        v-model:value="scheduling_type"
        :options="doseOptions"
      />
    </n-space>

    <dose
      v-for="(intake, index) in intakes"
      v-bind:key="index"
      :scheduling_type="scheduling_type"
      v-model:option="intakes[index]"
    />

    <n-space justify="end">
      <n-button ghost circle type="primary" @click="add()">
        <template #icon>
          <n-icon>
            <add-icon />
          </n-icon>
        </template>
      </n-button>
      <n-button
        v-if="intakes.length > 1"
        ghost
        circle
        type="error"
        @click="intakes.pop()"
      >
        <template #icon>
          <n-icon>
            <remove-icon />
          </n-icon>
        </template>
      </n-button>
    </n-space>
  </n-space>
</template>

