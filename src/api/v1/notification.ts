import * as fetchApi from "../fetchApi";

export async function notifyWeb(): Promise<any> {
    return await fetchApi.postHttp("/api/web")
  }