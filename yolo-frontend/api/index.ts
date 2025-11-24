import axios from "axios";

const YOLO_BACKEND_URL = process.env.NEXT_PUBLIC_YOLO_BACKEND_URL;

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
