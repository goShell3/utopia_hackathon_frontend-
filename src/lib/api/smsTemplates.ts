import { client } from './client';
import type { SMSTemplateResponse } from '@/types';

export const smsTemplatesService = {
  createFromExisting: () =>
    client.post<SMSTemplateResponse>('/sms-templates/existing', undefined, { skipPrefix: true }),

  createFromLead: () =>
    client.post<SMSTemplateResponse>('/sms-templates/lead', undefined, { skipPrefix: true }),

  sendBulk: (templateId: string) =>
    client.post<unknown>(`/sms-templates/${templateId}/send`, undefined, { skipPrefix: true }),
};
