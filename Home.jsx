import { useState, useEffect } from 'react';
import { quotes } from '../data/quotes';
import TypingBox from '../components/TypingBox';
import Timer from '../components/Timer';
import ResultCard from '../components/ResultCard';

function Home() {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0, correctChars: 0, totalChars: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadRandomQuote();
  }, []);

  const loadRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
    setUserInput('');
    setShowResult(false);
    setTimeLeft(60);
    setIsActive(false);
  };

  const startTest = () => {
    setUserInput('');
    setTimeLeft(60);
    setIsActive(true);
    setShowResult(false);
  };

  const calculateResults = () => {
    const original = currentQuote.text;
    const input = userInput;
    
    let correct = 0;
    for (let i = 0; i < Math.min(original.length, input.length); i++) {
      if (original[i] === input[i]) correct++;
    }
    
    const totalTyped = input.length;
    const accuracy = totalTyped === 0 ? 0 : Math.round((correct / totalTyped) * 100);
    const minutes = (60 - timeLeft) / 60;
    const wpm = minutes === 0 ? 0 : Math.round((correct / 5) / minutes);
    
    setStats({ wpm, accuracy, correctChars: correct, totalChars: totalTyped });
    setShowResult(true);
    
    if (wpm >= 60 && accuracy >= 85) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  if (!currentQuote) return <div className="loading">Loading...</div>;

  if (showResult) {
    return (
      <>
        {showConfetti && <div className="confetti">🎉✨🏆✨🎉</div>}
        <ResultCard
          wpm={stats.wpm}
          accuracy={stats.accuracy}
          correctChars={stats.correctChars}
          totalChars={stats.totalChars}
          onRestart={loadRandomQuote}
        />
      </>
    );
  }

  return (
    <div className="home">
      <header className="header">
        <h1 className="title">
          <span className="title-icon">⌨️</span>
          Typing Master
        </h1>
        <p className="subtitle">Test your typing speed in 60 seconds</p>
      </header>

      {!isActive ? (
        <div className="start-section">
          <button onClick={startTest} className="start-button">
            <span className="button-icon">🚀</span>
            Start Challenge
          </button>
          <p className="hint-text">60 seconds • Type exactly as shown • Get your WPM score</p>
        </div>
      ) : (
        <Timer
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          isActive={isActive}
          setIsActive={setIsActive}
          onComplete={calculateResults}
        />
      )}

      <TypingBox
        originalText={currentQuote.text}
        userInput={userInput}
        setUserInput={setUserInput}
        isActive={isActive}
      />

      {isActive && (
        <div className="motivation">
          <span className="motivation-icon">⚡</span>
          <span>Keep typing! Speed comes with practice.</span>
        </div>
      )}
    </div>
  );
}

export default Home;