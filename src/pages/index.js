import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch('/api/links')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  const handleSystemEntry = () => {
    setHasEntered(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Audio pipeline blocked by browser parameters:", err));
    }
  };

  const toggleAudioPlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(err => console.log(err));
    }
  };

  if (!data) return <div style={{ background: '#0a0a0f', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', letterSpacing: '1px' }}>LOADING_FRAMEWORK_NODES...</div>;

  const { profile, socials, assets, myWork } = data;

  // HORIZONTAL COLUMN ASSET FILTER MATRIX
  const windowsAssets = assets?.filter(item => item.title.toLowerCase().includes('[windows]')) || [];
  const macAssets = assets?.filter(item => item.title.toLowerCase().includes('[mac]')) || [];
  
  // Captures any item built as a text block instruction node rather than a download item
  const notesAssets = assets?.filter(item => item.title.toLowerCase().includes('[note]') || item.title.toLowerCase().includes('[password]')) || [];

  const cleanTitle = (title) => {
    return title.replace(/\[windows\]/i, '').replace(/\[mac\]/i, '').replace(/\[note\]/i, '').replace(/\[password\]/i, '').trim();
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '90px 20px 60px 20px', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* BRAND INTERACTIVE STYLE DICTIONARY */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatParticles {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-40px) translateX(10px); opacity: 0; }
        }
        /* --- INFINITE TICKER MARQUEE STEPPER --- */
        @keyframes scrollTicker {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-fade-in { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .column-delay-1 { animation-delay: 0.1s; opacity: 0; }
        .column-delay-2 { animation-delay: 0.2s; opacity: 0; }
        .column-delay-3 { animation-delay: 0.3s; opacity: 0; }
        
        .intro-curtain {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(6, 6, 9, 0.93); backdrop-filter: blur(24px); z-index: 9999;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.7s;
        }
        .intro-curtain.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
        
        .entry-glow-btn {
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(168, 85, 247, 0.4);
          padding: 18px 44px; border-radius: 4px; color: #fff; font-weight: 800;
          letter-spacing: 4px; cursor: pointer; font-size: 14px; text-transform: uppercase;
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.1); transition: all 0.4s ease; font-family: monospace;
        }
        .entry-glow-btn:hover {
          background: rgba(168, 85, 247, 0.15); border-color: #a855f7;
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.45); letter-spacing: 6px;
        }

        .pfp-wrapper { position: relative; display: inline-block; margin-bottom: 15px; }
        .pfp-wrapper::before, .pfp-wrapper::after {
          content: ''; position: absolute; width: 5px; height: 5px; background: #a855f7;
          border-radius: 50%; pointer-events: none; z-index: 3; box-shadow: 0 0 10px #a855f7;
        }
        .pfp-wrapper::before { top: 80%; left: 20%; animation: floatParticles 3s infinite linear; }
        .pfp-wrapper::after { top: 71%; right: 19%; animation: floatParticles 4s infinite linear 1.5s; }

        .particle-btn {
          position: relative; background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px);
          overflow: hidden; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        .particle-btn::before, .particle-btn::after {
          content: ''; position: absolute; background: radial-gradient(circle, rgba(168,85,247,0.8) 0%, transparent 70%);
          width: 4px; height: 4px; border-radius: 50%; opacity: 0; pointer-events: none;
        }
        .particle-btn::before { left: 25%; bottom: -10px; }
        .particle-btn::after { right: 25%; bottom: -12px; }
        .particle-btn:hover {
          transform: translateY(-3px); background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(168, 85, 247, 0.5) !important; box-shadow: 0 8px 24px rgba(168, 85, 247, 0.2);
        }
        .particle-btn:hover::before { opacity: 1; animation: floatParticles 2s infinite linear; }
        .particle-btn:hover::after { opacity: 1; animation: floatParticles 2.5s infinite linear 0.8s; }

        .video-card-container {
          background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .video-card-container:hover { transform: scale(1.015); border-color: rgba(16, 185, 129, 0.4); }

        /* --- THE ANNOUNCEMENT SLIM LINE MARQUEE WRAPPER --- */
        .marquee-strip-line {
          position: fixed; top: 0; left: 0; width: 100vw;
          background: linear-gradient(90deg, rgba(15,15,22,0.85) 0%, rgba(168,85,247,0.2) 50%, rgba(15,15,22,0.85) 100%);
          border-bottom: 1px solid rgba(168, 85, 247, 0.35);
          backdrop-filter: blur(12px); z-index: 999;
          overflow: hidden; white-space: nowrap; padding: 10px 0;
          display: flex; align-items: center;
        }
        .marquee-inner-scroll {
          display: inline-block; padding-left: 100%;
          animation: scrollTicker 25s linear infinite;
          font-family: monospace; font-size: 12px; font-weight: bold;
          letter-spacing: 2px; color: #f8fafc; text-transform: uppercase;
        }
        
        /* --- SECURE DATA BOX NOTE AT BOTTOM OF ASSETS CARD --- */
        .secure-data-info-box {
          background: rgba(168, 85, 247, 0.04);
          border: 1px dashed rgba(168, 85, 247, 0.3);
          border-radius: 10px; padding: 14px; margin-top: 15px;
          box-shadow: inset 0 0 15px rgba(168, 85, 247, 0.05);
        }
      `}</style>
      
      {/* 0. SECURE INTERACTIVE INTRO GATE CURTAIN */}
      <div className={`intro-curtain ${hasEntered ? 'hidden' : ''}`}>
        <button className="entry-glow-btn" onClick={handleSystemEntry}>DOMAIN EXPANSION</button>
      </div>

      {/* ANNOUNCEMENT SCROLLING TICKER LINE AT THE VERY TOP */}
      {profile.announcement && hasEntered && (
        <div className="marquee-strip-line">
          <div className="marquee-inner-scroll">
            ⚡ NOTIFICATION_CHANNEL // {profile.announcement} &nbsp;&nbsp;••••&nbsp;&nbsp; {profile.announcement} &nbsp;&nbsp;••••&nbsp;&nbsp; {profile.announcement} &nbsp;&nbsp;••••&nbsp;&nbsp;
          </div>
        </div>
      )}
      
      {/* 1. MASTER VIDEO BACKGROUND */}
      {profile.bgVideoUrl && (
        <video src={profile.bgVideoUrl} autoPlay loop muted playsInline style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: -3, pointerEvents: 'none' }} />
      )}
      
      {/* 2. OVERLAY BLUR WINDOW TINT */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(10, 10, 15, 0.55)', backdropFilter: 'blur(8px)', zIndex: -2, pointerEvents: 'none' }} />

      {/* 3. LOOPING AUDIO ELEMENT */}
      {profile.audioBgUrl && <audio ref={audioRef} src={profile.audioBgUrl} loop />}

      {/* FLOATING CONTROLLER CONFIG */}
      {profile.audioBgUrl && hasEntered && (
        <button onClick={toggleAudioPlayback} style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 100, background: 'rgba(15, 15, 20, 0.6)', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '50%', width: '46px', height: '46px', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
          {isPlaying ? '⏸️' : '🎵'}
        </button>
      )}

      {/* PROFILE DESIGN LAYOUT HOOK MAIN HOUSING */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* TOP COMPONENT INFO SLOTS */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '50px' }}>
          {profile.avatarUrl && (
            <div className="pfp-wrapper">
              <img src={profile.avatarUrl} alt="avatar" style={{ width: '95px', height: '95px', borderRadius: '50%', border: '2px solid rgba(168,85,247,0.5)', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 2 }} />
            </div>
          )}
          <h1 style={{ margin: '5px 0 5px 0', fontSize: '26px', letterSpacing: '1px', fontWeight: '800' }}>{profile.username}</h1>
          <p style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#a855f7', fontWeight: 'bold', letterSpacing: '3px' }}>{profile.subtitle}</p>
          <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>{profile.bio}</p>
        </div>

        {/* THREE HORIZONTAL GRID COLUMNS ENGINE ARRAYS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', alignItems: 'start' }}>
          
          {/* COLUMN BLOCK 1: SOCIAL PORTS */}
          <div className="animate-fade-in column-delay-1" style={{ background: 'rgba(15,15,20,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6366f1', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #6366f1', paddingLeft: '10px', fontWeight: '700' }}>Socials</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {socials.map(item => (
                <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '14px 18px', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'block' }}>
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN BLOCK 2: HORIZONTAL PLATFORM SPLIT ASSETS SEGMENT */}
          <div className="animate-fade-in column-delay-2" style={{ background: 'rgba(15,15,20,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#a855f7', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #a855f7', paddingLeft: '10px', fontWeight: '700' }}>Assets & Presets</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              {/* SUB BLOCK ROW: WINDOWS LIST ARRAYS */}
              <div>
                <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🪟 Windows System Apps
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {windowsAssets.map(item => (
                    <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '12px 16px', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '13px', display: 'block' }}>
                      {cleanTitle(item.title)}
                    </a>
                  ))}
                </div>
              </div>

              {/* SUB BLOCK ROW: MAC OS LIST ARRAYS */}
              <div>
                <div style={{ fontSize: '11px', color: '#fb7185', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🍎 Mac OS System Apps
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {macAssets.map(item => (
                    <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '12px 16px', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '13px', display: 'block' }}>
                      {cleanTitle(item.title)}
                    </a>
                  ))}
                </div>
              </div>

              {/* DEDICATED INDEPENDENT NOTES & PASSWORDS SYSTEM BLOCK AS DRAWN AT THE BOTTOM */}
              {notesAssets.length > 0 && (
                <div className="secure-data-info-box">
                  <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'monospace' }}>
                    🔒 Password & Info Index
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notesAssets.map(item => (
                      <div key={item._id} style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(168,85,247,0.1)' }}>
                        <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{cleanTitle(item.title)}</span>: {item.url}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* COLUMN BLOCK 3: CINEMATIC SHOWCASE EDITS */}
          <div className="animate-fade-in column-delay-3" style={{ background: 'rgba(15,15,20,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #10b981', paddingLeft: '10px', fontWeight: '700' }}>My Work</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {myWork.map(item => (
                <div key={item._id} className="video-card-container">
                  <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
                    <video src={item.url} controls muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(20,20,25,0.4)' }}>
                    <strong style={{ fontSize: '13.5px', color: '#f8fafc', display: 'block' }}>{item.title}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
