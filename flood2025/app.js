// Main Application Logic for Sri Lanka Flood Relief Website

// Spam protection tracking
let lastSubmissionTime = 0;
let submissionCount = 0;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function() {
    initLanguage(); // Initialize language first
    
    // Initialize image loader and wait for images to load
    await imageLoader.initialize();
    
    initializeApp();
    setupInfiniteScroll();
});

function initializeApp() {
    // Render static content from data
    renderFloodDescription();
    renderAccountDetails();
    renderContactPersons();
    
    // Render dynamic cards
    renderDonationTiers();
    renderAffectedAreas();
    loadTimeline();
    
    // Set up event listeners
    setupEventListeners();
}

// Render flood description in hero section
function renderFloodDescription() {
    const descElement = document.getElementById('floodDescription');
    if (descElement) {
        descElement.textContent = siteConfig.floodInfo.description;
    }
}

// Render account details
function renderAccountDetails() {
    const bankNameEl = document.getElementById('bankName');
    const accountNumberEl = document.getElementById('accountNumber');
    const accountNameEl = document.getElementById('accountName');
    const branchNameEl = document.getElementById('branchName');
    
    if (bankNameEl) bankNameEl.textContent = siteConfig.bankAccount.bankName;
    if (accountNumberEl) accountNumberEl.textContent = siteConfig.bankAccount.accountNumber;
    if (accountNameEl) accountNameEl.textContent = siteConfig.bankAccount.accountName;
    if (branchNameEl) branchNameEl.textContent = siteConfig.bankAccount.branch;
}

// Render contact persons
function renderContactPersons() {
    const contactsGrid = document.getElementById('contactsGrid');
    if (contactsGrid) {
        contactsGrid.innerHTML = siteConfig.contactPersons.map(person => `
            <a href="https://wa.me/${person.phone.replace(/[^0-9]/g, '')}" class="contact-card" target="_blank">
                <div class="contact-name">${person.name}</div>
                <div class="contact-role">${person.role}</div>
                <div class="contact-phone">${person.phone}</div>
            </a>
        `).join('');
    }
}

// Render donation tier buttons
function renderDonationTiers() {
    const tiersGrid = document.getElementById('tiersGrid');
    if (tiersGrid) {
        tiersGrid.innerHTML = donationTiers.map(tier => `
            <button class="tier-btn ${tier.size}" data-amount="${tier.amount}">
                ${tier.label}
            </button>
        `).join('');
        
        // Add click listeners to tier buttons
        const tierButtons = tiersGrid.querySelectorAll('.tier-btn');
        tierButtons.forEach(button => {
            button.addEventListener('click', function() {
                const amount = this.getAttribute('data-amount');
                openDonationModal(amount);
            });
        });
    }
}

// Render affected areas cards
function renderAffectedAreas(append = false) {
    const grid = document.getElementById('affectedAreasGrid');
    if (grid) {
        const images = append ? imageLoader.loadMoreAffectedAreas() : imageLoader.getAffectedAreasImages(0);
        
        const cardsHtml = images.map(area => `
            <div class="card" data-aos="fade-up">
                <img src="${area.thumbnailUrl}" 
                     alt="${area.title}" 
                     class="card-image" 
                     data-image-url="${area.fullUrl}"
                     loading="lazy">
            </div>
        `).join('');
        
        if (append) {
            grid.insertAdjacentHTML('beforeend', cardsHtml);
        } else {
            grid.innerHTML = cardsHtml;
        }
        
        // Add click listeners to new images
        const imageElements = grid.querySelectorAll('.card-image');
        imageElements.forEach(img => {
            if (!img.hasAttribute('data-listener')) {
                img.setAttribute('data-listener', 'true');
                img.addEventListener('click', function() {
                    openImageModal(this.getAttribute('data-image-url'));
                });
            }
        });
    }
}

// Render relief work cards (no longer used)
function renderReliefWork(append = false) {
    return;
}

// Load timeline items
function loadTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    
    // Render timeline items from data
    const timelineHtml = timeline.map(item => `
        <div class="timeline-item ${item.id % 2 === 0 ? 'left' : 'right'}" data-aos="fade-${item.id % 2 === 0 ? 'right' : 'left'}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-date">${item.date}</div>
                <h3 class="timeline-title">${item.title}</h3>
                ${item.description ? `<p class="timeline-description">${item.description}</p>` : ''}
                <div class="timeline-images" id="timeline-images-${item.id}">
                    <div class="timeline-loading">Loading images...</div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = timelineHtml;
    
    // Load images for each timeline item
    timeline.forEach(item => {
        loadTimelineImages(item.id, item.driveFolder);
    });
}

// Load images from Google Drive subfolder for a timeline item
async function loadTimelineImages(itemId, folderName) {
    const imagesContainer = document.getElementById(`timeline-images-${itemId}`);
    if (!imagesContainer) return;
    
    try {
        // First, find the subfolder by name in the relief work folder
        const folderSearchUrl = `https://www.googleapis.com/drive/v3/files?` +
            `q='${siteConfig.googleDrive.reliefWorkFolderId}'+in+parents+and+name='${folderName}'+and+mimeType='application/vnd.google-apps.folder'` +
            `&key=${siteConfig.googleDrive.apiKey}` +
            `&fields=files(id,name)`;
        
        const folderResponse = await fetch(folderSearchUrl);
        const folderData = await folderResponse.json();
        
        if (!folderData.files || folderData.files.length === 0) {
            imagesContainer.innerHTML = '';
            return;
        }
        
        const subfolderId = folderData.files[0].id;
        
        // Now fetch images from this subfolder (limit to 3)
        const imagesUrl = `https://www.googleapis.com/drive/v3/files?` +
            `q='${subfolderId}'+in+parents+and+(mimeType+contains+'image/')` +
            `&key=${siteConfig.googleDrive.apiKey}` +
            `&fields=files(id,name,thumbnailLink)` +
            `&pageSize=3` +
            `&orderBy=name`;
        
        const imagesResponse = await fetch(imagesUrl);
        const imagesData = await imagesResponse.json();
        
        if (!imagesData.files || imagesData.files.length === 0) {
            imagesContainer.innerHTML = '';
            return;
        }
        
        // Render images
        const imagesHtml = imagesData.files.map(file => {
            const thumbnailUrl = file.thumbnailLink ? file.thumbnailLink.replace('=s220', '=s400') : '';
            const fullUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;
            return `
                <div class="timeline-image">
                    <img src="${thumbnailUrl}" 
                         alt="${file.name}" 
                         data-image-url="${fullUrl}"
                         loading="lazy">
                </div>
            `;
        }).join('');
        
        imagesContainer.innerHTML = imagesHtml;
        
        // Add click listeners to open images in modal
        const imageElements = imagesContainer.querySelectorAll('img');
        imageElements.forEach(img => {
            img.addEventListener('click', function() {
                openImageModal(this.getAttribute('data-image-url'));
            });
        });
        
    } catch (error) {
        console.error('Error loading timeline images:', error);
        imagesContainer.innerHTML = '';
    }
}

// Set up event listeners
function setupEventListeners() {
    // Header donate button
    const headerDonateBtn = document.getElementById('headerDonateBtn');
    if (headerDonateBtn) {
        headerDonateBtn.addEventListener('click', function() {
            openDonationModal('');
        });
    }
    
    // Custom donate button
    const customDonateBtn = document.getElementById('customDonateBtn');
    if (customDonateBtn) {
        customDonateBtn.addEventListener('click', function() {
            openDonationModal('');
        });
    }
    
    // Modal close button
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeDonationModal);
    }
    
    // Modal overlay click to close
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeDonationModal);
    }
    
    // Donation form submission
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', handleDonationSubmit);
    }
    
    // Thank you close button
    const thankYouCloseBtn = document.getElementById('thankYouCloseBtn');
    if (thankYouCloseBtn) {
        thankYouCloseBtn.addEventListener('click', closeThankYouMessage);
    }
    
    // Image modal close button
    const imageModalClose = document.getElementById('imageModalClose');
    if (imageModalClose) {
        imageModalClose.addEventListener('click', closeImageModal);
    }
    
    // Image modal overlay click to close
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }
}

// Open donation modal with optional pre-filled amount
function openDonationModal(amount = '') {
    const modal = document.getElementById('donationModal');
    const amountInput = document.getElementById('donationAmount');
    const modalAccountNumber = document.getElementById('modalAccountNumber');
    const modalAccountName = document.getElementById('modalAccountName');
    const modalBankName = document.getElementById('modalBankName');
    
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Set account details in modal
        if (modalAccountNumber) {
            modalAccountNumber.textContent = siteConfig.bankAccount.accountNumber;
        }
        if (modalAccountName) {
            modalAccountName.textContent = siteConfig.bankAccount.accountName;
        }
        if (modalBankName) {
            modalBankName.textContent = `${siteConfig.bankAccount.bankName} - ${siteConfig.bankAccount.branch}`;
        }
        
        // Pre-fill amount if provided
        if (amountInput && amount) {
            amountInput.value = amount;
        }
    }
}

// Close donation modal
function closeDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset form
        const form = document.getElementById('donationForm');
        if (form) {
            form.reset();
        }
    }
}

// Handle donation form submission
function handleDonationSubmit(event) {
    event.preventDefault();
    
    // Spam protection check
    if (siteConfig.spamProtection.enabled) {
        const currentTime = Date.now();
        const timeSinceLastSubmission = (currentTime - lastSubmissionTime) / 1000; // in seconds
        
        // Check cooldown period
        if (timeSinceLastSubmission < siteConfig.spamProtection.cooldownSeconds) {
            const remainingSeconds = Math.ceil(siteConfig.spamProtection.cooldownSeconds - timeSinceLastSubmission);
            alert(`Please wait ${remainingSeconds} seconds before submitting another donation.`);
            return;
        }
        
        // Check max submissions per session
        if (submissionCount >= siteConfig.spamProtection.maxSubmissionsPerSession) {
            alert(`Maximum number of submissions (${siteConfig.spamProtection.maxSubmissionsPerSession}) reached. Please refresh the page if you need to submit more donations.`);
            return;
        }
        
        // Update tracking
        lastSubmissionTime = currentTime;
        submissionCount++;
    }
    
    // Get form values
    const name = document.getElementById('donorName').value;
    const phone = document.getElementById('donorPhone').value;
    const amount = document.getElementById('donationAmount').value;
    
    // Create donation data object
    const donationData = {
        name: name,
        phone: phone,
        amount: amount,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-US'),
        time: new Date().toLocaleTimeString('en-US')
    };
    
    // Log donation to console
    console.log('Donation Submission:', donationData);
    
    // Save to Google Sheets
    saveToGoogleSheets(donationData);
    
    // Close donation modal
    closeDonationModal();
    
    // Show thank you message
    showThankYouMessage(name, amount);
}

// Show thank you message
function showThankYouMessage(name, amount) {
    const thankYouModal = document.getElementById('thankYouModal');
    const thankYouDetails = document.getElementById('thankYouDetails');
    
    if (thankYouModal) {
        // Set donation details
        if (thankYouDetails) {
            thankYouDetails.innerHTML = `
                <div class="thank-you-detail-item">
                    <span class="detail-label">Name: </span>
                    <span class="detail-value">${name}</span>
                </div>
                <div class="thank-you-detail-item">
                    <span class="detail-label">Amount: </span>
                    <span class="detail-value">LKR ${formatNumber(amount)}</span>
                </div>
            `;
        }
        
        // Show modal
        thankYouModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close thank you message
function closeThankYouMessage() {
    const thankYouModal = document.getElementById('thankYouModal');
    if (thankYouModal) {
        thankYouModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Open image modal with full-size image
function openImageModal(imageUrl) {
    const imageModal = document.getElementById('imageModal');
    const imageModalImg = document.getElementById('imageModalImg');
    
    if (imageModal && imageModalImg) {
        imageModalImg.src = imageUrl;
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close image modal
function closeImageModal() {
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Setup infinite scroll for image galleries
function setupInfiniteScroll() {
    const affectedAreasGrid = document.getElementById('affectedAreasGrid');
    const reliefWorkGrid = document.getElementById('reliefWorkGrid');
    
    const options = {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
    };
    
    // Create sentinel elements at the bottom of each grid
    if (affectedAreasGrid && imageLoader.hasMoreAffectedAreas()) {
        const affectedSentinel = document.createElement('div');
        affectedSentinel.className = 'scroll-sentinel';
        affectedSentinel.id = 'affectedAreasSentinel';
        affectedAreasGrid.parentElement.appendChild(affectedSentinel);
        
        const affectedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && imageLoader.hasMoreAffectedAreas()) {
                    renderAffectedAreas(true);
                    if (!imageLoader.hasMoreAffectedAreas()) {
                        affectedObserver.disconnect();
                        affectedSentinel.remove();
                    }
                }
            });
        }, options);
        
        affectedObserver.observe(affectedSentinel);
    }
    
    if (reliefWorkGrid && imageLoader.hasMoreReliefWork()) {
        const reliefSentinel = document.createElement('div');
        reliefSentinel.className = 'scroll-sentinel';
        reliefSentinel.id = 'reliefWorkSentinel';
        reliefWorkGrid.parentElement.appendChild(reliefSentinel);
        
        const reliefObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && imageLoader.hasMoreReliefWork()) {
                    renderReliefWork(true);
                    if (!imageLoader.hasMoreReliefWork()) {
                        reliefObserver.disconnect();
                        reliefSentinel.remove();
                    }
                }
            });
        }, options);
        
        reliefObserver.observe(reliefSentinel);
    }
}

// Save donation data to Google Sheets
function saveToGoogleSheets(donationData) {
    const scriptUrl = siteConfig.googleSheets?.scriptUrl;
    
    // Check if script URL is configured
    if (!scriptUrl || scriptUrl === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        console.warn('Google Sheets integration not configured. Please set up the script URL in data.js');
        return;
    }
    
    // Send data to Google Apps Script
    fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData)
    })
    .then(() => {
        console.log('Donation data sent to Google Sheets successfully');
    })
    .catch((error) => {
        console.error('Error saving to Google Sheets:', error);
    });
}

// Utility function to format numbers with commas
function formatNumber(num) {
    return parseInt(num).toLocaleString('en-US');
}

// Smooth scroll to section (optional enhancement)
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
