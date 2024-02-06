import * as fetchApi from "../fetchApi";

export async function getStats() {
  return await fetchApi.getHttp(`/api/administration/statistics`);
}
