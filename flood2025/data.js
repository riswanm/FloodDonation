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
    description: "Major flooding has devastated communities across Thalduwa and surrounding areas. Nearly 90% of families have been partially or fully affected, with many seeking shelter in public places."
  },
  googleSheets: {
    scriptUrl: "https://script.google.com/macros/s/AKfycbwORZF9BIYLbWgnL2Yr-Zstnh018P_K13kYKWnHZddD2DqlR4ozs5SJHeRA7HawZmxW/exec" // Replace with your deployed script URL
  },
  googleDrive: {
    // Shared folder IDs from Google Drive
    // To get folder ID: Open folder in Google Drive, look at URL: https://drive.google.com/drive/folders/FOLDER_ID_HERE
    // Make sure folders are set to "Anyone with the link can view"
    affectedAreasFolderId: "1icxNiiJj7LsnG_-t9OVynb3v6YP8s278", // Add your affected areas folder ID here
    reliefWorkFolderId: "15KLi5KYnDTBVKfnO55UKAggTItcpAQkw", // Add your relief work folder ID here
    apiKey: "AIzaSyBcNQcHzUGXmYtnS36jiMXpMErFWJfp21A" // Add your Google Drive API key here
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
    id: 5,
    title: "Entrance to higly residentail area under water in the Village",
    imageUrl: "assets/images/effect/postflood1.jpeg"
  },
  {
    id: 5,
    title: "Entrance to higly residentail area under water in the Village",
    imageUrl: "assets/images/effect/postflood2.jpeg"
  },
  {
    id: 5,
    title: "Entrance to higly residentail area under water in the Village",
    imageUrl: "assets/images/effect/postflood3.jpeg"
  },
  {
    id: 5,
    title: "Entrance to higly residentail area under water in the Village",
    imageUrl: "assets/images/effect/postflood4.jpeg"
  },
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

// Timeline for flood relief activities
// Each timeline item will load 3 images from the specified Google Drive subfolder
const timeline =  [
  {
    id: 1,
    title: "Devastating Flood Hits Thalduwa",
    date: "November 28, 2025",
    description: "A sudden and severe flood sweeps through Thalduwa, submerging most homes. Families are forced to flee with almost nothing, leaving behind destroyed belongings and damaged houses.",
    driveFolder: "FloodDisaster"
  },
  {
    id: 2,
    title: "Emergency Boat Rescue and Volunteer Response",
    date: "November 28, 2025",
    description: "Local volunteers courageously launch rescue missions using boats, saving stranded families and securing whatever belongings they can from rising waters.",
    driveFolder: "RescueOperations"
  },
  {
    id: 3,
    title: "Community Kitchen Begins Serving Flood Victims",
    date: "November 29, 2025",
    description: "With the help of villagers, a large community kitchen is set up at the mosque, providing warm meals three times a day to affected families who have lost access to cooking facilities.",
    driveFolder: "CommunityKitchen"
  },
  {
    id: 31,
    title: "Mosque Launches Donation Campaign",
    date: "November 30, 2025",
    description: "A heartfelt donation campaign is initiated to gather essential items for flood-affected families, reflecting the unity and compassion of the community.",
    driveFolder: "DonationCompaign"
  },
  {
    id: 32,
    title: "Distribution of Meals and Essential Supplies",
    date: "December 01, 2025",
    description: "Volunteers begin distributing cooked meals and essential relief items to families who have lost access to basic necessities.",
    driveFolder: "DistributionMeals"
  },
  {
    id: 33,
    title: "Volunteers Visit Affected Homes",
    date: "December 01, 2025",
    description: "Teams of volunteers visit damaged homes to understand the suffering of families, offer emotional support, and document the losses.",
    driveFolder: "HomeVisit"
  },
  {
    id: 4,
    title: "Free Medical Camp Held for Flood Victims",
    date: "December 2, 2025",
    description: "A medical camp provides urgent healthcare, treating injuries, infections, and stress-related conditions among affected people.",
    driveFolder: "MedicalCamp"
  },
  {
    id: 41,
    title: "Dry Ration Packs and Mattresses Distributed",
    date: "December 2, 2025",
    description: "Families receive dry food packs and mattresses to ease their immediate hardships and help them rebuild their daily life.",
    driveFolder: "DryPackDist"
  },
  {
    id: 42,
    title: "Clothing Distributed to Flood-Affected Families",
    date: "December 3, 2025",
    description: "New clothes and dresses are distributed, bringing comfort and dignity to people who lost almost everything in the floods.",
    driveFolder: "CLothDistribution"
  },
  {
    id: 43,
    title: "Housing Damage Data Collection Begins",
    date: "December 3, 2025",
    description: "Volunteers start a systematic data collection project, documenting every affected home to ensure fair and organized relief support.",
    driveFolder: "DataCollection"
  },
  {
    id: 5,
    title: "Volunteer House Cleaning Initiative",
    date: "December 4, 2025",
    description: "Volunteers from surrounding areas join hands to clean mud-filled homes, helping families return to a sense of normalcy.",
    driveFolder: "HouseCLeaning"
  },
  {
    id: 51,
    title: "Counselling Support for Affected Families",
    date: "December 6, 2025",
    description: "A counselling program is launched to provide emotional support over the phone, helping victims cope with trauma and stress.",
    driveFolder: "Counselling"
  },
  {
  id: 52,
  title: "Data Collection for Affected Shops Begins",
  date: "December 6, 2025",
  description: "Volunteers begin documenting damage to shops and small businesses, ensuring that every affected shop owner’s losses are recorded so relief and support can reach them quickly.",
  driveFolder: "ShopsDataCollect"
},
{
  id: 53,
  title: "Volunteer Support to Repair Electrical and Wiring Damages",
  date: "December 6, 2025",
  description: "Dedicated volunteers step in to repair damaged electrical systems and wiring in affected homes, helping families restore safety and stability after the floods.",
  driveFolder: "ElectricSupport"
}



];

 

