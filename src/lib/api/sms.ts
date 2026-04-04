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
    client.post<SMSResponse>('/api/v1/sms/send', data),

  sendBulk: (data: SendBulkSMSRequest) =>
    client.post<BulkSMSResponse>('/api/v1/sms/send-bulk', data),

  sendOtp: (data: SendOTPRequest) =>
    client.post<OTPResponse>('/api/v1/sms/otp/send', data),

  verifyOtp: (data: VerifyOTPRequest) =>
    client.post<OTPVerifyResponse>('/api/v1/sms/otp/verify', data),

  healthCheck: () => client.get<unknown>('/api/v1/sms/health'),
};
