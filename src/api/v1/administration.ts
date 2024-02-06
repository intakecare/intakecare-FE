import { CreateDoctorDto, UserCreateDTO, UserUpdateDTO } from "@/classes/user-dto";
import * as fetchApi from "../fetchApi";

export async function getDoctors(): Promise<any> {
    const data = await fetchApi.getHttp("/api/administration/doctors");
    return data;
  }

  export async function findDoctor(userID: string): Promise<any> {
    const data = await fetchApi.getHttp(`/api/administration/doctorBy/${userID}`);
    return data;
  }

export async function createDoctor(data: CreateDoctorDto): Promise<any> {
    return await fetchApi.postHttp("/api/administration/create/doctor", data
    )
}

export async function createPatient(data: UserCreateDTO): Promise<any> {
  return await fetchApi.postHttp("/api/administration/create/patient", data
  )
}


export async function notifyWeb(therapyId: string): Promise<any> {//endpoint: string | undefined, expirationTime: number | null | undefined , keys: Record<string, string> | undefined
  return await fetchApi.postHttp("/api/administration/notifyWeb", therapyId
  )
}

/*export async function saveSW(endpoint: string | undefined, expirationTime: number | null | undefined , keys: Record<string, string> | undefined): Promise<any> {
  return await fetchApi.patchHttp("/api/administration/saveSW", {
    endpoint: endpoint,
    expirationTime: expirationTime,
    keys: keys
  })
}*/

export async function saveSW(update: Partial<UserUpdateDTO>): Promise<any> {
  return await fetchApi.patchHttp("/api/administration/saveSW", update)
}