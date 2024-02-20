<script setup lang="ts">
import {
  h,
  RendererElement,
  RendererNode,
  VNode,
  onMounted,
  ref,
  computed,
} from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { NTag } from "naive-ui";
import * as api from "@/api";
import { Therapy } from "@/classes/therapy-dto";
import NewPatientForm from "@/components/patient-list/NewPatientForm.vue";
import OTP from "@/components/OTP.vue";
import Settings from "@/components/Settings.vue";
import useWindowResize from "@/use/useWindowResize";
import ResponsiveView from "@/components/ResponsiveView.vue";
import ResponsiveConfig from "@/assets/responsive-config.json";
import {
  Close as CloseIcon,
  Settings as SettingsIcon
} from "@vicons/ionicons5";
import { Refresh as RefreshIcon } from "@vicons/ionicons5";
import { useUserStore } from "@/stores/user";
import router from "@/router";
import Fuse from "fuse.js";

/**
 * This view is used to display the list of therapies of a certain patient.
 */

const { t } = useI18n({ useScope: "global", inheritLocale: true });
const { width } = useWindowResize();
const user = useUserStore();
const data = ref([] as Therapy[]);
const search = ref(null as string | null);
const showSpin = ref(false);
const showModal = ref(false);
const showOTPModal = ref(false);
const showSettingsModal = ref(false);
const PatientId = ref(null as string | null);
const pagination = {
  pageSize: 10,
};

const getData = async () => {
  /**
   * This function fetches the data from the api related to all therapies of a certain patient.
   */
  showSpin.value = true;

  await api.therapies
      .find()
      .then((value) => {
        data.value = value.data;
        showSpin.value = false;
      })
      .catch(() => {
        showSpin.value = false;
      });
};

type Row = {
  key: string | null;
  therapy: string;
  validation: boolean;
  adherence: number;
};

const open = (row: Row) => {
  router.push({ name: "PatientTherapyDetail", query: { id: row.key } });
};

const rowProps = (row: Row) => {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      open(row);
    },
  };
};

onMounted(() => {
  getData();
  PatientId.value = user._id
});

const tableData = computed(() => {
  /**
   * This function maps the data from the api to the table.
   */
  if (data.value.length) {
    const mapped = data.value.map((element) => {
      return {
        key: element._id,
        therapy: element.drug,
        validation: element.validation_alexa ? 'alexa' :
            element.validation_web ? 'web' :
                element.validation_phone ? 'phone' :
                    'undefined',
        adherence: element.adherence,
      };
    });
    if (search.value) {
      const fuse = new Fuse(mapped, { keys: ["therapy", "validation"] });
      return fuse.search(search.value as string).map((e) => e.item);
    } else return mapped;
  } else return [];
});

const createColumns = computed(() => {
  /**
   * This function creates the columns of the table.
   */
  const columns = [
    {
      title: t("therapies.drug"),
      key: "therapy",
      sorter: "default",
    },
  ] as {
    title: string;
    key: string;
    defaultSortOrder?: string;
    sorter?: string;
    render?: (
        row: Row
        /* eslint-disable-next-line */
    ) => VNode<RendererNode, RendererElement, { [key: string]: any }>;
  }[];

  if (width.value > ResponsiveConfig.medium) {
    columns.push({
      title: t("therapies.validation"),
      key: "validation",
      sorter: "default",
    });
  }

  columns.push({
    title:
        width.value > ResponsiveConfig.medium ? t("therapies.adherence") : "%",
    key: "adherence",
    defaultSortOrder: "ascend",
    sorter: "default",
    render(row: Row) {
      if (row.adherence > 69) {
        return h(NTag, { type: "info" }, { default: () => row.adherence });
      } else if (row.adherence > 30 && row.adherence <= 69) {
        return h(
            NTag,
            { type: "warning" },
            { default: () => row.adherence }
        );
      } else
        return h(NTag, { type: "error" }, { default: () => row.adherence });
    },
  });

  return columns;
});

</script>


<template>
  <n-modal style="max-width: 1260px" v-model:show="showSettingsModal" preset="dialog">
    <template #header>
      <div>{{ t("general.settings") }}</div>
    </template>
      <div>
        <Settings :patient_id="PatientId"/>
      </div>
  </n-modal>

  <n-modal style="max-width: 1260px" v-model:show="showOTPModal" preset="dialog">
    <template #header>
      <div>{{ t("general.genOTP") }}</div>
    </template>
    <div>
      <OTP :patient_id="PatientId" />
    </div>
  </n-modal>

  <n-modal v-model:show="showModal">
    <n-card
      style="max-width: 1260px"
      :title="`${t('general.therapy', 1)}`"
      :bordered="false"
      size="huge"
    >
      <template #header-extra>
        <n-button ghost circle type="primary" @click="showModal = false">
          <template #icon>
            <n-icon>
              <close-icon />
            </n-icon>
          </template> </n-button>
      </template>
      <new-patient-form
        @saved="
          showModal = false;
          getData();
        "
      />
    </n-card>
  </n-modal>
  
  <n-card class="content">
    <n-space vertical>
      <responsive-view>
        <!-- Template for medium and large screens -->
        <template v-slot:m+>
          <n-space justify="space-between">
            <n-input
              type="text"
              :placeholder="t('general.search')"
              clearable
              v-model:value="search"
              style="max-width: 320px"
            />
            <n-space justify="end">
              <n-button type="primary" secondary circle @click="showSettingsModal = true">
                <template #icon>
                  <n-icon>
                    <settings-icon />
                  </n-icon> </template
              ></n-button>

              <n-button type="primary" @click="showOTPModal = true">
                        <template #icon>
                          <img
                            height="18"
                            alt="amazonalexa"
                            src="@/assets/icons/amazonalexawhite.svg"
                          />
                        </template>
                        {{ t("general.genOTP") }}
              </n-button>

              <n-button type="primary" secondary circle @click="getData()">
                <template #icon>
                  <n-icon>
                    <refresh-icon />
                  </n-icon> </template
              ></n-button>
            </n-space>
          </n-space>
        </template>
      </responsive-view>
      <!-- Template for small screens -->
      <responsive-view>
        <template v-slot:small>
          <n-space vertical>
            <n-input
              type="text"
              :placeholder="t('general.search')"
              clearable
              v-model:value="search"
            />
            <n-space justify="space-between">
              <n-button
                  type="primary"
                  secondary
                  style="width: 100%"
                  @click="getData()"
              >
                <template #icon>
                  <n-icon>
                    <refresh-icon />
                  </n-icon> </template
                >{{ t("general.refresh") }}
              </n-button>
              <n-button
                  type="primary"
                  secondary
                  style="width: 100%"
                  @click="showSettingsModal = true"
              >
                <template #icon>
                  <n-icon>
                    <settings-icon />
                  </n-icon>
                </template>
              </n-button>
              <n-button
                  type="primary"
                  style="width: 100%"
                  @click="showOTPModal = true"
              >
                <template #icon>
                  <img
                      height="18"
                      alt="amazonalexa"
                      src="@/assets/icons/amazonalexawhite.svg"
                  />
                </template>
                {{ t("general.genOTP") }}
              </n-button>
            </n-space>

          </n-space>
        </template>
      </responsive-view>
      <!-- Table -->
      <n-spin :show="showSpin">
        <n-data-table
          :columns="createColumns"
          :data="tableData"
          :pagination="pagination"
          :row-props="rowProps">
        </n-data-table>
      </n-spin>
    </n-space>
  </n-card>
</template>
