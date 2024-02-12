<script setup lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import Therapy from "@/components/Therapy.vue";
import * as api from "@/api";
import { useI18n } from "vue-i18n";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Trash as TrashIcon,
  Pencil as PencilIcon,
  Eye as EyeIcon,
} from "@vicons/ionicons5";
import { useDialog } from "naive-ui";
import router from "@/router";
import EditPatientForm from "@/components/EditPatientForm.vue";
import TherapyForm from "@/components/TherapyForm.vue";
import TherapyDetails from "@/components/TherapyDetails.vue";
import useWindowResize from "@/use/useWindowResize";
import ResponsiveConfig from "@/assets/responsive-config.json";
import ResponsiveView from "@/components/ResponsiveView.vue";
import Fuse from "fuse.js";

// TODO: RIPARTI DA QUI! DEVI AGGIUSTARE QUESTO FILE ASSOLUTAMENTE!

const { t } = useI18n({ useScope: "global", inheritLocale: true });
const { width, height } = useWindowResize();
const dialog = useDialog();
const route = useRoute();
const search = ref(null as string | null);
const userData = ref({
  id: undefined as string | undefined,
  username: undefined as string | undefined,
  name: undefined as string | undefined,
  surname: undefined as string | undefined,
  sex: undefined as string | undefined,
  residence: undefined as string | undefined,
  dob: undefined as string | undefined,
  cf: undefined as string | undefined,
  phone: undefined as string | undefined,
  email: undefined as string | undefined,
});
const patientData = ref();
const therapies = ref([]);
const editMode = ref(false);
const showDrawer = ref(false);
const showTherapyModal = ref(false);
const showSpin = ref(false);
const selectedTherapy = ref({ therapyId: null, therapyDrug: null } as {
  therapyId: string | null;
  therapyDrug: string | null;
});

const getId = () => {
  console.log(`Id: ${route.query.id}`);
  return route.query.id;
};

const getData = async () => {
  if (getId()) {
    showSpin.value = true;
    await api.patients
        .findByUserId(getId() as string)
        .then((value) => {
          patientData.value = value.data;
          userData.value.id = value.data._id;
          userData.value.username = value.data.username;
          userData.value.name = value.data.name;
          userData.value.surname = value.data.surname;
          userData.value.sex = value.data.sex;
          userData.value.residence = value.data.residence;
          userData.value.dob = value.data.dob;
          userData.value.cf = value.data.cf;
          userData.value.phone = value.data.phone;
          userData.value.email = value.data.email;
          therapies.value = value.data.therapies;
          showSpin.value = false;
          console.log("Name: " + userData.value.name)
          console.log("Therapies: " + therapies.value)
        })
        .catch(() => {
          showSpin.value = false;
        });
  }
};

const onSaved = () => {
  editMode.value = false;
  getData();
};
const deletePatient = () => {
  const d = dialog.warning({
    title: t("general.confirmDeletion"),
    content: t("general.confirmDeletion"),
    positiveText: t("general.confirm"),
    negativeText: t("general.undo"),
    onPositiveClick: () => {
      d.loading = true;
      api.user.remove(userData.value.id as string).then(() => {
        router.push({ name: "Patients" });
      });
    },
  });
};
const filtered = computed(() => {
  if (search.value) {
    const fuse = new Fuse(therapies.value, { keys: ["drug"] });
    return fuse.search(search.value as string).map((e) => e.item);
  } else return therapies.value;
});

onMounted(async () => {
  await getData();
});

const computedContentStyle = computed(() => {
  return width.value < ResponsiveConfig.medium
      ? "max-width: 600px; margin-bottom: 10px; margin-right:0px; margin-left:0px; border-radius: 0px;"
      : "";
});
const computedStyle = computed(() => {
  return `max-height: ${height.value - 150}px`;
});
</script>


<template>
  <n-modal v-model:show="showTherapyModal">
    <n-card
      style="max-width: 1260px"
      :title="`${t('general.add')} ${t('general.therapy', 1)}`"
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
<!--      <therapy-form-->
<!--        @changed="-->
<!--          showTherapyModal = false;-->
<!--          getData();-->
<!--        "-->
<!--        :patient_id="getId()"-->
<!--      />-->
    </n-card>
  </n-modal>

  <n-card class="content-wide" :style="computedContentStyle">
    <n-spin :show="showSpin">
      <responsive-view>
        <template v-slot:large>
          <n-grid :x-gap="10" :y-gap="10" cols="2 1400:3 " item-responsive>
            <n-grid-item span="1 1400:2">
              <n-scrollbar :style="computedStyle">
                <n-space vertical>
                  <n-card>
                    <n-space justify="space-between">
                      <n-h1
                        ><n-text type="primary"
                          >{{ userData.username }}
                      </n-text></n-h1
                      >
                      <n-space justify="end">

                        <n-button
                          v-if="!editMode"
                          secondary
                          type="primary"
                          @click="editMode = true"
                        >
                          <template #icon>
                            <pencil-icon />
                          </template>
                          {{ t("general.edit") }}</n-button
                        >
                        <n-button
                          v-else
                          secondary
                          type="primary"
                          @click="editMode = false"
                        >
                          <template #icon>
                            <close-icon />
                          </template>
                          {{ t("general.undo") }}</n-button
                        >
                        <n-button
                          secondary
                          type="error"
                          @click="deletePatient()"
                        >
                          <template #icon>
                            <trash-icon />
                          </template>
                          {{ t("general.delete") }}
                        </n-button>
                      </n-space>
                    </n-space>
                    <n-divider>{{ t("patientDetail.detail") }}</n-divider>
                    <div v-if="!editMode">
                      <n-grid x-gap="10" cols="1 630:2">
                        <n-gi>
                          <div>{{ t("patients.name") }}: {{ userData.name }}</div>
                          <div>
                            {{ t("patients.surname") }}: {{ userData.surname }}
                          </div>
                          <div>{{ t("patients.cf") }}: {{ userData.cf }}</div>
                          <div>
                            {{ t("profile.residence") }}: {{ userData.residence }}
                          </div>
                        </n-gi>
                        <n-gi>
                          <div>
                            <div>
                              {{ t("patients.dob") }}:
                              {{
                                new Date(userData.dob).toLocaleDateString(
                                    t("code"),
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                )
                              }}
                            </div>
                            <div>
                              {{ t("profile.phone") }}: {{ userData.phone }}
                            </div>
                            <div>
                              {{ t("profile.email") }}: {{ userData.email }}
                            </div>
                          </div>
                        </n-gi>
                      </n-grid>
                    </div>
                    <div v-else>
                      <edit-patient-form
                        :id="userData.id"
                        :name="userData.name"
                        :surname="userData.surname"
                        :cf="userData.cf"
                        :email="userData.email"
                        :phone="userData.phone"
                        :sex="userData.sex"
                        :dob="userData.dob"
                        :residence="userData.residence"
                        @saved="onSaved()"
                      />
                    </div>
                  </n-card>

                  <therapy-details
                    :therapyId="selectedTherapy.therapyId"
                    :therapyDrug="selectedTherapy.therapyDrug"
                    :patientId="getId()"
                  />

<!--                  <therapy-log-->
<!--                    v-if="selectedTherapy.therapyId"-->
<!--                    :therapyId="selectedTherapy.therapyId"-->
<!--                  />-->
                </n-space>
              </n-scrollbar>
            </n-grid-item>

            <n-grid-item>
              <div>
                <n-space vertical>
                  <n-space justify="space-between">
                    <n-input
                      type="text"
                      :placeholder="t('general.search')"
                      clearable
                      v-model:value="search"
                      style="max-width: 260px"
                    />
                    <n-space justify="end">
                      <n-button type="primary" @click="showTherapyModal = true">
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
                        circle
                        @click="getData()"
                      >
                        <template #icon>
                          <n-icon>
                            <refresh-icon />
                          </n-icon> </template
                      ></n-button>
                    </n-space>
                  </n-space>
                </n-space>
                <n-scrollbar :style="computedStyle">
                  <div
                    v-for="item in filtered"
                    v-bind:key="item"
                    @click="
                      if (selectedTherapy.therapyId === item._id) {
                        selectedTherapy.therapyId = null;
                        selectedTherapy.therapyDrug = null;
                      } else {
                        selectedTherapy.therapyId = item._id;
                        selectedTherapy.therapyDrug = item.drug.split('-')[0];
                      }
                    "
                  >
                    <therapy
                      @changed="getData()"
                      :therapy="item"
                      :isSelected="selectedTherapy.therapyId === item._id"
                    />
                  </div>
                </n-scrollbar>
              </div>
            </n-grid-item>
          </n-grid>
        </template>
        <template v-slot:m->
          <n-space vertical>
            <n-card>
              <responsive-view>
                <template v-slot:medium>
                  <n-space vertical>
                    <n-h1
                      ><n-text type="primary"
                        >{{ userData.username }}
                    </n-text></n-h1
                    >

                    <n-grid :x-gap="10" :y-gap="10" cols="2 540:3 750:4">
                      <n-gi>
                        <n-button
                          v-if="!editMode"
                          secondary
                          type="primary"
                          @click="editMode = true"
                        >
                          <template #icon>
                            <pencil-icon />
                          </template>
                          {{ t("general.edit") }}</n-button
                        >
                        <n-button
                          v-else
                          secondary
                          type="primary"
                          @click="editMode = false"
                        >
                          <template #icon>
                            <close-icon />
                          </template>
                          {{ t("general.undo") }}</n-button
                        ></n-gi
                      ><n-gi>
                        <n-button
                          secondary
                          type="error"
                          @click="deletePatient()"
                        >
                          <template #icon>
                            <trash-icon />
                          </template>
                          {{ t("general.delete") }}
                        </n-button></n-gi
                      >

                      <n-gi>
                        <n-button secondary @click="showDrawer = true">
                          <template #icon>
                            <eye-icon />
                          </template>
                          {{ t("patientDetail.showTherapies") }}</n-button
                        >
                      </n-gi>
                    </n-grid>
                  </n-space>
                </template>
                <template v-slot:small>
                  <n-h1
                    ><n-text type="primary">{{ userData.username }}</n-text></n-h1
                  >
                </template>
              </responsive-view>
              <n-divider>{{ t("patientDetail.detail") }}</n-divider>
              <div v-if="!editMode">
                <n-grid x-gap="10" y-gap="10" cols="1 630:2">
                  <n-gi>
                    <n-space vertical>
                      <n-text>{{ t("patients.name") }}: {{ userData.name }}</n-text>
                      <n-text
                        >{{ t("patients.surname") }}: {{ userData.surname }}</n-text
                      >
                      <n-text>{{ t("patients.cf") }}: {{ userData.cf }}</n-text>
                      <n-text>
                        {{ t("profile.residence") }}: {{ userData.residence }}
                      </n-text>
                    </n-space>
                  </n-gi>
                  <n-gi>
                    <n-space vertical>
                      <n-text>
                        {{ t("patients.dob") }}:
                        {{
                          new Date(userData.dob).toLocaleDateString(t("code"), {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        }}
                      </n-text>
                      <n-text
                        >{{ t("profile.phone") }}: {{ userData.phone }}</n-text
                      >
                      <n-text
                        >{{ t("profile.email") }}: {{ userData.email }}</n-text
                      >
                    </n-space>
                  </n-gi>
                </n-grid>
              </div>
              <div v-else>
                <edit-patient-form
                  :id="userData.id"
                  :name="userData.name"
                  :surname="userData.surname"
                  :cf="userData.cf"
                  :email="userData.email"
                  :phone="userData.phone"
                  :sex="userData.sex"
                  :dob="userData.dob"
                  :residence="userData.residence"
                  @saved="onSaved()"
                />
              </div>
            </n-card>

            <therapy-details
              :therapyId="selectedTherapy.therapyId"
              :therapyDrug="selectedTherapy.therapyDrug"
              :patientId="getId()"
            />
            <therapy-log
              v-if="selectedTherapy.therapyId"
              :therapyId="selectedTherapy.therapyId"
            />
            <responsive-view>
              <template v-slot:small>
                <n-space vertical>
                  <n-space justify="space-between">
                    <n-button
                      v-if="!editMode"
                      secondary
                      type="primary"
                      @click="editMode = true"
                    >
                      <template #icon>
                        <pencil-icon />
                      </template>
                      {{ t("general.edit") }}</n-button
                    >
                    <n-button
                      v-else
                      secondary
                      type="primary"
                      @click="editMode = false"
                    >
                      <template #icon>
                        <close-icon />
                      </template>
                      {{ t("general.undo") }}</n-button
                    >
                    <n-button secondary type="error" @click="deletePatient()">
                      <template #icon>
                        <trash-icon />
                      </template>
                      {{ t("general.delete") }}
                    </n-button>
                  </n-space>

                  <n-button
                    style="width: 100%; padding: 0px"
                    secondary
                    @click="showDrawer = true"
                  >
                    <template #icon>
                      <eye-icon />
                    </template>
                    Show</n-button
                  >
                </n-space>
              </template>
            </responsive-view>
          </n-space>

          <n-drawer
            v-model:show="showDrawer"
            :height="height - 70"
            placement="bottom"
          >
            <n-drawer-content>
              <template #header>
                <n-space justify="space-between">
                  <span tabindex="0" />
                  <n-input
                    type="text"
                    :placeholder="t('general.search')"
                    v-model:value="search"
                    clearable
                    :style="`width: ${width - 250}px`"
                  />
                  <n-space justify="end">
                    <n-button type="primary" @click="showTherapyModal = true">
                      <template #icon>
                        <n-icon>
                          <add-icon />
                        </n-icon>
                      </template>
                      {{ t("general.add") }}
                    </n-button>
                    <n-button
                      ghost
                      circle
                      type="primary"
                      @click="showDrawer = false"
                    >
                      <template #icon>
                        <n-icon>
                          <close-icon />
                        </n-icon>
                      </template>
                    </n-button>
                  </n-space>
                </n-space>
              </template>
              <div>
                <n-scrollbar :style="computedStyle">
                  <n-space vertical>
                    <div
                      v-for="item in filtered"
                      v-bind:key="item"
                      @click="
                        if (selectedTherapy.therapyId === item._id) {
                          selectedTherapy.therapyId = null;
                          selectedTherapy.therapyDrug = null;
                        } else {
                          selectedTherapy.therapyId = item._id;
                          selectedTherapy.therapyDrug = item.drug.split('-')[0];
                        }
                      "
                    >
                      <therapy
                        @changed="getData()"
                        :therapy="item"
                        :isSelected="selectedTherapy.therapyId === item._id"
                      />
                    </div>
                  </n-space>
                </n-scrollbar>
              </div>
            </n-drawer-content>
          </n-drawer>
        </template>
      </responsive-view>
    </n-spin>
  </n-card>
</template>

