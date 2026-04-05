import type { components, operations } from './api';

// Auth
export type Token = components['schemas']['Token'];
export type UserLogin = components['schemas']['UserLogin'];
export type UserCreate = components['schemas']['UserCreate'];
export type UserResponse = components['schemas']['UserResponse'];

// Leads
export type Lead = components['schemas']['LeadResponse'];
export type LeadCreate = components['schemas']['LeadCreate'];
export type LeadUpdate = components['schemas']['LeadUpdate'];
export type LeadListResponse = components['schemas']['LeadListResponse'];
export type LeadScoreResponse = components['schemas']['LeadScoreResponse'];
export type LeadSegmentUpdate = components['schemas']['LeadSegmentUpdate'];
export type LeadSegment = components['schemas']['LeadSegment'];
export type LeadSource = components['schemas']['LeadSource'];
export type ConsentStatus = components['schemas']['ConsentStatus'];

// Campaigns
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type CampaignType = 'trigger' | 'scheduled' | 'manual';
export type TriggerEvent = 'lead.created' | 'booking.confirmed' | 'checkin' | 'checkout' | 'checkout.completed';
export type MessageChannel = 'sms' | 'email' | 'whatsapp';

export interface Campaign {
  id: string;
  name: string;
  description?: string | null;
  campaign_type: CampaignType;
  status: CampaignStatus;
  channels: string[];
  trigger_event?: TriggerEvent | null;
  schedule_cron?: string | null;
  enable_ab_test: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface CampaignCreate {
  name: string;
  description?: string | null;
  campaign_type: CampaignType;
  channels: string[];
  trigger_event?: TriggerEvent | null;
  schedule_cron?: string | null;
  enable_ab_test?: boolean;
}

export type CampaignUpdate = Partial<CampaignCreate>;

export interface CampaignListResponse {
  items: Campaign[];
  total: number;
  page?: number;
  size?: number;
}

export interface CampaignStats {
  total_sent: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
}

// Templates
export type MessageTemplate = components['schemas']['MessageTemplateResponse'];
export type MessageTemplateCreate = components['schemas']['MessageTemplateCreate'];

// AI
export type MessageTone = 'professional' | 'friendly' | 'casual' | 'urgent';
export type CampaignGoal = 'booking' | 'upsell' | 'loyalty' | 're_engagement' | 'feedback';

export interface MessageVariant {
  text: string;
  tone: MessageTone;
  score?: number;
}

export interface MessageGenerationRequest {
  lead_id: string;
  campaign_goal: CampaignGoal;
  tone: MessageTone;
  channel: string;
  language?: string;
  max_length?: number;
  personalization_data?: Record<string, unknown>;
}

export interface MessageGenerationResponse {
  variants: MessageVariant[];
  model?: string;
  tokens_used?: number;
}

export interface BatchMessageRequest {
  lead_ids: string[];
  campaign_goal: CampaignGoal;
  tone: MessageTone;
  channel: string;
  language?: string;
}

export interface AILeadScoringResponse {
  lead_id: string;
  score: number;
  explanation?: string;
  recommendations?: string[];
}

export interface CampaignAdvisorRequest {
  hotel_id: string;
  context?: Record<string, unknown>;
}

export interface CampaignRecommendation {
  title: string;
  description: string;
  campaign_type: CampaignType;
  goal: CampaignGoal;
}

export interface CampaignAdvisorResponse {
  recommendations: CampaignRecommendation[];
}

export interface LeadEnrichmentResponse {
  lead_id: string;
  predictions?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
}

export interface AIUsageStats {
  total_requests: number;
  tokens_used: number;
  cost_estimate?: number;
}

// SMS
// export type SendSMSRequest = components['schemas']['SendSMSRequest'];
// export type SMSResponse = components['schemas']['SMSResponse'];
// export type SendBulkSMSRequest = components['schemas']['SendBulkSMSRequest'];
// export type BulkSMSResponse = components['schemas']['BulkSMSResponse'];
// export type SendOTPRequest = components['schemas']['SendOTPRequest'];
// export type OTPResponse = components['schemas']['OTPResponse'];
// export type VerifyOTPRequest = components['schemas']['VerifyOTPRequest'];
// export type OTPVerifyResponse = components['schemas']['OTPVerifyResponse'];

// Query params
export type ListLeadsParams = operations['list_leads_api_v1_leads_get']['parameters']['query'];
export type ListCampaignsParams = operations['list_campaigns_api_v1_campaigns_get']['parameters']['query'];
export type ListTemplatesParams = operations['list_templates_api_v1_templates_get']['parameters']['query'];

// Events (AI-powered event discovery)
export type EventResponse = components['schemas']['EventResponse'];
export type AdCampaignResponse = components['schemas']['AdCampaignResponse'];
export type EventSearchRequest = components['schemas']['EventSearchRequest'];

// Shared
export type ValidationError = components['schemas']['ValidationError'];
export type HTTPValidationError = components['schemas']['HTTPValidationError'];
