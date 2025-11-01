import { useState } from 'react';

const DetailCard = ({ weatherData, getWeatherIcon, formatTime, unit, temperatureSymbol }) => {
  const [showComparison, setShowComparison] = useState(false);
  const [compareCity, setCompareCity] = useState(null);

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

  // Static data untuk Jakarta & IKN
  const staticCities = {
    jakarta: {
      name: 'Jakarta',
      country: 'ID',
      temp: 32,
      feelsLike: 35,
      humidity: 74,
      windSpeed: 3.5,
      icon: '☁️',
      description: 'Broken Clouds'
    },
    ikn: {
      name: 'IKN Nusantara',
      country: 'ID',
      temp: 30,
      feelsLike: 33,
      humidity: 65,
      windSpeed: 2.8,
      icon: '☀️',
      description: 'Clear Sky'
    }
  };

  const handleCompare = (cityKey) => {
    setCompareCity(staticCities[cityKey]);
    setShowComparison(true);
  };

  const closeComparison = () => {
    setShowComparison(false);
    setCompareCity(null);
  };

  const getComparison = (searchValue, compareValue, type = 'number') => {
    const diff = searchValue - compareValue;
    const percentage = Math.abs(((diff / compareValue) * 100).toFixed(1));
    
    if (type === 'temp') {
      if (diff > 0) {
        return { text: `${Math.abs(diff)}° warmer`, color: '#f97316', icon: '🔥' };
      } else if (diff < 0) {
        return { text: `${Math.abs(diff)}° cooler`, color: '#06b6d4', icon: '❄️' };
      } else {
        return { text: 'Same', color: '#10b981', icon: '=' };
      }
    } else {
      if (diff > 0) {
        return { text: `+${percentage}% higher`, color: '#f97316', icon: '↑' };
      } else if (diff < 0) {
        return { text: `${percentage}% lower`, color: '#06b6d4', icon: '↓' };
      } else {
        return { text: 'Same', color: '#10b981', icon: '=' };
      }
    }
  };

  return (
    <>
      {/* Main Weather Card */}
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

      {/* Jakarta & IKN Cards */}
      <div className="static-weather-cards">
        {Object.entries(staticCities).map(([key, city]) => (
          <div key={key} className="static-weather-card">
            <div className="static-weather-content">
              <h3 className="static-weather-city">{city.name}, {city.country}</h3>
              <p className="static-weather-time">
                {formatTime(dt)} • {new Date(dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
              <div className="static-weather-icon">{city.icon}</div>
              <div className="static-weather-temp">{city.temp}°C</div>
              <div className="static-weather-desc">{city.description}</div>
              
              <div className="static-weather-details">
                <div className="static-detail">
                  <span className="static-detail-icon">🌡️</span>
                  <div>
                    <div className="static-detail-label">Feels Like</div>
                    <div className="static-detail-value">{city.feelsLike}°C</div>
                  </div>
                </div>
                <div className="static-detail">
                  <span className="static-detail-icon">💧</span>
                  <div>
                    <div className="static-detail-label">Humidity</div>
                    <div className="static-detail-value">{city.humidity}%</div>
                  </div>
                </div>
                <div className="static-detail">
                  <span className="static-detail-icon">💨</span>
                  <div>
                    <div className="static-detail-label">Wind</div>
                    <div className="static-detail-value">{city.windSpeed} m/s</div>
                  </div>
                </div>
              </div>

              {/* Compare Button */}
              <button 
                className="compare-button"
                onClick={() => handleCompare(key)}
                aria-label={`Compare weather with ${city.name}`}
              >
                <span className="compare-icon">⚖️</span>
                Compare with {name}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Modal */}
      {showComparison && compareCity && (
        <div className="comparison-overlay" onClick={closeComparison}>
          <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeComparison} aria-label="Close comparison">
              ✕
            </button>
            
            <h2 className="comparison-title">
              Weather Comparison
            </h2>
            <p className="comparison-subtitle">
              {name}, {sys.country} vs {compareCity.name}, {compareCity.country}
            </p>

            <div className="comparison-grid">
              {/* Your Search City */}
              <div className="comparison-card">
                <div className="comparison-card-header">
                  <h3>{name}, {sys.country}</h3>
                  <span className="comparison-badge search-badge">Your Search</span>
                </div>
                <div className="comparison-main">
                  <div className="comparison-icon">{weatherIcon}</div>
                  <div className="comparison-temp">{temperature}°C</div>
                  <div className="comparison-desc">{weather[0].description}</div>
                </div>
                <div className="comparison-details">
                  <div className="comparison-detail-item">
                    <span className="detail-label">Feels Like</span>
                    <span className="detail-value">{feelsLike}°C</span>
                  </div>
                  <div className="comparison-detail-item">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{humidity}%</span>
                  </div>
                  <div className="comparison-detail-item">
                    <span className="detail-label">Wind Speed</span>
                    <span className="detail-value">{wind.speed} m/s</span>
                  </div>
                </div>
              </div>

              {/* Comparison Indicators */}
              <div className="comparison-indicators">
                <div className="indicator-item">
                  <span className="indicator-label">Temperature</span>
                  <div className="indicator-badge" style={{ 
                    backgroundColor: getComparison(temperature, compareCity.temp, 'temp').color + '20',
                    color: getComparison(temperature, compareCity.temp, 'temp').color
                  }}>
                    <span className="indicator-icon">
                      {getComparison(temperature, compareCity.temp, 'temp').icon}
                    </span>
                    {getComparison(temperature, compareCity.temp, 'temp').text}
                  </div>
                </div>

                <div className="indicator-item">
                  <span className="indicator-label">Feels Like</span>
                  <div className="indicator-badge" style={{ 
                    backgroundColor: getComparison(feelsLike, compareCity.feelsLike, 'temp').color + '20',
                    color: getComparison(feelsLike, compareCity.feelsLike, 'temp').color
                  }}>
                    <span className="indicator-icon">
                      {getComparison(feelsLike, compareCity.feelsLike, 'temp').icon}
                    </span>
                    {getComparison(feelsLike, compareCity.feelsLike, 'temp').text}
                  </div>
                </div>

                <div className="indicator-item">
                  <span className="indicator-label">Humidity</span>
                  <div className="indicator-badge" style={{ 
                    backgroundColor: getComparison(humidity, compareCity.humidity).color + '20',
                    color: getComparison(humidity, compareCity.humidity).color
                  }}>
                    <span className="indicator-icon">
                      {getComparison(humidity, compareCity.humidity).icon}
                    </span>
                    {getComparison(humidity, compareCity.humidity).text}
                  </div>
                </div>

                <div className="indicator-item">
                  <span className="indicator-label">Wind Speed</span>
                  <div className="indicator-badge" style={{ 
                    backgroundColor: getComparison(wind.speed, compareCity.windSpeed).color + '20',
                    color: getComparison(wind.speed, compareCity.windSpeed).color
                  }}>
                    <span className="indicator-icon">
                      {getComparison(wind.speed, compareCity.windSpeed).icon}
                    </span>
                    {getComparison(wind.speed, compareCity.windSpeed).text}
                  </div>
                </div>
              </div>

              {/* Compare City */}
              <div className="comparison-card">
                <div className="comparison-card-header">
                  <h3>{compareCity.name}, {compareCity.country}</h3>
                  <span className="comparison-badge compare-badge">Reference</span>
                </div>
                <div className="comparison-main">
                  <div className="comparison-icon">{compareCity.icon}</div>
                  <div className="comparison-temp">{compareCity.temp}°C</div>
                  <div className="comparison-desc">{compareCity.description}</div>
                </div>
                <div className="comparison-details">
                  <div className="comparison-detail-item">
                    <span className="detail-label">Feels Like</span>
                    <span className="detail-value">{compareCity.feelsLike}°C</span>
                  </div>
                  <div className="comparison-detail-item">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{compareCity.humidity}%</span>
                  </div>
                  <div className="comparison-detail-item">
                    <span className="detail-label">Wind Speed</span>
                    <span className="detail-value">{compareCity.windSpeed} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Static Weather Cards Styles */
        .static-weather-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg, 1.5rem);
          margin-bottom: var(--spacing-xl, 2rem);
        }

        .static-weather-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-2xl, 1.5rem);
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 450px;
        }

        .static-weather-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
        }

        .static-weather-content {
          padding: 2rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .static-weather-city {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--gray-900, #111827);
          margin-bottom: 0.5rem;
        }

        .static-weather-time {
          font-size: 0.875rem;
          color: var(--gray-600, #4b5563);
          margin-bottom: 1.5rem;
        }

        .static-weather-icon {
          font-size: 4rem;
          margin: 1rem 0;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .static-weather-temp {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0.5rem 0;
        }

        .static-weather-desc {
          font-size: 1.1rem;
          color: var(--gray-700);
          font-weight: 600;
          text-transform: capitalize;
          margin-bottom: 1.5rem;
        }

        .static-weather-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: rgba(243, 244, 246, 0.6);
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .static-detail {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 0.5rem;
        }

        .static-detail-icon {
          font-size: 1.5rem;
        }

        .static-detail-label {
          font-size: 0.75rem;
          color: var(--gray-600);
          text-transform: uppercase;
          font-weight: 600;
          text-align: left;
        }

        .static-detail-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--gray-900);
          text-align: left;
        }

        /* Compare Button */
        .compare-button {
          margin-top: auto;
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
        }

        .compare-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 12px -2px rgba(37, 99, 235, 0.4);
        }

        .compare-button:active {
          transform: translateY(0);
        }

        .compare-icon {
          font-size: 1.2rem;
        }

        /* Comparison Modal */
        .comparison-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .comparison-modal {
          background: white;
          border-radius: 1.5rem;
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
          position: relative;
          animation: slideUp 0.4s ease-out;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .close-button {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          border: none;
          background: var(--gray-200);
          color: var(--gray-700);
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: var(--gray-300);
          transform: rotate(90deg);
        }

        .comparison-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--gray-900);
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .comparison-subtitle {
          font-size: 1rem;
          color: var(--gray-600);
          text-align: center;
          margin-bottom: 2rem;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 2rem;
          align-items: start;
        }

        .comparison-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 2px solid var(--gray-200);
        }

        .comparison-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .comparison-card-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--gray-900);
        }

        .comparison-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .search-badge {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
        }

        .compare-badge {
          background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%);
          color: white;
        }

        .comparison-main {
          text-align: center;
          padding: 1rem 0;
          border-bottom: 2px solid var(--gray-200);
          margin-bottom: 1rem;
        }

        .comparison-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .comparison-temp {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .comparison-desc {
          font-size: 1rem;
          color: var(--gray-700);
          font-weight: 600;
          text-transform: capitalize;
        }

        .comparison-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .comparison-detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: white;
          border-radius: 0.5rem;
          border: 1px solid var(--gray-200);
        }

        .comparison-detail-item .detail-label {
          font-size: 0.875rem;
          color: var(--gray-600);
          font-weight: 600;
        }

        .comparison-detail-item .detail-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--gray-900);
        }

        /* Comparison Indicators */
        .comparison-indicators {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.5rem;
          min-width: 200px;
        }

        .indicator-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .indicator-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-600);
          text-align: center;
        }

        .indicator-badge {
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .indicator-icon {
          font-size: 1.1rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .comparison-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .comparison-indicators {
            min-width: auto;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .static-weather-cards {
            grid-template-columns: 1fr;
          }

          .comparison-modal {
            padding: 1.5rem;
          }

          .comparison-title {
            font-size: 1.5rem;
          }

          .indicator-badge {
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
    </>
  );
};

export default DetailCard;