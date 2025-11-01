const DetailCard = ({ weatherData, getWeatherIcon, formatTime, unit, temperatureSymbol }) => {
  if (!weatherData) return null;

  const {
    name,
    sys,
    weather,
    main,
    wind,
    clouds,
    dt,
  } = weatherData;

  const weatherIcon = getWeatherIcon(weather[0].icon);
  const temperature = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);
  const humidity = main.humidity;
  const pressure = main.pressure;
  const windSpeed = unit === 'metric' 
    ? `${wind.speed} m/s` 
    : `${wind.speed} mph`;
  const cloudiness = clouds.all;
  const visibility = weatherData.visibility 
    ? `${(weatherData.visibility / 1000).toFixed(1)} km` 
    : 'N/A';

  // Get wind direction
  const getWindDirection = (degree) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  };

  const windDirection = wind.deg ? getWindDirection(wind.deg) : '';

  return (
    <div className="current-weather">
      <div className="weather-header">
        <div className="location-info">
          <h2>{name}, {sys.country}</h2>
          <p>
            {formatTime(dt)} • {new Date(dt * 1000).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="weather-icon-large" role="img" aria-label={weather[0].description}>
          {weatherIcon}
        </div>
      </div>

      <div className="temperature-display">
        <span className="temp-value">{temperature}</span>
        <span className="temp-unit">{temperatureSymbol}</span>
      </div>

      <p className="weather-description">{weather[0].description}</p>

      <div className="weather-details">
        <div className="detail-item">
          <div className="detail-label">Feels Like</div>
          <div className="detail-value">
            <span className="detail-icon">🌡️</span>
            {feelsLike}{temperatureSymbol}
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-label">Humidity</div>
          <div className="detail-value">
            <span className="detail-icon">💧</span>
            {humidity}%
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-label">Wind Speed</div>
          <div className="detail-value">
            <span className="detail-icon">💨</span>
            {windSpeed}
            {windDirection && <span style={{ fontSize: '0.9rem', marginLeft: '4px' }}>
              {windDirection}
            </span>}
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-label">Pressure</div>
          <div className="detail-value">
            <span className="detail-icon">🔽</span>
            {pressure} hPa
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-label">Cloudiness</div>
          <div className="detail-value">
            <span className="detail-icon">☁️</span>
            {cloudiness}%
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-label">Visibility</div>
          <div className="detail-value">
            <span className="detail-icon">👁️</span>
            {visibility}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;