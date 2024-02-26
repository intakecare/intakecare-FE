import * as fetchApi from "../fetchApi";
import { Therapy } from "@/classes/therapy-dto";

export async function save(therapy: Partial<Therapy>) {
  return await fetchApi.postHttp("/api/therapies", {
    therapy: therapy,
  });
}

export async function update(
  therapy_id: string,
  therapy_update: Partial<Therapy>
) {
  return await fetchApi.patchHttp(`/api/therapies/${therapy_id}`, {
    therapy: therapy_update,
  });
}

export async function remove(therapy_id: string) {
  return await fetchApi.deleteHttp(`/api/therapies/${therapy_id}`);
}

export async function getLogs(therapy_id: string) {
  return await fetchApi.getHttp(`/api/therapies/${therapy_id}/logs`);
}

export async function find() {//patient_id: string
  return await fetchApi.getHttp(`/api/patients/therapies`);//${patient_id}`);
}

export async function get(therapy_id: string) {
  return await fetchApi.getHttp(`/api/therapies/${therapy_id}`);
}

export async function getPatientId(therapy_id: string) {
  return await fetchApi.getHttp(`/api/therapies/${therapy_id}/patientId`);
}

export async function getByPatientId(patient_id: string) {
  return await fetchApi.getHttp(`/api/therapies/by/${patient_id}`);
}