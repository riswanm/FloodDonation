// Flood Dashboard - Main JavaScript
// ==================================

// Register Chart.js datalabels plugin globally
if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
    // Set default to false, enable per dataset
    Chart.defaults.set('plugins.datalabels', {
        display: false
    });
}

// Global variables
let chartInstances = {
    areaChart: null,
    jobChart: null,
    damagesChart: null
};

// Utility function to parse number safely
function parseNumber(value) {
    if (value === null || value === undefined || value === '') return 0;
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
}

// Utility function to safely get string value
function getString(value) {
    if (value === null || value === undefined) return '';
    return String(value).trim();
}

// Fetch data from Google Sheets
async function fetchSheetData() {
    try {
        // Check if API key and Sheet ID are configured
        if (CONFIG.API_KEY === 'YOUR_API_KEY_HERE' || CONFIG.SHEET_ID === 'YOUR_SHEET_ID_HERE') {
            throw new Error('Please configure your Google Sheets API Key and Sheet ID in config.js');
        }

        const apiUrl = CONFIG.getApiUrl();
        console.log('Fetching data from Google Sheets...');
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            // Parse error response
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    console.error('Google Sheets API Error:', errorData.error);
                    
                    // Provide specific error messages
                    if (response.status === 403) {
                        if (errorData.error.message.includes('PERMISSION_DENIED') || 
                            errorData.error.message.includes('does not have permission')) {
                            errorMessage = 'Access Denied: Your Google Sheet is not publicly accessible. Please share it as "Anyone with the link can view". Check README.md for detailed instructions.';
                        } else if (errorData.error.message.includes('API key')) {
                            errorMessage = 'API Key Error: The API key may be invalid or restricted. Check that Google Sheets API is enabled and the key is configured correctly.';
                        } else {
                            errorMessage = `Permission Error: ${errorData.error.message}. Make sure your sheet is shared publicly and the API key has proper permissions.`;
                        }
                    } else if (response.status === 400) {
                        errorMessage = `Bad Request: ${errorData.error.message}. Check your sheet name and column ranges in config.js.`;
                    } else if (response.status === 404) {
                        errorMessage = 'Sheet Not Found: The Google Sheet ID may be incorrect. Verify the Sheet ID in config.js.';
                    } else {
                        errorMessage = `Error: ${errorData.error.message}`;
                    }
                }
            } catch (parseError) {
                console.error('Could not parse error response:', parseError);
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Data fetched successfully');
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Process raw data from Google Sheets API
function processData(apiResponse) {
    try {
        if (!apiResponse.valueRanges || apiResponse.valueRanges.length !== 6) {
            throw new Error('Invalid API response structure');
        }

        // Extract columns (skip header row at index 0)
        const areaData = apiResponse.valueRanges[0].values || [];
        const adultsData = apiResponse.valueRanges[1].values || [];
        const childrenData = apiResponse.valueRanges[2].values || [];
        const studentsData = apiResponse.valueRanges[3].values || [];
        const jobData = apiResponse.valueRanges[4].values || [];
        const damagesData = apiResponse.valueRanges[5].values || [];

        // Get the maximum length to handle all rows
        const maxLength = Math.max(
            areaData.length,
            adultsData.length,
            childrenData.length,
            studentsData.length,
            jobData.length,
            damagesData.length
        );

        const processedRows = [];

        // Process each row (skip header at index 0)
        for (let i = 1; i < maxLength; i++) {
            try {
                const area = getString(areaData[i] ? areaData[i][0] : '');
                const adults = parseNumber(adultsData[i] ? adultsData[i][0] : 0);
                const children = parseNumber(childrenData[i] ? childrenData[i][0] : 0);
                const students = parseNumber(studentsData[i] ? studentsData[i][0] : 0);
                const job = getString(jobData[i] ? jobData[i][0] : '');
                const damages = getString(damagesData[i] ? damagesData[i][0] : '');

                // Skip rows with no area (likely empty rows)
                if (!area) continue;

                processedRows.push({
                    area,
                    adults,
                    children,
                    students,
                    job,
                    damages,
                    people: adults + children
                });
            } catch (rowError) {
                // Skip malformed rows silently
                console.warn(`Skipping row ${i} due to error:`, rowError);
                continue;
            }
        }

        return processedRows;
    } catch (error) {
        console.error('Error processing data:', error);
        throw error;
    }
}

// Calculate summary statistics
function calculateStatistics(rows) {
    const stats = {
        families: rows.length,
        totalPeople: 0,
        totalAdults: 0,
        totalChildren: 0,
        totalStudents: 0
    };

    rows.forEach(row => {
        stats.totalPeople += row.people;
        stats.totalAdults += row.adults;
        stats.totalChildren += row.children;
        stats.totalStudents += row.students;
    });

    return stats;
}

// Aggregate data by area
function aggregateByArea(rows) {
    const areaMap = {};

    rows.forEach(row => {
        if (!areaMap[row.area]) {
            areaMap[row.area] = {
                families: 0,
                people: 0,
                adults: 0,
                children: 0
            };
        }
        areaMap[row.area].families++;
        areaMap[row.area].people += row.people;
        areaMap[row.area].adults += row.adults;
        areaMap[row.area].children += row.children;
    });

    return areaMap;
}

// Categorize jobs
function categorizeJobs(rows) {
    const jobCategories = {
        'Self Employed': 0,
        'Business': 0,
        'Daily Wage': 0,
        'Monthly Wage': 0,
        'Not Mentioned': 0,
        'Other': 0
    };

    rows.forEach(row => {
        const job = row.job.toLowerCase();
        
        if (!job || job === '') {
            jobCategories['Not Mentioned']++;
        } else if (job.includes('self') || job.includes('employed')) {
            jobCategories['Self Employed']++;
        } else if (job.includes('business')) {
            jobCategories['Business']++;
        } else if (job.includes('daily') || job.includes('wage')) {
            jobCategories['Daily Wage']++;
        } else if (job.includes('monthly') || job.includes('salary')) {
            jobCategories['Monthly Wage']++;
        } else {
            jobCategories['Other']++;
        }
    });

    return jobCategories;
}

// Process damages and get top 10
function processDamages(rows) {
    const damageMap = {};

    rows.forEach(row => {
        if (!row.damages) return;

        // Split by comma and process each damage
        const damages = row.damages.split(',');
        damages.forEach(damage => {
            let trimmed = damage.trim();
            if (trimmed) {
                const lowerDamage = trimmed.toLowerCase();
                
                // Skip bags and shoes (not school-related)
                if (lowerDamage === 'bags' || lowerDamage === 'shoes' || 
                    lowerDamage === 'bag' || lowerDamage === 'shoe') {
                    return;
                }
                
                // Normalize school-related items to "School Items"
                if (lowerDamage.includes('school')) {
                    trimmed = 'School Items';
                }
                
                damageMap[trimmed] = (damageMap[trimmed] || 0) + 1;
            }
        });
    });

    // Convert to array and sort by count
    const damageArray = Object.entries(damageMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 only

    return damageArray;
}

// Update statistics display
function updateStatistics(stats) {
    document.getElementById('statFamilies').textContent = stats.families.toLocaleString();
    document.getElementById('statPeople').textContent = stats.totalPeople.toLocaleString();
    document.getElementById('statAdults').textContent = stats.totalAdults.toLocaleString();
    document.getElementById('statChildren').textContent = stats.totalChildren.toLocaleString();
    document.getElementById('statStudents').textContent = stats.totalStudents.toLocaleString();
}

// Destroy existing chart if it exists
function destroyChart(chartKey) {
    if (chartInstances[chartKey]) {
        chartInstances[chartKey].destroy();
        chartInstances[chartKey] = null;
    }
}

// Create area-wise chart
function createAreaChart(areaData) {
    destroyChart('areaChart');

    const ctx = document.getElementById('areaChart').getContext('2d');
    const areas = Object.keys(areaData);
    const familiesData = areas.map(area => areaData[area].families);
    const peopleData = areas.map(area => areaData[area].people);
    const adultsData = areas.map(area => areaData[area].adults);
    const childrenData = areas.map(area => areaData[area].children);

    // Calculate dynamic height based on number of areas
    const chartContainer = document.querySelector('#areaChart').parentElement;
    const minHeight = Math.max(400, areas.length * 90);
    chartContainer.style.minHeight = `${minHeight}px`;

    chartInstances.areaChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: areas,
            datasets: [
                {
                    label: 'Families',
                    data: familiesData,
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 2,
                    datalabels: {
                        color: '#5b21b6',
                        anchor: 'end',
                        align: 'end',
                        font: {
                            weight: 'bold',
                            size: 11
                        }
                    }
                },
                {
                    label: 'Total People',
                    data: peopleData,
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 2,
                    datalabels: {
                        color: '#1e40af',
                        anchor: 'end',
                        align: 'end',
                        font: {
                            weight: 'bold',
                            size: 11
                        }
                    }
                },
                {
                    label: 'Adults',
                    data: adultsData,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2,
                    datalabels: {
                        color: '#065f46',
                        anchor: 'end',
                        align: 'end',
                        font: {
                            weight: 'bold',
                            size: 11
                        }
                    }
                },
                {
                    label: 'Children',
                    data: childrenData,
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 2,
                    datalabels: {
                        color: '#92400e',
                        anchor: 'end',
                        align: 'end',
                        font: {
                            weight: 'bold',
                            size: 11
                        }
                    }
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 13
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    }
                },
                datalabels: {
                    display: true
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create job type chart
function createJobChart(jobData) {
    destroyChart('jobChart');

    const ctx = document.getElementById('jobChart').getContext('2d');
    const labels = Object.keys(jobData);
    const values = Object.values(jobData);

    // Calculate dynamic height
    const chartContainer = document.querySelector('#jobChart').parentElement;
    const minHeight = Math.max(300, labels.length * 50);
    chartContainer.style.minHeight = `${minHeight}px`;

    chartInstances.jobChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Families',
                data: values,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(156, 163, 175, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(156, 163, 175, 1)',
                    'rgba(139, 92, 246, 1)'
                ],
                borderWidth: 2,
                datalabels: {
                    color: '#374151',
                    anchor: 'end',
                    align: 'end',
                    font: {
                        weight: 'bold',
                        size: 12
                    }
                }
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    }
                },
                datalabels: {
                    display: true
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create damages chart
function createDamagesChart(damagesData) {
    destroyChart('damagesChart');

    const ctx = document.getElementById('damagesChart').getContext('2d');
    const labels = damagesData.map(d => d.name);
    const values = damagesData.map(d => d.count);

    // Calculate dynamic height
    const chartContainer = document.querySelector('#damagesChart').parentElement;
    const minHeight = Math.max(350, labels.length * 45);
    chartContainer.style.minHeight = `${minHeight}px`;

    // Generate different colors for each bar
    const colors = [
        { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgba(239, 68, 68, 1)', text: '#991b1b' },      // Red
        { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgba(245, 158, 11, 1)', text: '#92400e' },    // Orange
        { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgba(16, 185, 129, 1)', text: '#065f46' },    // Green
        { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgba(59, 130, 246, 1)', text: '#1e40af' },    // Blue
        { bg: 'rgba(139, 92, 246, 0.8)', border: 'rgba(139, 92, 246, 1)', text: '#5b21b6' },    // Purple
        { bg: 'rgba(236, 72, 153, 0.8)', border: 'rgba(236, 72, 153, 1)', text: '#9f1239' },    // Pink
        { bg: 'rgba(20, 184, 166, 0.8)', border: 'rgba(20, 184, 166, 1)', text: '#134e4a' },    // Teal
        { bg: 'rgba(251, 191, 36, 0.8)', border: 'rgba(251, 191, 36, 1)', text: '#78350f' },    // Amber
        { bg: 'rgba(99, 102, 241, 0.8)', border: 'rgba(99, 102, 241, 1)', text: '#3730a3' },    // Indigo
        { bg: 'rgba(168, 85, 247, 0.8)', border: 'rgba(168, 85, 247, 1)', text: '#6b21a8' }     // Violet
    ];

    const backgroundColors = values.map((_, index) => colors[index % colors.length].bg);
    const borderColors = values.map((_, index) => colors[index % colors.length].border);
    const labelColors = values.map((_, index) => colors[index % colors.length].text);

    chartInstances.damagesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Reports',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                datalabels: {
                    color: labelColors,
                    anchor: 'end',
                    align: 'end',
                    font: {
                        weight: 'bold',
                        size: 12
                    }
                }
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    }
                },
                datalabels: {
                    display: true
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        },
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Show error message
function showError(message) {
    document.getElementById('loadingOverlay').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('noDataContainer').style.display = 'none';
    document.getElementById('errorContainer').style.display = 'flex';
    document.getElementById('errorMessage').textContent = message;
}

// Show no data message
function showNoData() {
    document.getElementById('loadingOverlay').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('errorContainer').style.display = 'none';
    document.getElementById('noDataContainer').style.display = 'flex';
}

// Show main content
function showMainContent() {
    document.getElementById('loadingOverlay').style.display = 'none';
    document.getElementById('errorContainer').style.display = 'none';
    document.getElementById('noDataContainer').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('lastUpdate').textContent = `Last updated: ${formatted}`;
}

// Handle window resize with debouncing
let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Resize charts
        Object.values(chartInstances).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }, 250);
}

// Main initialization function
async function initDashboard() {
    try {
        // Fetch data
        const apiResponse = await fetchSheetData();
        
        // Process data
        const processedRows = processData(apiResponse);
        
        // Check if we have data
        if (processedRows.length === 0) {
            showNoData();
            return;
        }

        // Calculate statistics
        const stats = calculateStatistics(processedRows);
        
        // Aggregate data
        const areaData = aggregateByArea(processedRows);
        const jobData = categorizeJobs(processedRows);
        const damagesData = processDamages(processedRows);

        // Update UI
        showMainContent();
        updateStatistics(stats);
        updateLastUpdated();

        // Create charts
        createAreaChart(areaData);
        createJobChart(jobData);
        createDamagesChart(damagesData);

        // Setup resize handler
        window.addEventListener('resize', handleResize);

    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showError(error.message || 'Failed to load dashboard data. Please try again later.');
    }
}

// Start the dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);
