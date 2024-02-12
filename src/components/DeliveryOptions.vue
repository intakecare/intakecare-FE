<template>
  <n-space justify="center" vertical>
    <n-space justify="center" align="center" vertical>
      <n-radio-group
        v-if="width > 600"
        v-model:value="scheduling"
        name="radiobuttongroup1"
      >
        <n-radio-button
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </n-radio-button>
      </n-radio-group>

      <n-select
        style="width: 100%"
        v-else
        v-model:value="scheduling"
        :options="options"
      />
    </n-space>

    <dose
      v-for="(intake, index) in intakes"
      v-bind:key="index"
      :schedule="scheduling"
      v-model:value="intakes[index]"
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

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  PropType,
  watchEffect,
} from "vue";
import { useI18n } from "vue-i18n";
import { Add as AddIcon, Remove as RemoveIcon } from "@vicons/ionicons5";
import Dose from "@/components/Dose.vue";
// import ResponsiveView from "@/components/ResponsiveView.vue";
import { Dose as Delivery } from "@/classes/therapy-dto";
import useWindowResize from "@/use/useWindowResize";
export default defineComponent({
  name: "DeliveryOptions",
  components: {
    AddIcon,
    RemoveIcon,
    Dose,
    //ResponsiveView
  },
  emits: ["changed"],
  props: { 
    time_place: {type: String, required: true},
    deliveries: { type: Object as PropType<Delivery> } },
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: "global", inheritLocale: true });
    const { width, height } = useWindowResize();
    const scheduling = ref("daily");
    
    const add = () => {
      intakes.value.push({
        weekdays: ["MO"],
        time: "12:00",
        cadence: 1,
      });
    };
    const intakes = ref([
      {
        weekdays: ["MO"],
        time: "12:00",
        cadence: 1,
      },
    ]);

    const options = computed(() => {
      return [
        {
          label: t("doses.daily"),
          value: "daily",
        },
        {
          label: t("doses.weekly"),
          value: "weekly",
        },
        {
          label: t("doses.interval"),
          value: "interval",
        },
        {
          label: t("doses.once"),
          value: "once",
        },
      ];
    });

    watchEffect(() => {
      intakes.value.forEach((e) => {
        if (scheduling.value === "daily") e.cadence = 1;
        else if (scheduling.value === "interval" && e.cadence < 2)
          e.cadence = 2;
      });

      emit("changed", {
        scheduling_type: scheduling.value,
        options: intakes.value,
      });
    });

    onMounted(() => {
      if (!props.deliveries) {
        emit("changed", {
          scheduling_type: scheduling.value,
          options: intakes.value,
        });
      }
    });

    watch(props, () => {
      if (props.deliveries) {
        scheduling.value = props.deliveries.scheduling_type;
        intakes.value = props.deliveries.options.map((e) => {
          return {
            time: e.time,
            weekdays: typeof e.cadence === "number" ? ["MO"] : e.cadence,
            cadence: typeof e.cadence === "number" ? e.cadence : 1,
          };
        });
      }
    });
    return { scheduling, options, intakes, add, width, height };
  },
});
</script>
