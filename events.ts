export const events = [
  {
    id: "timkat-addis",
    name: "Timkat (Epiphany)",
    type: "demand_driver",
    category: "religious",

    startDate: "2026-01-19",
    endDate: "2026-01-20",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      cities: ["Addis Ababa", "Gondar", "Lalibela"]
    },

    demandImpact: {
      level: "extreme",
      travelerType: ["local", "international"]
    },

    leadTimeDays: 30,

    tags: ["orthodox", "festival", "pilgrimage"],

    description: "Major Orthodox celebration attracting large domestic and international visitors.",

    hotelStrategy: {
      campaignType: ["package", "event-based"],
      suggestedAudience: ["tourists", "diaspora"]
    }
  },

  {
    id: "meskel-addis",
    name: "Meskel",
    type: "demand_driver",
    category: "religious",

    startDate: "2026-09-27",
    endDate: "2026-09-28",
    recurrence: "yearly",

    locations: {
      country: "Ethiopia",
      cities: ["Addis Ababa"]
    },

    demandImpact: {
      level: "high",
      travelerType: ["local", "diaspora"]
    },

    leadTimeDays: 21,

    tags: ["orthodox", "bonfire"],

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
      cities: ["Addis Ababa", "Dire Dawa", "Harar"]
    },

    demandImpact: {
      level: "high",
      travelerType: ["local"]
    },

    leadTimeDays: 14,

    tags: ["muslim", "holiday"],

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
      cities: ["Addis Ababa"]
    },

    demandImpact: {
      level: "extreme",
      travelerType: ["international", "business"]
    },

    leadTimeDays: 45,

    tags: ["diplomatic", "government"],

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
      cities: ["Bishoftu", "Addis Ababa"]
    },

    demandImpact: {
      level: "extreme",
      travelerType: ["local"]
    },

    leadTimeDays: 30,

    tags: ["oromo", "culture"],

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
      cities: ["Addis Ababa"]
    },

    demandImpact: {
      level: "high",
      travelerType: ["diaspora", "local"]
    },

    leadTimeDays: 25,

    tags: ["holiday", "seasonal"],

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
      cities: ["Addis Ababa", "Bahir Dar"]
    },

    demandImpact: {
      level: "high",
      travelerType: ["diaspora"]
    },

    leadTimeDays: 60,

    tags: ["seasonal"],

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
      cities: ["Addis Ababa", "Hawassa", "Mekelle"]
    },

    demandImpact: {
      level: "medium",
      travelerType: ["local"]
    },

    leadTimeDays: 14,

    tags: ["education"],

    hotelStrategy: {
      campaignType: ["discount"],
      suggestedAudience: ["families"]
    }
  }
];