// Main Application Logic for Sri Lanka Flood Relief Website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Render static content from data
    renderFloodDescription();
    renderFundUsage();
    renderAccountDetails();
    renderContactPersons();
    
    // Render dynamic cards
    renderDonationTiers();
    renderAffectedAreas();
    renderReliefWork();
    
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

// Render fund usage list
function renderFundUsage() {
    const listElement = document.getElementById('fundUsageList');
    if (listElement) {
        listElement.innerHTML = fundUsage.map(item => `<li>${item}</li>`).join('');
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
            <div class="contact-card">
                <div class="contact-name">${person.name}</div>
                <div class="contact-role">${person.role}</div>
                <div class="contact-phone">${person.phone}</div>
            </div>
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
function renderAffectedAreas() {
    const grid = document.getElementById('affectedAreasGrid');
    if (grid) {
        grid.innerHTML = affectedAreas.map(area => `
            <div class="card">
                <img src="${area.imageUrl}" alt="${area.title}" class="card-image" data-image-url="${area.imageUrl}">
                <div class="card-content">
                    <h3 class="card-title">${area.title}</h3>
                </div>
            </div>
        `).join('');
        
        // Add click listeners to images
        const images = grid.querySelectorAll('.card-image');
        images.forEach(img => {
            img.addEventListener('click', function() {
                openImageModal(this.getAttribute('data-image-url'));
            });
        });
    }
}

// Render relief work cards
function renderReliefWork() {
    const grid = document.getElementById('reliefWorkGrid');
    if (grid) {
        grid.innerHTML = reliefWork.map(work => `
            <div class="card">
                <img src="${work.imageUrl}" alt="${work.title}" class="card-image" data-image-url="${work.imageUrl}">
                <div class="card-content">
                    <h3 class="card-title">${work.title}</h3>
                    <div class="card-meta">
                        <span class="card-date">${work.date}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click listeners to images
        const images = grid.querySelectorAll('.card-image');
        images.forEach(img => {
            img.addEventListener('click', function() {
                openImageModal(this.getAttribute('data-image-url'));
            });
        });
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
    
    // Get form values
    const name = document.getElementById('donorName').value;
    const phone = document.getElementById('donorPhone').value;
    const amount = document.getElementById('donationAmount').value;
    
    // Log donation to console
    console.log('Donation Submission:', {
        name: name,
        phone: phone,
        amount: `LKR ${amount}`,
        timestamp: new Date().toISOString()
    });
    
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
