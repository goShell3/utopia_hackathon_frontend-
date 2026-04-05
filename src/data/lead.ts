// lead.ts

export type LeadSource = 'pms' | 'manual' | 'meta' | 'website';

export type Lead = {
  id: string;
  source: LeadSource;
  name?: string;
  phone?: string;
  email?: string;
  hashedEmail?: string;
  hashedPhone?: string;
  city?: string;
  tags?: string[];
  lastStayDate?: string;
  createdAt: string;
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
  lastStayDaysAgo?: number;
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

// ----------------------
// Dummy Lead Data
// ----------------------

export type DummyLead = {
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
  conversion_score?: number | null;
  conversion_probability?: number | null;
  quality_score?: number | null;
  is_duplicate?: boolean;
  created_at?: string;
  score?: number | null;
};

export const DUMMY_LEADS: Record<string, DummyLead> = {
  '1': {
    id: '1', first_name: 'Abebe', last_name: 'Girma',
    phone: '+251911234567', email: 'abebe.girma@email.com',
    country: 'Ethiopia', source: 'pms', segment: 'hot',
    consent_status: 'opted_in', language: 'am',
    total_bookings: 7, total_revenue: 42000,
    last_booking_date: '2024-11-15', last_contact_date: '2024-12-01',
    conversion_score: 87, conversion_probability: 0.82, quality_score: 91,
    is_duplicate: false, created_at: '2024-01-10', score: 87,
  },
  '2': {
    id: '2', first_name: 'Sara', last_name: 'Tadesse',
    phone: '+251922345678', email: 'sara.t@gmail.com',
    country: 'Ethiopia', source: 'meta_ads', segment: 'warm',
    consent_status: 'opted_in', language: 'en',
    total_bookings: 2, total_revenue: 8500,
    last_booking_date: '2024-09-20', last_contact_date: '2024-10-05',
    conversion_score: 61, conversion_probability: 0.55, quality_score: 70,
    is_duplicate: false, created_at: '2024-03-22', score: 61,
  },
  '3': {
    id: '3', first_name: 'Dawit', last_name: 'Bekele',
    phone: '+251933456789', email: null,
    country: 'Ethiopia', source: 'manual', segment: 'cold',
    consent_status: 'pending', language: 'en',
    total_bookings: 1, total_revenue: 3200,
    last_booking_date: '2024-05-10', last_contact_date: null,
    conversion_score: 34, conversion_probability: 0.28, quality_score: 45,
    is_duplicate: false, created_at: '2024-06-01', score: 34,
  },
  '4': {
    id: '4', first_name: 'Hana', last_name: 'Mulugeta',
    phone: '+251944567890', email: 'hana.m@outlook.com',
    country: 'Ethiopia', source: 'website', segment: 'hot',
    consent_status: 'opted_in', language: 'en',
    total_bookings: 5, total_revenue: 31000,
    last_booking_date: '2024-12-01', last_contact_date: '2024-12-10',
    conversion_score: 79, conversion_probability: 0.74, quality_score: 83,
    is_duplicate: false, created_at: '2023-11-15', score: 79,
  },
  '5': {
    id: '5', first_name: 'Yonas', last_name: 'Haile',
    phone: '+251955678901', email: 'yonas.h@yahoo.com',
    country: 'Ethiopia', source: 'pms', segment: 'unqualified',
    consent_status: 'opted_out', language: 'am',
    total_bookings: 0, total_revenue: 0,
    last_booking_date: null, last_contact_date: null,
    conversion_score: 12, conversion_probability: 0.08, quality_score: 20,
    is_duplicate: true, created_at: '2024-08-30', score: 12,
  },
};