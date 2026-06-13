/**
 * Main Application Logic
 * Handles UI interactions and option chain updates
 */

let refreshInterval = null;
let isRunning = false;

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    document.getElementById('startBtn').addEventListener('click', startFetching);
    document.getElementById('stopBtn').addEventListener('click', stopFetching);
    document.getElementById('refreshRate').addEventListener('change', updateRefreshRate);
    document.getElementById('strikeFilter').addEventListener('input', applyFilters);
    document.getElementById('expiryFilter').addEventListener('change', applyFilters);
}

/**
 * Start fetching option chain data
 */
async function startFetching() {
    const apiKey = document.getElementById('apiKey').value.trim();
    
    if (!apiKey) {
        updateStatus('Please enter API key', 'error');
        return;
    }

    try {
        // Initialize API
        api = new AngleOneAPI(apiKey);
        
        // For demo purposes, we'll skip actual authentication
        // In production, you'd authenticate with user credentials
        updateStatus('Fetching data...', 'active');
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('apiKey').disabled = true;
        isRunning = true;

        // Initial fetch
        await fetchAndUpdateOptionChain();

        // Set up interval for continuous updates
        const refreshRate = parseInt(document.getElementById('refreshRate').value) * 1000;
        refreshInterval = setInterval(fetchAndUpdateOptionChain, refreshRate);
        
        updateStatus('Fetching live data', 'active');
    } catch (error) {
        updateStatus(`Error: ${error.message}`, 'error');
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        isRunning = false;
    }
}

/**
 * Stop fetching option chain data
 */
function stopFetching() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
    
    isRunning = false;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('apiKey').disabled = false;
    updateStatus('Stopped', 'error');
}

/**
 * Fetch and update option chain data
 */
async function fetchAndUpdateOptionChain() {
    try {
        // Using mock data for demonstration
        // In production, replace with actual API calls
        const mockData = generateMockOptionChain();
        
        // Update tables
        updateCallTable(mockData.calls);
        updatePutTable(mockData.puts);
        updateSpotPrice(mockData.spotPrice);
        updateLastUpdateTime();
    } catch (error) {
        console.error('Error fetching option chain:', error);
        updateStatus(`Error: ${error.message}`, 'error');
    }
}

/**
 * Update call options table
 */
function updateCallTable(calls) {
    const tbody = document.querySelector('#callTable tbody');
    
    if (!calls || calls.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = calls.map(call => `
        <tr>
            <td><strong>${call.strikePrice}</strong></td>
            <td>${formatNumber(call.bid)}</td>
            <td>${formatNumber(call.ask)}</td>
            <td class="${call.lastPrice >= call.bid ? 'positive' : 'negative'}">${formatNumber(call.lastPrice)}</td>
            <td>${formatNumber(call.volume)}</td>
            <td>${formatNumber(call.openInterest)}</td>
            <td>${formatNumber(call.impliedVol, 4)}</td>
            <td>${formatNumber(call.delta, 4)}</td>
        </tr>
    `).join('');
}

/**
 * Update put options table
 */
function updatePutTable(puts) {
    const tbody = document.querySelector('#putTable tbody');
    
    if (!puts || puts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = puts.map(put => `
        <tr>
            <td><strong>${put.strikePrice}</strong></td>
            <td>${formatNumber(put.bid)}</td>
            <td>${formatNumber(put.ask)}</td>
            <td class="${put.lastPrice >= put.bid ? 'positive' : 'negative'}">${formatNumber(put.lastPrice)}</td>
            <td>${formatNumber(put.volume)}</td>
            <td>${formatNumber(put.openInterest)}</td>
            <td>${formatNumber(put.impliedVol, 4)}</td>
            <td>${formatNumber(put.delta, 4)}</td>
        </tr>
    `).join('');
}

/**
 * Update spot price display
 */
function updateSpotPrice(price) {
    document.getElementById('spotPrice').textContent = `₹ ${formatNumber(price)}`;
}

/**
 * Update last update time
 */
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN');
    document.getElementById('lastUpdate').textContent = `Last updated: ${timeString}`;
}

/**
 * Apply filters to tables
 */
function applyFilters() {
    const strikeFilter = document.getElementById('strikeFilter').value.trim();
    const expiryFilter = document.getElementById('expiryFilter').value;

    // Filter call table
    filterTable('#callTable', strikeFilter);
    // Filter put table
    filterTable('#putTable', strikeFilter);
}

/**
 * Filter table rows based on strike price
 */
function filterTable(tableSelector, strikeFilter) {
    const rows = document.querySelectorAll(`${tableSelector} tbody tr`);
    
    rows.forEach(row => {
        if (!strikeFilter) {
            row.style.display = '';
            return;
        }
        
        const strikePrice = row.cells[0].textContent.trim();
        row.style.display = strikePrice.includes(strikeFilter) ? '' : 'none';
    });
}

/**
 * Update refresh rate
 */
function updateRefreshRate() {
    if (isRunning) {
        stopFetching();
        startFetching();
    }
}

/**
 * Update status indicator
 */
function updateStatus(message, type = 'default') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
}

/**
 * Format numbers for display
 */
function formatNumber(num, decimals = 2) {
    if (num === null || num === undefined) return '-';
    return parseFloat(num).toFixed(decimals);
}

/**
 * Generate mock option chain data for demonstration
 */
function generateMockOptionChain() {
    const spotPrice = 2850 + Math.random() * 50;
    const strikes = [2800, 2850, 2900, 2950, 3000, 3050, 3100];
    
    const calls = strikes.map(strike => ({
        strikePrice: strike,
        bid: Math.max(spotPrice - strike, 1) + Math.random() * 5,
        ask: Math.max(spotPrice - strike, 1) + Math.random() * 10,
        lastPrice: Math.max(spotPrice - strike, 1) + Math.random() * 8,
        volume: Math.floor(Math.random() * 100000),
        openInterest: Math.floor(Math.random() * 500000),
        impliedVol: 0.20 + Math.random() * 0.10,
        delta: Math.random() * 0.8
    }));

    const puts = strikes.map(strike => ({
        strikePrice: strike,
        bid: Math.max(strike - spotPrice, 1) + Math.random() * 5,
        ask: Math.max(strike - spotPrice, 1) + Math.random() * 10,
        lastPrice: Math.max(strike - spotPrice, 1) + Math.random() * 8,
        volume: Math.floor(Math.random() * 100000),
        openInterest: Math.floor(Math.random() * 500000),
        impliedVol: 0.20 + Math.random() * 0.10,
        delta: Math.random() * 0.8
    }));

    return { spotPrice, calls, puts };
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateStatus('Ready');
});