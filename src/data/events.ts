export type EventCategory =
  | 'religious'
  | 'conference'
  | 'festival'
  | 'diaspora'
  | 'education'
  | 'trade'
  | 'arts'
  | 'sports'
  | 'music';

export const EVENT_CATEGORY_COLORS: Record<EventCategory, string> = {
  religious: '#10b981',
  conference: '#3b82f6',
  festival: '#f59e0b',
  diaspora: '#8b5cf6',
  education: '#06b6d4',
  trade: '#64748b',
  arts: '#ec4899',
  sports: '#f97316',
  music: '#ef4444',
};

export interface EventVenue {
  city: string;
}

export interface EventLocations {
  country: string;
  venues: EventVenue[];
}

export interface StaticEvent {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  category: EventCategory;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  locations: EventLocations;
}

export const events: StaticEvent[] = [
  {
    id: 'evt-001',
    name: 'Addis Ababa Diaspora Tech Summit',
    description: 'Annual gathering of Ethiopian diaspora investors, technologists, and professionals.',
    category: 'diaspora',
    startDate: '2026-06-15',
    endDate: '2026-06-18',
    locations: {
      country: 'Ethiopia',
      venues: [{ city: 'Addis Ababa' }]
    }
  },
  {
    id: 'evt-002',
    name: 'Timkat (Epiphany)',
    description: 'Major Ethiopian Orthodox celebration drawing global tourism.',
    category: 'religious',
    startDate: '2026-01-19',
    endDate: '2026-01-20',
    locations: {
      country: 'Ethiopia',
      venues: [{ city: 'Gondar' }, { city: 'Addis Ababa' }]
    }
  },
  {
    id: 'evt-003',
    name: 'Pan-African Trade Conference',
    description: 'Continental trade negotiations and business expo.',
    category: 'conference',
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    locations: {
      country: 'Ethiopia',
      venues: [{ city: 'Addis Ababa' }]
    }
  },
  {
    id: 'evt-004',
    name: 'Great Ethiopian Run',
    description: 'Mass participation running event in the capital.',
    category: 'sports',
    startDate: '2026-11-20',
    endDate: '2026-11-20',
    locations: {
      country: 'Ethiopia',
      venues: [{ city: 'Addis Ababa' }]
    }
  }
];
