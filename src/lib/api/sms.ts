import { client } from './client';
import type {
  SendSMSRequest,
  SMSResponse,
  SendBulkSMSRequest,
  BulkSMSResponse,
  SendOTPRequest,
  OTPResponse,
  VerifyOTPRequest,
  OTPVerifyResponse,
} from '@/types';

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
