function TypingBox({ originalText, userInput, setUserInput, isActive }) {
  const handleChange = (e) => {
    if (!isActive) return;
    setUserInput(e.target.value);
  };

  return (
    <div className="typing-box">
      <div className="quote-display">
        {originalText.split('').map((char, index) => {
          let status = 'pending';
          if (index < userInput.length) {
            status = userInput[index] === char ? 'correct' : 'incorrect';
          }
          return (
            <span key={index} className={`char ${status}`}>
              {char}
            </span>
          );
        })}
      </div>

      <textarea
        value={userInput}
        onChange={handleChange}
        disabled={!isActive}
        placeholder={isActive ? "Start typing here..." : "Click 'Start Challenge' to begin"}
        className="typing-input"
      />
    </div>
  );
}

export default TypingBox;