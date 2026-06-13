# Reliance Option Chain - Live Data Website

A real-time option chain viewer for Reliance using the Angel One (Angle One) API.

## Features

✨ **Live Option Data**
- Real-time option chain data for Reliance
- Separate Call and Put options tables
- Live spot price updates
- Configurable refresh rate

📊 **Option Chain Display**
- Strike Price
- Bid/Ask prices
- Last traded price
- Volume and Open Interest
- Implied Volatility
- Delta values

🔍 **Filtering & Search**
- Filter by strike price
- Filter by expiry (Weekly/Monthly)
- Responsive filtering in real-time

## Setup Instructions

### Prerequisites

1. **Angel One Account**: Get an account at [Angel One](https://www.angelone.in/)
2. **API Key**: Generate API credentials from your Angel One dashboard
3. **Basic Web Server**: Any local server or hosting platform

### Installation

1. Clone this repository:
```bash
git clone https://github.com/nishant13062003-arch/Nishany.git
cd Nishany
```

2. Start a local web server:
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (http-server)
npx http-server
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## Usage

1. **Enter API Key**: Paste your Angel One API key in the input field
2. **Set Refresh Rate**: Configure how often to fetch data (in seconds)
3. **Start Fetching**: Click "Start Fetching" to begin receiving live data
4. **Filter Data**: Use the filter inputs to find specific strike prices
5. **Stop**: Click "Stop" to pause data fetching

## API Integration

The application uses the Angel One API endpoints:

- **Authentication**: `/rest/secure/angelbroking/user/login/`
- **Quote Data**: `/rest/secure/angelbroking/market/quote/`
- **Option Chain**: `/rest/secure/angelbroking/market/optionchain/`

## File Structure

```
.
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── config.js       # Configuration and constants
├── api.js          # Angel One API wrapper
├── app.js          # Main application logic
└── README.md       # This file
```

## Configuration

Edit `config.js` to customize:

- Angel One API base URL
- Reliance stock token
- Default refresh rate
- Option expiry dates

```javascript
const CONFIG = {
    API_BASE_URL: 'https://api.smartapi.angelbroking.com',
    RELIANCE_SYMBOL: 'RELIANCE',
    RELIANCE_TOKEN: '99926000',
    DEFAULT_REFRESH_RATE: 5
};
```

## Features in Detail

### Real-Time Updates
- Automatic data refresh at configurable intervals
- Live spot price updates
- Timestamp of last update

### Option Greeks
- **Delta**: Rate of change of option price with respect to spot price
- **Implied Volatility**: Market's expectation of future volatility

### Data Display
- Responsive design for desktop and mobile
- Color-coded price changes
- Sortable and filterable tables

## Troubleshooting

### API Key Error
- Verify your API key is correct
- Check your Angel One account has API access enabled
- Ensure your IP is whitelisted in Angel One settings

### No Data Displayed
- Check browser console for errors (F12)
- Verify API response in Network tab
- Ensure market is open (9:15 AM - 3:30 PM IST)

### Connection Timeout
- Check internet connection
- Verify Angel One API server status
- Try increasing refresh rate to reduce request frequency

## Browser Compatibility

✅ Chrome 60+
✅ Firefox 55+
✅ Safari 11+
✅ Edge 79+

## Security Notes

⚠️ **Important**: 
- Never commit your API key to version control
- Use environment variables for sensitive data in production
- Consider using a backend proxy for API calls
- Implement proper authentication in production

## Future Enhancements

- [ ] Option Greeks calculation
- [ ] Historical data charts
- [ ] Trade placement integration
- [ ] Custom alerts and notifications
- [ ] Dark mode
- [ ] Export to CSV/Excel
- [ ] Advanced charting with TradingView

## License

MIT License - feel free to use for personal and commercial projects

## Support

For issues or feature requests, please create an issue on GitHub.

## Disclaimer

This is a demonstration project. Always verify data with official sources before making trading decisions. The authors are not responsible for any losses incurred from using this application.

---

**Happy Trading! 📈**