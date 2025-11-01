const DataTable = ({ forecastData, formatDate, getWeatherIcon, temperatureSymbol }) => {
  if (!forecastData || forecastData.length === 0) return null;

  return (
    <div className="forecast-section">
      <h3>5-Day Forecast</h3>
      <div className="forecast-table-wrapper">
        <table className="forecast-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weather</th>
              <th>Temperature</th>
              <th>Feels Like</th>
              <th>Humidity</th>
              <th>Wind</th>
              <th>Conditions</th>
            </tr>
          </thead>
          <tbody>
            {forecastData.map((forecast, index) => {
              const date = formatDate(forecast.dt);
              const icon = getWeatherIcon(forecast.weather[0].icon);
              const tempHigh = Math.round(forecast.main.temp_max);
              const tempLow = Math.round(forecast.main.temp_min);
              const feelsLike = Math.round(forecast.main.feels_like);
              const humidity = forecast.main.humidity;
              const windSpeed = forecast.wind.speed;
              const description = forecast.weather[0].description;

              return (
                <tr key={`${forecast.dt}-${index}`}>
                  <td>
                    <strong>{date}</strong>
                  </td>
                  <td>
                    <span className="weather-icon" role="img" aria-label={description}>
                      {icon}
                    </span>
                  </td>
                  <td>
                    <div className="temp-range">
                      <span className="temp-high">{tempHigh}{temperatureSymbol}</span>
                      <span style={{ color: '#9ca3af' }}>/</span>
                      <span className="temp-low">{tempLow}{temperatureSymbol}</span>
                    </div>
                  </td>
                  <td>{feelsLike}{temperatureSymbol}</td>
                  <td>{humidity}%</td>
                  <td>{windSpeed} {temperatureSymbol === '°C' ? 'm/s' : 'mph'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;