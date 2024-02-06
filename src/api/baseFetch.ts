import axios, { Method } from "axios";

export default async (url: string, method: string, options = {}) =>
  axios({ method: method as Method, url, ...options });
