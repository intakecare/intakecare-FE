import axios, { Method } from "axios";
import { Capacitor } from '@capacitor/core';
const BASE_URL = 'https://intake-care-de7b20968242.herokuapp.com';
export default async (url: string, method: string, options = {}) => {
    const apiUrl = getApiUrl(url);
    return axios({ method: method as Method, url: apiUrl, ...options });
};

const getApiUrl = (url: string) => {
    // Determine the final API URL based on whether the application is running on a native platform or not
    return Capacitor.isNativePlatform() ? BASE_URL + url.substring(4) : url;
};

