import React, { useState } from 'react';
import Timer from './Timer';
import RandomPicture from './RandomPicture';
import './App.css';

const App = () => {
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0); // Initial timer duration in seconds
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const minutes = parseInt(inputValue);
    if (!isNaN(minutes) && minutes > 0) {
      setTimerDuration(minutes * 60); // Convert minutes to seconds
      setTimerStarted(true); // Start the timer
    } else {
      alert('Please enter a valid positive number for timer duration.');
    }
  };

  const handleTimerEnd = () => {
    setTimerStarted(false);
  };

  return (
    <div className="App">
      <h1>Timer and Random Picture App</h1>
      {!timerStarted ? (
        <div>
           <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter timer length (minutes)"
              required
            />
            <button type="submit">Start Timer</button>
          </form>
          <RandomPicture timerLength={timerDuration} />
        </div>
      ) : (
        <><div>
            <RandomPicture timerLength={timerDuration} />
          </div><div>
              <Timer initialTime={timerDuration} onTimerEnd={handleTimerEnd} />
            </div></>
      )}
    </div>
  );
};

export default App;

