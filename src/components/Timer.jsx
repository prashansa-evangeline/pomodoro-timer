import React, { useState, useEffect } from 'react';
import { formatTime } from '../utils';

const Timer = () => {
  const [time, setTime] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [theme, setTheme] = useState('light');
  const [customTime, setCustomTime] = useState(25);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const updateState = () => {
      chrome.runtime.sendMessage({ action: 'get_state' }, (response) => {
        if (response) {
          setTime(response.time);
          setIsActive(response.isActive);
        }
      });
    };

    updateState();
    const interval = setInterval(updateState, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    const customTimeInSeconds = customTime * 60;
    chrome.runtime.sendMessage({ action: 'start', time: customTimeInSeconds });
  };

  const handleReset = () => {
    chrome.runtime.sendMessage({ action: 'reset' });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="timer p-4 max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg relative">
      <h1 className="text-2xl font-extrabold text-center mb-4 text-black dark:text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
        Pomodoro Timer
      </h1>
      <div className="time text-5xl font-mono text-center mb-4 dark:text-white">{formatTime(time)}</div>
      <div className="text-center mb-4">
        <label className="block text-gray-700 mb-2 text-lg font-semibold dark:text-white">
          Enter a time
        </label>
        <input
          type="number"
          className="input border-2 border-gray-500 text-gray-500 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          value={customTime}
          onChange={(e) => setCustomTime(e.target.value)}
          placeholder="Enter minutes"
        />
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className="btn btn-primary border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-300"
          onClick={handleStart}
        >
          Start
        </button>
        <button
          className="btn btn-secondary border-2 border-red-500 text-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-300"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="btn btn-theme-switch border-2 border-gray-500 text-gray-500 px-4 py-2 rounded-full hover:bg-gray-500 hover:text-white transition-colors duration-300"
          onClick={toggleTheme}
        >
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </div>
      {showPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Time's up!</h2>
            <button
              className="btn btn-primary border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-300"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
