import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2, Instagram } from 'lucide-react';
import confetti from 'canvas-confetti';

const SUPABASE_URL = 'https://dambuszjzkaeezjlkybh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_yq1OhLPJFzk0ZLAC_QLtAw__xZmtysP';
const OMNISEND_API_KEY = '6ac0c03ff9e55097b6c819e1-iNddFEB2001ejjEOaZ83WrfgASenONATefrwNr96XTJsJ1T0Cv';

export default function App() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullPhoto, setFullPhoto] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const audioCtxRef = useRef(null);

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

  useEffect(() => {
    const handleGlobalTap = () => {
      initAudio();
    };

    window.addEventListener('pointerdown', handleGlobalTap, { capture: true });
    window.addEventListener('touchstart', handleGlobalTap, { capture: true });
    window.addEventListener('click', handleGlobalTap, { capture: true });

    return () => {
      window.removeEventListener('pointerdown', handleGlobalTap, { capture: true });
      window.removeEventListener('touchstart', handleGlobalTap, { capture: true });
      window.removeEventListener('click', handleGlobalTap, { capture: true });
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    const nowIso = new Date().toISOString();

    // 1. Omnisend API v3 Contact Creation with Subscribed Status & Tags to trigger Welcome Automation
    try {
      await fetch('https://api.omnisend.com/v3/contacts', {
        method: 'POST',
        headers: {
          'X-API-KEY': OMNISEND_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          status: 'subscribed',
          statusDate: nowIso,
          tags: ['welcome', 'newsletter', 'website_signup'],
          identifiers: [
            {
              type: 'email',
              id: email,
              channels: {
                email: {
                  status: 'subscribed',
                  statusDate: nowIso
                }
              }
            }
          ]
        })
      });
    } catch (omniErr) {
      console.error("Omnisend API v3 error:", omniErr);
    }

    // 2. Omnisend JS Tracker Welcome Automation Trigger Events
    window.omnisend = window.omnisend || [];
    try {
      window.omnisend.push(["identify", { 
        email: email, 
        status: "subscribed",
        tags: ["welcome", "website_signup"]
      }]);
      window.omnisend.push(["contact", { email: email, status: "subscribed" }]);
      window.omnisend.push(["track", "$emailSubscribed", { email: email }]);
      window.omnisend.push(["track", "Joined Access List", { email: email }]);
    } catch (omniJsErr) {
      console.error("Omnisend JS push error:", omniJsErr);
    }

    // 3. Supabase database insert
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ email: email })
      });
    } catch (err) {
      console.error("Supabase insert error:", err);
    } finally {
      setLoading(false);
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
    }
  };

  return (
    <div className={fullPhoto ? 'full-photo-active' : ''} onClick={initAudio} onTouchStart={initAudio}>
      <div className="noise-overlay" />

      <div className="hero-photo-container">
        <img src="/hero.png" alt="Gudsex Background" className="hero-photo" />
        <div className="hero-vignette" />
      </div>

      <header className="site-header">
        <a href="#" className="brand-logo">
          gudsex <span className="brand-star">✦</span>
        </a>

        <div className="header-controls">
          <button 
            onClick={toggleAudio} 
            className={`btn-glass ${audioPlaying ? 'audio-active' : ''}`}
            title="Toggle Audio"
            style={{ padding: '0.6rem 0.9rem' }}
          >
            {audioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {audioPlaying && <span style={{ fontSize: '0.65rem' }}>ON</span>}
          </button>

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

      <button 
        onClick={(e) => { e.stopPropagation(); setFullPhoto(false); }} 
        className="exit-photo-btn"
      >
        <Minimize2 size={16} /> Exit Full Photo
      </button>

      <main className="stage-container">
        <div className="content-box">
          <h1 className="coming-soon-title">✦ Coming Soon ✦</h1>
          <p className="subscribe-label">Subscribe to news</p>

          {!subscribed ? (
            <form 
              onSubmit={handleSubmit} 
              className="omnisend-subscribe-form subscribe-form-box" 
              onClick={(e) => e.stopPropagation()}
            >
              <input 
                type="email" 
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL..."
                className="omnisend-subscribe-input-email subscribe-input"
                disabled={loading}
              />
              <button type="submit" className="omnisend-subscribe-button btn-submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Subscribe'}
              </button>
            </form>
          ) : (
            <div className="success-msg">
              ✦ ACCESS GRANTED // YOU ARE SUBSCRIBED
            </div>
          )}
        </div>
      </main>

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
