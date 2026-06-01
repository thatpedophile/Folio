import { useEffect, useState, useRef } from 'react';

const bgStyles = {
  cosmic_purple: { backgroundColor: '#050508', backgroundImage: 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, #050508 60%)' },
  deep_void: { backgroundColor: '#020203', backgroundImage: 'none' },
  liquid_emerald: { backgroundColor: '#020604', backgroundImage: 'radial-gradient(circle at 50% -20%, #064e3b 0%, #020604 60%)' },
  ruby_glow: { backgroundColor: '#050202', backgroundImage: 'radial-gradient(circle at 50% -20%, #4c0519 0%, #050202 60%)' },
  neon_cyber: { backgroundColor: '#07040d', backgroundImage: 'radial-gradient(circle at 20% -10%, #2e0854 0%, #07040d 50%)' }
};

export default function Home() {
  const [links, setLinks] = useState([]);
  const [videoProjects, setVideoProjects] = useState([]);
  const [particles, setParticles] = useState([]);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [profile, setProfile] = useState({
    username: 'sh1vx', bio: '', avatarUrl: '', videoUrl: '', subtitle: 'VFX PORTFOLIO ENGINE', bgPreset: 'cosmic_purple', audioBgUrl: '', audioHoverUrl: ''
  });

  const hoverAudioRef = useRef(null);
  const bgAudioRef = useRef(null);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflowX = "hidden";

    fetch('/api/links')
      .then((res) => res.json())
      .then((data) => {
        setLinks(data.links || []);
        setVideoProjects(data.videoProjects || []);
        if (data.profile) setProfile(data.profile);
      });
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;
    const frame = requestAnimationFrame(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - 0.02,
            size: p.size * 0.98
          }))
          .filter((p) => p.alpha > 0)
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [particles]);

  const triggerSparkParticles = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX || (rect.left + rect.width / 2);
    const clickY = e.clientY || (rect.top + rect.height / 2);

    const pool = [];
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      pool.push({
        id: Math.random(),
        x: clickX,
        y: clickY + window.scrollY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 6 + 4,
        alpha: 1,
        color: ['#6366f1', '#a855f7', '#ec4899', '#38bdf8'][Math.floor(Math.random() * 4)]
      });
    }
    setParticles((prev) => [...prev, ...pool]);
  };

  const playHoverSound = () => {
    if (hoverAudioRef.current) {
      hoverAudioRef.current.currentTime = 0;
      hoverAudioRef.current.play().catch(() => {});
    }
  };

  const toggleBackgroundAudioTrack = () => {
    if (!bgAudioRef.current) return;
    if (musicPlaying) {
      bgAudioRef.current.pause();
    } else {
      bgAudioRef.current.play().catch(() => {});
    }
    setMusicPlaying(!musicPlaying);
  };

  return (
    <div style={{
      ...bgStyles[profile.bgPreset] || bgStyles.cosmic_purple,
      color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', boxSizing: 'border-box', position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {profile.audioHoverUrl && <audio ref={hoverAudioRef} src={profile.audioHoverUrl} preload="auto" />}
      {profile.audioBgUrl && <audio ref={bgAudioRef} src={profile.audioBgUrl} loop preload="auto" />}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes borderSweep {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .premium-btn {
          position: relative; border-radius: 14px; background: rgba(255, 255, 255, 0.05); text-decoration: none; text-align: center; padding: 18px; font-weight: 600; display: block; color: #f8fafc; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .premium-btn::before {
          content: ''; position: absolute; inset: -1px; border-radius: 14px; padding: 1.5px; background: linear-gradient(90deg, transparent, transparent, transparent); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; transition: all 0.4s; background-size: 200% auto;
        }
        .premium-btn:hover {
          transform: translateY(-2px); background: rgba(255, 255, 255, 0.09); box-shadow: 0 0 25px rgba(99, 102, 241, 0.25);
        }
        .premium-btn:hover::before {
          background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #6366f1); background-size: 200% auto; animation: borderSweep 2s linear infinite;
        }
      `}} />

      {particles.map((p) => (
        <div key={p.id} style={{
          position: 'absolute', left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: '50%', backgroundColor: p.color, opacity: p.alpha, pointerEvents: 'none', transform: 'translate(-50%, -50%)', boxShadow: `0 0 10px ${p.color}`, zIndex: 9999
        }} />
      ))}

      {profile.audioBgUrl && (
        <button onClick={toggleBackgroundAudioTrack} style={{
          position: 'fixed', bottom: '24px', right: '24px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, transition: 'all 0.2s'
        }}>
          {musicPlaying ? '⏸️' : '🎵'}
        </button>
      )}
      
      <div style={{ textAlign: 'center', marginBottom: '35px', userSelect: 'none' }}>
        <div onClick={triggerSparkParticles} style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
          <div style={{ position: 'absolute', top: '-4px', left: '-4px', right: '-4px', bottom: '-4px', borderRadius: '50%', background: 'linear-gradient(45deg, #6366f1, #a855f7, #ec4899)', opacity: '0.6', filter: 'blur(8px)', zIndex: 0 }}></div>
          <img src={profile.avatarUrl || 'https://api.dicebear.com/7.x/shapes/svg?seed=sh1vx'} style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 1, objectFit: 'cover' }} />
        </div>

        <h1 onClick={triggerSparkParticles} style={{ cursor: 'pointer', fontSize: '26px', fontWeight: '700', margin: '15px 0 5px 0', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {profile.username}
        </h1>
        <p style={{ color: '#6366f1', fontSize: '12px', margin: '0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
          {profile.subtitle}
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div onClick={triggerSparkParticles} style={{ cursor: 'pointer', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px', textAlign: 'center', fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
          {profile.bio || 'Click me or profile units to trigger particle bursts.'}
        </div>

        {profile.videoUrl && (
          <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', overflow: 'hidden' }}>
            <video key={profile.videoUrl} src={profile.videoUrl} controls autoPlay muted loop playsInline style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }} />
          </div>
        )}

        {videoProjects.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 -4px 4px' }}>Recent Edits / Works</h3>
            {videoProjects.map((project) => (
              <div key={project._id} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', overflow: 'hidden' }}>
                <video src={project.url} controls muted loop playsInline style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }} />
                <div style={{ padding: '14px', fontSize: '14px', fontWeight: '600', color: '#f8fafc', background: 'rgba(0,0,0,0.3)' }}>{project.title}</div>
              </div>
            ))}
          </div>
        )}

        {links.length > 0 && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 -4px 4px' }}>Links</h3>
            {links.map((link) => (
              <a
                key={link._id} href={link.url} target="_blank" rel="noopener noreferrer" className="premium-btn"
                onMouseEnter={playHoverSound}
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
