import { patientUpdateDTO } from "@/classes/patient-dto";
import { patients } from "..";
import { UserUpdateDTO } from "@/classes/user-dto";
import * as fetchApi from "../fetchApi";

export async function find() {
  return await fetchApi.getHttp("/api/patients");
}

export async function findByUserId(userId: string) {
  return await fetchApi.getHttp(`/api/patients/by/${userId}`);
}

export async function findOne(id: string) {
  return await fetchApi.getHttp(`/api/patients?${id}`);
}

export async function edit(id: string, update: Partial<UserUpdateDTO>) {
  return await fetchApi.patchHttp(`/api/patients/${id}`, update);
}

export async function count(doctorId: string) {
  return await fetchApi.getHttp(`/api/patients/countByDoctorId/${doctorId}`);
}

export async function sendNote(body: {therapyId: string, note: string}) {
  return await fetchApi.postHttp(`/api/patients/note`, body);
}


