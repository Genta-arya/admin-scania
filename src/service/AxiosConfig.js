import axios from "axios";

export const AxiosConfig = axios.create({
  // baseURL: "http://localhost:5005/api/v1",
  // baseURL: "https://server-scania.vercel.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
