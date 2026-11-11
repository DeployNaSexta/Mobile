
import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.10.44.82:3000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
