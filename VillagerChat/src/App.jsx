import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';

function App() {
  return (
    <div className="app">
      <div className="castle-background">
        <div className="castle-silhouette"></div>
        <div className="moat"></div>
      </div>
      <div className="app-container">
        <header className="app-header">
          <h1>The Village Inn</h1>
          <p className="subtitle">Speak with Horkin, the village elder</p>
        </header>
        <main className="app-main">
          <ChatWindow />
        </main>
        <footer className="app-footer">
          <p className="footer-text">May the realm master guide your journey</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
