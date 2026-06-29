import type { KhqrResponse } from "../types/khqr";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const generateKhqrApi = async (): Promise<KhqrResponse> => {
  const response = await fetch(`${API_URL}/api/generate_qrcode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
