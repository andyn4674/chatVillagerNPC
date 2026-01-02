import React, { useState, useEffect } from 'react';

const TypingText = ({ text, isTyping, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      if (onComplete) onComplete();
      return;
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 12.5); // Typing speed (50ms / 4 = 12.5ms)

      return () => clearTimeout(timer);
    } else {
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, isTyping, onComplete]);

  return (
    <span className="typing-text">
      {displayedText}
      {isTyping && <span className="cursor">|</span>}
    </span>
  );
};

export default TypingText;
