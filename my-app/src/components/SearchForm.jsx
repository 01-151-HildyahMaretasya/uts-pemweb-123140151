import { useState, useEffect, useRef } from 'react';

const SearchForm = ({ onSearch, unit, onUnitChange, loading }) => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  // DAFTAR 98 KOTA DI INDONESIA (Sumber: Wikipedia - Daftar Kota di Indonesia)
  const popularCities = [
    // ===== PULAU JAWA (41 KOTA) =====
    
    // DKI Jakarta (1 Kota)
    'Jakarta',
    
    // Banten (4 Kota)
    'Cilegon', 'Serang', 'Tangerang', 'Tangerang Selatan',
    
    // Jawa Barat (9 Kota)
    'Bandung', 'Banjar', 'Bekasi', 'Bogor', 'Cimahi', 
    'Cirebon', 'Depok', 'Sukabumi', 'Tasikmalaya',
    
    // Jawa Tengah (6 Kota)
    'Magelang', 'Pekalongan', 'Salatiga', 'Semarang', 
    'Surakarta', 'Tegal',
    
    // DI Yogyakarta (1 Kota)
    'Yogyakarta',
    
    // Jawa Timur (9 Kota)
    'Batu', 'Blitar', 'Kediri', 'Madiun', 'Malang', 
    'Mojokerto', 'Pasuruan', 'Probolinggo', 'Surabaya',
    
    // ===== PULAU SUMATRA (25 KOTA) =====
    
    // Aceh (5 Kota)
    'Banda Aceh', 'Langsa', 'Lhokseumawe', 'Sabang', 'Subulussalam',
    
    // Sumatera Utara (8 Kota)
    'Binjai', 'Gunungsitoli', 'Medan', 'Padangsidimpuan', 
    'Pematangsiantar', 'Sibolga', 'Tanjungbalai', 'Tebing Tinggi',
    
    // Sumatera Barat (7 Kota)
    'Bukittinggi', 'Padang', 'Padang Panjang', 'Pariaman', 
    'Payakumbuh', 'Sawahlunto', 'Solok',
    
    // Riau (2 Kota)
    'Dumai', 'Pekanbaru',
    
    // Kepulauan Riau (2 Kota)
    'Batam', 'Tanjung Pinang',
    
    // Jambi (2 Kota)
    'Jambi', 'Sungai Penuh',
    
    // Sumatera Selatan (4 Kota)
    'Lubuklinggau', 'Pagar Alam', 'Palembang', 'Prabumulih',
    
    // Bangka Belitung (1 Kota)
    'Pangkal Pinang',
    
    // Bengkulu (1 Kota)
    'Bengkulu',
    
    // Lampung (2 Kota)
    'Bandar Lampung', 'Metro',
    
    // ===== PULAU KALIMANTAN (14 KOTA) =====
    
    // Kalimantan Barat (2 Kota)
    'Pontianak', 'Singkawang',
    
    // Kalimantan Tengah (1 Kota)
    'Palangkaraya',
    
    // Kalimantan Selatan (2 Kota)
    'Banjarbaru', 'Banjarmasin',
    
    // Kalimantan Timur (7 Kota)
    'Balikpapan', 'Bontang', 'Samarinda',
    
    // Kalimantan Utara (2 Kota)
    'Tarakan',
    
    // ===== PULAU SULAWESI (11 KOTA) =====
    
    // Sulawesi Utara (4 Kota)
    'Bitung', 'Kotamobagu', 'Manado', 'Tomohon',
    
    // Gorontalo (1 Kota)
    'Gorontalo',
    
    // Sulawesi Tengah (1 Kota)
    'Palu',
    
    // Sulawesi Barat (1 Kota)
    'Mamuju',
    
    // Sulawesi Selatan (3 Kota)
    'Makassar', 'Palopo', 'Parepare',
    
    // Sulawesi Tenggara (2 Kota)
    'Bau-Bau', 'Kendari',
    
    // ===== BALI & NUSA TENGGARA (3 KOTA) =====
    
    // Bali (1 Kota)
    'Denpasar',
    
    // Nusa Tenggara Barat (2 Kota)
    'Bima', 'Mataram',
    
    // Nusa Tenggara Timur (1 Kota)
    'Kupang',
    
    // ===== MALUKU & PAPUA (4 KOTA) =====
    
    // Maluku (2 Kota)
    'Ambon', 'Tual',
    
    // Maluku Utara (2 Kota)
    'Ternate', 'Tidore Kepulauan',
    
    // Papua (1 Kota)
    'Jayapura',
    
    // Papua Barat (1 Kota)
    'Sorong',
    
    // ===== KOTA INTERNASIONAL POPULER =====
    
    // Asia Tenggara
    'Singapore', 'Bangkok', 'Kuala Lumpur', 'Manila', 'Hanoi', 
    'Ho Chi Minh City', 'Phnom Penh', 'Vientiane', 'Yangon', 'Bandar Seri Begawan',
    
    // Asia Timur
    'Tokyo', 'Seoul', 'Beijing', 'Shanghai', 'Hong Kong', 
    'Taipei', 'Osaka', 'Kyoto', 'Busan',
    
    // Asia Selatan
    'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai',
    'Dhaka', 'Karachi', 'Islamabad', 'Colombo', 'Kathmandu',
    
    // Timur Tengah
    'Dubai', 'Abu Dhabi', 'Doha', 'Riyadh', 'Jeddah',
    'Kuwait City', 'Muscat', 'Manama', 'Amman', 'Beirut',
    'Tel Aviv', 'Jerusalem', 'Istanbul', 'Tehran', 'Baghdad',
    
    // Eropa Barat
    'London', 'Paris', 'Berlin', 'Madrid', 'Rome',
    'Amsterdam', 'Brussels', 'Vienna', 'Zurich', 'Geneva',
    'Barcelona', 'Milan', 'Munich', 'Hamburg', 'Frankfurt',
    'Lisbon', 'Porto', 'Copenhagen', 'Stockholm', 'Oslo',
    
    // Eropa Timur
    'Moscow', 'Warsaw', 'Prague', 'Budapest', 'Athens',
    'Bucharest', 'Sofia', 'Belgrade', 'Zagreb', 'Kiev',
    
    // Amerika Utara
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami',
    'San Francisco', 'Boston', 'Seattle', 'Las Vegas', 'Washington',
    'Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary',
    'Mexico City', 'Guadalajara', 'Monterrey',
    
    // Amerika Selatan
    'São Paulo', 'Rio de Janeiro', 'Buenos Aires', 'Lima',
    'Bogota', 'Santiago', 'Caracas', 'Quito', 'La Paz',
    'Montevideo', 'Asuncion', 'Brasilia',
    
    // Australia & Oceania
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
    'Auckland', 'Wellington', 'Christchurch', 'Canberra',
    
    // Afrika
    'Cairo', 'Lagos', 'Johannesburg', 'Cape Town', 'Nairobi',
    'Casablanca', 'Algiers', 'Tunis', 'Accra', 'Addis Ababa',
    'Dar es Salaam', 'Khartoum', 'Luanda', 'Kampala', 'Dakar'
  ];

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setActiveSuggestionIndex(-1);

    if (value.trim().length > 0) {
      const filtered = popularCities.filter(c => 
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-section">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper" ref={suggestionsRef}>
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Enter city name..."
            required
            autoComplete="off"
            disabled={loading}
            aria-label="City search"
            aria-autocomplete="list"
            aria-controls="suggestions-list"
            aria-expanded={showSuggestions}
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <ul 
              id="suggestions-list"
              className="autocomplete-suggestions"
              role="listbox"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  className={`suggestion-item ${
                    index === activeSuggestionIndex ? 'active' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                  role="option"
                  aria-selected={index === activeSuggestionIndex}
                >
                  <span className="suggestion-icon">📍</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="search-controls">
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !city.trim()}
            aria-label="Search weather"
          >
            {loading ? 'Searching...' : 'Search Weather'}
          </button>

          <div className="unit-toggle" role="group" aria-label="Temperature unit">
            <button
              type="button"
              className={`unit-button ${unit === 'metric' ? 'active' : ''}`}
              onClick={() => onUnitChange('metric')}
              disabled={loading}
              aria-pressed={unit === 'metric'}
            >
              °C
            </button>
            <button
              type="button"
              className={`unit-button ${unit === 'imperial' ? 'active' : ''}`}
              onClick={() => onUnitChange('imperial')}
              disabled={loading}
              aria-pressed={unit === 'imperial'}
            >
              °F
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        .autocomplete-suggestions {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          right: 0;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                      0 4px 6px -2px rgba(0, 0, 0, 0.05);
          max-height: 280px;
          overflow-y: auto;
          z-index: 50;
          list-style: none;
          margin: 0;
          padding: 0.5rem;
          animation: slideDown 0.2s ease-out;
          border: 1px solid rgba(229, 231, 235, 0.8);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .suggestion-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          border-radius: 0.5rem;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
          color: #374151;
        }

        .suggestion-item:hover,
        .suggestion-item.active {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #2563eb;
        }

        .suggestion-icon {
          font-size: 1.1rem;
          opacity: 0.6;
        }

        .suggestion-item.active .suggestion-icon {
          opacity: 1;
        }

        .autocomplete-suggestions::-webkit-scrollbar {
          width: 6px;
        }

        .autocomplete-suggestions::-webkit-scrollbar-track {
          background: transparent;
        }

        .autocomplete-suggestions::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .autocomplete-suggestions::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default SearchForm;