// Angle One API Configuration
const CONFIG = {
    API_BASE_URL: 'https://api.smartapi.angelbroking.com',
    RELIANCE_SYMBOL: 'RELIANCE',
    RELIANCE_TOKEN: '99926000', // Reliance stock token in Angle One
    DEFAULT_REFRESH_RATE: 5, // seconds
    
    // Option chain symbols (these are example tokens)
    // You'll need to fetch the actual tokens from Angle One API
    OPTION_EXPIRY: {
        CURRENT_WEEK: '230721',
        NEXT_WEEK: '230728',
        CURRENT_MONTH: '230831'
    },

    // API Endpoints
    ENDPOINTS: {
        QUOTE: '/rest/secure/angelbroking/market/quote/',
        SEARCH: '/rest/secure/angelbroking/market/search/',
        OPTION_CHAIN: '/rest/secure/angelbroking/market/optionchain/'
    }
};

// User configuration (to be filled from UI)
let userConfig = {
    apiKey: null,
    authToken: null,
    userId: null,
    refreshRate: CONFIG.DEFAULT_REFRESH_RATE
};