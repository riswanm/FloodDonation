// ===========================================
// MOSQUE MAINTENANCE FUND - RAMADAN 2026
// Main Application Logic
// ===========================================

// DOM Elements
let sharesGrid;
let modalOverlay;
let loadingOverlay;
let shareModalOverlay;
let capturedImageUrl = null;

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
async function initializeApp() {
    // Cache DOM elements
    sharesGrid = document.getElementById('sharesGrid');
    modalOverlay = document.getElementById('modalOverlay');
    loadingOverlay = document.getElementById('loadingOverlay');
    shareModalOverlay = document.getElementById('shareModalOverlay');
    
    // Show loading
    showLoading();
    
    // Load issued shares from Google Sheets
    await loadIssuedSharesFromSheet();
    
    // Render all components
    renderAllContent();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update active language button
    updateActiveLanguageButton();
    
    // Hide loading
    hideLoading();
}

/**
 * Render all translatable content
 */
function renderAllContent() {
    renderHeaderContent();
    renderQuote();
    renderStats();
    renderSectionHeadings();
    renderProjectInfo();
    renderShares();
    renderBankDetails();
}

/**
 * Render header content with translations
 */
function renderHeaderContent() {
    document.getElementById('mosqueTitle').textContent = t('header.mosqueTitle');
    document.getElementById('projectTitle').textContent = t('header.projectTitle');
    document.getElementById('sadaqahJariyah').textContent = t('header.sadaqahJariyah');
}

/**
 * Render section headings with translations
 */
function renderSectionHeadings() {
    document.getElementById('progressTitle').textContent = t('sections.collectionProgress');
    document.getElementById('sharesTitle').textContent = '🎫 ' + t('sections.sponsorshipShares');
    document.getElementById('sharesSubtitle').textContent = t('sections.sharesSubtitle');
    document.getElementById('legendAvailable').textContent = t('sections.available');
    document.getElementById('legendIssued').textContent = t('sections.issued');
    document.getElementById('projectTitle2').textContent = '📋 ' + t('sections.aboutProject');
    document.getElementById('contactTitle').textContent = '💝 ' + t('sections.howToDonate');
    document.getElementById('contactSubtitle').textContent = t('sections.donateSubtitle');
    document.getElementById('bankTitle').textContent = '🏦 ' + t('sections.bankTransferDetails');
    document.getElementById('loadingText').textContent = t('sections.loading');
    
    // Update share button text
    const shareButtonText = document.getElementById('shareButtonText');
    if (shareButtonText) {
        shareButtonText.textContent = t('sections.shareProgress');
    }
}

/**
 * Update active language button
 */
function updateActiveLanguageButton() {
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = currentLanguage === 'en' ? document.getElementById('langEn') : document.getElementById('langTa');
    if (activeBtn) activeBtn.classList.add('active');
}

/**
 * Show loading overlay
 */
function showLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

/**
 * Load issued shares count from Google Sheets
 */
async function loadIssuedSharesFromSheet() {
    if (!CONFIG.googleSheets.scriptUrl) {
        console.log('Google Sheets not configured, using default value');
        return;
    }
    
    try {
        const response = await fetch(`${CONFIG.googleSheets.scriptUrl}?action=getIssuedShares`);
        const data = await response.json();
        
        if (data.success && typeof data.issuedShares === 'number') {
            SHARES_ISSUED = data.issuedShares;
            console.log('Loaded issued shares:', SHARES_ISSUED);
        }
    } catch (error) {
        console.error('Failed to load issued shares from Google Sheets:', error);
    }
}

/**
 * Render random Islamic quote about charity
 */
function renderQuote() {
    const quoteContainer = document.getElementById('quoteSection');
    
    quoteContainer.innerHTML = `
        <p class="quote-text">"${t('quote.text')}"</p>
        <p class="quote-source">— ${t('quote.source')}</p>
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
    
    // Update stat labels with translations
    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels.length >= 6) {
        statLabels[0].textContent = t('stats.targetAmount');
        statLabels[1].textContent = t('stats.collectedAmount');
        statLabels[2].textContent = t('stats.remainingAmount');
        statLabels[3].textContent = t('stats.totalShares');
        statLabels[4].textContent = t('stats.sharesIssued');
        statLabels[5].textContent = t('stats.sharesAvailable');
    }
}

/**
 * Render project information
 */
function renderProjectInfo() {
    document.getElementById('projectDescription').textContent = t('projectInfo.description');
    
    const objectivesList = document.getElementById('objectivesList');
    const objectives = getObjectives(currentLanguage);
    objectivesList.innerHTML = objectives
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
            <h4>${t('modal.shareIssued')} ✓</h4>
            <div class="modal-share-number">#${shareNumber}</div>
            <p>${t('modal.shareSponsored')}</p>
            <p class="modal-price">${formatCurrency(CONFIG.sharePrice)}</p>
            <p style="color: var(--primary-light); font-style: italic;">${t('modal.mayAllahReward')}</p>
            <button class="modal-close" onclick="closeModal()">${t('modal.close')}</button>
        `;
    } else {
        // Show booking form for available shares
        const availableShares = CONFIG.totalShares - SHARES_ISSUED;
        modal.innerHTML = `
            <h4>📝 ${t('modal.bookYourShares')}</h4>
            <div class="modal-share-number">${t('modal.startingFrom')} #${shareNumber}</div>
            <p class="modal-price">${formatCurrency(CONFIG.sharePrice)} ${t('modal.perShare')}</p>
            
            <form id="bookingForm" class="booking-form">
                <div class="form-group">
                    <label for="donorName">${t('form.yourName')} *</label>
                    <input type="text" id="donorName" name="donorName" required placeholder="${t('form.namePlaceholder')}">
                </div>
                
                <div class="form-group">
                    <label for="donorPhone">${t('form.phoneNumber')} *</label>
                    <input type="tel" id="donorPhone" name="donorPhone" required placeholder="${t('form.phonePlaceholder')}">
                </div>
                
                <div class="form-group">
                    <label for="numShares">${t('form.numberOfShares')} *</label>
                    <input type="number" id="numShares" name="numShares" required min="1" max="${Math.min(availableShares, 400)}" value="1" placeholder="${t('form.sharesPlaceholder')}">
                </div>
                
                <div class="form-total" id="formTotal">
                    ${t('form.total')}: ${formatCurrency(CONFIG.sharePrice)}
                </div>
                
                <p class="form-note">
                    ${t('form.contactNote')}
                </p>
                
                <div class="form-buttons">
                    <button type="submit" class="btn btn-primary btn-submit">
                        ✓ ${t('form.submitRequest')}
                    </button>
                    <button type="button" class="btn btn-outline" onclick="closeModal()">
                        ${t('form.cancel')}
                    </button>
                </div>
            </form>
        `;
        
        // Setup form handlers
        setupBookingForm(shareNumber);
    }
    
    modalOverlay.classList.add('active');
}

/**
 * Setup booking form event handlers
 */
function setupBookingForm(startingShare) {
    const form = document.getElementById('bookingForm');
    const numSharesInput = document.getElementById('numShares');
    const formTotal = document.getElementById('formTotal');
    
    // Update total when shares change
    numSharesInput.addEventListener('input', () => {
        const numShares = parseInt(numSharesInput.value) || 1;
        const total = numShares * CONFIG.sharePrice;
        formTotal.textContent = `${t('form.total')}: ${formatCurrency(total)}`;
    });
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const donorName = document.getElementById('donorName').value.trim();
        const donorPhone = document.getElementById('donorPhone').value.trim();
        const numShares = parseInt(document.getElementById('numShares').value);
        
        // Validate
        if (!donorName || !donorPhone || !numShares) {
            alert(t('form.fillAllFields'));
            return;
        }
        
        // Submit booking
        await submitBooking({
            donorName,
            donorPhone,
            numShares,
            startingShare,
            totalAmount: numShares * CONFIG.sharePrice
        });
    });
}

/**
 * Submit booking to Google Sheets
 */
async function submitBooking(bookingData) {
    const modal = document.getElementById('modalContent');
    
    // Show loading state
    const submitBtn = modal.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `⏳ ${t('form.submitting')}`;
    submitBtn.disabled = true;
    
    try {
        // If Google Sheets is configured, submit the data
        if (CONFIG.googleSheets.scriptUrl) {
            const response = await fetch(CONFIG.googleSheets.scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // Required for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'addBooking',
                    ...bookingData,
                    timestamp: new Date().toISOString()
                })
            });
            
            console.log('Booking submitted to Google Sheets');
        }
        
        // Show success message with WhatsApp option
        showBookingSuccess(bookingData);
        
    } catch (error) {
        console.error('Failed to submit booking:', error);
        // Still show success (booking noted locally)
        showBookingSuccess(bookingData);
    }
}

/**
 * Show booking success message
 */
function showBookingSuccess(bookingData) {
    const modal = document.getElementById('modalContent');
    const whatsappMessage = encodeURIComponent(
        `Assalamu Alaikum,\n\n${t('success.whatsappMessage').replace('{shares}', bookingData.numShares)}\n\n${t('form.yourName')}: ${bookingData.donorName}\n${t('form.phoneNumber')}: ${bookingData.donorPhone}\n${t('modal.shares')}: ${bookingData.numShares}\n${t('form.total')}: ${formatCurrency(bookingData.totalAmount)}\n\nJazakAllah Khair`
    );
    
    modal.innerHTML = `
        <div class="success-message">
            <div class="success-icon">✓</div>
            <h4>${t('success.requestSubmitted')}</h4>
            <p>${t('success.jazakAllah')}, <strong>${bookingData.donorName}</strong>!</p>
            <p>${t('success.requestFor').replace('{shares}', bookingData.numShares)} (${formatCurrency(bookingData.totalAmount)}) ${t('success.hasBeenNoted')}</p>
            
            <div class="success-info">
                <p>${t('success.committeeWillContact')}</p>
                <p><strong>${bookingData.donorPhone}</strong></p>
            </div>
            
            <p class="success-note">${t('success.depositNote')}</p>
            
            <div class="bank-summary">
                <p><strong>${CONFIG.bankDetails.bankName}</strong></p>
                <p>${CONFIG.bankDetails.accountName}</p>
                <p>${t('bank.accountNumber')}: ${CONFIG.bankDetails.accountNumber}</p>
            </div>
            
            <div class="form-buttons">
                <a href="https://wa.me/${CONFIG.contactWhatsApp.replace('+', '')}?text=${whatsappMessage}" 
                   class="btn btn-primary" target="_blank">
                    📱 ${t('success.openWhatsApp')}
                </a>
                <button class="modal-close" onclick="closeModal()">${t('modal.close')}</button>
            </div>
        </div>
    `;
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
            <div class="bank-info-label">${t('bank.bankName')}</div>
            <div class="bank-info-value">${bankDetails.bankName}</div>
        </div>
        <div class="bank-info-item">
            <div class="bank-info-label">${t('bank.accountName')}</div>
            <div class="bank-info-value">${bankDetails.accountName}</div>
        </div>
        <div class="bank-info-item">
            <div class="bank-info-label">${t('bank.accountNumber')}</div>
            <div class="bank-info-value">${bankDetails.accountNumber}</div>
        </div>
        <div class="bank-info-item">
            <div class="bank-info-label">${t('bank.branch')}</div>
            <div class="bank-info-value">${bankDetails.branch}</div>
        </div>
    `;
    
    // Update WhatsApp link
    const whatsappLink = document.getElementById('whatsappLink');
    if (whatsappLink) {
        whatsappLink.href = `https://wa.me/${CONFIG.contactWhatsApp.replace('+', '')}?text=${t('contact.whatsappText')}`;
        whatsappLink.innerHTML = `📱 ${t('contact.whatsapp')}`;
    }
    
    // Update email link
    const emailLink = document.getElementById('emailLink');
    if (emailLink) {
        emailLink.href = `mailto:${CONFIG.contactEmail}?subject=${t('contact.emailSubject')}`;
        emailLink.innerHTML = `✉️ ${t('contact.email')}`;
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
    
    // Close share modal when clicking overlay
    if (shareModalOverlay) {
        shareModalOverlay.addEventListener('click', (e) => {
            if (e.target === shareModalOverlay) {
                closeShareModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeShareModal();
        }
    });
}

// ===========================================
// SHARE DASHBOARD FUNCTIONALITY
// ===========================================

/**
 * Open dashboard share modal and capture dashboard
 */
async function openDashboardShareModal() {
    const shareModal = document.getElementById('shareModalContent');
    
    // Show loading state
    shareModal.innerHTML = `
        <div class="share-loading">
            <div class="share-spinner"></div>
            <p>${t('sections.loading')}</p>
        </div>
    `;
    shareModalOverlay.classList.add('active');
    
    // Capture the stats section
    await captureDashboard();
    
    // Show share options
    showShareOptions();
}

/**
 * Capture dashboard as image
 */
async function captureDashboard() {
    const statsSection = document.querySelector('.stats-section');
    
    if (!statsSection || typeof html2canvas === 'undefined') {
        console.error('html2canvas not loaded or stats section not found');
        return;
    }
    
    try {
        const canvas = await html2canvas(statsSection, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
            logging: false,
            useCORS: true
        });
        
        // Convert to blob
        canvas.toBlob((blob) => {
            if (capturedImageUrl) {
                URL.revokeObjectURL(capturedImageUrl);
            }
            capturedImageUrl = URL.createObjectURL(blob);
        }, 'image/png');
        
        return canvas;
    } catch (error) {
        console.error('Failed to capture dashboard:', error);
    }
}

/**
 * Show share options modal
 */
function showShareOptions() {
    const shareModal = document.getElementById('shareModalContent');
    const stats = getStats();
    const shareText = encodeURIComponent(
        `${t('header.mosqueTitle')}\n\n` +
        `${t('stats.sharesIssued')}: ${stats.issuedCount}/${CONFIG.totalShares}\n` +
        `${t('stats.collectedAmount')}: ${formatCurrency(stats.collectedAmount)}\n` +
        `${t('form.total')}: ${formatCurrency(CONFIG.totalAmount)}\n\n` +
        `${t('success.jazakAllah')}! 🕌`
    );
    
    shareModal.innerHTML = `
        <h4>📤 ${currentLanguage === 'ta' ? 'முன்னேற்றத்தைப் பகிரவும்' : 'Share Progress'}</h4>
        <p>${currentLanguage === 'ta' ? 'எங்கள் நிதி சேகரிப்பு முன்னேற்றத்தைப் பகிரவும்' : 'Share our fundraising progress with your community'}</p>
        
        <div class="share-options">
            <button class="share-option-btn" onclick="downloadDashboard()">
                <span class="icon">⬇️</span>
                <span>${currentLanguage === 'ta' ? 'பதிவிறக்கவும்' : 'Download'}</span>
            </button>
            
            <button class="share-option-btn" onclick="shareToWhatsApp('${shareText}')">
                <span class="icon">📱</span>
                <span>${currentLanguage === 'ta' ? 'வாட்ஸ்அப்' : 'WhatsApp'}</span>
            </button>
        </div>
        
        <div class="share-note">
            ${currentLanguage === 'ta' ? 
                '💡 பதிவிறக்கிய பிறகு, படத்தை வாட்ஸ்அப்பில் கைமுறையாக இணைக்கலாம்' : 
                '💡 After downloading, you can manually attach the image to WhatsApp'}
        </div>
        
        <button class="modal-close" onclick="closeShareModal()">${t('modal.close')}</button>
    `;
}

/**
 * Download dashboard as image
 */
async function downloadDashboard() {
    if (!capturedImageUrl) {
        await captureDashboard();
    }
    
    if (capturedImageUrl) {
        const link = document.createElement('a');
        link.download = `mosque-fund-progress-${new Date().toISOString().split('T')[0]}.png`;
        link.href = capturedImageUrl;
        link.click();
    }
}

/**
 * Share to WhatsApp with text
 */
function shareToWhatsApp(text) {
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
}

/**
 * Print dashboard
 */
async function printDashboard() {
    const statsSection = document.querySelector('.stats-section');
    
    if (!statsSection) return;
    
    // Create print window
    const printWindow = window.open('', '_blank');
    const styles = `
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 20px;
                background: white;
            }
            .print-header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 3px solid #1a4d2e;
            }
            .print-header h1 {
                color: #1a4d2e;
                margin: 10px 0;
            }
            .print-header p {
                color: #666;
                margin: 5px 0;
            }
            img {
                max-width: 100%;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                border-radius: 10px;
            }
            .print-footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e9ecef;
                color: #666;
                font-size: 0.9rem;
            }
            @media print {
                body { margin: 0; }
                .print-header, .print-footer { page-break-inside: avoid; }
            }
        </style>
    `;
    
    try {
        const canvas = await html2canvas(statsSection, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false
        });
        
        const imageData = canvas.toDataURL('image/png');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Mosque Fund Progress</title>
                ${styles}
            </head>
            <body>
                <div class="print-header">
                    <h1>${t('header.mosqueTitle')}</h1>
                    <p>${t('header.projectTitle')}</p>
                    <p><strong>${t('header.sadaqahJariyah')}</strong></p>
                </div>
                <img src="${imageData}" alt="Fundraising Progress" />
                <div class="print-footer">
                    <p>Generated on ${new Date().toLocaleDateString('en-GB')}</p>
                    <p>${t('success.jazakAllah')}!</p>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for image to load then print
        setTimeout(() => {
            printWindow.print();
        }, 500);
        
    } catch (error) {
        console.error('Failed to print dashboard:', error);
        alert('Failed to generate print view. Please try downloading instead.');
    }
}

/**
 * Close share modal
 */
function closeShareModal() {
    if (shareModalOverlay) {
        shareModalOverlay.classList.remove('active');
    }
}

// Expose functions to global scope for onclick handlers
window.closeModal = closeModal;
window.openDashboardShareModal = openDashboardShareModal;
window.closeShareModal = closeShareModal;
window.downloadDashboard = downloadDashboard;
window.shareToWhatsApp = shareToWhatsApp;
window.printDashboard = printDashboard;
