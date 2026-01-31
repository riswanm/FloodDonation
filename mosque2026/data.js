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
    projectTitle: 'Mosque Maintenance & Facility Upgrade',
    projectSubtitle: 'Ramadan 2026 Fund Collection',
    
    // Contact Information
    contactWhatsApp: '+94XXXXXXXXX',
    contactEmail: 'mosque@example.com',
    
    // Bank Details for Donation
    bankDetails: {
        bankName: 'Bank Name',
        accountName: 'Mosque Fund Account',
        accountNumber: 'XXXX-XXXX-XXXX',
        branch: 'Branch Name'
    }
};

// Calculate total shares
CONFIG.totalShares = CONFIG.totalAmount / CONFIG.sharePrice;

// ===========================================
// SHARES ISSUED
// Simply set the number of shares that have been issued/purchased
// Shares 1 to SHARES_ISSUED are considered as issued
// ===========================================
const SHARES_ISSUED = 103;  // Update this number as shares are purchased

// ===========================================
// ISLAMIC QUOTES ABOUT CHARITY
// ===========================================
const CHARITY_QUOTES = [
    {
        text: "The believer's shade on the Day of Resurrection will be his charity.",
        source: "Prophet Muhammad (ﷺ) - Al-Tirmidhi"
    },
    {
        text: "Charity does not decrease wealth.",
        source: "Prophet Muhammad (ﷺ) - Sahih Muslim"
    },
    {
        text: "The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes; in each spike is a hundred grains.",
        source: "Quran 2:261"
    },
    {
        text: "Whoever builds a mosque for Allah, Allah will build for him a house in Paradise.",
        source: "Prophet Muhammad (ﷺ) - Sahih Bukhari"
    },
    {
        text: "The best of deeds is to bring happiness to a fellow Muslim.",
        source: "Prophet Muhammad (ﷺ)"
    }
];

// ===========================================
// PROJECT DESCRIPTION
// ===========================================
const PROJECT_INFO = {
    description: `Help us renovate and upgrade our beloved mosque facilities in preparation for the blessed month of Ramadan 2026. Your generous contribution will help maintain the house of Allah and provide better amenities for worshippers.`,
    
    objectives: [
        'Prayer hall renovation and carpet replacement',
        'Air conditioning and ventilation upgrade',
        'General maintenance and repairs'
    ]
};
