export type EventCategory = "religious" | "conference" | "festival" | "diaspora" | "education" | "trade" | "arts" | "sports" | "music";

export const EVENT_CATEGORY_COLORS: Record<EventCategory, string> = {
  religious:  "#7C3AED", // violet
  conference: "#2563EB", // blue
  festival:   "#D97706", // amber
  diaspora:   "#059669", // emerald
  education:  "#DC2626", // red
  trade:      "#0891B2", // cyan
  arts:       "#DB2777", // pink
  sports:     "#16A34A", // green
  music:      "#9333EA", // purple
};

type TravelerType = "local" | "international" | "diaspora" | "business";

type CampaignType =
  | "discount"
  | "package"
  | "event-based"
  | "corporate"
  | "long-stay";

export type EventType = {
  id: string;
  slug: string;

  name: string;
  category: EventCategory;

  startDate: string;
  endDate: string;
  recurrence: "yearly" | "variable";

  locations: {
    country: string;
    venues: {
      name: string;
      city: string;
      lat: number;
      lng: number;
      capacity: number;
      importance?: "primary" | "secondary";
    }[];
  };

  demandImpact: {
    level: "extreme" | "high" | "medium" | "low";
    travelerType: TravelerType[];
  };

  leadTimeDays: number;

  impactRadiusKm?: number;
  timezone?: string;

  description?: string;

  hotelStrategy: {
    campaignType: CampaignType[];
    suggestedAudience: string[];
  };
};

export const events: EventType[] = [
  {
    id: "timkat",
    slug: "timkat",
    name: "Timkat (Epiphany)",
    category: "religious",

    startDate: "2026-01-19",
    endDate: "2026-01-20",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Fasilides Bath",
          city: "Gondar",
          lat: 12.6080,
          lng: 37.4680,
          capacity: 200000,
          importance: "primary"
        },
        {
          name: "Jan Meda",
          city: "Addis Ababa",
          lat: 9.05,
          lng: 38.75,
          capacity: 150000,
          importance: "secondary"
        },
        {
          name: "Lalibela Churches",
          city: "Lalibela",
          lat: 12.0317,
          lng: 39.0476,
          capacity: 80000,
          importance: "secondary"
        }
      ]
    },

    demandImpact: {
      level: "extreme",
      travelerType: ["local", "international"]
    },

    leadTimeDays: 30,
    impactRadiusKm: 50,
    timezone: "Africa/Addis_Ababa",

    description: "Major Orthodox celebration attracting large domestic and international visitors.",

    hotelStrategy: {
      campaignType: ["package", "event-based"],
      suggestedAudience: ["tourists", "diaspora"]
    }
  },

  {
    id: "meskel",
    slug: "meskel",
    name: "Meskel",
    category: "religious",

    startDate: "2026-09-27",
    endDate: "2026-09-28",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Meskel Square",
          city: "Addis Ababa",
          lat: 9.0108,
          lng: 38.7613,
          capacity: 300000,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "high",
      travelerType: ["local", "diaspora"]
    },

    leadTimeDays: 21,
    impactRadiusKm: 20,
    timezone: "Africa/Addis_Ababa",

    hotelStrategy: {
      campaignType: ["event-based"],
      suggestedAudience: ["local travelers", "diaspora"]
    }
  },

  {
    id: "eid-al-fitr",
    slug: "eid-al-fitr",
    name: "Eid al-Fitr",
    category: "religious",

    startDate: "2026-03-20",
    endDate: "2026-03-21",
    recurrence: "variable",

    locations: {
      country: "Ethiopia",
      venues: []
    },

    demandImpact: {
      level: "high",
      travelerType: ["local"]
    },

    leadTimeDays: 14,
    timezone: "Africa/Addis_Ababa",

    hotelStrategy: {
      campaignType: ["discount", "package"],
      suggestedAudience: ["families"]
    }
  },

  {
    id: "au-summit",
    slug: "au-summit",
    name: "African Union Summit",
    category: "conference",

    startDate: "2026-02-10",
    endDate: "2026-02-17",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "African Union Headquarters",
          city: "Addis Ababa",
          lat: 9.0127,
          lng: 38.7578,
          capacity: 5000,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "extreme",
      travelerType: ["international", "business"]
    },

    leadTimeDays: 45,
    impactRadiusKm: 10,
    timezone: "Africa/Addis_Ababa",

    hotelStrategy: {
      campaignType: ["corporate", "package"],
      suggestedAudience: ["NGOs", "delegates", "business travelers"]
    }
  },

  {
    id: "irreecha",
    slug: "irreecha",
    name: "Irreecha Festival",
    category: "festival",

    startDate: "2026-10-04",
    endDate: "2026-10-05",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Hora Arsadi",
          city: "Bishoftu",
          lat: 8.7520,
          lng: 38.9780,
          capacity: 500000,
          importance: "primary"
        },
        {
          name: "Addis Ababa Celebration Area",
          city: "Addis Ababa",
          lat: 8.9806,
          lng: 38.7578,
          capacity: 100000,
          importance: "secondary"
        }
      ]
    },

    demandImpact: {
      level: "extreme",
      travelerType: ["local"]
    },

    leadTimeDays: 30,
    impactRadiusKm: 60,
    timezone: "Africa/Addis_Ababa",

    hotelStrategy: {
      campaignType: ["event-based"],
      suggestedAudience: ["local travelers"]
    }
  },

  {
    id: "new-year",
    slug: "enkutatash",
    name: "Ethiopian New Year (Enkutatash)",
    category: "diaspora",

    startDate: "2026-09-11",
    endDate: "2026-09-12",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: []
    },

    demandImpact: {
      level: "high",
      travelerType: ["diaspora", "local"]
    },

    leadTimeDays: 25,
    timezone: "Africa/Addis_Ababa",

    hotelStrategy: {
      campaignType: ["package", "discount"],
      suggestedAudience: ["diaspora"]
    }
  },

  {
    id: "summer-diaspora",
    slug: "summer-diaspora",
    name: "Diaspora Summer Season",
    category: "diaspora",

    startDate: "2026-06-01",
    endDate: "2026-09-01",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: []
    },

    demandImpact: {
      level: "high",
      travelerType: ["diaspora"]
    },

    leadTimeDays: 60,
    timezone: "Africa/Addis_Ababa",

    hotelStrategy: {
      campaignType: ["long-stay", "package"],
      suggestedAudience: ["diaspora families"]
    }
  },

  {
    id: "graduation-season",
    slug: "graduation-season",
    name: "University Graduation Season",
    category: "education",

    startDate: "2026-07-01",
    endDate: "2026-07-31",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Addis Ababa University",
          city: "Addis Ababa",
          lat: 9.035,
          lng: 38.757,
          capacity: 20000,
          importance: "primary"
        },
        {
          name: "Hawassa University",
          city: "Hawassa",
          lat: 7.0621,
          lng: 38.4764,
          capacity: 15000,
          importance: "secondary"
        },
        {
          name: "Mekelle University",
          city: "Mekelle",
          lat: 13.4967,
          lng: 39.4762,
          capacity: 15000,
          importance: "secondary"
        }
      ]
    },

    demandImpact: {
      level: "medium",
      travelerType: ["local"]
    },

    leadTimeDays: 14,
    timezone: "Africa/Addis_Ababa",

    hotelStrategy: {
      campaignType: ["discount"],
      suggestedAudience: ["families"]
    }
  },

  {
    id: "siklet",
    slug: "siklet",
    name: "Ethiopian Good Friday (Siklet)",
    category: "religious",

    startDate: "2026-04-10",
    endDate: "2026-04-10",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Holy Trinity Cathedral",
          city: "Addis Ababa",
          lat: 9.0227,
          lng: 38.7614,
          capacity: 50000,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "medium",
      travelerType: ["local", "diaspora"]
    },

    leadTimeDays: 14,
    impactRadiusKm: 15,
    timezone: "Africa/Addis_Ababa",

    description: "A day of deep spiritual reflection with special church services, most notably at the Holy Trinity Cathedral.",

    hotelStrategy: {
      campaignType: ["event-based"],
      suggestedAudience: ["local travelers", "diaspora"]
    }
  },

  {
    id: "fasika",
    slug: "fasika",
    name: "Fasika (Ethiopian Easter)",
    category: "religious",

    startDate: "2026-04-12",
    endDate: "2026-04-12",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Holy Trinity Cathedral",
          city: "Addis Ababa",
          lat: 9.0227,
          lng: 38.7614,
          capacity: 80000,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "extreme",
      travelerType: ["local", "diaspora", "international"]
    },

    leadTimeDays: 21,
    impactRadiusKm: 30,
    timezone: "Africa/Addis_Ababa",

    description: "One of the most significant holidays in Ethiopia — midnight candlelight processions and the breaking of the 55-day fast with traditional feasts.",

    hotelStrategy: {
      campaignType: ["package", "event-based"],
      suggestedAudience: ["diaspora", "tourists", "families"]
    }
  },

  {
    id: "palm-sunday",
    slug: "palm-sunday",
    name: "Palm Sunday Procession",
    category: "religious",

    startDate: "2026-04-05",
    endDate: "2026-04-05",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Holy Trinity Cathedral",
          city: "Addis Ababa",
          lat: 9.0227,
          lng: 38.7614,
          capacity: 40000,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "low",
      travelerType: ["local"]
    },

    leadTimeDays: 7,
    timezone: "Africa/Addis_Ababa",

    description: "Worshippers gather at the Holy Trinity Cathedral with decorated palm leaves to commemorate Jesus Christ's entry into Jerusalem.",

    hotelStrategy: {
      campaignType: ["event-based"],
      suggestedAudience: ["local travelers"]
    }
  },

  {
    id: "acitf",
    slug: "acitf",
    name: "Addis Chamber International Trade Fair (ACITF)",
    category: "trade",

    startDate: "2026-04-23",
    endDate: "2026-04-25",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Addis Ababa Exhibition Center",
          city: "Addis Ababa",
          lat: 9.0192,
          lng: 38.7525,
          capacity: 10000,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "high",
      travelerType: ["international", "business"]
    },

    leadTimeDays: 30,
    impactRadiusKm: 10,
    timezone: "Africa/Addis_Ababa",

    description: "27th edition of the trade fair under the theme 'Sustainable Business, Competitive Ethiopia'.",

    hotelStrategy: {
      campaignType: ["corporate", "package"],
      suggestedAudience: ["business travelers", "delegates"]
    }
  },

  {
    id: "big5-construct",
    slug: "big5-construct",
    name: "Big 5 Construct Ethiopia",
    category: "trade",

    startDate: "2026-04-23",
    endDate: "2026-04-25",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Addis International Convention Center (AICC)",
          city: "Addis Ababa",
          lat: 9.0192,
          lng: 38.7630,
          capacity: 8000,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "high",
      travelerType: ["international", "business"]
    },

    leadTimeDays: 30,
    impactRadiusKm: 10,
    timezone: "Africa/Addis_Ababa",

    description: "Ethiopia's leading construction event featuring over 180 exhibitors from 20+ countries.",

    hotelStrategy: {
      campaignType: ["corporate", "package"],
      suggestedAudience: ["business travelers", "construction industry"]
    }
  },

  {
    id: "eu-ethiopia-forum",
    slug: "eu-ethiopia-forum",
    name: "EU–Ethiopia Business Forum",
    category: "conference",

    startDate: "2026-04-20",
    endDate: "2026-04-22",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Hilton Hotel",
          city: "Addis Ababa",
          lat: 9.0192,
          lng: 38.7614,
          capacity: 2000,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "high",
      travelerType: ["international", "business"]
    },

    leadTimeDays: 30,
    impactRadiusKm: 5,
    timezone: "Africa/Addis_Ababa",

    description: "High-level forum focusing on international cooperation and global gateways between the EU and Ethiopia.",

    hotelStrategy: {
      campaignType: ["corporate", "package"],
      suggestedAudience: ["delegates", "NGOs", "business travelers"]
    }
  },

  {
    id: "big-art-sale",
    slug: "big-art-sale",
    name: "The Big Art Sale",
    category: "arts",

    startDate: "2026-04-04",
    endDate: "2026-04-05",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Hilton Addis Ababa",
          city: "Addis Ababa",
          lat: 9.0192,
          lng: 38.7614,
          capacity: 3000,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "medium",
      travelerType: ["local", "international"]
    },

    leadTimeDays: 14,
    timezone: "Africa/Addis_Ababa",

    description: "Features over 200 artists and thousands of original artworks for sale at the Hilton Addis Ababa.",

    hotelStrategy: {
      campaignType: ["event-based", "package"],
      suggestedAudience: ["tourists", "art collectors"]
    }
  },

  {
    id: "equestrian-french-embassy",
    slug: "equestrian-french-embassy",
    name: "Equestrian Sport & Social Celebration",
    category: "sports",

    startDate: "2026-04-19",
    endDate: "2026-04-19",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "French Embassy",
          city: "Addis Ababa",
          lat: 9.0150,
          lng: 38.7600,
          capacity: 1500,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "low",
      travelerType: ["local", "international"]
    },

    leadTimeDays: 7,
    timezone: "Africa/Addis_Ababa",

    description: "Public event at the French Embassy featuring horse jumping competitions, an elegant hat contest, and food vendors.",

    hotelStrategy: {
      campaignType: ["event-based"],
      suggestedAudience: ["expats", "tourists"]
    }
  },

  {
    id: "made-in-ethiopia-race",
    slug: "made-in-ethiopia-race",
    name: "Made in Ethiopia Race",
    category: "sports",

    startDate: "2026-04-26",
    endDate: "2026-04-26",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "Meskel Square",
          city: "Addis Ababa",
          lat: 9.0108,
          lng: 38.7613,
          capacity: 17000,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "medium",
      travelerType: ["local"]
    },

    leadTimeDays: 14,
    impactRadiusKm: 10,
    timezone: "Africa/Addis_Ababa",

    description: "Large-scale movement at Meskel Square involving over 17,000 runners to celebrate national industry and resilience.",

    hotelStrategy: {
      campaignType: ["event-based", "discount"],
      suggestedAudience: ["local travelers", "sports enthusiasts"]
    }
  },

  {
    id: "strictly-soul-africa-tour",
    slug: "strictly-soul-africa-tour",
    name: "Strictly Soul – Africa Tour",
    category: "music",

    startDate: "2026-04-25",
    endDate: "2026-04-25",
    recurrence: "variable",

    locations: {
      country: "Ethiopia",
      venues: [
        {
          name: "TBA – Addis Ababa Venue",
          city: "Addis Ababa",
          lat: 9.0192,
          lng: 38.7525,
          capacity: 5000,
          importance: "primary"
        }
      ]
    },

    demandImpact: {
      level: "medium",
      travelerType: ["local", "diaspora", "international"]
    },

    leadTimeDays: 14,
    timezone: "Africa/Addis_Ababa",

    description: "Africa's largest R&B party makes its stop in Addis Ababa featuring old-school classics and new hits.",

    hotelStrategy: {
      campaignType: ["event-based", "package"],
      suggestedAudience: ["diaspora", "music fans"]
    }
  }
];