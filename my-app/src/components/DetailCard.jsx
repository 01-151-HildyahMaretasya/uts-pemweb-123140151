const DetailCard = ({ weatherData, getWeatherIcon, formatTime, unit, temperatureSymbol }) => {
  if (!weatherData) return null;

  const { name, sys, weather, main, wind, clouds, dt } = weatherData;

  const weatherIcon = getWeatherIcon(weather[0].icon);
  const temperature = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);
  const humidity = main.humidity;
  const pressure = main.pressure;
  const windSpeed = unit === 'metric' ? `${wind.speed} m/s` : `${wind.speed} mph`;
  const cloudiness = clouds.all;
  const visibility = weatherData.visibility
    ? `${(weatherData.visibility / 1000).toFixed(1)} km`
    : 'N/A';

  const getWindDirection = (degree) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degree / 45) % 8];
  };

  const windDirection = wind.deg ? getWindDirection(wind.deg) : '';

  return (
    <div
      className="current-weather"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
        maxWidth: '900px',
        margin: '1.5rem auto',
        fontFamily: `'Inter', 'Segoe UI', Roboto, sans-serif`,
        color: '#1e293b',
      }}
    >
      {/* Header */}
      <div
        className="weather-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '1.2rem',
        }}
      >
        <div className="location-info">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' }}>
            {name}, {sys.country}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#475569' }}>
            {formatTime(dt)} •{' '}
            {new Date(dt * 1000).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div
          className="weather-icon-large"
          role="img"
          aria-label={weather[0].description}
          style={{ fontSize: '3rem' }}
        >
          {weatherIcon}
        </div>
      </div>

      {/* Temperature */}
      <div
        className="temperature-display"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '3rem', fontWeight: '700' }}>{temperature}</span>
          <span style={{ fontSize: '1.4rem', marginLeft: '4px', color: '#64748b' }}>
            {temperatureSymbol}
          </span>
        </div>
        <p
          style={{
            marginTop: '0.3rem',
            fontSize: '1rem',
            textTransform: 'capitalize',
            color: '#475569',
          }}
        >
          {weather[0].description}
        </p>
      </div>

      {/* Details - Mendatar */}
      <div
        className="weather-details"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '1rem',
        }}
      >
        {[
          { label: 'Feels Like', icon: '🌡️', value: `${feelsLike}${temperatureSymbol}` },
          { label: 'Humidity', icon: '💧', value: `${humidity}%` },
          {
            label: 'Wind',
            icon: '💨',
            value: `${windSpeed} ${windDirection}`,
          },
          { label: 'Pressure', icon: '🔽', value: `${pressure} hPa` },
          { label: 'Cloudiness', icon: '☁️', value: `${cloudiness}%` },
          { label: 'Visibility', icon: '👁️', value: visibility },
        ].map((item) => (
          <div
            key={item.label}
            className="detail-item"
            style={{
              flex: '1 1 120px',
              minWidth: '120px',
              textAlign: 'center',
              background: 'white',
              padding: '0.8rem 0.6rem',
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease',
            }}
          >
            <div
              style={{
                fontSize: '1.2rem',
                marginBottom: '0.3rem',
                opacity: 0.8,
              }}
            >
              {item.icon}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#0f172a' }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailCard;
