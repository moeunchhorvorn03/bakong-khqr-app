export interface KhqrStatus {
  code: number;
  errorCode: number | null;
  message: string | null;
}

export interface KhqrData {
  qr: string;
  md5: string;
}

export interface KhqrResponse {
  status: KhqrStatus;
  data: KhqrData | null;
}

export interface CheckPaymentResponse {
  success: boolean;
  message: string;
  data?: {
    bakongHash: string;
  };
}
