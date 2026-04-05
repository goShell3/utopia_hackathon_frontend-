import { hospitalityRequest } from './hospitalityClient';
import type { SMSTemplateResponse } from '@/types';

export const smsTemplatesService = {
  createFromExisting: () =>
    hospitalityRequest<SMSTemplateResponse>('/sms-templates/existing', { method: 'POST' }),

  createFromLead: () =>
    hospitalityRequest<SMSTemplateResponse>('/sms-templates/lead', { method: 'POST' }),

  sendBulk: (templateId: string) =>
    hospitalityRequest<unknown>(`/sms-templates/${templateId}/send`, { method: 'POST' }),
};
