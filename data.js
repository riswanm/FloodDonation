// In-memory data store for Sri Lanka Flood Relief 2025
// Managed by Jawhariyya Mosque Thalduwa Avissawella

const siteConfig = {
  organizationName: "Jawhariyya Mosque Thalduwa Avissawella",
  location: "Thalduwa, Avissawella, Sri Lanka",
  bankAccount: {
    accountNumber: "0291 0010 0038 726",
    bankName: "People's Bank",
    accountName: "Al Jawhari Jummah Masjid",
    branch: "Avissawella"
  },
  contactPersons: [
    {
      name: "A.L.M. Amanullah",
      role: "President",
      phone: "+94 77 296 0630"
    },
    {
      name: "M.H.M. Fawaz",
      role: "Secretary",
      phone: "+94 78 757 1876"
    }
  ],
  floodInfo: {
    date: "November 2025",
    impactPercentage: 80,
    description: "Major flooding has devastated communities across Avissawella and surrounding areas. Nearly 80% of families have been partially or fully affected, with many seeking shelter in public places."
  }
};

const donationTiers = [
  { amount: 200000, size: "large", label: "LKR 200,000" },
  { amount: 100000, size: "large", label: "LKR 100,000" },
  { amount: 50000, size: "large", label: "LKR 50,000" },
  { amount: 25000, size: "medium", label: "LKR 25,000" },
  { amount: 10000, size: "medium", label: "LKR 10,000" },
  { amount: 5000, size: "medium", label: "LKR 5,000" }
];

const affectedAreas = [
  {
    id: 1,
    title: "Thalduwa Village Center",
    description: "Residential areas completely submerged. Over 150 families displaced, with homes and belongings severely damaged. Urgent need for shelter and basic necessities.",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80"
  },
  {
    id: 2,
    title: "Avissawella Town Market",
    description: "Main marketplace destroyed by floodwaters. Local businesses and livelihoods lost. Families who depend on daily wages are now without income or food supplies.",
    imageUrl: "https://images.unsplash.com/photo-1594568284297-7c64464062b1?w=800&q=80"
  },
  {
    id: 3,
    title: "Kosgama Housing Area",
    description: "Low-lying residential zone heavily flooded. 200+ houses damaged, personal belongings washed away. Children's education materials and clothing completely lost.",
    imageUrl: "https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=800&q=80"
  },
  {
    id: 4,
    title: "Ranwala Agricultural Lands",
    description: "Paddy fields and farmlands submerged. Farmers have lost their entire harvest and livestock. Food security concerns for the coming months.",
    imageUrl: "https://images.unsplash.com/photo-1623936274547-101c1a82f4c6?w=800&q=80"
  },
  {
    id: 5,
    title: "Puwakpitiya Rural Villages",
    description: "Remote villages cut off from main roads. Families stranded without access to food, clean water, or medical supplies. Elderly and children most vulnerable.",
    imageUrl: "https://images.unsplash.com/photo-1616680214084-22670a617b3c?w=800&q=80"
  },
  {
    id: 6,
    title: "Malwala Settlement",
    description: "Entire community relocated to temporary shelters. Houses destroyed beyond repair. Families living with only the clothes on their backs.",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80"
  }
];

const reliefWork = [
  {
    id: 1,
    title: "Daily Meals Distribution - Day 1",
    description: "Provided hot meals to 500+ displaced families at Thalduwa Community Center. Rice, curry, and clean drinking water distributed three times daily.",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
    date: "November 16, 2025",
    time: "8:00 AM - 8:00 PM"
  },
  {
    id: 2,
    title: "Emergency Shelter Setup",
    description: "Established temporary shelters at Thalduwa Mosque and Government School. Provided bedding, mosquito nets, and basic sanitation facilities for 300 families.",
    imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    date: "November 17, 2025",
    time: "6:00 AM - 6:00 PM"
  },
  {
    id: 3,
    title: "Clothing Distribution Drive",
    description: "Distributed new and gently used clothing to affected families. Over 2,000 clothing items provided including children's wear, adult clothing, and undergarments.",
    imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
    date: "November 19, 2025",
    time: "9:00 AM - 5:00 PM"
  },
  {
    id: 4,
    title: "Sanitary Supplies Distribution",
    description: "Essential sanitary items provided to 400+ families including soap, detergent, toothpaste, sanitary napkins, diapers, and disinfectants.",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    date: "November 21, 2025",
    time: "10:00 AM - 4:00 PM"
  },
  {
    id: 5,
    title: "Dry Food Packages for Families",
    description: "Distributed dry food rations including rice, lentils, flour, sugar, tea, and canned goods. Each family received supplies to last one week.",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80",
    date: "November 23, 2025",
    time: "8:00 AM - 6:00 PM"
  },
  {
    id: 6,
    title: "House Repair Initiative - Phase 1",
    description: "Began repairing 50 partially damaged homes in Thalduwa area. Replacing roofs, fixing walls, and restoring basic electrical and plumbing systems.",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    date: "November 25, 2025",
    time: "7:00 AM - 5:00 PM"
  },
  {
    id: 7,
    title: "Medical Camp & Health Services",
    description: "Free medical camp conducted with volunteer doctors. Provided medicines, first aid, and health checkups for 300+ affected individuals.",
    imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80",
    date: "November 27, 2025",
    time: "9:00 AM - 3:00 PM"
  }
];

const fundUsage = [
  "Daily meals for all affected families",
  "Purchasing new clothing and essentials",
  "Sanitary supplies and hygiene products",
  "Dry food packages and provisions",
  "Repairing and rebuilding damaged houses",
  "Supporting all communities regardless of religion or ethnicity"
];
