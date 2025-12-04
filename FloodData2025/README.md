# Flood Data Dashboard - Setup Guide

## 🚨 Fixing "Forbidden" Error

If you're getting a **403 Forbidden** error, follow these steps:

### Step 1: Make Your Google Sheet Public

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1MaoC1k0J00JJxZYE7Ig_YuD80_XhZypHVbFlEG6H8a0/edit
2. Click the **"Share"** button (top right)
3. Click **"Change to anyone with the link"**
4. Make sure it's set to **"Viewer"** access
5. Click **"Done"**

**⚠️ CRITICAL:** Without this step, the API cannot read your sheet data!

### Step 2: Verify API Key Restrictions

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Find your API key: `AIzaSyC65fJSqgNbMQhKlhtLRGVd89ZmZHVE9xY`
3. Click **"Edit"** (pencil icon)
4. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check **"Google Sheets API"**
   - Save changes
5. Under **"Application restrictions"** (for production):
   - Select **"HTTP referrers (web sites)"**
   - Add your website URL (e.g., `yourdomain.com/*`)
   - For local testing, you can leave this unrestricted

### Step 3: Test the Sheet Access

Open this URL in your browser to test if the sheet is accessible:

```
https://sheets.googleapis.com/v4/spreadsheets/1MaoC1k0J00JJxZYE7Ig_YuD80_XhZypHVbFlEG6H8a0/values/Form%20Responses%201!B2:B10?key=AIzaSyC65fJSqgNbMQhKlhtLRGVd89ZmZHVE9xY
```

**Expected Result:** You should see JSON data with values from your sheet.

**If you see an error:**
- `"PERMISSION_DENIED"` = Sheet is not shared publicly (go back to Step 1)
- `"API_KEY_INVALID"` = API key is wrong or hasn't been created properly
- `"Access_Denied"` = API key restrictions are too strict

---

## 📋 Quick Setup Checklist

- [ ] Google Sheets API is enabled in Google Cloud Console
- [ ] API key is created and copied to `config.js`
- [ ] Sheet ID is correct in `config.js`
- [ ] Sheet is shared as "Anyone with the link can view"
- [ ] API key has Google Sheets API restriction enabled
- [ ] Test URL works in browser

---

## 🔧 Alternative: Use Published CSV (No API Key Needed)

If you continue having issues with the API, you can publish your sheet as CSV:

1. In Google Sheets: **File → Share → Publish to web**
2. Select **"Form Responses 1"** sheet
3. Select **"Comma-separated values (.csv)"**
4. Click **"Publish"**
5. Copy the URL (it will look like: `https://docs.google.com/spreadsheets/d/e/...../pub?output=csv`)

Then I can modify the dashboard to use the CSV endpoint instead, which doesn't require an API key.

---

## 📞 Common Errors

### Error: "The caller does not have permission"
**Solution:** Your sheet is not publicly accessible. Click Share → Change to "Anyone with the link" → Viewer.

### Error: "API key not valid"
**Solution:** 
- Check if Google Sheets API is enabled in your project
- Verify the API key is copied correctly
- Make sure there are no extra spaces

### Error: "Unable to parse range"
**Solution:** Check that your sheet tab name is exactly "Form Responses 1" (check for extra spaces).

### Error: "Requested entity was not found"
**Solution:** The Sheet ID is incorrect. Get it from the URL when viewing your sheet.

---

## 📊 Column Mapping

Your Google Form responses should have these columns:

| Column | Field Name | Used For |
|--------|-----------|----------|
| B | Area | Area-wise breakdown chart |
| G | No of Adults | Statistics & charts |
| H | No of Children | Statistics & charts |
| I | No of Students | Statistics |
| J | Job | Job type distribution chart |
| K | Damages | Top 10 damages chart |

---

## 🧪 Testing

1. Open `index.html` in a web browser
2. Check browser console (F12) for any error messages
3. If you see a 403 error, follow Step 1 above
4. Reload the page after making the sheet public

---

## 📱 Mobile Testing

The dashboard is optimized for mobile. Test on:
- Portrait orientation
- Landscape orientation
- Different screen sizes (phones, tablets)

---

## 🆘 Still Having Issues?

1. Open browser Developer Tools (F12)
2. Go to the "Console" tab
3. Take a screenshot of any error messages
4. Check the "Network" tab to see the exact API request and response
