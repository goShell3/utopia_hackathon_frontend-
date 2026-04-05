import { useMutation } from '@tanstack/react-query';
import { smsTemplatesService } from '@/lib/api/smsTemplates';

export function useCreateSmsTemplateFromExisting() {
  return useMutation({
    mutationFn: smsTemplatesService.createFromExisting,
  });
}

export function useCreateSmsTemplateFromLead() {
  return useMutation({
    mutationFn: smsTemplatesService.createFromLead,
  });
}

export function useSendBulkSms() {
  return useMutation({
    mutationFn: (templateId: string) => smsTemplatesService.sendBulk(templateId),
  });
}
