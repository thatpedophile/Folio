import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); {/* Manages the full-screen cinematic overlay portal */}
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
        .catch(err => console.log("Audio block bypass:", err));
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

  const allLinksCombined = [...(socials || []), ...(assets || []), ...(myWork || [])];

  const cleanTitle = (title) => {
    return title.replace(/\[windows\]/i, '').replace(/\[mac\]/i, '').replace(/\[activation\]/i, '').replace(/\[othersite\]/i, '').replace(/\[lowertutorial\]/i, '').trim();
  };

  const isUrlOnly = (string) => {
    try { return (string.startsWith('http://') || string.startsWith('https://')) && !string.includes(' '); } 
    catch (_) { return false; }
  };

  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noreferrer" style={{ color: '#c084fc', textDecoration: 'underline', fontWeight: 'bold', wordBreak: 'break-all' }}>{part}</a>;
      }
      return part;
    });
  };

  const RenderAttachedSubNodes = ({ parentId }) => {
    const matchingNodes = allLinksCombined.filter(item => item.parentId === parentId);
    if (matchingNodes.length === 0) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', marginBottom: '10px' }}>
        {matchingNodes.map(node => (
          <div key={node._id} className="individual-pass-box">
            {node.title.toLowerCase().includes('pass') ? '🔑' : '📌'} {cleanTitle(node.title)}: {node.url}
          </div>
        ))}
      </div>
    );
  };

  {/* ================= MATRIX DATA SET ARRAYS GRID FILTERS ================= */}
  const block1Socials = socials?.filter(item => !item.title.toLowerCase().match(/\[activation\]|\[othersite\]|\[lowertutorial\]/) && !item.parentId) || [];
  
  const windowsAssets = assets?.filter(item => item.title.toLowerCase().includes('[windows]') && !item.parentId) || [];
  const macAssets = assets?.filter(item => item.title.toLowerCase().includes('[mac]') && !item.parentId) || [];

  const block3Work = myWork?.filter(item => !item.title.toLowerCase().match(/\[activation\]|\[othersite\]|\[lowertutorial\]/) && !item.parentId) || [];

  const totalActivationNodes = allLinksCombined.filter(item => item.title.toLowerCase().includes('[activation]') && !item.parentId);
  const windowsActivation = totalActivationNodes.filter(item => item.title.toLowerCase().includes('windows'));
  const macActivation = totalActivationNodes.filter(item => item.title.toLowerCase().includes('mac'));

  const block5OtherSites = allLinksCombined.filter(item => item.title.toLowerCase().includes('[othersite]') && !item.parentId);
  const block6Tutorials = allLinksCombined.filter(item => item.title.toLowerCase().includes('[lowertutorial]') && !item.parentId);

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
        .particle-btn:hover::after { opacity: 1; animation: floatParticles 2.5s infinite linear 0.7s; }

        .video-card-container {
          background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          width: 100%; box-sizing: border-box;
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

        .grid-block-panel {
          background: rgba(15,15,20,0.4); border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px; padding: 20px; backdrop-filter: blur(12px);
        }
        .matrix-row-wrapper {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 25px; align-items: start;
        }
        
        /* --- ADVANCED MODAL HUD INTERFACE LAYOUT STYLES --- */
        .cinematic-modal-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(6, 6, 10, 0.82); backdrop-filter: blur(28px);
          z-index: 5000; display: flex; justify-content: center; align-items: center;
          opacity: 0; visibility: hidden; pointer-events: none;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 20px; box-sizing: border-box;
        }
        .cinematic-modal-overlay.active {
          opacity: 1; visibility: visible; pointer-events: auto;
        }
        .modal-inner-card-matrix {
          width: 100%; max-width: 1100px; height: 85vh;
          background: rgba(18, 18, 26, 0.65); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; padding: 35px; box-sizing: border-box;
          display: flex; flex-direction: column; position: relative;
          box-shadow: 0 30px 70px rgba(0,0,0,0.8);
          transform: translateY(30px) scale(0.97); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cinematic-modal-overlay.active .modal-inner-card-matrix {
          transform: translateY(0) scale(1);
        }
        .modal-split-panels-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px;
          flex: 1; min-height: 0; margin-top: 25px;
        }
        @media (max-width: 800px) {
          .modal-split-panels-grid { grid-template-columns: 1fr; }
        }
        .modal-scroll-pane-card {
          background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.03);
          border-radius: 16px; padding: 20px; overflow-y: auto; box-sizing: border-box;
          display: flex; flexDirection: column; gap: 18px;
        }
        .modal-scroll-pane-card::-webkit-scrollbar { width: 5px; }
        .modal-scroll-pane-card::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        .pro-doc-guide-card {
          background: rgba(15, 15, 22, 0.7); border: 1px solid rgba(255,255,255,0.04);
          padding: 18px; border-radius: 12px; font-family: monospace;
          font-size: 12.5px; line-height: 1.65; color: #cbd5e1;
          white-space: pre-wrap; word-break: break-word; text-align: left;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .individual-pass-box {
          display: block; font-size: 11.5px; color: #a855f7; font-family: monospace;
          background: rgba(168, 85, 247, 0.04); border: 1px solid rgba(168, 85, 247, 0.25);
          padding: 8px 14px; border-radius: 6px; margin: 6px 0 12px 0; letter-spacing: 0.5px;
          text-shadow: 0 0 8px rgba(168,85,247,0.3); text-align: left; backdrop-filter: blur(5px);
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
            ⚡ NOTIFICATION_CHANNEL // {profile.announcement} &nbsp;&nbsp;••••&nbsp;&nbsp;
          </div>
        </div>
      )}
      
      {/* BACKGROUND BG VIDEO */}
      {profile.bgVideoUrl && (
        <video src={profile.bgVideoUrl} autoPlay loop muted playsInline style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: -3, pointerEvents: 'none' }} />
      )}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(10, 10, 15, 0.55)', backdropFilter: 'blur(8px)', zIndex: -2, pointerEvents: 'none' }} />

      {/* AUDIO PLAYER */}
      {profile.audioBgUrl && <audio ref={audioRef} src={profile.audioBgUrl} loop />}

      {/* AUDIO FLIP ACTION FLOATER */}
      {profile.audioBgUrl && hasEntered && (
        <button onClick={toggleAudioPlayback} style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 100, background: 'rgba(15, 15, 20, 0.6)', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '50%', width: '46px', height: '46px', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
          {isPlaying ? '⏸️' : '🎵'}
        </button>
      )}

      {/* ======================================================================
          THE CINEMATIC FULL-SCREEN OVERLAY PORTAL SCREEN (FOR BLOCK 4 ACTIVATION)
         ====================================================================== */}
      <div className={`cinematic-modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
        <div className="modal-inner-card-matrix" onClick={(e) => e.stopPropagation()}>
          
          {/* TOP HEADER CONTROLS INSIDE MODAL */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '1.5px', color: '#a855f7', textTransform: 'uppercase', fontWeight: '800' }}>⚡ {profile.block4Name} Gateway</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>SECURE ACCESS CONSOLE SYSTEM ACTIVE</p>
            </div>
            <button onClick={() => setIsModalOpen(false)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>CLOSE ESC</button>
          </div>

          {/* SPLIT HUB COLUMNS: HORIZONTAL PANELS MATRIX SIDE-BY-SIDE */}
          <div className="modal-split-panels-grid">
            
            {/* WINDOWS ACTIVATION DECK */}
            <div className="modal-scroll-pane-card" style={{ borderTop: '3px solid #38bdf8' }}>
              <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>🪟 Windows Setup Panel</div>
              {windowsActivation.map(item => (
                <div key={item._id} className="pro-doc-guide-card">
                  <div style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: '8px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>{cleanTitle(item.title)}</div>
                  <div style={{ color: '#e2e8f0' }}>{renderTextWithLinks(item.url)}</div>
                  <RenderAttachedSubNodes parentId={item._id} />
                </div>
              ))}
              {windowsActivation.length === 0 && <p style={{ color: '#444855', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>No active setups cataloged.</p>}
            </div>

            {/* MAC OS ACTIVATION DECK */}
            <div className="modal-scroll-pane-card" style={{ borderTop: '3px solid #fb7185' }}>
              <div style={{ fontSize: '12px', color: '#fb7185', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>🍎 Mac OS Setup Panel</div>
              {macActivation.map(item => (
                <div key={item._id} className="pro-doc-guide-card">
                  <div style={{ color: '#fb7185', fontWeight: 'bold', marginBottom: '8px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>{cleanTitle(item.title)}</div>
                  <div style={{ color: '#e2e8f0' }}>{renderTextWithLinks(item.url)}</div>
                  <RenderAttachedSubNodes parentId={item._id} />
                </div>
              ))}
              {macActivation.length === 0 && <p style={{ color: '#444855', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>No active setups cataloged.</p>}
            </div>

          </div>

        </div>
      </div>

      {/* CORE FRAME LAYOUT WRAPPER CONTENT BOUNDS */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* BRAND TITLE LOG */}
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

        {/* ========================================================
            ROW MATRIX GRID 1: THE PRIMARY UPPER THREE COLS (1, 2, 3)
           ======================================================== */}
        <div className="matrix-row-wrapper">
          
          {/* BLOCK 1 */}
          <div className="animate-fade-in column-delay-1 grid-block-panel" style={{ borderLeft: '3px solid #6366f1' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6366f1', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>{profile.block1Name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {block1Socials.map(item => (
                <div key={item._id}>
                  <a href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '14px 18px', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'block' }}>
                    {cleanTitle(item.title)}
                  </a>
                  <RenderAttachedSubNodes parentId={item._id} />
                </div>
              ))}
            </div>
          </div>

          {/* BLOCK 2 */}
          <div className="animate-fade-in column-delay-2 grid-block-panel" style={{ borderLeft: '3px solid #a855f7' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#a855f7', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>{profile.block2Name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div>
                <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>🪟 Windows System Apps</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {windowsAssets.map(item => (
                    <div key={item._id}>
                      <a href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '12px 16px', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '13px', display: 'block' }}>
                        {cleanTitle(item.title)}
                      </a>
                      <RenderAttachedSubNodes parentId={item._id} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: '#fb7185', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>🍎 Mac OS System Apps</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {macAssets.map(item => (
                    <div key={item._id}>
                      <a href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '12px 16px', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '13px', display: 'block' }}>
                        {cleanTitle(item.title)}
                      </a>
                      <RenderAttachedSubNodes parentId={item._id} />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* BLOCK 3 */}
          <div className="animate-fade-in column-delay-3 grid-block-panel" style={{ borderLeft: '3px solid #10b981' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>{profile.block3Name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {block3Work.map(item => (
                <div key={item._id}>
                  <div className="video-card-container">
                    <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
                      <video src={item.url} controls muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(20,20,25,0.4)', fontSize: '13px' }}>{cleanTitle(item.title)}</div>
                  </div>
                  <RenderAttachedSubNodes parentId={item._id} />
                </div>
              ))}
            </div>
          </div>

        </div>

        <div style={{ margin: '40px 0' }} />

        {/* ========================================================
            ROW MATRIX GRID 2: LOWER INTERACTIVE MATRIC MATRIX SLOTS
           ======================================================== */}
        <div className="matrix-row-wrapper">
          
          {/* BLOCK 4: ACTIVATION (TRIGGER FULL-SCREEN DUAL OVERLAY GATE ON CLICK) */}
          <div className="animate-fade-in column-delay-1 grid-block-panel" style={{ borderLeft: '3px solid #7c3aed' }}>
            <h3 style={{ margin: '0 0 25px 0', fontSize: '14px', color: '#7c3aed', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>{profile.block4Name}</h3>
            <button className="particle-btn" onClick={() => setIsModalOpen(true)} style={{ width: '100%', padding: '16px', borderRadius: '12px', color: '#fff', border: 'none', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer', textAlign: 'center', letterSpacing: '1.5px', textTransform: 'uppercase', background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(168,85,247,0.1) 100%)' }}>
              ⚡ Open Activation Console
            </button>
          </div>

          {/* BLOCK 5 */}
          <div className="animate-fade-in column-delay-2 grid-block-panel" style={{ borderLeft: '3px solid #0ea5e9' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#0ea5e9', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>{profile.block5Name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {block5OtherSites.map(item => (
                <div key={item._id}>
                  {isUrlOnly(item.url) ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '14px 18px', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'block' }}>
                      {cleanTitle(item.title)}
                    </a>
                  ) : (
                    <div className="markdown-doc-card" style={{ padding: '14px', margin: 0 }}>
                      <div style={{ color: '#0ea5e9', fontWeight: 'bold', marginBottom: '6px' }}>{cleanTitle(item.title)}</div>
                      <div>{renderTextWithLinks(item.url)}</div>
                    </div>
                  )}
                  <RenderAttachedSubNodes parentId={item._id} />
                </div>
              ))}
              {block5OtherSites.length === 0 && <p style={{ color: '#64748b', fontSize: '12px' }}>Empty.</p>}
            </div>
          </div>

          {/* BLOCK 6 */}
          <div className="animate-fade-in column-delay-3 grid-block-panel" style={{ borderLeft: '3px solid #059669' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#059669', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>{profile.block6Name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {block6Tutorials.map(item => (
                <div key={item._id}>
                  {isUrlOnly(item.url) && (item.url.endsWith('.mp4') || item.url.includes('raw.githubusercontent.com')) ? (
                    <div className="video-card-container" style={{ borderStyle: 'dashed' }}>
                      <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
                        <video src={item.url} controls muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '10px', background: 'rgba(20,20,25,0.4)', fontSize: '13px' }}>{cleanTitle(item.title)}</div>
                    </div>
                  ) : (
                    <div className="markdown-doc-card" style={{ padding: '14px', margin: 0 }}>
                      <div style={{ color: '#059669', fontWeight: 'bold', marginBottom: '6px' }}>{cleanTitle(item.title)}</div>
                      <div>{renderTextWithLinks(item.url)}</div>
                    </div>
                  )}
                  <RenderAttachedSubNodes parentId={item._id} />
                </div>
              ))}
              {block6Tutorials.length === 0 && <p style={{ color: '#64748b', fontSize: '12px' }}>Empty.</p>}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
