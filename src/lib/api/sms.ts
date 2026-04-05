import { client } from './client';

type SendSMSRequest = { to: string; message: string; sender_id?: string };
type SMSResponse = { message_id: string; status: string };
type SendBulkSMSRequest = { recipients: string[]; message: string; sender_id?: string };
type BulkSMSResponse = { sent: number; failed: number; message_ids: string[] };
type SendOTPRequest = { phone: string; length?: number };
type OTPResponse = { reference: string; expires_in: number };
type VerifyOTPRequest = { phone: string; code: string; reference: string };
type OTPVerifyResponse = { verified: boolean };

export const smsService = {
  send: (data: SendSMSRequest) =>
    client.post<SMSResponse>('/sms/send', data),

  sendBulk: (data: SendBulkSMSRequest) =>
    client.post<BulkSMSResponse>('/sms/send-bulk', data),

  sendOtp: (data: SendOTPRequest) =>
    client.post<OTPResponse>('/sms/otp/send', data),

  verifyOtp: (data: VerifyOTPRequest) =>
    client.post<OTPVerifyResponse>('/sms/otp/verify', data),

  healthCheck: () => client.get<unknown>('/sms/health'),
};
