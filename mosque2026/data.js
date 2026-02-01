// ===========================================
// MOSQUE MAINTENANCE FUND - RAMADAN 2026
// Configuration & Dynamic Data
// ===========================================

// Fund Configuration
const CONFIG = {
    totalAmount: 2000000,        // Total required amount in LKR
    sharePrice: 5000,            // Price per share in LKR
    currency: 'LKR',
    currencySymbol: 'Rs.',
    
    // Project Details
    projectTitle: 'Jawhariyya Jumma Masjid Thalduwa – Avissawella',
    projectSubtitle: 'Continuous Charity (Sadaqah Jariyah)',
    mosquePhone: '036 222 2077',
    
    // Contact Information (from flood2025)
    contactWhatsApp: '+94777571876',
    contactEmail: 'mosque@example.com',
    contactPersons: [
        {
            name: "A.L.M. Amanullah",
            role: "President",
            phone: "+94 77 296 0630"
        },
        {
            name: "M.H.M. Fawaz",
            role: "Secretary",
            phone: "+94 77 757 1876"
        }
    ],
    
    // Bank Details for Donation (from flood2025)
    bankDetails: {
        bankName: "People's Bank",
        accountName: 'Al Jawhari Jummah Masjid',
        accountNumber: '0291 0010 0038 726',
        branch: 'Avissawella'
    },
    
    // Google Sheets Integration
    googleSheets: {
        // Replace with your deployed Google Apps Script URL
        scriptUrl: 'https://script.google.com/macros/s/AKfycbyzvp7fc4gkmpxrIpUI5JcrgA7zQ7JV9XIwLeuT4I13JQxZQKw3UrrOo4vLdK5Bm0f1/exec',
        // Sheet names
        bookingsSheet: 'Bookings'
        // Note: Issued shares are now automatically calculated from Bookings sheet - no Config sheet needed!
    }
};

// Calculate total shares
CONFIG.totalShares = CONFIG.totalAmount / CONFIG.sharePrice;

// ===========================================
// SHARES ISSUED
// This value will be dynamically loaded from Google Sheets
// Default value is used until data is fetched
// ===========================================
let SHARES_ISSUED = 0;  // Will be updated from Google Sheets

// ===========================================
// ISLAMIC QUOTES ABOUT CHARITY
// ===========================================
const CHARITY_QUOTES = [
    {
        text: "Whoever builds a mosque for Allah, Allah will build for him a house in Paradise.",
        source: "Prophet Muhammad (ﷺ) - Sahih Bukhari"
    }
];

// ===========================================
// PROJECT DESCRIPTION
// ===========================================
const PROJECT_INFO = {
    description: `Help us renovate and upgrade our beloved mosque facilities in preparation for the blessed month of Ramadan 2026. Your generous contribution will help maintain the house of Allah and provide better amenities for worshippers.`,
    
    objectives: [
        'Prayer hall renovation and carpet replacement',
        'Air conditioning and ventilation installation',
        'General maintenance and repairs'
    ]
};
