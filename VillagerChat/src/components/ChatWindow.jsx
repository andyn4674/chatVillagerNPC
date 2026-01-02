import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import TypingText from './TypingText';
import './ChatWindow.css';

const ChatWindow = () => {
  const [message, setMessage] = useState('');
  const [npcMessage, setNpcMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [npcMessage, isTyping]);

  // Initial greeting from NPC
  useEffect(() => {
    const initialGreeting = "Ah, a traveler! Welcome to our humble village. I'm Horkin, and I've lived here my whole life. The winds carry many stories through these parts... What brings you to our village today?";
    setTimeout(() => {
      setNpcMessage(initialGreeting);
      setHasStarted(true);
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isTyping || isWaiting) return;

    // Add user message to display (though we only show NPC messages per requirements)
    setMessage('');
    setIsWaiting(true);

    try {
      const response = await axios.post('http://localhost:3000/api/npc/chat', {
        message: message.trim()
      });

      setIsWaiting(false);
      setNpcMessage(''); // Clear previous message
      setIsTyping(true);

      // Simulate typing effect
      const fullMessage = response.data.response;
      let currentIndex = 0;
      
      const typeWriter = setInterval(() => {
        setNpcMessage(fullMessage.substring(0, currentIndex + 1));
        currentIndex++;
        
        if (currentIndex >= fullMessage.length) {
          clearInterval(typeWriter);
          setIsTyping(false);
        }
      }, 50); // Typing speed

    } catch (error) {
      console.error('Error sending message:', error);
      setIsWaiting(false);
      setNpcMessage("I'm sorry, the spirits aren't speaking clearly today. Please try again.");
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="npc-avatar">
          <div className="avatar-icon">🧙‍♂️</div>
        </div>
        <div className="npc-info">
          <h3>Horkin the Elder</h3>
          <p className="status">{"●"} Available</p>
        </div>
      </div>
      
      <div className="chat-messages">
        <div className="message-bubble npc-bubble">
          <div className="message-content">
            {hasStarted && (
              <TypingText 
                text={npcMessage} 
                isTyping={isTyping}
                onComplete={() => setIsTyping(false)}
              />
            )}
          </div>
        </div>
        {isWaiting && (
          <div className="message-bubble waiting-bubble">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Speak your thoughts..."
            className="chat-input"
            disabled={isTyping || isWaiting}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!message.trim() || isTyping || isWaiting}
          >
            Send
          </button>
        </div>
        <div className="input-hint">
          Press Enter to speak with the village elder
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
