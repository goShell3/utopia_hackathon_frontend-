// lead.ts

export type LeadSource = 'pms' | 'manual' | 'meta' | 'website';

export type Lead = {
  id: string;
  source: LeadSource;
  name?: string;
  phone?: string;
  email?: string;
  hashedEmail?: string; // for Meta CAPI
  hashedPhone?: string; // for Meta CAPI
  city?: string;
  tags?: string[];
  lastStayDate?: string; // YYYY-MM-DD, optional
  createdAt: string; // ISO date
};

type LeadCapture = {
  id: string;

  campaignAdId: string;
  // which ad generated this lead

  leadId: string;

  source: "meta" | "google" | "website";

  createdAt: string;
};

// Segment definitions
export type SegmentFilter = {
  city?: string;
  tags?: string[];
  lastStayDaysAgo?: number; // only works if lead.lastStayDate exists
  source?: LeadSource[];
};

export type Segment = {
  id: string;
  name: string;
  description?: string;
  filters: SegmentFilter;
};

export type Conversion = {
  id: string;

  leadId: string;
  campaignId: string;

  type: "booking" | "inquiry";

  value?: number;

  createdAt: string;
};

// ─── Mock Leads ──────────────────────────────────────────────────────────────
export const leads: Lead[] = [
  {
    id: 'l1',
    source: 'pms',
    name: 'Almaz Tadesse',
    phone: '+251911234567',
    email: 'almaz.tadesse@gmail.com',
    city: 'Addis Ababa',
    tags: ['vip', 'frequent'],
    lastStayDate: '2025-05-10',
    createdAt: '2024-03-15T08:00:00Z',
  },
  {
    id: 'l2',
    source: 'pms',
    name: 'Bereket Haile',
    phone: '+251922345678',
    email: 'bereket.h@outlook.com',
    city: 'Addis Ababa',
    tags: ['corporate'],
    lastStayDate: '2025-04-22',
    createdAt: '2024-06-01T10:30:00Z',
  },
  {
    id: 'l3',
    source: 'meta',
    name: 'Selam Girma',
    phone: '+251933456789',
    city: 'Gondar',
    tags: ['diaspora'],
    lastStayDate: '2025-01-18',
    createdAt: '2025-01-10T14:00:00Z',
  },
  {
    id: 'l4',
    source: 'meta',
    name: 'Dawit Bekele',
    phone: '+251944567890',
    email: 'dawit.bekele@yahoo.com',
    city: 'Addis Ababa',
    tags: ['diaspora', 'high-value'],
    lastStayDate: '2025-06-01',
    createdAt: '2025-02-20T09:15:00Z',
  },
  {
    id: 'l5',
    source: 'website',
    name: 'Hana Mekonnen',
    phone: '+251955678901',
    email: 'hana.m@gmail.com',
    city: 'Hawassa',
    tags: ['family'],
    lastStayDate: '2025-03-05',
    createdAt: '2025-01-28T11:45:00Z',
  },
  {
    id: 'l6',
    source: 'pms',
    name: 'Yonas Alemu',
    phone: '+251966789012',
    city: 'Addis Ababa',
    tags: ['vip', 'loyalty'],
    lastStayDate: '2025-05-28',
    createdAt: '2023-11-10T07:30:00Z',
  },
  {
    id: 'l7',
    source: 'manual',
    name: 'Tigist Worku',
    phone: '+251977890123',
    email: 'tigist.worku@hotmail.com',
    city: 'Dire Dawa',
    tags: [],
    createdAt: '2025-04-05T16:00:00Z',
  },
  {
    id: 'l8',
    source: 'meta',
    name: 'Abebe Kebede',
    phone: '+251988901234',
    city: 'Lalibela',
    tags: ['diaspora', 'frequent'],
    lastStayDate: '2025-02-14',
    createdAt: '2025-01-05T13:20:00Z',
  },
  {
    id: 'l9',
    source: 'website',
    name: 'Meron Tesfaye',
    phone: '+251999012345',
    email: 'meron.t@gmail.com',
    city: 'Addis Ababa',
    tags: ['corporate', 'high-value'],
    lastStayDate: '2025-04-30',
    createdAt: '2024-09-18T08:50:00Z',
  },
  {
    id: 'l10',
    source: 'pms',
    name: 'Kidus Hailu',
    phone: '+251900123456',
    city: 'Bahir Dar',
    tags: ['loyalty'],
    lastStayDate: '2024-12-20',
    createdAt: '2024-01-22T10:00:00Z',
  },
];

// Match a lead to a segment
export function matchLeadToSegment(lead: Lead, segment: Segment): boolean {
  const { city, tags, lastStayDaysAgo, source } = segment.filters;

  if (city && lead.city !== city) return false;
  if (tags && (!lead.tags || !tags.every(tag => lead.tags?.includes(tag)))) return false;
  if (source && !source.includes(lead.source)) return false;

  if (lastStayDaysAgo && lead.lastStayDate) {
    const diffDays =
      (new Date().getTime() - new Date(lead.lastStayDate).getTime()) / (1000 * 3600 * 24);
    if (diffDays > lastStayDaysAgo) return false;
  }

  return true;
}