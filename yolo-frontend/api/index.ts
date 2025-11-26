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
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const signUp = async (email: string, password: string, name: string) =>
  await axios.post(`${YOLO_BACKEND_URL}/auth/sign-up`, {
    email,
    password,
    name,
  });

export const signIn = async (email: string, password: string) =>
  await axios.post(
    `${YOLO_BACKEND_URL}/auth/sign-in`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );

export const signOut = async () => await api.post("/auth/sign-out");

export const getProfile = async () => await api.get("/user/profile");

export const getMessages = async () => await api.get("/user/messages");

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
