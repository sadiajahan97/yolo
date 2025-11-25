import axios from "axios";

const YOLO_BACKEND_URL = process.env.NEXT_PUBLIC_YOLO_BACKEND_URL;

export interface Detection {
  object: string;
  confidence: number;
  boundingBox: [number, number, number, number];
}

export interface Message {
  content: string;
  role: "user" | "assistant";
}

export interface Profile {
  name: string;
  email: string;
}

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

export const detectObjects = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await api.post("/yolo/detect", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const askGemini = async (
  file: File,
  detections: Detection[],
  question: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("detections", JSON.stringify(detections));
  formData.append("question", question);

  return await api.post("/gemini/ask", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
