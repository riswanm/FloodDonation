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
    description: "Major flooding has devastated communities across Thalduwa and surrounding areas. Nearly 80% of families have been partially or fully affected, with many seeking shelter in public places."
  },
  googleSheets: {
    scriptUrl: "https://script.google.com/macros/s/AKfycbwORZF9BIYLbWgnL2Yr-Zstnh018P_K13kYKWnHZddD2DqlR4ozs5SJHeRA7HawZmxW/exec" // Replace with your deployed script URL
  },
  spamProtection: {
    enabled: true,
    cooldownSeconds: 60, // Time in seconds before allowing another submission from same device
    maxSubmissionsPerSession: 5 // Maximum number of submissions allowed per session (configurable)
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
    title: "Main road with Shops and Houses under water",
    imageUrl: "assets/images/effect/townwithwater.jpeg"
  },
  {
    id: 2,
    title: "Entrance to higly residentail area under water in the Village",
    imageUrl: "assets/images/effect/townwithwater2.jpeg"
  },
  {
    id: 3,
    title: "Entrace to Mosque Under drawned",
    imageUrl: "assets/images/effect/mosqueroad.jpeg"
  },
  {
    id: 4,
    title: "More houses under water people waiting for support",
    imageUrl: "assets/images/effect/housesdrowned.jpeg"
  },
  {
    id: 5,
    title: "Entrance to higly residentail area under water in the Village",
    imageUrl: "assets/images/effect/townwithwater.jpeg"
  }
];

const reliefWork = [
  {
    id: 2,
    title: "Preparing food for the lunch",
    imageUrl: "assets/images/support/foodmaking.jpeg",
    date: "November 28, 2025"
  },
  {
    id: 3,
    title: "Food pack to be Distributed for Dinner",
    imageUrl: "assets/images/support/foodpack.jpeg",
    date: "November 28, 2025"
  },
  {
    id: 4,
    title: "Distributing food pack in a Boat",
    imageUrl: "assets/images/support/DistributingFood.jpeg",
    date: "November 29, 2025"
  },
   {
    id: 1,
    title: "Prapring a boat fro resue and support operation",
    imageUrl: "assets/images/support/boat.jpeg",
    date: "November 29, 2025"
  },
 
];

const fundUsage = [
  "Daily meals for all affected families",
  "Purchasing new clothing and essentials",
  "Sanitary supplies and hygiene products",
  "Dry food packages and provisions",
  "Repairing and rebuilding damaged houses",
  "Supporting all communities regardless of religion or ethnicity"
];
