import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./components/Footer";

function App() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  useEffect(() => {
    getCityByGeo();
  }, []);
  const getCityByGeo = () => {
    const API_KEY = import.meta.env.VITE_WEATHER_API;
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const fetchByCity = async (city) => {
      try {
        const result = await axios.get(url, {
          params: {
            q: city,
            units: "metric",
            appid: API_KEY,
          },
        });
        setInput(result.data.name);
        setWeather({ data: result.data, loading: false, error: false });
      } catch (error) {
        setWeather({ ...weather, loading: false, error: true });
        console.error(`Error fetching weather for ${city}:`, error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const result = await axios.get(url, {
              params: {
                lat: latitude,
                lon: longitude,
                units: "metric",
                appid: API_KEY,
              },
            });
            setInput(result.data.name);
            setWeather({ data: result.data, loading: false, error: false });
          } catch (error) {
            setWeather({ ...weather, loading: false, error: true });
            console.error("Error fetching location weather", error);
            fetchByCity("Kolkata")
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          fetchByCity("Kolkata")
        }
      );
    } else {
      console.error("Geolocation not supported");
      fetchByCity("Kolkata");
    }
  };

  const search = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setInput("");
      setWeather({ ...weather, loading: true });

      const url = `https://api.openweathermap.org/data/2.5/weather`;
      // Open 'Openweathermap' and login and create your API key
      const API_KEY = import.meta.env.VITE_WEATHER_API;

      try {
        const result = await axios.get(url, {
          params: {
            q: input,
            units: "metric",
            appid: API_KEY,
          },
        });
        console.log(result.data);
        setWeather({ data: result.data, loading: false, error: false });
      } catch (error) {
        setWeather({ ...weather, data: {}, loading: false, error: true });
        console.error("Error fetching data", error);
      }
    }
  };

  const toDateFunction = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const weekDays = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const currentDate = new Date();

    const day = weekDays[currentDate.getDay()].toUpperCase();
    const date = currentDate.getDate();
    const month = months[currentDate.getMonth()];

    return `${day}, ${date} ${month}`;
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2">
      <div className="App flex flex-col items-center justify-center w-full md:w-1/2 border border-gray-500/30 bg-white text-center mx-auto pb-5 rounded-lg shadow-md">
        <h1 className="text-blue-600 text-4xl my-5 font-bold">Akash Vani</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter City"
            className="city-search text-center"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={search}
          />
        </div>

        {weather.loading && (
          <div className="loading-spinner">
            <br />
            <div className="spinner" />
          </div>
        )}
        {weather.error && (
          <div className="error-message">
            <span style={{ fontSize: "20px" }}> City Not found ... </span>
          </div>
        )}
        {weather.data?.main && (
          <div className="weather-info">
            <div className="city-name">
              <h2>
                {weather.data?.name}
                <span> {weather.data?.sys?.country} </span>
              </h2>
            </div>
            <div className="date">
              <span>{toDateFunction()}</span>
            </div>

            <div className="icon-temp flex items-center justify-center flex-col">
              <img
                src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@4x.png`}
                alt={weather.data.weather[0].description}
              />

              <span>
                {Math.round(weather.data.main.temp)}
                <sup className="deg">°C</sup>
              </span>
            </div>

            <div className="des-wind">
              <p>{weather.data.weather[0].description.toUpperCase()}</p>
              <p>Wind Speed : {weather.data.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;