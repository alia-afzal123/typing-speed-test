import { useEffect } from 'react';

function Timer({ timeLeft, setTimeLeft, isActive, setIsActive, onComplete }) {
  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, setTimeLeft, setIsActive, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="timer-container">
      <div className="timer-circle">
        <svg className="timer-svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" className="timer-bg" />
          <circle 
            cx="50" cy="50" r="45" 
            className="timer-progress"
            style={{ 
              strokeDashoffset: 283 - (283 * timeLeft) / 60,
              stroke: 'url(#gradient)'
            }} 
          />
        </svg>
        <div className="timer-text">
          <span className="timer-value">{minutes}:{seconds.toString().padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}

export default Timer;