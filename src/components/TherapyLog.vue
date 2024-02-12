<template>
  <n-card>
    <n-spin :show="showSpin">
      <n-space vertical>
        <n-h1
          ><n-text type="primary"> {{ t("therapies.therapyHistory") }}</n-text>
        </n-h1>

        <responsive-view>
          <template v-slot:m+>
            <n-scrollbar x-scrollable>
              <n-timeline size="large" horizontal>
                <n-popover
                  placement="top"
                  trigger="hover"
                  v-for="(log, index) in therapyLogs"
                  v-bind:key="log._id"
                >
                  <template #trigger>
                    <n-timeline-item
                      type="info"
                      :title="`${log.name} ${log.surname || null}`"
                      :time="log.date.toLocaleString(t('code'))"
                    />
                  </template>

                  <n-space vertical v-if="index > 0">
                    <span v-for="item in getComparison(index)" :key="item">
                      <n-text style="font-weight: bold" type="primary" strong
                        >{{ item.path }}:
                      </n-text>
                      <n-text>{{ item.edit }} </n-text>
                    </span>
                  </n-space>
                </n-popover>
              </n-timeline>
            </n-scrollbar>
          </template>
          <template v-slot:small>
            <n-timeline size="large" vertical>
              <n-timeline-item
                v-for="(log, index) in therapyLogs"
                v-bind:key="log._id"
                type="info"
                :title="`${log.name} ${log.surname || null}`"
                :time="log.date.toLocaleString(t('code'))"
              >
                <n-space vertical v-if="index > 0">
                  <span v-for="item in getComparison(index)" :key="item"
                    ><n-text style="font-weight: bold" type="primary" strong
                      >{{ item.path }}:
                    </n-text>
                    <n-text>{{ item.edit }}</n-text></span
                  >
                </n-space>
              </n-timeline-item>
            </n-timeline>
          </template>
        </responsive-view>
      </n-space>
    </n-spin>
  </n-card>
</template>

<script lang="ts">
import { Therapy, TherapyLog } from "@/classes/therapy-dto";
import { defineComponent, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Diff, diff } from "deep-diff";
import * as api from "@/api";

import ResponsiveView from "@/components/ResponsiveView.vue";

export default defineComponent({
  name: "TherapyLog",
  components: { ResponsiveView },
  props: { therapyId: { type: String, required: true } },
  setup(props) {
    const { t, te } = useI18n({ useScope: "global", inheritLocale: true });
    const therapyLogs = ref([] as TherapyLog[]);
    const showSpin = ref(false);
    const getData = () => {
      showSpin.value = true;
      api.therapies
        .getLogs(props.therapyId)
        .then((value) => {
          therapyLogs.value = value.data;
          showSpin.value = false;
        })
        .catch(() => {
          showSpin.value = false;
        });
    };

    const getComparison = (
      index: number
    ): { path: string; edit: string }[] | null => {
      const a = diff(
        therapyLogs.value[index - 1].therapy_update as Therapy,
        therapyLogs.value[index].therapy_update as Therapy
      );

      return a ? a.map((e) => getTranslation(e)) : null;
    };

    const getTranslation = (
      e: Diff<Therapy, Therapy>
    ): { path: string; edit: string } => {
      if (e.kind === "E" && e.path) {
        var path: string;
        var lhs: string;
        var rhs: string;
        path = e.path
          .map((k) => (te("therapyLogs." + k) ? t("therapyLogs." + k) : k))
          .join(" / ");
        lhs = te("therapyLogs." + e.lhs.toString())
          ? t("therapyLogs." + e.lhs.toString())
          : e.lhs.toString();
        rhs = te("therapyLogs." + e.rhs.toString())
          ? t("therapyLogs." + e.rhs.toString())
          : e.rhs.toString();

        return { path: path, edit: `${lhs} -> ${rhs}` };
      } else if (e.kind === "A" && e.path) {
        path = e.path
          .map((k) => (te("therapyLogs." + k) ? t("therapyLogs." + k) : k))
          .join(" / ");
        return { path: path, edit: getTranslation(e.item).edit };
      } else if (e.kind === "N") {
        var tempRhs: string[] = [];
        for (const [key, value] of Object.entries(e.rhs)) {
          tempRhs.push(
            `${
              te("therapyLogs." + key.toString())
                ? t("therapyLogs." + key.toString())
                : key.toString()
            }: ${
              te("therapyLogs." + value.toString())
                ? t("therapyLogs." + value.toString())
                : value.toString()
            }`
          );
        }
        rhs = t("general.added") + ": " + tempRhs.join(", ");

        return { path: "", edit: rhs };
      } else if (e.kind === "D") {
        var tempLhs: string[] = [];
        for (const [key, value] of Object.entries(e.lhs)) {
          tempLhs.push(
            `${
              te("therapyLogs." + key.toString())
                ? t("therapyLogs." + key.toString())
                : key.toString()
            }: ${
              te("therapyLogs." + value.toString())
                ? t("therapyLogs." + value.toString())
                : value.toString()
            }`
          );
        }
        lhs = t("general.removed") + ": " + tempLhs.join(", ");

        return { path: "", edit: lhs };
      }
      return { path: "", edit: "" };
    };

    onMounted(() => {
      getData();
    });

    watch(
      () => props.therapyId,
      () => {
        getData();
      }
    );

    return { therapyLogs, t, getComparison, showSpin };
  },
});
</script>
