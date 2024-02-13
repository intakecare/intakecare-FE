<script setup lang="ts">
import { computed, PropType } from "vue";
import { IntakeDTO } from "@/classes/intake-dto";
import { useI18n } from "vue-i18n";
import { useThemeVars } from "naive-ui";

// Define props
const props = defineProps({
  intake: { type: Object as PropType<IntakeDTO>, required: true }
});
const themeVars = useThemeVars();
const { t } = useI18n({ useScope: "global", inheritLocale: true });

const computedStyle = computed(() => {
  let color: string = "#CCCCCC";
  if (props.intake.status === "taken") {
    color = themeVars.value.primaryColor;
  } else if (props.intake.status === "programmed") {
    color = "#CCCCCC";
  } else if (props.intake.status === "missed") {
    color = themeVars.value.errorColor;
  }
  return `margin: auto; height: 30px; width: 30px; background-color: ${color};border-radius: 50%; display: inline-block;`;
});
</script>

<template>
  <n-popover trigger="hover">
    <template #trigger>
      <span :style="computedStyle"></span>
    </template>
    <n-space vertical>
      <span
        >{{
          new Date(
            new Date(intake.programmed_date).getTime() +
              new Date().getTimezoneOffset() * 60 * 1000
          ).toLocaleString(t("code"))
        }}
      </span>
      <n-text v-if="intake.intake_delay !== undefined"
        >{{ t("intakes.delay") }}: {{ intake.intake_delay }} min</n-text
      >
    </n-space>
  </n-popover>
</template>
