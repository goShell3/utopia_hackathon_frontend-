// segment.ts

export type SegmentFilter = {
  city?: string;              // target specific city
  tags?: string[];            // VIP, frequent, diaspora, etc.
  lastStayDaysAgo?: number;   // for PMS leads, e.g., stayed in last X days
  source?: ("pms" | "meta" | "website")[];  // lead origin
};

export type Segment = {
  id: string;
  name: string;
  description?: string;
  filters: SegmentFilter;
};

// Example hardcoded segments
export const segments: Segment[] = [
  {
    id: "segment-001",
    name: "Addis VIP Leads",
    description: "Leads from Addis Ababa with VIP tag",
    filters: {
      city: "Addis Ababa",
      tags: ["VIP"]
    }
  },
  {
    id: "segment-002",
    name: "Recent PMS Leads",
    description: "Leads from PMS who stayed in last 90 days",
    filters: {
      source: ["pms"],
      lastStayDaysAgo: 90
    }
  },
  {
    id: "segment-003",
    name: "Meta Ad Captured Leads",
    description: "Leads captured via Meta ads",
    filters: {
      source: ["meta"]
    }
  }
];