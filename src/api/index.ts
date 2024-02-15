export * as login from "./v1/login";
export * as user from "./v1/user";
export * as patients from "./v1/patients";
export * as therapies from "./v1/therapies";
export * as intakes from "./v1/intakes";
export * as host from "./v1/host";
export * as administration from "./v1/administration"
export * as notification from "./v1/notification"

import axios from "axios";
import {useUserStore} from "@/stores/user";

axios.interceptors.request.use((config) => {
  const user = useUserStore();
  const access_token = user.access_token;

  if (access_token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${access_token}`;
    } else {
      console.log("No headers in the request");
    }
  } else {
    console.log("No token in the store");
  }

  return config;
});
