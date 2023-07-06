import React from "react";
import WeatherCard from "./components/WeatherCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  return (
    <div className="appWrap">
      <div className="titleWrap">Weather Checker</div>
      <div className="appContentWrap">
        <WeatherCard />
      </div>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
