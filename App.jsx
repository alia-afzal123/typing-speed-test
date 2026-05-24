import { useState, useEffect, useRef } from 'react';
import { quotes } from './data/quotes';
import './App.css';

function App() {
  // States
  const [timeLimit, setTimeLimit] = useState(60);
  const [difficulty, setDifficulty] = useState('Medium');
  const [currentQuote, setCurrentQuote] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({
    wpm: 0,
    netSpeed: 0,
    accuracy: 0,
    correctChars: 0,
    totalChars: 0,
    mistakes: 0
  });

  const inputRef = useRef(null);

  // Load random quote based on difficulty
  const loadRandomQuote = () => {
    const filteredQuotes = quotes.filter(q => q.difficulty === difficulty);
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    setCurrentQuote(filteredQuotes[randomIndex]);
    setUserInput('');
    setShowResult(false);
    setTimeLeft(timeLimit);
    setIsActive(false);
  };

  // Reset and start test
  const startTest = () => {
    setUserInput('');
    setTimeLeft(timeLimit);
    setIsActive(true);
    setShowResult(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Stop/Submit test early
  const stopTest = () => {
    if (isActive) {
      setIsActive(false);
      calculateResults();
    }
  };

  // Calculate results
  const calculateResults = () => {
    const original = currentQuote.text;
    const input = userInput;
    
    let correct = 0;
    let mistakes = 0;
    
    for (let i = 0; i < Math.min(original.length, input.length); i++) {
      if (original[i] === input[i]) {
        correct++;
      } else {
        mistakes++;
      }
    }
    
    const totalTyped = input.length;
    const accuracy = totalTyped === 0 ? 0 : Math.round((correct / totalTyped) * 100);
    
    // WPM = (correct characters / 5) / minutes
    const minutes = (timeLimit - timeLeft) / 60;
    const wpm = minutes === 0 ? 0 : Math.round((correct / 5) / minutes);
    
    // Net Speed = (correct - mistakes) / 5 / minutes
    const netSpeed = minutes === 0 ? 0 : Math.round(((correct - mistakes) / 5) / minutes);
    
    setStats({
      wpm,
      netSpeed: netSpeed < 0 ? 0 : netSpeed,
      accuracy,
      correctChars: correct,
      totalChars: totalTyped,
      mistakes
    });
    setShowResult(true);
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            calculateResults();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Load quote when difficulty or time changes
  useEffect(() => {
    loadRandomQuote();
  }, [difficulty, timeLimit]);

  const handleTimeChange = (seconds) => {
    setTimeLimit(seconds);
    setTimeLeft(seconds);
  };

  // Don't render until quote is loaded
  if (!currentQuote) return <div className="loading">Loading...</div>;

 // Result Screen
if (showResult) {
  // Get result theme based on accuracy
  const getResultTheme = () => {
    if (stats.accuracy >= 80) return 'excellent';
    if (stats.accuracy >= 60) return 'good';
    if (stats.accuracy >= 40) return 'average';
    return 'poor';
  };

  const getFeedbackMessage = () => {
    if (stats.accuracy >= 90) return {
      message: "🏆 OUTSTANDING! You're a typing master! 🏆",
      emoji: "🎉✨🌟"
    };
    if (stats.accuracy >= 80) return {
      message: "🔥 EXCELLENT! Amazing accuracy! Keep it up! 🔥",
      emoji: "⭐🎯💪"
    };
    if (stats.accuracy >= 70) return {
      message: "🎯 GREAT JOB! You're doing fantastic! 🎯",
      emoji: "👍🎉✨"
    };
    if (stats.accuracy >= 60) return {
      message: "✅ GOOD WORK! You're improving quickly! ✅",
      emoji: "📈💪"
    };
    if (stats.accuracy >= 50) return {
      message: "📝 NICE TRY! A little more practice will make you perfect! 📝",
      emoji: "🍀✨"
    };
    if (stats.accuracy >= 40) return {
      message: "💪 KEEP GOING! You're on the right track! 💪",
      emoji: "🌟📚"
    };
    return {
      message: "🌱 DON'T GIVE UP! Every master was once a beginner. Practice daily! 🌱",
      emoji: "💚🌸"
    };
  };

  const theme = getResultTheme();
  const feedback = getFeedbackMessage();

  return (
    <div className={`result-container result-theme-${theme}`}>
      <div className="result-card">
        <div className="result-header">
          <span className="result-emoji">{feedback.emoji}</span>
          <h2>📊 Test Results</h2>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">⚡</span>
            <span className="stat-value">{stats.wpm}</span>
            <span className="stat-label">Gross WPM</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <span className="stat-value">{stats.netSpeed}</span>
            <span className="stat-label">Net Speed</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <span className="stat-value">{stats.accuracy}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📝</span>
            <span className="stat-value">{stats.correctChars}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">❌</span>
            <span className="stat-value">{stats.mistakes}</span>
            <span className="stat-label">Mistakes</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⌨️</span>
            <span className="stat-value">{stats.totalChars}</span>
            <span className="stat-label">Total Typed</span>
          </div>
        </div>

        <div className={`feedback-message feedback-${theme}`}>
          <div className="feedback-emoji">{feedback.emoji}</div>
          <p>{feedback.message}</p>
        </div>

        <button onClick={loadRandomQuote} className="restart-button">
          🔄 Take New Test
        </button>
      </div>
    </div>
  );
}
  // Main Test Screen
  return (
    <div className="app">
      {!isActive ? (
        // Settings Screen
        <div className="settings-container">
          <div className="settings-card">
            <h1>⌨️ Typing Speed Test</h1>
            <p className="subtitle">Test your typing skills</p>

            <div className="settings-section">
              <label>⏱️ Select Time</label>
              <div className="time-options">
                <button className={timeLimit === 30 ? 'active' : ''} onClick={() => handleTimeChange(30)}>30s</button>
                <button className={timeLimit === 60 ? 'active' : ''} onClick={() => handleTimeChange(60)}>60s</button>
                <button className={timeLimit === 120 ? 'active' : ''} onClick={() => handleTimeChange(120)}>120s</button>
              </div>
            </div>

            <div className="settings-section">
              <label>📚 Select Difficulty</label>
              <div className="difficulty-options">
                <button className={difficulty === 'Easy' ? 'active-easy' : ''} onClick={() => setDifficulty('Easy')}>🌿 Easy</button>
                <button className={difficulty === 'Medium' ? 'active-medium' : ''} onClick={() => setDifficulty('Medium')}>⭐ Medium</button>
                <button className={difficulty === 'Hard' ? 'active-hard' : ''} onClick={() => setDifficulty('Hard')}>🔥 Hard</button>
              </div>
            </div>

            <button onClick={startTest} className="start-test-btn">
              🚀 Start Test
            </button>
          </div>
        </div>
      ) : (
        // Active Test Screen
        <div className="test-container">
          <div className="test-header">
            <div className="timer-section">
              <div className="timer-circle">
                <span className="timer-value">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
              </div>
            </div>
            <button onClick={stopTest} className="stop-btn">
              ⏹️ Stop & Submit
            </button>
          </div>

          <div className="quote-display">
            {currentQuote.text.split('').map((char, index) => {
              let status = 'pending';
              if (index < userInput.length) {
                status = userInput[index] === char ? 'correct' : 'incorrect';
              }
              // Add space handling
              if (char === ' ') {
                return (
                  <span key={index} className={`char-space ${status}`}>
                    &nbsp;
                  </span>
                );
              }
              return (
                <span key={index} className={`char ${status}`}>
                  {char}
                </span>
              );
            })}
          </div>

          <textarea
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Start typing here..."
            className="typing-input"
          />

          <div className="progress-info">
            <span>📝 {userInput.length} / {currentQuote.text.length} characters</span>
            <span className="difficulty-badge">{currentQuote.difficulty}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;