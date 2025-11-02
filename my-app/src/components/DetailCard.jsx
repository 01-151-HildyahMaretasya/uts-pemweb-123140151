import { useState } from 'react';

const DetailCard = ({ 
  weatherData, 
  getWeatherIcon, 
  formatTime, 
  unit, 
  temperatureSymbol,
  showCompare = false,
  jakartaWeather = null,
  iknWeather = null
}) => {
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

  const handleCompare = (city) => {
    setCompareCity(city);
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
        return { text: `${Math.abs(diff).toFixed(1)}° warmer`, color: '#f97316', icon: '🔥' };
      } else if (diff < 0) {
        return { text: `${Math.abs(diff).toFixed(1)}° cooler`, color: '#06b6d4', icon: '❄️' };
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

        {/* Compare Buttons - Only show after search */}
        {showCompare && jakartaWeather && iknWeather && (
          <div className="compare-buttons-section">
            <h4 className="compare-title">Compare with:</h4>
            <div className="compare-buttons">
              <button 
                className="compare-button"
                onClick={() => handleCompare(jakartaWeather)}
                aria-label="Compare weather with Jakarta"
              >
                <span className="compare-icon">⚖️</span>
                Jakarta
              </button>
              <button 
                className="compare-button"
                onClick={() => handleCompare(iknWeather)}
                aria-label="Compare weather with IKN Nusantara"
              >
                <span className="compare-icon">⚖️</span>
                IKN Nusantara
              </button>
            </div>
          </div>
        )}
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
              {name}, {sys.country} vs {compareCity.name}, {compareCity.sys.country}
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
                  <div className="comparison-temp">{temperature}{temperatureSymbol}</div>
                  <div className="comparison-desc">{weather[0].description}</div>
                </div>
                <div className="comparison-details">
                  <div className="comparison-detail-item">
                    <span className="detail-label">Feels Like</span>
                    <span className="detail-value">{feelsLike}{temperatureSymbol}</span>
                  </div>
                  <div className="comparison-detail-item">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{humidity}%</span>
                  </div>
                  <div className="comparison-detail-item">
                    <span className="detail-label">Wind Speed</span>
                    <span className="detail-value">{wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span>
                  </div>
                </div>
              </div>

              {/* Comparison Indicators */}
              <div className="comparison-indicators">
                <div className="indicator-item">
                  <span className="indicator-label">Temperature</span>
                  <div className="indicator-badge" style={{ 
                    backgroundColor: getComparison(temperature, Math.round(compareCity.main.temp), 'temp').color + '20',
                    color: getComparison(temperature, Math.round(compareCity.main.temp), 'temp').color
                  }}>
                    <span className="indicator-icon">
                      {getComparison(temperature, Math.round(compareCity.main.temp), 'temp').icon}
                    </span>
                    {getComparison(temperature, Math.round(compareCity.main.temp), 'temp').text}
                  </div>
                </div>

                <div className="indicator-item">
                  <span className="indicator-label">Feels Like</span>
                  <div className="indicator-badge" style={{ 
                    backgroundColor: getComparison(feelsLike, Math.round(compareCity.main.feels_like), 'temp').color + '20',
                    color: getComparison(feelsLike, Math.round(compareCity.main.feels_like), 'temp').color
                  }}>
                    <span className="indicator-icon">
                      {getComparison(feelsLike, Math.round(compareCity.main.feels_like), 'temp').icon}
                    </span>
                    {getComparison(feelsLike, Math.round(compareCity.main.feels_like), 'temp').text}
                  </div>
                </div>

                <div className="indicator-item">
                  <span className="indicator-label">Humidity</span>
                  <div className="indicator-badge" style={{ 
                    backgroundColor: getComparison(humidity, compareCity.main.humidity).color + '20',
                    color: getComparison(humidity, compareCity.main.humidity).color
                  }}>
                    <span className="indicator-icon">
                      {getComparison(humidity, compareCity.main.humidity).icon}
                    </span>
                    {getComparison(humidity, compareCity.main.humidity).text}
                  </div>
                </div>

                <div className="indicator-item">
                  <span className="indicator-label">Wind Speed</span>
                  <div className="indicator-badge" style={{ 
                    backgroundColor: getComparison(wind.speed, compareCity.wind.speed).color + '20',
                    color: getComparison(wind.speed, compareCity.wind.speed).color
                  }}>
                    <span className="indicator-icon">
                      {getComparison(wind.speed, compareCity.wind.speed).icon}
                    </span>
                    {getComparison(wind.speed, compareCity.wind.speed).text}
                  </div>
                </div>
              </div>

              {/* Compare City */}
              <div className="comparison-card">
                <div className="comparison-card-header">
                  <h3>{compareCity.name}, {compareCity.sys.country}</h3>
                  <span className="comparison-badge compare-badge">Reference</span>
                </div>
                <div className="comparison-main">
                  <div className="comparison-icon">{getWeatherIcon(compareCity.weather[0].icon)}</div>
                  <div className="comparison-temp">{Math.round(compareCity.main.temp)}{temperatureSymbol}</div>
                  <div className="comparison-desc">{compareCity.weather[0].description}</div>
                </div>
                <div className="comparison-details">
                  <div className="comparison-detail-item">
                    <span className="detail-label">Feels Like</span>
                    <span className="detail-value">{Math.round(compareCity.main.feels_like)}{temperatureSymbol}</span>
                  </div>
                  <div className="comparison-detail-item">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{compareCity.main.humidity}%</span>
                  </div>
                  <div className="comparison-detail-item">
                    <span className="detail-label">Wind Speed</span>
                    <span className="detail-value">{compareCity.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .compare-buttons-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid rgba(229, 231, 235, 0.5);
        }

        .compare-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--gray-700);
          margin-bottom: 1rem;
          text-align: center;
        }

        .compare-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }

        .compare-button {
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
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

        /* Comparison Modal Styles */
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
          background: #e5e7eb;
          color: #374151;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: #d1d5db;
          transform: rotate(90deg);
        }

        .comparison-title {
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .comparison-subtitle {
          font-size: 1rem;
          color: #6b7280;
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
          border: 2px solid #e5e7eb;
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
          color: #111827;
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
          border-bottom: 2px solid #e5e7eb;
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
          color: #374151;
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
          border: 1px solid #e5e7eb;
        }

        .comparison-detail-item .detail-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 600;
        }

        .comparison-detail-item .detail-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #111827;
        }

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
          color: #6b7280;
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

          .compare-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default DetailCard;