import axios from "axios";
import type { CheckPaymentResponse } from "../types/khqr";

export const checkPaymentApi = async (qr_md5: string): Promise<CheckPaymentResponse> => {

    const url = `${import.meta.env.VITE_API_URL}/api/check_payment`;

    const response = await axios.post(url, { qr_md5 });

    return response.data;
};
