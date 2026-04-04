import type { components, operations } from './api';

// Auth
export type Token = components['schemas']['Token'];
export type UserLogin = components['schemas']['UserLogin'];
export type UserCreate = components['schemas']['UserCreate'];
export type UserResponse = components['schemas']['UserResponse'];
export type Role = components['schemas']['Role'];

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
export type Campaign = components['schemas']['CampaignResponse'];
export type CampaignCreate = components['schemas']['CampaignCreate'];
export type CampaignUpdate = components['schemas']['CampaignUpdate'];
export type CampaignListResponse = components['schemas']['CampaignListResponse'];
export type CampaignStats = components['schemas']['CampaignStatsResponse'];
export type CampaignStatus = components['schemas']['CampaignStatus'];
export type CampaignType = components['schemas']['CampaignType'];
export type TriggerEvent = components['schemas']['TriggerEvent'];
export type MessageChannel = components['schemas']['app__models__campaign__MessageChannel'];
export type AIMessageChannel = components['schemas']['app__schemas__ai__MessageChannel'];

// Templates
export type MessageTemplate = components['schemas']['MessageTemplateResponse'];
export type MessageTemplateCreate = components['schemas']['MessageTemplateCreate'];

// AI
export type AIUsageStats = components['schemas']['AIUsageStats'];
export type MessageGenerationRequest = components['schemas']['MessageGenerationRequest'];
export type MessageGenerationResponse = components['schemas']['MessageGenerationResponse'];
export type MessageVariant = components['schemas']['MessageVariant'];
export type MessageTone = components['schemas']['MessageTone'];
export type BatchMessageRequest = components['schemas']['BatchMessageRequest'];
export type AILeadScoringResponse = components['schemas']['LeadScoringResponse'];
export type CampaignAdvisorRequest = components['schemas']['CampaignAdvisorRequest'];
export type CampaignAdvisorResponse = components['schemas']['CampaignAdvisorResponse'];
export type CampaignRecommendation = components['schemas']['CampaignRecommendation'];
export type LeadEnrichmentResponse = components['schemas']['LeadEnrichmentResponse'];

// SMS
export type SendSMSRequest = components['schemas']['SendSMSRequest'];
export type SMSResponse = components['schemas']['SMSResponse'];
export type SendBulkSMSRequest = components['schemas']['SendBulkSMSRequest'];
export type BulkSMSResponse = components['schemas']['BulkSMSResponse'];
export type SendOTPRequest = components['schemas']['SendOTPRequest'];
export type OTPResponse = components['schemas']['OTPResponse'];
export type VerifyOTPRequest = components['schemas']['VerifyOTPRequest'];
export type OTPVerifyResponse = components['schemas']['OTPVerifyResponse'];

// Query params
export type ListLeadsParams = operations['list_leads_api_v1_leads_get']['parameters']['query'];
export type ListCampaignsParams = operations['list_campaigns_api_v1_campaigns_get']['parameters']['query'];
export type ListTemplatesParams = operations['list_templates_api_v1_templates_get']['parameters']['query'];

// Calendar
export type CalendarEventType = 'campaign' | 'meeting' | 'sms' | 'reminder';
export type CalendarEventCreate = { title: string; date: string; type: CalendarEventType; description?: string | null };
export type CalendarEventResponse = { id: string; hotel_id: string; title: string; date: string; type: CalendarEventType; description?: string | null; created_at: string };
export type CalendarEventListResponse = { items: CalendarEventResponse[]; total: number };
export type ListCalendarEventsParams = { from_date?: string; to_date?: string };

// Shared
export type ValidationError = components['schemas']['ValidationError'];
export type HTTPValidationError = components['schemas']['HTTPValidationError'];
