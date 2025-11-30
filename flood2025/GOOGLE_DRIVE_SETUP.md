# Google Drive Image Loading Setup Guide

This guide will help you set up dynamic image loading from Google Drive folders.

## Step 1: Create and Share Google Drive Folders

1. Go to [Google Drive](https://drive.google.com)
2. Create two folders:
   - `FloodRelief_AffectedAreas` - for affected area images
   - `FloodRelief_ReliefWork` - for relief work images
3. Upload your images to these folders
4. For each folder:
   - Right-click → Share
   - Click "Change to anyone with the link"
   - Set permission to "Viewer"
   - Copy the folder ID from the URL (the part after `/folders/`)
   - Example URL: `https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ`
   - Folder ID would be: `1aBcDeFgHiJkLmNoPqRsTuVwXyZ`

## Step 2: Create Google Drive API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the **Google Drive API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Drive API"
   - Click "Enable"
4. Create API Key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key
   - (Optional but recommended) Click "Restrict Key":
     - Under "API restrictions", select "Restrict key"
     - Choose "Google Drive API"
     - Under "Website restrictions", add your website domain

## Step 3: Update data.js Configuration

Open `data.js` and update the `googleDrive` section:

```javascript
googleDrive: {
  affectedAreasFolderId: "YOUR_AFFECTED_AREAS_FOLDER_ID",
  reliefWorkFolderId: "YOUR_RELIEF_WORK_FOLDER_ID",
  apiKey: "YOUR_GOOGLE_DRIVE_API_KEY"
}
```

## Step 4: Test the Setup

1. Open your website in a browser
2. The images should load automatically from Google Drive
3. As you scroll, more images will load dynamically (lazy loading)
4. Check browser console for any errors

## Image Requirements

- Supported formats: JPG, JPEG, PNG, GIF, WebP
- Recommended size: Less than 5MB per image
- Recommended dimensions: 1920x1080 or smaller
- Images will be automatically resized to fit the card layout

## Troubleshooting

### Images not loading?
1. Check that folders are shared with "Anyone with the link can view"
2. Verify folder IDs are correct
3. Verify API key is valid
4. Check browser console for error messages
5. Make sure Google Drive API is enabled in your project

### Slow loading?
1. Reduce image file sizes
2. Use compressed/optimized images
3. Limit number of images per folder (recommended: 50-100 images)

### API quota exceeded?
- Free tier allows 1,000 requests per day per API key
- If you need more, consider upgrading to paid tier
- Or create multiple API keys and rotate them

## Security Notes

- API key will be visible in browser (this is normal for public websites)
- Restrict API key to only Google Drive API
- Restrict API key to your specific website domain
- Never use an API key with write/delete permissions
- Monitor API usage in Google Cloud Console

## Alternative: If you don't want to use Google Drive API

If you prefer not to use the API, you can:
1. Keep images in the `assets/images` folder
2. The website will continue to work with static images
3. Update images manually by uploading to your hosting
