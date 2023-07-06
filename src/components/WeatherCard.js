import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { API_NINJA_KEY, WEATHER_API_KEY } from "../config"; // Get your own API KEYS
import "./WeatherCard.css";
import "react-toastify/dist/ReactToastify.css";

const WeatherCard = () => {
  const [location, setLocation] = useState("");
  const [result, setResult] = useState({});
  const [timezone, setTimezone] = useState("");

  const [unit, setUnit] = useState("F");

  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}`;

  const searchWeather = async (e) => {
    if (e.key === "Enter") {
      try {
        setLoading(true);
        const data = await axios({
          method: "get",
          url: url,
        });
        setResult(data);
        getTimeZone();
      } catch (err) {
        toast.error("Cannot Find the City. Try Again!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const convertTemp = () => {
    setUnit((prevUnit) => (prevUnit === "F" ? "°C" : "F"));
  };

  const getTimeZone = () => {
    axios
      .get(`https://api.api-ninjas.com/v1/timezone?city=${location}`, {
        headers: {
          "X-Api-Key": API_NINJA_KEY,
        },
      })
      .then((response) => {
        const timezone = response.data.timezone;
        setCurrentTime(getCurrentTime(timezone));
        setTimezone(timezone);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error:", error.response.status, error.response.data);
        } else {
          console.error("Request failed:", error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCurrentTime = (timeZone) => {
    const now = moment().tz(timeZone);
    return now.format("HH:mm:ss");
  };

  useEffect(() => {
    if (timezone) {
      const intervalId = setInterval(() => {
        setCurrentTime(getCurrentTime(timezone));
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [timezone]);

  return (
    <>
      <input
        placeholder="CITY"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        type="text"
        onKeyDown={searchWeather}
        spellCheck="false"
      />
      {loading ? (
        <div></div>
      ) : (
        Object.keys(result).length !== 0 && (
          <>
            <div className="ResultWrap">
              <div className="city">{result.data.name}</div>
              <div className="time">{currentTime}</div>
              <div className="temperature">
                {unit === "F"
                  ? Math.round((result.data.main.temp - 273.15) * (9 / 5) + 32)
                  : Math.round((result.data.main.temp - 273.15) * 10) / 10}
                {unit}
              </div>
              <div className="sky">{result.data.weather[0].main}</div>
            </div>
            <div className="button-container">
              <button className="button-80" onClick={convertTemp}>
                {unit === "F" ? "Celcius" : "Fahrenheit"}
              </button>
            </div>
          </>
        )
      )}
    </>
  );
};

export default WeatherCard;
