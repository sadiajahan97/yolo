import axios from "axios";

const YOLO_BACKEND_URL = process.env.NEXT_PUBLIC_YOLO_BACKEND_URL;

const api = axios.create({
  baseURL: YOLO_BACKEND_URL,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access-token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signUp = async (email: string, password: string, name: string) => {
  return await axios.post(`${YOLO_BACKEND_URL}/auth/sign-up`, {
    email,
    password,
    name,
  });
};

export const signIn = async (email: string, password: string) => {
  return await axios.post(`${YOLO_BACKEND_URL}/auth/sign-in`, {
    email,
    password,
  });
};

export const getProfile = async () => {
  return await api.get("/user/profile");
};

export const getMessages = async () => {
  return await api.get("/user/messages");
};
