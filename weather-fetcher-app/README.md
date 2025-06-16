# Weather Data Fetcher

A client-side web application that fetches weather data for multiple ZIP codes using the OpenWeatherMap API.

## Features

- 🌤️ Bulk weather data fetching for multiple ZIP codes
- 📊 Real-time progress tracking with live updates
- 📱 Responsive, mobile-friendly design
- 📄 CSV export functionality
- 🚀 Controlled batch processing to respect API rate limits
- ⚡ Client-side processing - no backend server required

## How to Use

### 1. Get an API Key
- Sign up at [OpenWeatherMap](https://openweathermap.org/api) for a free API key
- The free tier allows 1,000 API calls per day

### 2. Enter Your Data
- Paste your API key in the designated field
- Add ZIP codes (one per line) in the text area
- Example ZIP codes: 10001, 90210, 60601, 33101, 02101

### 3. Start Processing
- Click "Start Fetching Weather" to begin
- Monitor real-time progress in the activity log
- The app processes ZIP codes in batches to avoid rate limits

### 4. Review and Download
- Preview the first 5 results in the data table
- Download the complete CSV file with all weather data

## Weather Data Collected

For each ZIP code, the app collects:
- **Location**: ZIP code and city name
- **Temperature**: Current temp and "feels like" (°F and °C)
- **Conditions**: Humidity, atmospheric pressure, weather description
- **Wind**: Speed (m/s) and direction (degrees)
- **Sky**: Cloud cover percentage
- **Sun**: Sunrise and sunset times (UTC)
- **Time**: Date and time of observation (UTC)

## CSV Output Format

The generated CSV includes these columns:
- `zip_code` - ZIP code
- `city` - City name
- `date_time_utc` - Observation timestamp (UTC)
- `temp_f` / `temp_c` - Temperature in Fahrenheit/Celsius
- `feels_like_f` / `feels_like_c` - Feels like temperature
- `humidity` - Humidity percentage
- `pressure_hpa` - Atmospheric pressure in hPa
- `wind_speed_mps` - Wind speed in meters per second
- `wind_direction_deg` - Wind direction in degrees
- `cloud_cover_percent` - Cloud cover percentage
- `sunrise_utc` / `sunset_utc` - Sun times in UTC
- `weather_description` - Weather condition description

## Rate Limiting

The app includes built-in rate limiting:
- Processes 3 ZIP codes simultaneously
- 1-second delay between batches
- Respects OpenWeatherMap's free tier limits

## Error Handling

The application handles various scenarios:
- Invalid API keys
- ZIP codes not found
- Network timeouts
- Rate limiting
- Invalid input data

All errors are logged in the activity log with timestamps.

## Technical Details

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **API**: Direct calls to OpenWeatherMap API
- **Processing**: Client-side with controlled concurrency
- **Export**: Browser-based CSV generation

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript features
- Fetch API
- File download via Blob URLs

## Privacy & Security

- All processing happens in your browser
- API key is never stored or transmitted to any server
- Weather data is processed locally
- No data is collected or stored by this application

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Verify your OpenWeatherMap API key is correct and active
2. **"ZIP code not found"**: Some ZIP codes may not be recognized by the API
3. **Rate limiting**: The app automatically handles rate limits with delays
4. **Network errors**: Check your internet connection

### Tips for Best Results

- Use valid US ZIP codes (5-digit format)
- Don't exceed 1,000 requests per day on the free tier
- Allow the app to complete processing before starting a new batch
- Check the activity log for detailed error information

## License

This project is open source and available under the MIT License.
