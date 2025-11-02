import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import DataTable from './components/DataTable';
import DetailCard from './components/DetailCard';

// API Configuration - OpenWeatherMap
const API_KEY = '2a03b14974b5cdcb68aaacf0556e7d77';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [jakartaWeather, setJakartaWeather] = useState(null);
  const [denpasarWeather, setDenpasarWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [staticLoading, setStaticLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('weatherSearchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Fetch static cities (Jakarta & Denpasar) on mount and every 10 minutes
  useEffect(() => {
    fetchStaticCities();
    const interval = setInterval(fetchStaticCities, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, [unit]);

  const fetchStaticCities = async () => {
    setStaticLoading(true);
    try {
      const [jakarta, denpasar] = await Promise.all([
        fetchWeather('Jakarta', unit),
        fetchWeather('Denpasar', unit) // Denpasar 
      ]);
      setJakartaWeather(jakarta);
      setDenpasarWeather(denpasar);
    } catch (err) {
      console.error('Failed to fetch static cities:', err);
    } finally {
      setStaticLoading(false);
    }
  };

  const fetchWeather = async (city, units = 'metric') => {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        } else if (response.status === 401) {
          throw new Error('API key invalid. Please check your configuration.');
        } else {
          throw new Error('Failed to fetch weather data. Please try again.');
        }
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const fetchForecast = async (city, units = 'metric') => {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data.');
      }
      
      const data = await response.json();
      
      const dailyForecasts = [];
      const processedDates = new Set();
      
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        const hour = new Date(item.dt * 1000).getHours();
        
        if (!processedDates.has(date) && hour >= 11 && hour <= 14 && dailyForecasts.length < 5) {
          processedDates.add(date);
          dailyForecasts.push(item);
        }
      });
      
      if (dailyForecasts.length < 5) {
        data.list.forEach(item => {
          const date = new Date(item.dt * 1000).toDateString();
          if (!processedDates.has(date) && dailyForecasts.length < 5) {
            processedDates.add(date);
            dailyForecasts.push(item);
          }
        });
      }
      
      return dailyForecasts;
    } catch (err) {
      throw err;
    }
  };

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const [currentWeather, forecast] = await Promise.all([
        fetchWeather(city, unit),
        fetchForecast(city, unit)
      ]);

      setWeatherData(currentWeather);
      setForecastData(forecast);

      setSearchHistory((prev) => {
        const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
        return [city, ...filtered].slice(0, 10);
      });

    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnitChange = async (newUnit) => {
    setUnit(newUnit);
    
    if (weatherData) {
      setLoading(true);
      try {
        const [currentWeather, forecast] = await Promise.all([
          fetchWeather(weatherData.name, newUnit),
          fetchForecast(weatherData.name, newUnit)
        ]);
        setWeatherData(currentWeather);
        setForecastData(forecast);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleHistoryClick = (city) => {
    handleSearch(city);
  };

  const handleClearAllHistory = () => {
    if (confirm('Are you sure you want to clear all search history?')) {
      setSearchHistory([]);
      localStorage.removeItem('weatherSearchHistory');
    }
  };

  const getWeatherIcon = (code) => {
    const icons = {
      '01d': '☀️', '01n': '🌙', 
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️', 
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️', 
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️', 
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️',
    };
    return icons[code] || '🌤️';
  };

  const formatDate = (ts) =>
    new Date(ts * 1000).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });

  const formatTime = (ts) =>
    new Date(ts * 1000).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

  const getTemperatureSymbol = () => (unit === 'metric' ? '°C' : '°F');

  const getWeatherClass = () => {
    if (!weatherData) return '';
    const condition = weatherData.weather[0].main.toLowerCase();
    if (condition.includes('rain')) return 'weather-rain';
    if (condition.includes('snow')) return 'weather-snow';
    if (condition.includes('cloud')) return 'weather-clouds';
    return '';
  };

  // Render static weather card
  const renderStaticCard = (data, cityName) => {
    if (!data) {
      return (
        <div className="static-weather-card loading-card">
          <div className="loading-shimmer" style={{ height: '100%', borderRadius: '1.5rem' }}></div>
        </div>
      );
    }

    const icon = getWeatherIcon(data.weather[0].icon);
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;

    return (
      <div className="static-weather-card">
        <div className="static-weather-content">
          <h3 className="static-weather-city">{cityName}, {data.sys.country}</h3>
          <p className="static-weather-time">
            {formatTime(data.dt)} • {new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
          <div className="static-weather-icon">{icon}</div>
          <div className="static-weather-temp">{temp}{getTemperatureSymbol()}</div>
          <div className="static-weather-desc">{description}</div>
          
          <div className="static-weather-details">
            <div className="static-detail">
              <span className="static-detail-icon">🌡️</span>
              <div>
                <div className="static-detail-label">Feels Like</div>
                <div className="static-detail-value">{feelsLike}{getTemperatureSymbol()}</div>
              </div>
            </div>
            <div className="static-detail">
              <span className="static-detail-icon">💧</span>
              <div>
                <div className="static-detail-label">Humidity</div>
                <div className="static-detail-value">{humidity}%</div>
              </div>
            </div>
            <div className="static-detail">
              <span className="static-detail-icon">💨</span>
              <div>
                <div className="static-detail-label">Wind</div>
                <div className="static-detail-value">{windSpeed} {unit === 'metric' ? 'm/s' : 'mph'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`App ${getWeatherClass()}`}>
      <Header />

      <div className="main-content">
        <SearchForm 
          onSearch={handleSearch} 
          unit={unit} 
          onUnitChange={handleUnitChange} 
          loading={loading} 
        />

        {loading && (
          <div className="loading">
            <div className="loading-dots">
              Loading weather data<span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        {/* Search Results - Only shown after search - APPEARS FIRST */}
        {weatherData && !loading && (
          <div className="search-results-section">
            <DetailCard
              weatherData={weatherData}
              getWeatherIcon={getWeatherIcon}
              formatTime={formatTime}
              unit={unit}
              temperatureSymbol={getTemperatureSymbol()}
              showCompare={true}
              jakartaWeather={jakartaWeather}
              denpasarWeather={denpasarWeather}
            />
          </div>
        )}

        {/* Static Weather Cards - Always visible AFTER search results */}
        <div className="static-weather-section">
          <div className="static-weather-cards">
            {renderStaticCard(jakartaWeather, 'Jakarta')}
            {renderStaticCard(denpasarWeather, 'Denpasar')}
          </div>
        </div>

        {/* 5-Day Forecast - Only shown after search */}
        {weatherData && !loading && forecastData.length > 0 && (
          <DataTable
            forecastData={forecastData}
            formatDate={formatDate}
            getWeatherIcon={getWeatherIcon}
            temperatureSymbol={getTemperatureSymbol()}
          />
        )}

        <div className="history-section" aria-live="polite">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3>Recent Searches</h3>
            {searchHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllHistory}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                Clear All
              </button>
            )}
          </div>

          <div className="history-list">
            {searchHistory.length === 0 ? (
              <div className="history-empty">
                No search history yet. Start by searching for a city!
              </div>
            ) : (
              searchHistory.map((city, index) => (
                <button
                  key={`${city}-${index}`}
                  type="button"
                  onClick={() => handleHistoryClick(city)}
                  disabled={loading}
                  className="history-item"
                  title={`Search weather for ${city}`}
                >
                  📍 {city}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(37,99,235,0.95)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          fontSize: '0.9rem',
          fontWeight: '600',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
        }}
      >
        © 2025 Weather Dashboard | Powered by OpenWeatherMap
      </div>

      <style jsx>{`
        .static-weather-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1.5rem;
          text-align: center;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .search-results-section {
          margin: 2rem 0;
        }

        .static-weather-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .static-weather-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                      0 0 0 1px rgba(255, 255, 255, 0.2) inset;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 450px;
        }

        .static-weather-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
        }

        .loading-card {
          display: flex;
          align-items: center;
          justify-content: center;
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
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .static-weather-time {
          font-size: 0.875rem;
          color: #6b7280;
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
          color: #374151;
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
          margin-top: auto;
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
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 600;
          text-align: left;
        }

        .static-detail-value {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          text-align: left;
        }

        @media (max-width: 768px) {
          .static-weather-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default App;