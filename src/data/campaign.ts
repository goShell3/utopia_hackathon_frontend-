// campaign.ts

import { Lead, Segment, matchLeadToSegment, leads as ALL_LEADS } from './lead';

// ─── Core types ───────────────────────────────────────────────────────────────

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type CampaignGoal = 'bookings' | 'awareness' | 'lead_generation';
export type CampaignPurpose = 'activation' | 'acquisition' | 'both';

export type CampaignTarget = {
  segmentIds?: string[];
  source?: ('pms' | 'meta' | 'website' | 'manual')[];
};

export type Campaign = {
  id: string;
  name: string;
  goal: CampaignGoal;
  purpose: CampaignPurpose;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  eventId?: string;
  target?: CampaignTarget;       // used when purpose includes activation
  ads: CampaignAd[];
};

// ─── Ads ──────────────────────────────────────────────────────────────────────

export type CampaignAdChannel = 'sms' | 'email' | 'meta' | 'google';
export type CampaignAdStatus = 'draft' | 'running' | 'paused';
export type CampaignAdPurpose = 'activation' | 'acquisition';

export type CampaignAd = {
  id: string;
  campaignId: string;
  purpose: CampaignAdPurpose;
  channel: CampaignAdChannel;
  title?: string;
  message: string;
  status: CampaignAdStatus;
  budget?: number;               // only for meta / google
  leadsCaptured?: number;        // acquisition metric
  sentCount?: number;            // activation metric
};

// ─── Conversions ──────────────────────────────────────────────────────────────

export type Conversion = {
  id: string;
  leadId: string;
  campaignId: string;
  type: 'booking' | 'inquiry';
  value?: number;
  createdAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCampaignLeads(campaign: Campaign, leads: Lead[], segments?: Segment[]): Lead[] {
  if (!campaign.target) return leads;
  return leads.filter(lead => {
    if (campaign.target?.source && !campaign.target.source.includes(lead.source)) return false;
    if (campaign.target?.segmentIds && segments) {
      return campaign.target.segmentIds.some(sid => {
        const seg = segments.find(s => s.id === sid);
        return seg ? matchLeadToSegment(lead, seg) : false;
      });
    }
    return true;
  });
}

// ─── Mock campaigns ───────────────────────────────────────────────────────────

export const CAMPAIGNS: Campaign[] = [
  // Scenario A: SMS only (activation)
  {
    id: '1',
    name: 'Summer Bookings Push',
    goal: 'bookings',
    purpose: 'activation',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'active',
    target: { source: ['pms', 'website'] },
    ads: [
      {
        id: 'a1', campaignId: '1', purpose: 'activation', channel: 'sms',
        message: 'Hi {{name}}, enjoy 20% off your next stay this summer. Book now before it\'s gone!',
        status: 'running', sentCount: 312,
      },
      {
        id: 'a2', campaignId: '1', purpose: 'activation', channel: 'email',
        title: 'Your exclusive summer deal',
        message: 'Dear {{name}}, as a valued guest we\'d like to offer you a special rate this summer season.',
        status: 'draft',
      },
    ],
  },

  // Scenario B: Meta Ads only (acquisition)
  {
    id: '2',
    name: 'Brand Awareness Q3',
    goal: 'awareness',
    purpose: 'acquisition',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    status: 'draft',
    ads: [
      {
        id: 'a3', campaignId: '2', purpose: 'acquisition', channel: 'meta',
        title: 'Discover Utopia Hotel',
        message: 'Experience luxury in the heart of Addis Ababa. Book your stay today.',
        status: 'draft', budget: 800, leadsCaptured: 0,
      },
      {
        id: 'a4', campaignId: '2', purpose: 'acquisition', channel: 'google',
        title: 'Best Hotel in Addis Ababa',
        message: 'Award-winning hospitality. Book direct for the best rates.',
        status: 'draft', budget: 400, leadsCaptured: 0,
      },
    ],
  },

  // Scenario C: Both activation + acquisition
  {
    id: '3',
    name: 'Timkat Gondar Campaign',
    goal: 'bookings',
    purpose: 'both',
    startDate: '2026-01-10',
    endDate: '2026-01-25',
    status: 'active',
    eventId: 'timkat',
    target: { source: ['pms'], segmentIds: ['s1'] },
    ads: [
      {
        id: 'a5', campaignId: '3', purpose: 'activation', channel: 'sms',
        message: 'Hi {{name}}, Timkat is coming! Reserve your room in Gondar now — limited availability.',
        status: 'running', sentCount: 124,
      },
      {
        id: 'a6', campaignId: '3', purpose: 'acquisition', channel: 'meta',
        title: 'Timkat 2026 — Book Your Stay',
        message: 'Join thousands celebrating Timkat in Gondar. Exclusive hotel packages available.',
        status: 'running', budget: 1200, leadsCaptured: 67,
      },
    ],
  },

  // Scenario A: SMS only (paused)
  {
    id: '4',
    name: 'Lead Gen Winter',
    goal: 'lead_generation',
    purpose: 'activation',
    startDate: '2025-11-01',
    endDate: '2026-01-31',
    status: 'paused',
    target: { source: ['pms', 'manual'] },
    ads: [
      {
        id: 'a7', campaignId: '4', purpose: 'activation', channel: 'sms',
        message: 'Hi {{name}}, winter is the perfect time to visit. Special rates available now.',
        status: 'paused', sentCount: 89,
      },
    ],
  },
];
