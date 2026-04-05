export const events = [
  {
    id: "timkat",
    name: "Timkat (Epiphany)",
    type: "demand_driver",
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
          isPrimary: true
        },
        {
          name: "Jan Meda",
          city: "Addis Ababa",
          lat: 9.05,
          lng: 38.75,
          capacity: 150000
        },
        {
          name: "Lalibela Churches",
          city: "Lalibela",
          lat: 12.0317,
          lng: 39.0476,
          capacity: 80000
        }
      ]
    },

    demandImpact: {
      level: "extreme",
      travelerType: ["local", "international"]
    },

    leadTimeDays: 30,

    description: "Major Orthodox celebration attracting large domestic and international visitors.",

    hotelStrategy: {
      campaignType: ["package", "event-based"],
      suggestedAudience: ["tourists", "diaspora"]
    }
  },

  {
    id: "meskel",
    name: "Meskel",
    type: "demand_driver",
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
          isPrimary: true
        }
      ]
    },

    demandImpact: {
      level: "high",
      travelerType: ["local", "diaspora"]
    },

    leadTimeDays: 21,

    hotelStrategy: {
      campaignType: ["event-based"],
      suggestedAudience: ["local travelers", "diaspora"]
    }
  },

  {
    id: "eid-al-fitr",
    name: "Eid al-Fitr",
    type: "demand_driver",
    category: "religious",

    startDate: "2026-03-20",
    endDate: "2026-03-21",
    recurrence: "variable",

    locations: {
      country: "Ethiopia",
      venues: [] // global event
    },

    demandImpact: {
      level: "high",
      travelerType: ["local"]
    },

    leadTimeDays: 14,

    hotelStrategy: {
      campaignType: ["discount", "package"],
      suggestedAudience: ["families"]
    }
  },

  {
    id: "au-summit",
    name: "African Union Summit",
    type: "demand_driver",
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
          isPrimary: true
        }
      ]
    },

    demandImpact: {
      level: "extreme",
      travelerType: ["international", "business"]
    },

    leadTimeDays: 45,

    hotelStrategy: {
      campaignType: ["corporate", "package"],
      suggestedAudience: ["NGOs", "delegates", "business travelers"]
    }
  },

  {
    id: "irreecha",
    name: "Irreecha Festival",
    type: "demand_driver",
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
          isPrimary: true
        },
        {
          name: "Addis Ababa Celebration Area",
          city: "Addis Ababa",
          lat: 8.9806,
          lng: 38.7578,
          capacity: 100000
        }
      ]
    },

    demandImpact: {
      level: "extreme",
      travelerType: ["local"]
    },

    leadTimeDays: 30,

    hotelStrategy: {
      campaignType: ["event-based"],
      suggestedAudience: ["local travelers"]
    }
  },

  {
    id: "new-year",
    name: "Ethiopian New Year (Enkutatash)",
    type: "demand_driver",
    category: "diaspora",

    startDate: "2026-09-11",
    endDate: "2026-09-12",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [] // nationwide effect
    },

    demandImpact: {
      level: "high",
      travelerType: ["diaspora", "local"]
    },

    leadTimeDays: 25,

    hotelStrategy: {
      campaignType: ["package", "discount"],
      suggestedAudience: ["diaspora"]
    }
  },

  {
    id: "summer-diaspora",
    name: "Diaspora Summer Season",
    type: "demand_driver",
    category: "diaspora",

    startDate: "2026-06-01",
    endDate: "2026-09-01",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      venues: [] // nationwide effect
    },

    demandImpact: {
      level: "high",
      travelerType: ["diaspora"]
    },

    leadTimeDays: 60,

    hotelStrategy: {
      campaignType: ["long-stay", "package"],
      suggestedAudience: ["diaspora families"]
    }
  },

  {
    id: "graduation-season",
    name: "University Graduation Season",
    type: "demand_driver",
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
          isPrimary: true
        },
        {
          name: "Hawassa University",
          city: "Hawassa",
          lat: 7.0621,
          lng: 38.4764,
          capacity: 15000
        },
        {
          name: "Mekelle University",
          city: "Mekelle",
          lat: 13.4967,
          lng: 39.4762,
          capacity: 15000
        }
      ]
    },

    demandImpact: {
      level: "medium",
      travelerType: ["local"]
    },

    leadTimeDays: 14,

    hotelStrategy: {
      campaignType: ["discount"],
      suggestedAudience: ["families"]
    }
  }
];