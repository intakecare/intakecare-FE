import { UserCreateDTO, UserUpdateDTO } from "@/classes/user-dto";
import { email } from "vuelidate/lib/validators";
import * as fetchApi from "../fetchApi";

export async function get(id: string): Promise<any> {
  return await fetchApi.getHttp(`/api/users/${id}`);
}

export async function update(userUpdate: Partial<UserUpdateDTO>): Promise<any> {
  return await fetchApi.patchHttp("/api/users", userUpdate);
}

export async function create(userData: UserCreateDTO): Promise<any> {
  return await fetchApi.postHttp("/api/auth/patient", userData);
}

export async function remove(id: string): Promise<any> {
  return await fetchApi.deleteHttp(`/api/administration/patient/${id}`);
}

export async function signup(email: string): Promise<any> {
  const data = await fetchApi.getHttp(`/api/users/${email}`);
  return data
}
