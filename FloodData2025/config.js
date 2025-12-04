// Google Sheets API Configuration
// =================================
// 
// SETUP INSTRUCTIONS:
// 
// 1. Get your Google Sheets API Key:
//    - Go to https://console.cloud.google.com/
//    - Create a new project or select an existing one
//    - Enable "Google Sheets API" for your project
//    - Go to "Credentials" and create an API Key
//    - Restrict the API Key to "Google Sheets API" only
//    - For production, add HTTP referrer restrictions to your domain
//
// 2. Get your Google Sheet ID:
//    - Open your Google Sheet
//    - The Sheet ID is in the URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
//    - Copy the SHEET_ID part
//
// 3. Make your Google Sheet accessible:
//    - Click "Share" button on your Google Sheet
//    - Change access to "Anyone with the link can view"
//    - This allows the API to read the data
//
// 4. Update the values below:
//    - Replace 'YOUR_API_KEY_HERE' with your actual API key
//    - Replace 'YOUR_SHEET_ID_HERE' with your actual Sheet ID
//    - Update SHEET_NAME if your sheet tab has a different name
//
// IMPORTANT: Column Mapping (from your Google Form responses):
// - Column B: Area
// - Column G: No of Adults
// - Column H: No of Children
// - Column I: No of Students ( School, Pre School, University, Other Courses)
// - Column J: Job
// - Column K: Damages

const CONFIG = {
    // Replace with your Google Sheets API Key
    API_KEY: 'AIzaSyC65fJSqgNbMQhKlhtLRGVd89ZmZHVE9xY',
    
    // Replace with your Google Sheet ID
    SHEET_ID: '1MaoC1k0J00JJxZYE7Ig_YuD80_XhZypHVbFlEG6H8a0',
    
    // The name of the sheet tab (usually "Sheet1" or "Form Responses 1")
    SHEET_NAME: 'Form Responses 1',
    
    // Column ranges to fetch (optimized for bandwidth)
    // We only fetch the columns we need: B, G, H, I, J, K
    RANGES: [
        'B:B',  // Area
        'G:G',  // No of Adults
        'H:H',  // No of Children
        'I:I',  // No of Students
        'J:J',  // Job
        'K:K'   // Damages
    ],
    
    // API endpoint builder
    getApiUrl() {
        const ranges = this.RANGES.map(range => 
            `${encodeURIComponent(this.SHEET_NAME)}!${range}`
        ).join('&ranges=');
        
        return `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values:batchGet?ranges=${ranges}&key=${this.API_KEY}`;
    }
};
