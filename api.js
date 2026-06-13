/**
 * Angle One API Handler
 * Manages all API calls to fetch option chain data
 */

class AngleOneAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = CONFIG.API_BASE_URL;
        this.authToken = null;
        this.clientCode = null;
    }

    /**
     * Authenticate with Angle One API
     * @param {string} userId - Angel One user ID
     * @param {string} password - Angel One password
     * @returns {Promise<boolean>}
     */
    async authenticate(userId, password) {
        try {
            const response = await fetch(`${this.baseURL}/rest/secure/angelbroking/user/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    clientcode: userId,
                    password: password,
                    // totp field is required if 2FA is enabled
                })
            });

            if (!response.ok) {
                throw new Error(`Authentication failed: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.status && data.data) {
                this.authToken = data.data.authtoken;
                this.clientCode = data.data.clientcode;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    /**
     * Fetch quote data for a symbol
     * @param {string} symbol - Stock symbol (e.g., 'RELIANCE')
     * @param {string} token - Token for the symbol
     * @returns {Promise<Object>}
     */
    async getQuote(symbol, token) {
        try {
            const response = await fetch(`${this.baseURL}${CONFIG.ENDPOINTS.QUOTE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-ClientCode': this.clientCode,
                    'X-AuthToken': this.authToken
                },
                body: JSON.stringify({
                    mode: 'LTP',
                    exchangetokens: {
                        'NSE': [token]
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Quote fetch failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Quote fetch error:', error);
            throw error;
        }
    }

    /**
     * Fetch option chain data for Reliance
     * @param {string} expiryDate - Expiry date in format DDMMMYY (e.g., '20JUL23')
     * @returns {Promise<Array>}
     */
    async getOptionChain(expiryDate) {
        try {
            const response = await fetch(`${this.baseURL}${CONFIG.ENDPOINTS.OPTION_CHAIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-ClientCode': this.clientCode,
                    'X-AuthToken': this.authToken
                },
                body: JSON.stringify({
                    exchangetokens: {
                        'NFO': {
                            'RELIANCE': [expiryDate]
                        }
                    },
                    strikePrice: 0,
                    mode: 'FULL'
                })
            });

            if (!response.ok) {
                throw new Error(`Option chain fetch failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Option chain fetch error:', error);
            throw error;
        }
    }

    /**
     * Fetch option chain for multiple expiries
     * @returns {Promise<Object>}
     */
    async getCompleteOptionChain() {
        try {
            const expiries = [
                CONFIG.OPTION_EXPIRY.CURRENT_WEEK,
                CONFIG.OPTION_EXPIRY.NEXT_WEEK,
                CONFIG.OPTION_EXPIRY.CURRENT_MONTH
            ];

            const results = {};
            
            for (const expiry of expiries) {
                results[expiry] = await this.getOptionChain(expiry);
            }

            return results;
        } catch (error) {
            console.error('Complete option chain fetch error:', error);
            throw error;
        }
    }

    /**
     * Parse option chain data
     * @param {Array} data - Raw option chain data from API
     * @returns {Object} - Parsed data with calls and puts separated
     */
    parseOptionChain(data) {
        const calls = [];
        const puts = [];

        if (!data || !data.data) return { calls, puts };

        const chainData = data.data;
        
        for (const item of chainData) {
            const strike = {
                strikePrice: item.strikePrice,
                bid: item.bid,
                ask: item.ask,
                lastPrice: item.lastPrice,
                volume: item.volume,
                openInterest: item.oi,
                impliedVol: item.iv,
                delta: item.delta,
                expiry: item.expiry
            };

            if (item.optionType === 'CE') {
                calls.push(strike);
            } else if (item.optionType === 'PE') {
                puts.push(strike);
            }
        }

        // Sort by strike price
        calls.sort((a, b) => a.strikePrice - b.strikePrice);
        puts.sort((a, b) => a.strikePrice - b.strikePrice);

        return { calls, puts };
    }
}

// Create global API instance
let api = null;