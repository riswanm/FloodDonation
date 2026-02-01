# Google Sheets Integration Setup

This guide explains how to set up Google Sheets integration for the Mosque Maintenance Fund website.

## Features
- **Save booking requests** - When users submit the booking form, their details are saved to Google Sheets
- **Dynamic issued shares** - The number of issued shares is read from Google Sheets automatically

## Setup Instructions

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Mosque Maintenance Fund 2026"
3. The main sheet should be named `Bookings` (for storing booking requests)

### Step 2: Setup the Bookings Sheet

In the `Bookings` sheet, add these column headers in Row 1:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Timestamp | Name | Phone | Shares | Total Amount | Starting Share | Status |

**Important:** The "Shares" column (D) is used to automatically calculate the total issued shares. Make sure all your existing bookings have the number of shares in this column.

### Step 3: Create the Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste the following:

```javascript
// Google Apps Script for Mosque Maintenance Fund

// Configuration
const BOOKINGS_SHEET = 'Bookings';

/**
 * Handle HTTP GET requests
 */
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getIssuedShares') {
    return getIssuedShares();
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: 'Unknown action'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle HTTP POST requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'addBooking') {
      return addBooking(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get the number of issued shares by summing from Bookings sheet
 * Automatically calculated from all bookings - no manual update needed!
 */
function getIssuedShares() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const bookingsSheet = ss.getSheetByName(BOOKINGS_SHEET);
  
  if (!bookingsSheet) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Bookings sheet not found'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Get all data from the Shares column (Column D, index 4)
  const lastRow = bookingsSheet.getLastRow();
  
  // If only header row or empty, return 0
  if (lastRow <= 1) {
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      issuedShares: 0
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Get shares column data (D2:D) - skip header row
  const sharesRange = bookingsSheet.getRange(2, 4, lastRow - 1, 1);
  const sharesValues = sharesRange.getValues();
  
  // Sum all shares
  let totalShares = 0;
  for (let i = 0; i < sharesValues.length; i++) {
    const value = sharesValues[i][0];
    if (typeof value === 'number') {
      totalShares += value;
    } else if (typeof value === 'string' && value.trim() !== '') {
      totalShares += parseInt(value) || 0;
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    issuedShares: totalShares
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Add a new booking to the Bookings sheet
 */
function addBooking(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const bookingsSheet = ss.getSheetByName(BOOKINGS_SHEET);
  
  if (!bookingsSheet) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Bookings sheet not found'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Add new row with booking data
  bookingsSheet.appendRow([
    new Date().toLocaleString('en-GB', { timeZone: 'Asia/Colombo' }), // Timestamp
    data.donorName || '',
    data.donorPhone || '',
    data.numShares || 0,
    data.totalAmount || 0,
    data.startingShare || '',
    'Pending' // Status
  ]);
  
  // Send email notification (optional)
  try {
    sendNotificationEmail(data);
  } catch (e) {
    console.log('Email notification failed:', e);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Booking added successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Send email notification for new booking (optional)
 */
function sendNotificationEmail(data) {
  const recipientEmail = Session.getActiveUser().getEmail();
  const subject = `New Share Booking: ${data.donorName}`;
  const body = `
New booking request received:

Name: ${data.donorName}
Phone: ${data.donorPhone}
Shares: ${data.numShares}
Total Amount: Rs. ${data.totalAmount.toLocaleString()}

Please contact the donor to arrange payment.
  `;
  
  MailApp.sendEmail(recipientEmail, subject, body);
}
```

3. Click **Save** (Ctrl+S or ⌘+S)
4. Name the project "MosqueFundScript"

### Step 4: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in the settings:
   - **Description:** "Mosque Fund API v1"
   - **Execute as:** "Me"
   - **Who has access:** "Anyone"
4. Click **Deploy**
5. **Important:** Copy the Web app URL that appears

### Step 5: Authorize the Script

1. When deploying, you'll be asked to authorize the script
2. Click "Authorize access"
3. Choose your Google account
4. Click "Advanced" → "Go to MosqueFundScript (unsafe)"
5. Click "Allow"

### Step 6: Update Your Website Configuration

1. Open `data.js` in your website files
2. Find the `googleSheets` configuration section
3. Paste your Web app URL:

```javascript
googleSheets: {
    scriptUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    bookingsSheet: 'Bookings'
}
```

## How Issued Shares Are Calculated

The website **automatically calculates** the number of issued shares by summing the "Shares" column (Column D) from the Bookings sheet. 

**This means:**
- ✅ No manual updating required!
- ✅ When someone books new shares, the count updates automatically
- ✅ All existing bookings in your sheet are counted
- ✅ The Config sheet is no longer needed

**To adjust shares:**
- Simply add, edit, or remove rows in the Bookings sheet
- The website will reflect the changes on next page load

## Viewing Bookings

All booking requests will appear in the `Bookings` sheet with:
- Timestamp of when the request was made
- Donor's name and phone number
- Number of shares requested
- Total amount
- Status (initially "Pending")

You can update the **Status** column to track:
- Pending
- Contacted
- Payment Received
- Confirmed

## Troubleshooting

### "Script URL not working"
- Make sure you deployed as a Web app (not just saved)
- Ensure "Who has access" is set to "Anyone"
- Try redeploying with a new version

### "Bookings not appearing"
- Check that sheet names match exactly: `Bookings` and `Config`
- Verify the script has been authorized properly
- Check the Apps Script execution logs for errors

### "Issued shares not updating"
- Ensure the `Bookings` sheet exists with column headers
- Make sure the "Shares" column (D) contains numbers, not text
- Verify all existing bookings have share counts in column D
- Clear browser cache and refresh
- Check if cell format is "Number" not "Text"

## Security Notes

- The booking form only collects name, phone, and share count
- No sensitive payment information is collected through the form
- All actual payments should be verified separately
- Consider adding CAPTCHA if you experience spam submissions
