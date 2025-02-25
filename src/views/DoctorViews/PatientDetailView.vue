<script setup lang="ts">
import {onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import Therapy from "@/components/patient-details/Therapy.vue";
import * as api from "@/api";
import { useI18n } from "vue-i18n";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Trash as TrashIcon,
  Pencil as PencilIcon,
  Eye as EyeIcon,
  PersonSharp as PersonaIcon,
} from "@vicons/ionicons5";
import { useDialog } from "naive-ui";
import router from "@/router";
import EditPatientForm from "@/components/patient-details/EditPatientForm.vue";
import TherapyForm from "@/components/PatientDetailDoctor/TherapyForm.vue";
import TherapyDetails from "@/components/patient-details/TherapyDetails.vue";
import useWindowResize from "@/use/useWindowResize";
import ResponsiveConfig from "@/assets/responsive-config.json";
import ResponsiveView from "@/components/ResponsiveView.vue";
import Fuse from "fuse.js";

/** This view shows the details of a single patient:
 * - Patient details (name, surname, ...)
 * - Therapies
 * - Adherence
 * */

// TODO: Fix a bug that does not correctly update the DeliveryOptions of a therapy when it is selected to be modified.

// Variable definition
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
  persona_id: undefined as string | undefined
});
const patientData = ref();
const therapies = ref([]);
const patientPersona = ref(null as string | null);
const editMode = ref(false);
const showDrawer = ref(false);
const showTherapyModal = ref(false);
const showPersonaModal = ref(false);
const showSpin = ref(false);
const selectedTherapy = ref({ therapyId: null, therapyDrug: null } as {
  therapyId: string | null;
  therapyDrug: string | null;
});

const getId = () : string => {
  // Get the patient id from the route and return it as a string
  return route.query.id as string;
};

const getData = async () => {
  // Fetch the patient data from the api
  if (getId()) {
    showSpin.value = true;
    await api.patients
        .findByUserId(getId() as string)
        .then((response) => {
          console.log(response.data);
          patientData.value = response.data;
          userData.value.id = response.data.user._id;
          userData.value.username = response.data.credential.username;
          userData.value.name = response.data.user.name;
          userData.value.surname = response.data.user.surname;
          userData.value.sex = response.data.user.sex;
          userData.value.residence = response.data.user.residence;
          userData.value.dob = response.data.user.dob;
          userData.value.cf = response.data.user.cf;
          userData.value.phone = response.data.user.phone;
          userData.value.email = response.data.user.email;
          userData.value.persona_id = response.data.user.persona_id.toString();
          console.log(userData.value.persona_id)
          therapies.value = response.data.therapies;
          showSpin.value = false;
        })
        .catch(() => {
          showSpin.value = false;
        });
  }
};

onMounted(async () => {
  // Fetch the patient data when the component is mounted
  await getData();
});

const onSaved = () => {
  // This function is called when the user saves the patient data
  console.log("Changed Patient Data")
  editMode.value = false;
  getData();
};

const deletePatient = () => {
  // This function is called when the user wants to delete the patient
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

/**
 * This function updates the persona of the patient
 *
 */
const updatePersona = () => {
  // This function updates the persona of the patient
  if (patientPersona.value) {
    console.log("Patient Persona: ", patientPersona.value);
    api.patients.edit(userData.value.id as string, {"user":
          { "persona_id": patientPersona.value.toString() }
    }).then(() => {
      showPersonaModal.value = false;
      getData();
    });
  }
}

const filtered = computed(() => {
  // This function filters the therapies based on the search input
  if (search.value) {
    const fuse = new Fuse(therapies.value, { keys: ["drug"] });
    return fuse.search(search.value as string).map((e) => e.item);
  } else return therapies.value;
});

const isValidDate = (date: string | undefined) : boolean => {
  // This function checks if a date is valid
  // If the date is valid it returns true, otherwise it returns false
  if (!date) return false;
  else{
    const d = new Date(date).toLocaleDateString(t("code"),
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
    return d !== "Invalid Date";
  }
};

// The following functions are used to compute the style of the components based on the screen size
const computedContentStyle = computed(() => {
  return width.value < ResponsiveConfig.medium
      ? "max-width: 600px; margin-bottom: 10px; margin-right:0px; margin-left:0px; border-radius: 0px;"
      : "";
});
const computedStyle = computed(() => {
  return `max-height: ${height.value - 150}px`;
});

const isTherapySelected = (id: string) => {
  // This function checks if a therapy is selected
  return selectedTherapy.value.therapyId === id
};

const onTherapySelected = (item: any) => {
  // This function is called when the user selects a therapy
  if (selectedTherapy.value.therapyId === item._id) {
    selectedTherapy.value.therapyId = null;
    selectedTherapy.value.therapyDrug = null;
  } else {
    selectedTherapy.value.therapyId = item._id;
    selectedTherapy.value.therapyDrug = item.drug.split('-')[0];
  }
};
</script>


<template>
  <!-- This is the modal that is shown when the user wants to add a new therapy -->
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
      <therapy-form
        @changed="
          showTherapyModal = false;
          getData();
        "
        :patient_id="getId()"
      />
    </n-card>
  </n-modal>

  <!-- This is the modal that is shown when the doctor wants to change the user's persona -->
  <n-modal v-model:show="showPersonaModal">
    <n-card
      style="max-width: 1260px"
      :title="`${t('patientDetail.changePersonaMessage')}`"
      :bordered="false"
      size="huge"
    >
      <template #header-extra>
        <n-button ghost circle type="primary" @click="showPersonaModal = false">
          <template #icon>
            <n-icon>
              <close-icon />
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-space vertical>
        <n-radio-group v-model:value="userData.persona_id" style="width: 100%">
          <n-radio-button value="1">Persona 1</n-radio-button>
          <n-radio-button value="2">Persona 2</n-radio-button>
          <n-radio-button value="3">Persona 3</n-radio-button>
        </n-radio-group>
        <n-space justify="space-between">
          <n-button type="primary" @click="updatePersona()">
            {{ t("general.confirm") }}
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>

  <!-- This is the main content of the view -->
  <n-card class="content-wide" :style="computedContentStyle">
    <n-spin :show="showSpin">
      <responsive-view>
        <!-- This is the large screen layout -->
        <template v-slot:large>
          <n-grid :x-gap="10" :y-gap="10" cols="2 1400:3 " item-responsive>
            <n-grid-item span="1 1400:2">
              <n-scrollbar :style="computedStyle">
                <n-space vertical>
                  <n-card>
                    <n-space justify="space-between">
                      <n-h1
                        ><n-text
                          >{{ userData.username }}
                      </n-text>
                      </n-h1>
                      <n-space justify="end">
                        <n-button
                            secondary
                            v-if="!userData.persona_id"
                            type="error"
                            @click="showPersonaModal = true">
                          <template #icon >
                            <persona-icon />
                          </template>
                          {{ t("patientDetail.assignPersona") }}
                        </n-button>

                        <n-button
                          secondary
                          type="primary"
                          v-else
                          @click="showPersonaModal = true">
                          <template #icon >
                            <persona-icon />
                          </template>
                          {{ t("patientDetail.changePersona") }}
                        </n-button>

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
                            <div v-if="isValidDate(userData.dob)">
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
                            <div v-else>
                              {{ t("patients.dob") }}: {{ t("patients.missingData") }}
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
                    @click="onTherapySelected(item)"
                  >
                    <therapy
                      @changed="getData()"
                      :therapy="item"
                      :isSelected="isTherapySelected(item._id)"
                    />
                  </div>
                </n-scrollbar>
              </div>
            </n-grid-item>
          </n-grid>
        </template>

        <!-- This is the medium to small screen layout -->
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
                            secondary
                            type="primary"
                            @click="showPersonaModal = true">
                          <template #icon >
                            <persona-icon />
                          </template>
                          {{ t("patientDetail.changePersona") }}
                        </n-button>
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
                      <n-text v-if="isValidDate(userData.dob)">
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
                      <n-text v-else>
                        {{ t("patients.dob") }}: {{ t("patients.missingData") }}
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
<!--            <therapy-log-->
<!--              v-if="selectedTherapy.therapyId"-->
<!--              :therapyId="selectedTherapy.therapyId"-->
<!--            />-->
            <!-- Small screen layout -->
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
                      @click="onTherapySelected(item)"
                    >
                      <therapy
                        @changed="getData()"
                        :therapy="item"
                        :isSelected="isTherapySelected(item._id)"
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

