import { useMutation, useQuery } from '@tanstack/react-query';
import { smsService } from '@/lib/api/sms';

type SendSMSRequest = { to: string; message: string; sender_id?: string };
type SendBulkSMSRequest = { recipients: string[]; message: string; sender_id?: string };
type SendOTPRequest = { phone: string; length?: number };
type VerifyOTPRequest = { phone: string; code: string; reference: string };

export function useSendSMS() {
  return useMutation({
    mutationFn: (data: SendSMSRequest) => smsService.send(data),
  });
}

export function useSendBulkSMS() {
  return useMutation({
    mutationFn: (data: SendBulkSMSRequest) => smsService.sendBulk(data),
  });
}

export function useSendOTP() {
  return useMutation({
    mutationFn: (data: SendOTPRequest) => smsService.sendOtp(data),
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: (data: VerifyOTPRequest) => smsService.verifyOtp(data),
  });
}

export function useSMSHealth() {
  return useQuery({
    queryKey: ['sms', 'health'],
    queryFn: smsService.healthCheck,
  });
}
