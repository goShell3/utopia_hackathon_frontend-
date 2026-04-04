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
export type MessageChannel = components['schemas']['MessageChannel'];

// Templates
export type MessageTemplate = components['schemas']['MessageTemplateResponse'];
export type MessageTemplateCreate = components['schemas']['MessageTemplateCreate'];

// Query params
export type ListLeadsParams = operations['list_leads_api_v1_leads_get']['parameters']['query'];
export type ListCampaignsParams = operations['list_campaigns_api_v1_campaigns_get']['parameters']['query'];
export type ListTemplatesParams = operations['list_templates_api_v1_templates_get']['parameters']['query'];

// Shared
export type ValidationError = components['schemas']['ValidationError'];
export type HTTPValidationError = components['schemas']['HTTPValidationError'];
