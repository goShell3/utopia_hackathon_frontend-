import { client } from './client';
import type { MessageTemplate, MessageTemplateCreate, ListTemplatesParams } from '@/types';

export const templatesService = {
  list: (params?: ListTemplatesParams) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return client.get<MessageTemplate[]>(`/templates${query ? `?${query}` : ''}`);
  },

  get: (id: string) => client.get<MessageTemplate>(`/templates/${id}`),

  create: (data: MessageTemplateCreate) =>
    client.post<MessageTemplate>('/templates', data),
};
