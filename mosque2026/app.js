// ===========================================
// MOSQUE MAINTENANCE FUND - RAMADAN 2026
// Main Application Logic
// ===========================================

// DOM Elements
let sharesGrid;
let modalOverlay;

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Cache DOM elements
    sharesGrid = document.getElementById('sharesGrid');
    modalOverlay = document.getElementById('modalOverlay');
    
    // Render all components
    renderQuote();
    renderStats();
    renderProjectInfo();
    renderShares();
    renderBankDetails();
    
    // Setup event listeners
    setupEventListeners();
}

/**
 * Render random Islamic quote about charity
 */
function renderQuote() {
    const quoteContainer = document.getElementById('quoteSection');
    const randomQuote = CHARITY_QUOTES[Math.floor(Math.random() * CHARITY_QUOTES.length)];
    
    quoteContainer.innerHTML = `
        <p class="quote-text">"${randomQuote.text}"</p>
        <p class="quote-source">— ${randomQuote.source}</p>
    `;
}

/**
 * Calculate statistics
 */
function getStats() {
    const totalShares = CONFIG.totalShares;
    const issuedCount = SHARES_ISSUED;
    const availableCount = totalShares - issuedCount;
    const collectedAmount = issuedCount * CONFIG.sharePrice;
    const remainingAmount = CONFIG.totalAmount - collectedAmount;
    const percentage = (issuedCount / totalShares) * 100;
    
    return {
        totalShares,
        issuedCount,
        availableCount,
        collectedAmount,
        remainingAmount,
        percentage
    };
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return `${CONFIG.currencySymbol} ${amount.toLocaleString()}`;
}

/**
 * Render statistics section
 */
function renderStats() {
    const stats = getStats();
    
    // Update stat values
    document.getElementById('totalAmount').textContent = formatCurrency(CONFIG.totalAmount);
    document.getElementById('bookedAmount').textContent = formatCurrency(stats.collectedAmount);
    document.getElementById('remainingAmount').textContent = formatCurrency(stats.remainingAmount);
    document.getElementById('totalShares').textContent = CONFIG.totalShares;
    document.getElementById('issuedShares').textContent = stats.issuedCount;
    document.getElementById('availableShares').textContent = stats.availableCount;
    
    // Update progress bar
    document.getElementById('progressPercentage').textContent = `${stats.percentage.toFixed(1)}%`;
    document.getElementById('progressBar').style.width = `${stats.percentage}%`;
}

/**
 * Render project information
 */
function renderProjectInfo() {
    document.getElementById('projectDescription').textContent = PROJECT_INFO.description;
    
    const objectivesList = document.getElementById('objectivesList');
    objectivesList.innerHTML = PROJECT_INFO.objectives
        .map(obj => `<li>✦ ${obj}</li>`)
        .join('');
}

/**
 * Render all shares
 */
function renderShares() {
    const totalShares = CONFIG.totalShares;
    const issuedCount = SHARES_ISSUED;
    
    // Create arrays for available and issued shares
    const availableShares = [];
    const issuedShares = [];
    
    for (let i = 1; i <= totalShares; i++) {
        if (i <= issuedCount) {
            issuedShares.push(i);
        } else {
            availableShares.push(i);
        }
    }
    
    // Combine: available first, then issued
    const orderedShares = [...availableShares, ...issuedShares];
    
    // Clear grid
    sharesGrid.innerHTML = '';
    
    // Render shares
    orderedShares.forEach((shareNumber, index) => {
        const isIssued = shareNumber <= issuedCount;
        const shareElement = createShareElement(shareNumber, isIssued, index);
        sharesGrid.appendChild(shareElement);
    });
}

/**
 * Create a share card element
 */
function createShareElement(shareNumber, isIssued, index) {
    const share = document.createElement('div');
    share.className = `share-card ${isIssued ? 'issued' : 'available'}`;
    share.style.setProperty('--index', index);
    share.setAttribute('data-share', shareNumber);
    share.setAttribute('data-issued', isIssued);
    
    share.innerHTML = `<span class="share-number">${shareNumber}</span>`;
    
    // Add click handler
    share.addEventListener('click', () => openShareModal(shareNumber, isIssued));
    
    return share;
}

/**
 * Open share modal
 */
function openShareModal(shareNumber, isIssued) {
    const modal = document.getElementById('modalContent');
    
    if (isIssued) {
        modal.innerHTML = `
            <h4>Share Issued ✓</h4>
            <div class="modal-share-number">#${shareNumber}</div>
            <p>This share has been generously sponsored.</p>
            <p class="modal-price">${formatCurrency(CONFIG.sharePrice)}</p>
            <p style="color: var(--primary-light); font-style: italic;">May Allah reward them abundantly.</p>
            <button class="modal-close" onclick="closeModal()">Close</button>
        `;
    } else {
        modal.innerHTML = `
            <h4>Sponsor This Share</h4>
            <div class="modal-share-number">#${shareNumber}</div>
            <p>This share is available for sponsorship</p>
            <p class="modal-price">${formatCurrency(CONFIG.sharePrice)}</p>
            <p style="margin-bottom: 20px; color: var(--text-muted);">
                Contact us to sponsor this share and earn continuous rewards (Sadaqah Jariyah).
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <a href="https://wa.me/${CONFIG.contactWhatsApp.replace('+', '')}?text=I want to sponsor Share ${shareNumber} (${formatCurrency(CONFIG.sharePrice)}) for Mosque Maintenance Fund" 
                   class="btn btn-primary" target="_blank">
                    📱 WhatsApp
                </a>
                <button class="modal-close" onclick="closeModal()">Close</button>
            </div>
        `;
    }
    
    modalOverlay.classList.add('active');
}

/**
 * Close modal
 */
function closeModal() {
    modalOverlay.classList.remove('active');
}

/**
 * Render bank details
 */
function renderBankDetails() {
    const bankDetailsContainer = document.getElementById('bankDetails');
    const { bankDetails } = CONFIG;
    
    bankDetailsContainer.innerHTML = `
        <div class="bank-info-item">
            <div class="bank-info-label">Bank Name</div>
            <div class="bank-info-value">${bankDetails.bankName}</div>
        </div>
        <div class="bank-info-item">
            <div class="bank-info-label">Account Name</div>
            <div class="bank-info-value">${bankDetails.accountName}</div>
        </div>
        <div class="bank-info-item">
            <div class="bank-info-label">Account Number</div>
            <div class="bank-info-value">${bankDetails.accountNumber}</div>
        </div>
        <div class="bank-info-item">
            <div class="bank-info-label">Branch</div>
            <div class="bank-info-value">${bankDetails.branch}</div>
        </div>
    `;
    
    // Update WhatsApp link
    const whatsappLink = document.getElementById('whatsappLink');
    if (whatsappLink) {
        whatsappLink.href = `https://wa.me/${CONFIG.contactWhatsApp.replace('+', '')}?text=I want to donate for Mosque Maintenance Fund`;
    }
    
    // Update email link
    const emailLink = document.getElementById('emailLink');
    if (emailLink) {
        emailLink.href = `mailto:${CONFIG.contactEmail}?subject=Mosque Maintenance Fund Donation`;
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Expose closeModal to global scope for onclick handlers
window.closeModal = closeModal;
