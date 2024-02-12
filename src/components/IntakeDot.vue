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

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { IntakeDTO } from "@/classes/intake-dto";
import { useI18n } from "vue-i18n";
import { useThemeVars } from "naive-ui";

export default defineComponent({
  name: "IntakeDot",
  props: { intake: { type: Object as PropType<IntakeDTO>, required: true } },
  setup(props) {
    const { t } = useI18n({ useScope: "global", inheritLocale: true });
    const computedStyle = computed(() => {
      var color;
      if (props.intake.status === "taken") {
        color = useThemeVars().value.primaryColor;
      } else if (props.intake.status === "programmed") {
        color = "#CCCCCC";
      } else if (props.intake.status === "missed") {
        color = useThemeVars().value.errorColor;
      }
      return `margin: auto; height: 30px; width: 30px; background-color: ${color};border-radius: 50%; display: inline-block;`;
    });

    return { t, computedStyle };
  },
});
</script>
