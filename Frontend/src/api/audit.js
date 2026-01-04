import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const createAudit = async (contract) => {
    const { data } = await API.post("/audit/audit", { code: contract });

    if (data?.audit) return data.audit;
    return data;
};
