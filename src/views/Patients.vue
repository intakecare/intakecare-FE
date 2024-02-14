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
import { useI18n } from "vue-i18n";
import { NTag } from "naive-ui";
import * as api from "@/api";
import PatientDTO from "@/classes/patient-dto";
import NewPatientForm from "@/components/patient-list/NewPatientForm.vue";
import useWindowResize from "@/use/useWindowResize";
import ResponsiveView from "@/components/ResponsiveView.vue";
import ResponsiveConfig from "@/assets/responsive-config.json";
import { Close as CloseIcon } from "@vicons/ionicons5";
import { PersonAdd as AddIcon } from "@vicons/ionicons5";
import { Refresh as RefreshIcon } from "@vicons/ionicons5";
import router from "@/router";
import {useUserStore} from "@/stores/user";

/** This view is used to display the list of patients of a certain physician. */

// Variables definition
const { t } = useI18n({ useScope: "global", inheritLocale: true });
const { width } = useWindowResize();
const user = useUserStore();
const data = ref([] as PatientDTO[]);
const search = ref(null as string | null);
const showSpin = ref(false);
const showModal = ref(false);
const pagination = {
  pageSize: 10
}

const getData = () => {
  /** This function fetches the data from the api related to all patients of a certain physician. */
  showSpin.value = true;
  console.log(user);
  api.patients
      .find()
      .then((value) => {
        data.value = value.data;
        console.log(data.value);
        showSpin.value = false;
      })
      .catch(() => {
        showSpin.value = false;
      });
};

onMounted(() => {
  getData();
});

type Row = {
  _id: string;
  name: string;
  username: string;
  cf: string;
  adherence: number;
};

const open = (row: Row) => {
  /** This function defines what happens when the user clicks on a row. */
  router.push({ name: "PatientDetail", query: { id: row._id } });
};

const rowProps = (row: Row) => {
  /** This function defines what happens when the user hovers over a row. */
  return {
    style: "cursor: pointer;",
    onClick: () => {
      open(row);
    },
  };
};


const createColumns = computed(() => {
  /** This function creates the columns of the table. */
  const columns = [
    {
      title: t("patients.username"),
      key: "username",
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
      title: t("patients.name"),
      key: "name",
      sorter: "default",
    });
  }

  if (width.value > ResponsiveConfig.large) {
    columns.push({
      title: t("patients.cf"),
      key: "cf",
      sorter: "default",
    });
  }

  columns.push({
    title:
        width.value > ResponsiveConfig.medium ? t("patients.adherence") : "%",
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
<n-modal v-model:show="showModal">
  <n-card
    style="max-width: 1260px"
    :title="`${t('general.add')} ${t('general.patient', 1)}`"
    :bordered="false"
    size="huge"
  >
    <template #header-extra>
      <n-button ghost circle type="primary" @click="showModal = false">
        <template #icon>
          <n-icon>
            <close-icon />
          </n-icon>
        </template> </n-button
    ></template>
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
            <n-button type="primary" @click="showModal = true">
              <template #icon>
                <n-icon>
                  <add-icon />
                </n-icon>
              </template>
              {{ t("general.add") }}
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

    <n-spin :show="showSpin">
      <n-data-table
        :columns="createColumns"
        :data="data"
        :pagination="pagination"
        :row-props="rowProps"
      />
    </n-spin>
    <responsive-view>
      <template v-slot:small>
        <n-space vertical>
          <n-input
            type="text"
            :placeholder="t('general.search')"
            clearable
            v-model:value="search"
          />
          <n-button
            type="primary"
            style="width: 100%"
            @click="showModal = true"
          >
            <template #icon>
              <n-icon>
                <add-icon />
              </n-icon>
            </template>
            {{ t("general.add") }}
          </n-button>

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
            >{{ t("general.refresh") }}</n-button
          >
        </n-space>
      </template>
    </responsive-view>
  </n-space>
</n-card>
</template>

