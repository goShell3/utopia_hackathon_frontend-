import type { components } from './api';
import type { HospitalityEventSearchRequest } from './hospitalityApi';

export type { HospitalityEventSearchRequest };

// Auth
export type Token = components['schemas']['Token'];
export interface UserLogin { email: string; password: string; }
export interface UserCreate { email: string; password: string; full_name?: string; hotel_id?: string; }
export interface UserResponse { id: string; email: string; full_name?: string; hotel_id?: string; }

// Leads
export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  country?: string | null;
  source: string;
  segment?: string | null;
  consent_status?: string | null;
  language?: string | null;
  total_bookings?: number;
  total_revenue?: number;
  last_booking_date?: string | null;
  last_contact_date?: string | null;
  score?: number | null;
  conversion_score?: number | null;
  conversion_probability?: number | null;
  quality_score?: number | null;
  is_duplicate?: boolean;
  created_at?: string;
}
export interface LeadCreate { first_name: string; last_name: string; phone: string; email?: string | null; country?: string | null; source?: string; segment?: string | null; consent_status?: string | null; }
export type LeadUpdate = Partial<LeadCreate>;
export interface LeadListResponse { items: Lead[]; total: number; pages: number; page: number; }
export interface LeadScoreResponse { lead_id: string; score: number; }
export interface LeadSegmentUpdate { segment: string; }
export type LeadSegment = 'hot' | 'warm' | 'cold' | 'unqualified';
export type LeadSource = 'pms' | 'meta_ads' | 'website' | 'manual' | string;
export type ConsentStatus = 'granted' | 'denied' | 'pending';

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
export interface MessageTemplate { id: string; name: string; content: string; channel: string; created_at: string; }
export interface MessageTemplateCreate { name: string; content: string; channel: string; }

// AI
export type MessageTone = 'professional' | 'friendly' | 'casual' | 'urgent';
export type CampaignGoal = 'booking' | 'upsell' | 'loyalty' | 're_engagement' | 'feedback';

export interface MessageVariant { text: string; tone: MessageTone; score?: number; }

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

export interface AILeadScoringResponse { lead_id: string; score: number; explanation?: string; recommendations?: string[]; }
export interface CampaignAdvisorRequest { hotel_id: string; context?: Record<string, unknown>; }
export interface CampaignRecommendation { title: string; description: string; campaign_type: CampaignType; goal: CampaignGoal; }
export interface CampaignAdvisorResponse { recommendations: CampaignRecommendation[]; }
export interface LeadEnrichmentResponse { lead_id: string; predictions?: Record<string, unknown>; preferences?: Record<string, unknown>; }
export interface AIUsageStats { total_requests: number; tokens_used: number; cost_estimate?: number; }

// Query params
export type ListLeadsParams = { page?: number; page_size?: number; search?: string; segment?: string; source?: string; };
export type ListCampaignsParams = { page?: number; page_size?: number; status?: string; campaign_type?: string; };
export type ListTemplatesParams = { page?: number; page_size?: number; };

// Events & hospitality API (`api.json` / mock) — not all present in generated OpenAPI components

export interface EventResponse {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location_name?: string | null;
  source_url?: string | null;
  created_at: string;
}

export interface AdCampaignResponse {
  id: string;
  event_id?: string;
  headline: string;
  body_text: string;
  generated_image_url?: string | null;
  target_audience?: Record<string, unknown>;
  ai_rationale?: string;
  status: string;
  created_at: string;
}

export interface AdTemplateResponse {
  id: string;
  [key: string]: unknown;
}

/** Older mock shape; prefer `HospitalityEventSearchRequest` from `api.json`. */
export interface LegacyEventSearchRequest {
  query: string;
  location?: string | null;
}

export type EventSearchRequest = HospitalityEventSearchRequest | LegacyEventSearchRequest;

export interface SMSTemplateResponse {
  id: string;
  segment: string;
  message_body: string;
  discount_code: string | null;
  landing_page_url: string | null;
  created_at: string;
}

// Shared
export type ValidationError = components['schemas']['ValidationError'];
export type HTTPValidationError = components['schemas']['HTTPValidationError'];
