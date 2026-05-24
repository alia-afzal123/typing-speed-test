function ResultCard({ wpm, accuracy, correctChars, totalChars, onRestart }) {
  const getMessage = () => {
    if (wpm < 20) return "💪 Keep practicing! Every expert was once a beginner.";
    if (wpm < 40) return "👍 Great start! You're improving faster than you think.";
    if (wpm < 60) return "🎯 Amazing! You're above average. Keep going!";
    if (wpm < 80) return "🔥 Incredible! You're a typing master!";
    return "🏆 Legendary! You're in the top 1%!";
  };

  return (
    <div className="result-card">
      <h2>✨ Test Complete! ✨</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">⚡</span>
          <span className="stat-value">{wpm}</span>
          <span className="stat-label">WPM</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">{accuracy}%</span>
          <span className="stat-label">Accuracy</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <span className="stat-value">{correctChars}</span>
          <span className="stat-label">Correct</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📝</span>
          <span className="stat-value">{totalChars}</span>
          <span className="stat-label">Typed</span>
        </div>
      </div>

      <div className="feedback-message">
        {getMessage()}
      </div>

      <button onClick={onRestart} className="restart-button">
        🔄 Take Another Test
      </button>
    </div>
  );
}

export default ResultCard;