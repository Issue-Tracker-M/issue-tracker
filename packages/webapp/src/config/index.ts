import axios from "axios";
import store from "../store";

export const baseUrl = process.env.REACT_APP_API_HOST;

axios.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = token;
  return config;
});

axios.defaults.baseURL = baseUrl;
axios.defaults.withCredentials = true;
