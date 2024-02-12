<template>
  <n-modal v-model:show="showTherapyModal">
    <n-card
      style="max-width: 1260px"
      :title="`${t('general.edit')} ${t('general.therapy', 1)}`"
      :bordered="false"
      size="huge"
    >
      <template #header-extra>
        <n-button ghost circle type="primary" @click="showTherapyModal = false">
          <template #icon>
            <n-icon>
              <close-icon />
            </n-icon>
          </template> </n-button
      ></template>
      <therapy-form
        @changed="
          showTherapyModal = false;
          handleEdit();
        "
        :therapy="therapy"
        :patient_id="therapy.patient_id"
      />
    </n-card>
  </n-modal>
  <n-card
    :style="computedStyle"
    embedded
    :bordered="false"
    style="margin-top: 10px"
  >
    <n-space
      justify="space-between"
      style="margin: 0px"
      item-style="margin: auto"
      :wrap="false"
    >
      <n-space vertical>
        <n-text :style="computedTitleStyle">{{
          therapy.drug.split("-")[0]
        }}</n-text>
        <span>
          <n-text :style="computedTextStyle + ' margin-right: 5px'"
            >{{ therapy.posology }} -</n-text
          >
          <n-text :style="computedTextStyle" v-if="therapy.state">{{
            t("therapies.active")
          }}</n-text>
          <n-text :style="computedTextStyle" v-else>{{
            t("therapies.suspended")
          }}</n-text>
          <n-text v-if="therapy.end_date" :style="computedTextStyle">
            - {{ t("therapies.until") }}:
            {{ new Date(therapy.end_date).toLocaleDateString(t("code")) }}
          </n-text>
        </span>
        <n-collapse-transition :show="isSelected">
          <n-space justify="space-between">
            <n-space vertical>
              <n-space>
                <n-tag :color="tagColor"> {{ scheduling }}</n-tag>
                <n-tag :color="tagColor"
                  >{{ t("therapies.maxDelay") }}: {{ delay }} min</n-tag
                >
                <n-tag v-if="hasMeals" :color="tagColor">
                  {{ t(`therapies.${therapy.meals}`, 2) }}
                  {{ t("therapies.meals") }}
                </n-tag>
                <n-tag :color="tagColor">
                  {{ t(`therapies.${validation}`) }}
                </n-tag>
              </n-space>
              <span
                ><n-text :style="computedTextStyle + ' margin-right: 5px'"
                  >{{ t("therapies.at") }}:</n-text
                >
                <span
                  v-for:="item in therapy.delivery.options"
                  v-bind:key="item"
                >
                  <n-tag style="margin-right: 5px" :color="tagColor">
                    {{ item.time }}</n-tag
                  >
                </span>
              </span>
            </n-space>
          </n-space>
        </n-collapse-transition>
      </n-space>

      <n-space justify="end" :wrap="false" item-style="margin: auto">
        <n-space vertical>
          <div>
            <div :style="computedAdherenceStyle">
              <h2 style="margin: 5px">
                {{ parseFloat(therapy.adherence).toFixed(2) + "%" }}
              </h2>
            </div>
          </div>

          <n-collapse-transition :show="isSelected">
            <n-space :wrap="false">
              <n-button
                size="large"
                circle
                color="#E4EFEF"
                text-color="#006666"
                @click="showTherapyModal = true"
                ><template #icon>
                  <n-icon> <pencil-icon /> </n-icon
                ></template>
              </n-button>
              <n-button
                color="#E6D3E1"
                text-color="#510045"
                @click="deleteTherapy"
                size="large"
                circle
                type="error"
                ><template #icon>
                  <n-icon> <trash-icon /> </n-icon
                ></template>
              </n-button>
            </n-space>
          </n-collapse-transition>
        </n-space> </n-space
    ></n-space>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from "vue";
import AdherenceConfig from "@/assets/adherence-config.json";
import {
  Close as CloseIcon,
  Trash as TrashIcon,
  Pencil as PencilIcon,
} from "@vicons/ionicons5";
import { Therapy } from "@/classes/therapy-dto";
import { useI18n } from "vue-i18n";
import TherapyForm from "@/components/TherapyForm.vue";
import * as api from "@/api";
import { useDialog } from "naive-ui";

import { scaleColor } from "seemly";
import { useThemeVars } from "naive-ui";

 export default defineComponent({
  name: "Therapy",
  components: {
    TrashIcon,
    PencilIcon,
    TherapyForm,
    CloseIcon,
  },
  emits: ["changed"],
  props: {
    therapy: { type: Object as PropType<Therapy>, required: true },
    isSelected: { type: Boolean, required: true },
  },
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: "global", inheritLocale: true });
    const dialog = useDialog();
    const showTherapyModal = ref(false);
    const delay = computed(() => {
      return props.therapy?.delivery.options[0].max_delay;
    });

    const validation = computed(() => {
      if( props.therapy.validation_alexa) {
        return 'alexa'
      } else if (props.therapy.validation_web) {
        return 'web'
      } else  {
        return 'phone'
      }
    })

    const scheduling = computed(() => {
      if (props.therapy.delivery.scheduling_type === "daily") {
        return t("therapies.daily");
      } else if (props.therapy.delivery.scheduling_type === "weekly") {
        var msg = t("therapies.weekly") + ": ";
        var week = (
          props.therapy.delivery.options[0].cadence as Array<any>
        ).map((e) => {
          return t(`weekDays.${e}`);
        });
        return msg + week.join(", ");
      } else if (props.therapy.delivery.scheduling_type === "once") {
        return t("therapies.once");
      } else if (props.therapy.delivery.scheduling_type === "interval") {
        return t("therapies.interval", {
          count: props.therapy.delivery.options[0].cadence,
        });
      } else return "";
    });
    const tagColor = {
      color: "#E4EFEF",
      textColor: "#006666",
      borderColor: "#9EC6C6",
    };

    const hasMeals = computed(() => {
      if (props.therapy.meals) return true;
      else return false;
    });

    const handleEdit = () => {
      emit("changed");
    };

    const deleteTherapy = () => {
      const d = dialog.warning({
        title: t("general.confirmDeletion"),
        content: t("general.confirmDeletion"),
        positiveText: t("general.confirm"),
        negativeText: t("general.undo"),
        onPositiveClick: () => {
          return new Promise((resolve) => {
            if (props.therapy._id) {
              d.loading = true;
              api.therapies
                .remove(props.therapy._id)
                .then(() => {
                  emit("changed");
                })
                .then(resolve);
            }
          });
        },
      });
    };

    const computedStyle = computed(() => {
      return props.isSelected
        ? `background-color: ${
            useThemeVars().value.primaryColor
          }; color: #FFFFFF;`
        : "";
    });

    const computedTextStyle = computed(() => {
      return props.isSelected ? "color: #FFFFFF;" : "";
    });

    const computedTitleStyle = computed(() => {
      return props.isSelected
        ? "color: #FFFFFF; font-size:18pt"
        : "font-size:18pt";
    });

    const computedAdherenceStyle = computed(() => {
      if (props.therapy.adherence > AdherenceConfig.warning) {
        return props.isSelected
          ? "border-radius: 5px; border-color: #FFFFFF;   border-width: 3px; border-style: solid; color: #FFFFFF;"
          : `border-radius: 5px; border-color: ${
              useThemeVars().value.primaryColor
            }; border-width: 3px; border-style: solid; color: ${
              useThemeVars().value.primaryColor
            };`;
      } else if (
        props.therapy.adherence > AdherenceConfig.danger &&
        props.therapy.adherence <= AdherenceConfig.warning
      ) {
        return `border-radius: 5px; border-color: ${
          useThemeVars().value.warningColorPressed
        }; border-width: 3px; color: ${
          useThemeVars().value.warningColorPressed
        }; border-style: solid; background-color: #FEDFCA;`;
      } else {
        return `border-radius: 5px; border-color: ${
          useThemeVars().value.errorColor
        }; border-width: 3px; color: #ffffff; border-style: solid; background-color: ${
          useThemeVars().value.errorColor
        };`;
      }
    });

    return {
      t,
      validation,
      AdherenceConfig,
      tagColor,
      scheduling,
      delay,
      showTherapyModal,
      deleteTherapy,
      handleEdit,
      hasMeals,
      computedStyle,
      computedTextStyle,
      computedTitleStyle,
      computedAdherenceStyle,
    };
  },
});
</script>
