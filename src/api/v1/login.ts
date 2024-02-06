import * as fetchApi from "../fetchApi";

export async function byUsername(
  username: string,
  password: string
): Promise<any> {
  const data = await fetchApi.postHttp("/api/auth/login", {
    username: username,
    password: password,
  });
  return data;
}

export async function getCurrent(): Promise<any> {
  const data = await fetchApi.getHttp("/api/auth/login");
  return data;
}

export async function generate(id: string, duration: number): Promise<any> {
  const data = await fetchApi.postHttp(`/api/auth/generate/${id}`, {
    duration: duration,
  });
  return data;
}

export async function getUsers(): Promise<any> {
  const data = await fetchApi.getHttp("/api/auth/users");
  return data;
}

export async function changePassword(oldPwd: string, newPwd: string) {
  const data = await fetchApi.patchHttp("/api/auth/change", { oldPwd, newPwd });
  return data;
}

//nuova function
export async function setFirstPassword(PwdIn: string) {//userId: string, 
  return await fetchApi.patchHttp("/api/auth/set", {PwdIn} );//userId,
}
