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
        .catch(err => console.log("Audio block override:", err));
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

  if (!data) return <div style={{ background: '#0a0a0f', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>LOADING ENGINE...</div>;

  const { profile, socials, assets, myWork } = data;

  // --- COLUMN 1 SORTING (SOCIALS) ---
  const socialSites = socials?.filter(item => !item.title.toLowerCase().includes('[tutorial]')) || [];
  const socialTutorials = socials?.filter(item => item.title.toLowerCase().includes('[tutorial]')) || [];

  // --- COLUMN 2 SORTING (ASSETS & PRESETS) ---
  const windowsAssets = assets?.filter(item => item.title.toLowerCase().includes('[windows]')) || [];
  const macAssets = assets?.filter(item => item.title.toLowerCase().includes('[mac]')) || [];
  const notesAssets = assets?.filter(item => item.title.toLowerCase().includes('[password]') || item.title.toLowerCase().includes('[note]')) || [];

  // --- COLUMN 3 SORTING (MY WORK) ---
  const primaryWork = myWork?.filter(item => !item.title.toLowerCase().includes('[tutorial]')) || [];
  const videoTutorials = myWork?.filter(item => item.title.toLowerCase().includes('[tutorial]')) || [];

  // Strips tags cleanly out for the viewer
  const cleanTitle = (title) => {
    return title.replace(/\[windows\]/i, '').replace(/\[mac\]/i, '').replace(/\[note\]/i, '').replace(/\[password\]/i, '').replace(/\[tutorial\]/i, '').trim();
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '90px 20px 60px 20px', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
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

        .marquee-strip-line {
          position: fixed; top: 0; left: 0; width: 100vw;
          background: linear-gradient(90deg, rgba(15,15,22,0.85) 0%, rgba(168,85,247,0.2) 50%, rgba(15,15,22,0.85) 100%);
          border-bottom: 1px solid rgba(168, 85, 247, 0.35);
          backdrop-filter: blur(12px); z-index: 999; overflow: hidden; white-space: nowrap; padding: 10px 0;
          display: flex; align-items: center;
        }
        .marquee-inner-scroll {
          display: inline-block; padding-left: 100%; animation: scrollTicker 25s linear infinite;
          font-family: monospace; font-size: 12px; font-weight: bold; letter-spacing: 2px; color: #f8fafc; text-transform: uppercase;
        }
        
        .secure-data-info-box {
          background: rgba(168, 85, 247, 0.04); border: 1px dashed rgba(168, 85, 247, 0.3);
          border-radius: 10px; padding: 14px; margin-top: 15px; box-shadow: inset 0 0 15px rgba(168, 85, 247, 0.05);
        }
      `}</style>
      
      {/* 0. INTRO CURTAIN GATE */}
      <div className={`intro-curtain ${hasEntered ? 'hidden' : ''}`}>
        <button className="entry-glow-btn" onClick={handleSystemEntry}>DOMAIN EXPANSION</button>
      </div>

      {/* ANNOUNCEMENT TICKER */}
      {profile.announcement && hasEntered && (
        <div className="marquee-strip-line">
          <div className="marquee-inner-scroll">
            ⚡ NOTIFICATION_CHANNEL // {profile.announcement} &nbsp;&nbsp;••••&nbsp;&nbsp; {profile.announcement} &nbsp;&nbsp;••••&nbsp;&nbsp;
          </div>
        </div>
      )}
      
      {/* BACKGROUND WALLPAPER VIDEO */}
      {profile.bgVideoUrl && (
        <video src={profile.bgVideoUrl} autoPlay loop muted playsInline style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: -3, pointerEvents: 'none' }} />
      )}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(10, 10, 15, 0.55)', backdropFilter: 'blur(8px)', zIndex: -2, pointerEvents: 'none' }} />

      {/* AUDIO LOADER */}
      {profile.audioBgUrl && <audio ref={audioRef} src={profile.audioBgUrl} loop />}

      {/* CORE DISPLAY ARCHITECTURE */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* BRAND IDENTITY */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '50px' }}>
          {profile.avatarUrl && (
            <div className="pfp-wrapper">
              <img src={profile.avatarUrl} alt="avatar" style={{ width: '95px', height: '95px', borderRadius: '50%', border: '2px solid rgba(168,85,247,0.5)', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 2 }} />
            </div>
          )}
          <h1 style={{ margin: '5px 0 5px 0', fontSize: '26px', letterSpacing: '1px', fontWeight: '800' }}>{profile.username}</h1>
          <p style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#a855f7', fontWeight: 'bold', letterSpacing: '3px' }}>{profile.subtitle}</p>
          <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>{profile.bio}</p>
        </div>

        {/* 3 CORE HORIZONTAL GRID COLUMNS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', alignItems: 'start' }}>
          
          {/* ================= COLUMN 1: SOCIALS ================= */}
          <div className="animate-fade-in column-delay-1" style={{ background: 'rgba(15,15,20,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6366f1', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #6366f1', paddingLeft: '10px', fontWeight: '700' }}>Socials</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* BLOCK 1: NETWORKS / SITES */}
              <div>
                <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>🌐 Main Sites</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {socialSites.length === 0 ? <p style={{ color: '#444855', fontSize: '12px' }}>Empty.</p> : socialSites.map(item => (
                    <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '12px 16px', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '13px', display: 'block' }}>
                      {cleanTitle(item.title)}
                    </a>
                  ))}
                </div>
              </div>

              {/* BLOCK 2: TUTORIAL CHANNELS */}
              <div>
                <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>📖 Tutorials & Guides</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {socialTutorials.length === 0 ? <p style={{ color: '#444855', fontSize: '12px' }}>Empty.</p> : socialTutorials.map(item => (
                    <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '12px 16px', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '13px', display: 'block' }}>
                      {cleanTitle(item.title)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= COLUMN 2: ASSETS & PRESETS ================= */}
          <div className="animate-fade-in column-delay-2" style={{ background: 'rgba(15,15,20,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#a855f7', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #a855f7', paddingLeft: '10px', fontWeight: '700' }}>Assets & Presets</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* BLOCK 1: WINDOWS BUILD APPS */}
              <div>
                <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>🪟 Windows Apps</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {windowsAssets.length === 0 ? <p style={{ color: '#444855', fontSize: '12px' }}>Empty.</p> : windowsAssets.map(item => (
                    <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '12px 16px', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '13px', display: 'block' }}>
                      {cleanTitle(item.title)}
                    </a>
                  ))}
                </div>
              </div>

              {/* BLOCK 2: MAC OS BUILD APPS */}
              <div>
                <div style={{ fontSize: '11px', color: '#fb7185', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>🍎 Mac OS Apps</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {macAssets.length === 0 ? <p style={{ color: '#444855', fontSize: '12px' }}>Empty.</p> : macAssets.map(item => (
                    <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '12px 16px', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '13px', display: 'block' }}>
                      {cleanTitle(item.title)}
                    </a>
                  ))}
                </div>
              </div>

              {/* BLOCK 3: PASSWORD NODE ENTRIES */}
              {notesAssets.length > 0 && (
                <div className="secure-data-info-box">
                  <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'monospace' }}>🔑 Passwords & Note Logs</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notesAssets.map(item => (
                      <div key={item._id} style={{ fontSize: '12.5px', color: '#cbd5e1', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(168,85,247,0.1)' }}>
                        <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{cleanTitle(item.title)}</span>: {item.url}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= COLUMN 3: MY WORK ================= */}
          <div className="animate-fade-in column-delay-3" style={{ background: 'rgba(15,15,20,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #10b981', paddingLeft: '10px', fontWeight: '700' }}>My Work</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* BLOCK 1: EDIT SHOWCASES */}
              <div>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>🎬 Production Edits</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {primaryWork.length === 0 ? <p style={{ color: '#444855', fontSize: '12px' }}>Empty.</p> : primaryWork.map(item => (
                    <div key={item._id} className="video-card-container">
                      <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
                        <video src={item.url} controls muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '10px', background: 'rgba(20,20,25,0.4)', fontSize: '13px' }}>{cleanTitle(item.title)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BLOCK 2: EDITING TUTORIAL VIDEOS / BREAKDOWNS */}
              <div>
                <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>🧠 VFX Tutorials</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {videoTutorials.length === 0 ? <p style={{ color: '#444855', fontSize: '12px' }}>Empty.</p> : videoTutorials.map(item => (
                    <div key={item._id} className="video-card-container" style={{ borderStyle: 'dashed' }}>
                      <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
                        <video src={item.url} controls muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '10px', background: 'rgba(20,20,25,0.4)', fontSize: '13px' }}>{cleanTitle(item.title)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
