import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const registerUser = async (payload) => {
    const { data } = await API.post("/auth/register", payload);
    return data;
};

export const loginUser = async (payload) => {
    const { data } = await API.post("/auth/login", payload);
    return data;
};
