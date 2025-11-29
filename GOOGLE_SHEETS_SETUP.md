# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration to automatically save donation data.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Flood Relief Donations 2025"
4. In the first row, add these column headers:
   - A1: `Name`
   - B1: `Phone`
   - C1: `Amount (LKR)`
   - D1: `Date`
   - E1: `Time`
   - F1: `Timestamp`

## Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Paste the following code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Prepare row data
    var rowData = [
      data.name,
      data.phone,
      data.amount,
      data.date,
      data.time,
      data.timestamp
    ];
    
    // Append data to sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy the Script

1. Click the **Deploy** button (top right)
2. Select **New deployment**
3. Click the gear icon ⚙️ next to "Select type"
4. Choose **Web app**
5. Configure the deployment:
   - **Description**: "Flood Donation Data Collector"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
6. Click **Deploy**
7. **Important**: Copy the **Web app URL** that appears (it will look like: `https://script.google.com/macros/s/XXXXX/exec`)
8. Click **Done**

## Step 4: Update Your Website

1. Open `data.js` in your project
2. Find the line with `scriptUrl: "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"`
3. Replace it with your copied Web app URL:

```javascript
googleSheets: {
  scriptUrl: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
}
```

4. Save the file

## Step 5: Test the Integration

1. Open your website
2. Fill out the donation form
3. Submit it
4. Check your Google Sheet - a new row should appear with the donation data
5. Check the browser console (F12) - you should see: "Donation data sent to Google Sheets successfully"

## Troubleshooting

### Data not appearing in Google Sheet?

1. **Check the script URL**: Make sure you copied the entire URL correctly
2. **Check permissions**: The script must be deployed as "Anyone" can access
3. **Redeploy**: If you made changes to the script, create a new deployment
4. **Check browser console**: Look for any error messages

### Script permissions error?

1. When you first deploy, Google will ask you to authorize the script
2. Click "Review permissions"
3. Choose your Google account
4. Click "Advanced" > "Go to [Project name] (unsafe)"
5. Click "Allow"

### Still not working?

1. Open the Google Apps Script editor
2. Click **View** > **Logs** to see execution logs
3. Check for any error messages

## Data Format

Each donation will create a new row with:
- **Name**: Donor's name
- **Phone**: Donor's phone number
- **Amount (LKR)**: Donation amount
- **Date**: Date of donation (MM/DD/YYYY)
- **Time**: Time of donation (HH:MM:SS AM/PM)
- **Timestamp**: Full ISO timestamp

## Security Note

The script URL is public but can only append data to your sheet. No one can read or modify existing data through this URL. Only you (the sheet owner) can view and manage the data in Google Sheets.

## Optional: Add Data Validation

In your Google Sheet, you can:
1. Format the Amount column as currency (LKR)
2. Add filters to the header row
3. Create charts to visualize donation data
4. Set up email notifications for new donations

---

**That's it!** Your website will now automatically save all donation submissions to Google Sheets.
