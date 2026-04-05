// campaign.ts

import { Lead, Segment, matchLeadToSegment } from './lead';

// ----------------------
// Campaign & Ads Core
// ----------------------

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type CampaignGoal = 'bookings' | 'awareness' | 'lead_generation';

export type CampaignTarget = {
  segmentIds?: string[]; // references Segment.id
  source?: ('pms' | 'meta' | 'website')[];
};

export type Campaign = {
  id: string;
  name: string;
  eventId?: string;
  goal: CampaignGoal;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  target?: CampaignTarget;
  // Convenience method to filter leads for this campaign
  filterLeads?: (leads: Lead[], segments?: Segment[]) => Lead[];
};

export type CampaignAdChannel = 'sms' | 'email' | 'meta' | 'google';
export type CampaignAdStatus = 'draft' | 'running' | 'paused';

export type CampaignAd = {
  id: string;
  campaignId: string;
  channel: CampaignAdChannel;
  content: {
    title?: string;
    message?: string;
    imageUrl?: string;
    link?: string;
  };
  status: CampaignAdStatus;
  budget?: number;
};

// ----------------------
// Lead Filtering Utility
// ----------------------

// Example helper to get campaign leads dynamically
export function getCampaignLeads(campaign: Campaign, leads: Lead[], segments?: Segment[]): Lead[] {
  if (!campaign.target) return leads;

  return leads.filter(lead => {
    // Filter by source
    if (campaign.target?.source && !campaign.target.source.includes(lead.source)) return false;

    // Filter by segments
    if (campaign.target?.segmentIds && segments) {
      return campaign.target.segmentIds.some(segmentId => {
        const segment = segments.find(s => s.id === segmentId);
        return segment ? matchLeadToSegment(lead, segment) : false;
      });
    }

    return true;
  });
}

// ----------------------
// Meta Ads Types
// ----------------------

export type MetaCampaignObjective =
  | 'OUTREACH'
  | 'CONVERSIONS'
  | 'TRAFFIC'
  | 'AWARENESS'
  | 'LEAD_GENERATION';

export type MetaCampaignStatus = 'PAUSED' | 'ACTIVE';

export type MetaCampaign = {
  name: string;
  objective: MetaCampaignObjective;
  status: MetaCampaignStatus;
  special_ad_categories: string[];
  buying_type: 'AUCTION' | 'RESERVATION';
  start_time?: string;
  end_time?: string;
};

export type MetaAdSet = {
  campaign_id: string;
  name: string;
  billing_event: 'IMPRESSIONS' | 'LINK_CLICKS';
  optimization_goal: 'REACH' | 'LINK_CLICKS' | 'OFFSITE_CONVERSIONS' | 'LEAD_GENERATION';
  daily_budget?: number;
  bid_amount?: number;
  targeting: MetaTargetingSpec;
  promoted_object?: {
    pixel_id?: string;
    custom_event_type?: string;
  };
  start_time?: string;
  end_time?: string;
  status: 'PAUSED' | 'ACTIVE';
};

export type MetaTargetingSpec = {
  geo_locations: {
    countries?: string[];
    cities?: { key: string; radius: number; distance_unit: 'mile' | 'kilometer' }[];
  };
  age_min?: number;
  age_max?: number;
  publisher_platforms?: ('facebook' | 'instagram' | 'audience_network' | 'messenger')[];
  device_platforms?: ('mobile' | 'desktop')[];
  interests?: { id: string; name: string }[];
  behaviors?: { id: string; name: string }[];
  custom_audiences?: { id: string }[];
};

export type MetaAdCreative = {
  name: string;
  object_story_spec: {
    page_id: string;
    instagram_actor_id?: string;
    link_data?: {
      message: string;
      link: string;
      image_hash: string;
      call_to_action: { type: 'LEARN_MORE' | 'SHOP_NOW' | 'SIGN_UP' | 'BOOK_NOW' };
    };
  };
};