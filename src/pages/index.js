import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch('/api/links')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  // Custom Physics Particle System Core Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const particlesArray = [];
    const numberOfParticles = 75;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#a855f7'; // Cosmic Purple tint theme accent
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [data]);

  if (!data) return <div style={{ background: '#0a0a0f', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Engine...</div>;

  const { profile, socials, assets, myWork } = data;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '40px 20px', boxSizing: 'border-box' }}>
      
      {/* 1. BACKGROUND VIDEO LAYER (POINTER EVENTS DISABLED TO PREVENT CLICK BLOCKING) */}
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
      
      {/* 2. CUSTOM PARTICLES CANVAS ENGINE MATRIX */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, pointerEvents: 'none' }} />
      
      {/* 3. BLURRED GLASS GLASSMORPHIC BLUR OVERLAY SHIELD */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(10, 10, 15, 0.82)', backdropFilter: 'blur(16px)', zIndex: -1, pointerEvents: 'none' }} />

      {/* MAIN CONTAINER LAYOUT */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* BRAND LOGO HEADER AVATAR SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          {profile.avatarUrl && <img src={profile.avatarUrl} alt="avatar" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '2px solid rgba(168,85,247,0.4)', objectFit: 'cover', marginBottom: '15px' }} />}
          <h1 style={{ margin: '0 0 5px 0', fontSize: '26px', letterSpacing: '1px', fontWeight: '800' }}>{profile.username}</h1>
          <p style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#a855f7', fontWeight: 'bold', letterSpacing: '3px' }}>{profile.subtitle}</p>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>{profile.bio}</p>
        </div>

        {/* HORIZONTAL COLUMNS GRID WRAPPER */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', alignItems: 'start' }}>
          
          {/* COLUMN 1: SOCIAL LINKS PANEL */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6366f1', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #6366f1', paddingLeft: '10px' }}>Socials</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {socials.length === 0 ? <p style={{ color: '#444', fontSize: '13px' }}>No socials listed.</p> : socials.map(item => (
                <a key={item._id} href={item.url} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px 18px', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '14px', transition: 'transform 0.2s, background 0.2s', display: 'block' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2: EDITING ASSETS & PRESETS PANEL */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#a855f7', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #a855f7', paddingLeft: '10px' }}>Assets & Presets</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assets.length === 0 ? <p style={{ color: '#444', fontSize: '13px' }}>No design materials hosted yet.</p> : assets.map(item => (
                <a key={item._id} href={item.url} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px 18px', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'block' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 3: MY WORK SHOWCASE (WITH EMBEDDED PREVIEW STREAMERS) */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #10b981', paddingLeft: '10px' }}>My Work</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {myWork.length === 0 ? <p style={{ color: '#444', fontSize: '13px' }}>No showreels added yet.</p> : myWork.map(item => (
                <div key={item._id} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden' }}>
                  <video src={item.url} controls muted playsInline style={{ width: '100%', aspectRatio: '16/9', display: 'block', objectFit: 'cover', background: '#000' }} />
                  <div style={{ padding: '12px' }}>
                    <strong style={{ fontSize: '14px', color: '#fff', display: 'block' }}>{item.title}</strong>
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
