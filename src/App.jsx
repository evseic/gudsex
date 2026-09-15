import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Instagram } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [fullPhoto, setFullPhoto] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const audioCtxRef = useRef(null);

  // Web Audio Trap Ambient Drone Synth
  const toggleAudio = () => {
    if (audioPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setAudioPlaying(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(43.65, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(190, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        setAudioPlaying(true);
      } catch (err) {
        console.error("Audio error:", err);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubscribed(true);
    localStorage.setItem('gudsex_subscriber', email);

    if (window.confetti || confetti) {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ffffff', '#aaaaaa', '#444444']
      });
    }
  };

  return (
    <div className={fullPhoto ? 'full-photo-active' : ''}>
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Main Fullscreen Background Photo */}
      <div className="hero-photo-container">
        <img src="/hero.png" alt="Gudsex Background" className="hero-photo" />
        <div className="hero-vignette" />
      </div>

      {/* Header Logo & Controls */}
      <header className="site-header">
        <a href="#" className="brand-logo">
          gudsex <span className="brand-star">✦</span>
        </a>

        <div className="header-controls">
          {/* Audio Toggle Button (Icon only, no words 'vibe' or 'sound') */}
          <button 
            onClick={toggleAudio} 
            className={`btn-glass ${audioPlaying ? 'audio-active' : ''}`}
            title="Toggle Audio"
            style={{ padding: '0.6rem 0.9rem' }}
          >
            {audioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {audioPlaying && <span style={{ fontSize: '0.65rem' }}>ON</span>}
          </button>

          {/* Open Full Photo Button */}
          <button 
            onClick={() => setFullPhoto(true)} 
            className="btn-glass"
            title="View Full Photo"
          >
            <Maximize2 size={15} />
            <span>FULL PHOTO</span>
          </button>
        </div>
      </header>

      {/* Exit Photo Button (shown when viewing full photo) */}
      <button 
        onClick={() => setFullPhoto(false)} 
        className="exit-photo-btn"
      >
        <Minimize2 size={16} /> Exit Full Photo
      </button>

      {/* Main Centered Stage */}
      <main className="stage-container">
        {/* Smaller & Animated COMING SOON */}
        <h1 className="coming-soon-title">✦ Coming Soon ✦</h1>

        {/* SUBSCRIBE TO NEWS under coming soon */}
        <p className="subscribe-label">Subscribe to news</p>

        {/* Subscribe Form */}
        {!subscribed ? (
          <form onSubmit={handleSubmit} className="subscribe-form-box">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL..."
              className="subscribe-input"
            />
            <button type="submit" className="btn-submit">
              Subscribe
            </button>
          </form>
        ) : (
          <div className="success-msg">
            ✦ ACCESS GRANTED // YOU ARE SUBSCRIBED
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="footer-bar">
        <span>© GUDSEX ✦ ALL RIGHTS RESERVED</span>
        <div>
          <a 
            href="https://www.instagram.com/evseicik/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-link"
          >
            <Instagram size={14} /> INSTAGRAM @EVSEICIK
          </a>
        </div>
      </footer>
    </div>
  );
}
