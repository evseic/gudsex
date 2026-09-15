import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Instagram } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [fullPhoto, setFullPhoto] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const audioCtxRef = useRef(null);

  // Initialize and start audio context directly in touch handler
  const initAudio = () => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return;
    }

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
      console.log("Audio touch init:", err);
    }
  };

  const stopAudio = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setAudioPlaying(false);
  };

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (audioPlaying) {
      stopAudio();
    } else {
      initAudio();
    }
  };

  // Attach global tap/touch/click listener to document & window
  useEffect(() => {
    const handleGlobalTap = () => {
      initAudio();
    };

    // Attach to window and document with capture
    window.addEventListener('pointerdown', handleGlobalTap, { capture: true });
    window.addEventListener('touchstart', handleGlobalTap, { capture: true });
    window.addEventListener('touchend', handleGlobalTap, { capture: true });
    window.addEventListener('click', handleGlobalTap, { capture: true });

    return () => {
      window.removeEventListener('pointerdown', handleGlobalTap, { capture: true });
      window.removeEventListener('touchstart', handleGlobalTap, { capture: true });
      window.removeEventListener('touchend', handleGlobalTap, { capture: true });
      window.removeEventListener('click', handleGlobalTap, { capture: true });
    };
  }, []);

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
    <div className={fullPhoto ? 'full-photo-active' : ''} onClick={initAudio}onTouchStart={initAudio}>
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
          {/* Audio Toggle Button */}
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
            onClick={(e) => { e.stopPropagation(); setFullPhoto(true); }} 
            className="btn-glass"
            title="View Full Photo"
          >
            <Maximize2 size={15} />
            <span>FULL PHOTO</span>
          </button>
        </div>
      </header>

      {/* Exit Photo Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); setFullPhoto(false); }} 
        className="exit-photo-btn"
      >
        <Minimize2 size={16} /> Exit Full Photo
      </button>

      {/* Main Stage */}
      <main className="stage-container">
        <div className="content-box">
          <h1 className="coming-soon-title">✦ Coming Soon ✦</h1>
          <p className="subscribe-label">Subscribe to news</p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="subscribe-form-box" onClick={(e) => e.stopPropagation()}>
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
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-bar">
        <span>© GUDSEX ✦ ALL RIGHTS RESERVED</span>
        <div>
          <a 
            href="https://www.instagram.com/evseicik/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="social-link"
            onClick={(e) => e.stopPropagation()}
          >
            <Instagram size={14} /> INSTAGRAM @EVSEICIK
          </a>
        </div>
      </footer>
    </div>
  );
}
