import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import DataTable from './components/DataTable';
import DetailCard from './components/DetailCard';

// Mock data untuk testing tampilan
const MOCK_WEATHER_DATA = {
  name: 'Jakarta',
  sys: { country: 'ID' },
  weather: [
    {
      main: 'Clouds',
      description: 'broken clouds',
      icon: '04d'
    }
  ],
  main: {
    temp: 31.5,
    feels_like: 35.2,
    temp_min: 30.1,
    temp_max: 32.8,
    pressure: 1010,
    humidity: 74
  },
  wind: {
    speed: 3.5,
    deg: 180
  },
  clouds: {
    all: 75
  },
  visibility: 8000,
  dt: Date.now() / 1000
};

const MOCK_FORECAST_DATA = [
  {
    dt: Date.now() / 1000 + 86400,
    weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
    main: {
      temp: 29.5,
      temp_min: 27.2,
      temp_max: 31.1,
      feels_like: 33.1,
      humidity: 80
    },
    wind: { speed: 4.2 }
  },
  {
    dt: Date.now() / 1000 + 172800,
    weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
    main: {
      temp: 30.8,
      temp_min: 28.5,
      temp_max: 32.4,
      feels_like: 34.5,
      humidity: 72
    },
    wind: { speed: 3.8 }
  },
  {
    dt: Date.now() / 1000 + 259200,
    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
    main: {
      temp: 32.1,
      temp_min: 29.8,
      temp_max: 33.9,
      feels_like: 36.2,
      humidity: 68
    },
    wind: { speed: 2.9 }
  },
  {
    dt: Date.now() / 1000 + 345600,
    weather: [{ main: 'Rain', description: 'moderate rain', icon: '10d' }],
    main: {
      temp: 28.3,
      temp_min: 26.1,
      temp_max: 29.8,
      feels_like: 31.5,
      humidity: 85
    },
    wind: { speed: 5.1 }
  },
  {
    dt: Date.now() / 1000 + 432000,
    weather: [{ main: 'Clouds', description: 'overcast clouds', icon: '04d' }],
    main: {
      temp: 30.2,
      temp_min: 28.7,
      temp_max: 31.6,
      feels_like: 33.8,
      humidity: 75
    },
    wind: { speed: 3.3 }
  }
];

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [searchHistory, setSearchHistory] = useState([
    'Jakarta',
    'Surabaya',
    'Bandung',
    'London',
    'New York'
  ]);

  // Auto-load mock data on mount untuk preview
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setWeatherData(MOCK_WEATHER_DATA);
      setForecastData(MOCK_FORECAST_DATA);
      setLoading(false);
    }, 1000);
  }, []);

  const convertTemperature = (temp, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return temp;
    if (toUnit === 'imperial') {
      return (temp * 9/5) + 32;
    } else {
      return (temp - 32) * 5/9;
    }
  };

  const convertMockDataUnit = (data, newUnit) => {
    if (!data) return null;
    
    const convertTemp = (temp) => {
      return newUnit === 'imperial' 
        ? convertTemperature(temp, 'metric', 'imperial')
        : temp;
    };

    return {
      ...data,
      main: {
        ...data.main,
        temp: convertTemp(data.main.temp),
        feels_like: convertTemp(data.main.feels_like),
        temp_min: convertTemp(data.main.temp_min),
        temp_max: convertTemp(data.main.temp_max)
      }
    };
  };

  const handleSearch = (city) => {
    // Simulate API call
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      // Simulate different cities with different data
      const mockData = {
        ...MOCK_WEATHER_DATA,
        name: city,
        main: {
          ...MOCK_WEATHER_DATA.main,
          temp: 25 + Math.random() * 10,
          feels_like: 28 + Math.random() * 10,
        }
      };
      
      setWeatherData(convertMockDataUnit(mockData, unit));
      setForecastData(MOCK_FORECAST_DATA);
      
      // Add to history
      setSearchHistory((prevHistory) => {
        const filtered = prevHistory.filter((item) => item !== city);
        const newHistory = [city, ...filtered].slice(0, 10);
        return newHistory;
      });
      
      setLoading(false);
    }, 800);
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    
    // Convert existing data
    if (weatherData) {
      const convertedWeather = convertMockDataUnit(weatherData, newUnit);
      setWeatherData(convertedWeather);
      
      const convertedForecast = forecastData.map(item => ({
        ...item,
        main: {
          ...item.main,
          temp: newUnit === 'imperial' 
            ? convertTemperature(item.main.temp, 'metric', 'imperial')
            : item.main.temp,
          temp_min: newUnit === 'imperial'
            ? convertTemperature(item.main.temp_min, 'metric', 'imperial')
            : item.main.temp_min,
          temp_max: newUnit === 'imperial'
            ? convertTemperature(item.main.temp_max, 'metric', 'imperial')
            : item.main.temp_max,
          feels_like: newUnit === 'imperial'
            ? convertTemperature(item.main.feels_like, 'metric', 'imperial')
            : item.main.feels_like,
        }
      }));
      
      setForecastData(convertedForecast);
    }
  };

  const handleHistoryClick = (city) => {
    handleSearch(city);
  };

  const getWeatherIcon = (weatherCode) => {
    const iconMap = {
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
    return iconMap[weatherCode] || '🌤️';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTemperatureSymbol = () => (unit === 'metric' ? '°C' : '°F');

  const getWeatherClass = () => {
    if (!weatherData) return '';
    const condition = weatherData.weather[0].main.toLowerCase();
    if (condition.includes('rain')) return 'weather-rain';
    if (condition.includes('snow')) return 'weather-snow';
    if (condition.includes('cloud')) return 'weather-clouds';
    return '';
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

        {weatherData && !loading && (
          <>
            <DetailCard
              weatherData={weatherData}
              getWeatherIcon={getWeatherIcon}
              formatTime={formatTime}
              unit={unit}
              temperatureSymbol={getTemperatureSymbol()}
            />

            {forecastData.length > 0 && (
              <DataTable
                forecastData={forecastData}
                formatDate={formatDate}
                getWeatherIcon={getWeatherIcon}
                temperatureSymbol={getTemperatureSymbol()}
              />
            )}
          </>
        )}

        {searchHistory.length > 0 && (
          <div className="history-section">
            <h3>Recent Searches</h3>
            <div className="history-list">
              {searchHistory.map((city, index) => (
                <button
                  key={`${city}-${index}`}
                  className="history-item"
                  onClick={() => handleHistoryClick(city)}
                  disabled={loading}
                  aria-label={`Search weather for ${city}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Mode Banner */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(37, 99, 235, 0.95)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        fontSize: '0.9rem',
        fontWeight: '600',
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}>
      </div>
    </div>
  );
}

export default App;