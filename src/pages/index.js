import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch('/api/links')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  // Browser Autoplay Safe-Guard Trigger
  const handleStartAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => console.log("Audio play blocked by browser:", err));
    }
  };

  if (!data) return <div style={{ background: '#0a0a0f', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>Loading Engine...</div>;

  const { profile, socials, assets, myWork } = data;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '60px 20px', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* GLOBAL HOVER EFFECTS & PARTICLE STYLES */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatParticles {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-40px) translateX(10px); opacity: 0; }
        }

        .animate-fade-in {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .column-delay-1 { animation-delay: 0.1s; opacity: 0; }
        .column-delay-2 { animation-delay: 0.2s; opacity: 0; }
        .column-delay-3 { animation-delay: 0.3s; opacity: 0; }
        
        .pfp-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 15px;
        }
        .pfp-wrapper::before, .pfp-wrapper::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          background: #a855f7;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          box-shadow: 0 0 10px #a855f7;
        }
        .pfp-wrapper::before {
          top: 80%; left: 20%;
          animation: floatParticles 3s infinite linear;
        }
        .pfp-wrapper::after {
          top: 70%; right: 15%;
          animation: floatParticles 4s infinite linear 1.5s;
        }

        .particle-btn {
          position: relative;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        .particle-btn::before, .particle-btn::after {
          content: '';
          position: absolute;
          background: radial-gradient(circle, rgba(168,85,247,0.8) 0%, transparent 70%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
        }
        .particle-btn::before { left: 20%; bottom: -10px; }
        .particle-btn::after { right: 30%; bottom: -15px; }

        .particle-btn:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(168, 85, 247, 0.5) !important;
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.2);
        }
        .particle-btn:hover::before { opacity: 1; animation: floatParticles 2s infinite linear; }
        .particle-btn:hover::after { opacity: 1; animation: floatParticles 2.5s infinite linear 0.7s; }

        .video-card-container {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .video-card-container:hover {
          transform: scale(1.015);
          border-color: rgba(16, 185, 129, 0.4);
        }
      `}</style>
      
      {/* 1. MASTER BACKGROUND VIDEO */}
      {profile.bgVideoUrl && (
        <video 
          src={profile.bgVideoUrl} 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: -3, pointerEvents: 'none' }} 
        />
      )}
      
      {/* 2. BACKGROUND GLASS TINT */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(10, 10, 15, 0.55)', backdropFilter: 'blur(8px)', zIndex: -2, pointerEvents: 'none' }} />

      {/* 3. HIDDEN LOOPING BACKGROUND AUDIO ELEMENT */}
      {profile.audioBgUrl && (
        <audio ref={audioRef} src={profile.audioBgUrl} loop />
      )}

      {/* FLOATING AUDIO CONTROLLER WIDGET */}
      {profile.audioBgUrl && (
        <button 
          onClick={isPlaying ? () => { audioRef.current.pause(); setIsPlaying(false); } : handleStartAudio}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100, background: 'rgba(15, 15, 20, 0.6)', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '50%', width: '45px', height: '45px', color: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', transition: 'transform 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isPlaying ? '⏸️' : '🎵'}
        </button>
      )}

      {/* CONTENT LAYOUT WRAPPER CONTAINER */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }} onClick={!isPlaying ? handleStartAudio : undefined}>
        
        {/* HEADER SECTION */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '50px' }}>
          {profile.avatarUrl && (
            <div className="pfp-wrapper">
              <img src={profile.avatarUrl} alt="avatar" style={{ width: '95px', height: '95px', borderRadius: '50%', border: '2px solid rgba(168,85,247,0.5)', objectFit: 'cover', display: 'block', position: 'relative', zIndex: 2 }} />
            </div>
          )}
          <h1 style={{ margin: '5px 0 5px 0', fontSize: '26px', letterSpacing: '1px', fontWeight: '800' }}>{profile.username}</h1>
          <p style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#a855f7', fontWeight: 'bold', letterSpacing: '3px' }}>{profile.subtitle}</p>
          <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>{profile.bio}</p>
          
          {/* AUDIO ENTRY ALIVE NOTICE */}
          {profile.audioBgUrl && !isPlaying && (
            <span style={{ fontSize: '10px', color: '#a855f7', display: 'block', marginTop: '10px', letterSpacing: '1px', cursor: 'pointer', textDecoration: 'underline' }} onClick={handleStartAudio}>
              ⚠️ Click anywhere to unmute live background audio track
            </span>
          )}
        </div>

        {/* 3 HORIZONTAL GRID COLUMNS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', alignItems: 'start' }}>
          
          {/* COLUMN 1: SOCIALS */}
          <div className="animate-fade-in column-delay-1" style={{ background: 'rgba(15,15,20,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6366f1', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #6366f1', paddingLeft: '10px', fontWeight: '700' }}>Socials</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {socials.length === 0 ? <p style={{ color: '#64748b', fontSize: '13px' }}>Empty.</p> : socials.map(item => (
                <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '14px 18px', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'block' }}>
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2: ASSETS & PRESETS */}
          <div className="animate-fade-in column-delay-2" style={{ background: 'rgba(15,15,20,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#a855f7', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #a855f7', paddingLeft: '10px', fontWeight: '700' }}>Assets & Presets</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assets.length === 0 ? <p style={{ color: '#64748b', fontSize: '13px' }}>Empty.</p> : assets.map(item => (
                <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="particle-btn" style={{ padding: '14px 18px', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'block' }}>
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 3: MY WORK */}
          <div className="animate-fade-in column-delay-3" style={{ background: 'rgba(15,15,20,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #10b981', paddingLeft: '10px', fontWeight: '700' }}>My Work</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {myWork.length === 0 ? <p style={{ color: '#64748b', fontSize: '13px' }}>Empty.</p> : myWork.map(item => (
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
