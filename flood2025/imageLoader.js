// Google Drive Image Loader
// Dynamically loads images from Google Drive folders

class GoogleDriveImageLoader {
    constructor() {
        this.affectedAreasImages = [];
        this.reliefWorkImages = [];
        this.isLoading = false;
        this.affectedAreasPage = 0;
        this.reliefWorkPage = 0;
        this.imagesPerPage = 12;
        this.useGoogleDrive = false;
        
        // Check if Google Drive is configured
        if (siteConfig.googleDrive && 
            siteConfig.googleDrive.apiKey && 
            siteConfig.googleDrive.affectedAreasFolderId && 
            siteConfig.googleDrive.reliefWorkFolderId) {
            this.useGoogleDrive = true;
            this.apiKey = siteConfig.googleDrive.apiKey;
            this.affectedAreasFolderId = siteConfig.googleDrive.affectedAreasFolderId;
            this.reliefWorkFolderId = siteConfig.googleDrive.reliefWorkFolderId;
        }
    }

    async initialize() {
        if (this.useGoogleDrive) {
            console.log('Loading images from Google Drive...');
            await Promise.all([
                this.loadFolderImages(this.affectedAreasFolderId, 'affected'),
                this.loadFolderImages(this.reliefWorkFolderId, 'relief')
            ]);
        } else {
            console.log('Using static images from assets folder');
            // Use static images from data.js
            this.affectedAreasImages = affectedAreas.map(area => ({
                id: area.id,
                title: area.title,
                thumbnailUrl: area.imageUrl,
                fullUrl: area.imageUrl
            }));
            this.reliefWorkImages = reliefWork.map(work => ({
                id: work.id,
                title: work.title,
                thumbnailUrl: work.imageUrl,
                fullUrl: work.imageUrl,
                date: work.date
            }));
        }
    }

    async loadFolderImages(folderId, type) {
        try {
            const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'+and+trashed=false&fields=files(id,name,mimeType,thumbnailLink,webContentLink)&key=${this.apiKey}&pageSize=100`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load images from Google Drive: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.files && data.files.length > 0) {
                const images = data.files.map((file, index) => ({
                    id: file.id,
                    title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                    thumbnailUrl: this.getThumbnailUrl(file.id),
                    fullUrl: this.getFullImageUrl(file.id),
                    mimeType: file.mimeType
                }));
                
                if (type === 'affected') {
                    this.affectedAreasImages = images;
                    console.log(`Loaded ${images.length} affected area images from Google Drive`);
                } else {
                    this.reliefWorkImages = images;
                    console.log(`Loaded ${images.length} relief work images from Google Drive`);
                }
            } else {
                console.warn(`No images found in ${type} folder`);
            }
        } catch (error) {
            console.error(`Error loading images from Google Drive (${type}):`, error);
            // Fallback to static images
            if (type === 'affected') {
                this.affectedAreasImages = affectedAreas.map(area => ({
                    id: area.id,
                    title: area.title,
                    thumbnailUrl: area.imageUrl,
                    fullUrl: area.imageUrl
                }));
            } else {
                this.reliefWorkImages = reliefWork.map(work => ({
                    id: work.id,
                    title: work.title,
                    thumbnailUrl: work.imageUrl,
                    fullUrl: work.imageUrl
                }));
            }
        }
    }

    getThumbnailUrl(fileId) {
        // Use Google Drive thumbnail with 800px width for cards
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    }

    getFullImageUrl(fileId) {
        // Use Google Drive viewer for full-size images
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    getAffectedAreasImages(page = 0) {
        const start = page * this.imagesPerPage;
        const end = start + this.imagesPerPage;
        return this.affectedAreasImages.slice(start, end);
    }

    getReliefWorkImages(page = 0) {
        const start = page * this.imagesPerPage;
        const end = start + this.imagesPerPage;
        return this.reliefWorkImages.slice(start, end);
    }

    hasMoreAffectedAreas() {
        return (this.affectedAreasPage + 1) * this.imagesPerPage < this.affectedAreasImages.length;
    }

    hasMoreReliefWork() {
        return (this.reliefWorkPage + 1) * this.imagesPerPage < this.reliefWorkImages.length;
    }

    loadMoreAffectedAreas() {
        if (this.hasMoreAffectedAreas()) {
            this.affectedAreasPage++;
            return this.getAffectedAreasImages(this.affectedAreasPage);
        }
        return [];
    }

    loadMoreReliefWork() {
        if (this.hasMoreReliefWork()) {
            this.reliefWorkPage++;
            return this.getReliefWorkImages(this.reliefWorkPage);
        }
        return [];
    }

    resetPagination() {
        this.affectedAreasPage = 0;
        this.reliefWorkPage = 0;
    }
}

// Create global instance
const imageLoader = new GoogleDriveImageLoader();
