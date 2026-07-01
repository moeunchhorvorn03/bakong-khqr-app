import axios from "axios";
import type { KhqrResponse } from "../types/khqr";

export const generateKhqrApi = async (): Promise<KhqrResponse> => {
    
    const url = `${import.meta.env.VITE_API_URL}/api/generate_qrcode`;

    const response = await axios.post(url, {});

    return response.data;
};
