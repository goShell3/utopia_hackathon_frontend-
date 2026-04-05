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