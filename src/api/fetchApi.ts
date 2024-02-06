import baseHttp from "./baseFetch";

export const getHttp = async (url: string, params?: any, options?: any) =>
  baseHttp(url, "get", {
    ...options,
    params,
  });

export const postHttp = async (url: string, data?: any, options?: any) =>
  baseHttp(url, "post", {
    data,
    ...options,
  });

export const putHttp = async (url: string, data?: any, options?: any) =>
  baseHttp(url, "put", {
    data,
    ...options,
  });

export const patchHttp = async (url: string, data?: any, options?: any) =>
  baseHttp(url, "patch", {
    data,
    ...options,
  });

export const updateHttp = async (url: string, data?: any, options?: any) =>
  baseHttp(url, "update", {
    data,
    ...options,
  });

export const deleteHttp = async (url: string, data?: any, options?: any) =>
  baseHttp(url, "delete", {
    data,
    ...options,
  });
