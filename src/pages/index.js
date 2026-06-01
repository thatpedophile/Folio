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

  // Background Physics Particles Engine Activation Loop
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
    const numberOfParticles = 80; // Balanced visibility density

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5; // Slightly varied sizes
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.5 + 0.3;
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
        ctx.fillStyle = '#a855f7'; // Neon cosmic purple glow accent
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

  if (!data) return <div style={{ background: '#0a0a0f', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>Loading Engine...</div>;

  const { profile, socials, assets, myWork } = data;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '60px 20px', boxSizing: 'border-box' }}>
      
      {/* RESTORED SMOOTH GLASSMORPHIC HOVER EFFECTS */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .column-delay-1 { animation-delay: 0.1s; opacity: 0; }
        .column-delay-2 { animation-delay: 0.2s; opacity: 0; }
        .column-delay-3 { animation-delay: 0.3s; opacity: 0; }
        
        .interactive-card {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        .interactive-card:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(168, 85, 247, 0.5) !important;
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.2);
        }
        .video-card-container {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .video-card-container:hover {
          transform: scale(1.015);
        }
      `}</style>
      
      {/* 1. LIVE RECONSTRUCTED VIDEO CANVAS ENGINE WALLPAPER */}
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
      
      {/* 2. GLOWING PARTICLE CANVAS SYSTEM LAYER */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, pointerEvents: 'none' }} />
      
      {/* 3. SHIELD TINT GLASS OVERLAY OVER LIVE WALLPAPER */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(10, 10, 15, 0.45)', backdropFilter: 'blur(8px)', zIndex: -1, pointerEvents: 'none' }} />

      {/* RENDER BODY CONTEXT BLOCK CONTAINER */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* HEADER BRAND SECTOR */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '50px' }}>
          {profile.avatarUrl && <img src={profile.avatarUrl} alt="avatar" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '2px solid rgba(168,85,247,0.5)', objectFit: 'cover', marginBottom: '15px' }} />}
          <h1 style={{ margin: '0 0 5px 0', fontSize: '26px', letterSpacing: '1px', fontWeight: '800' }}>{profile.username}</h1>
          <p style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#a855f7', fontWeight: 'bold', letterSpacing: '3px' }}>{profile.subtitle}</p>
          <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>{profile.bio}</p>
        </div>

        {/* HORIZONTAL GRID SPLIT COLUMNS ARCHITECTURE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', alignItems: 'start' }}>
          
          {/* COLUMN 1: SOCIAL PORTS */}
          <div className="animate-fade-in column-delay-1" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6366f1', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #6366f1', paddingLeft: '10px', fontWeight: '700' }}>Socials</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {socials.length === 0 ? <p style={{ color: '#64748b', fontSize: '13px' }}>Empty.</p> : socials.map(item => (
                <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="interactive-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '14px 18px', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'block' }}>
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2: ASSETS & DESIGN PACKS */}
          <div className="animate-fade-in column-delay-2" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#a855f7', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #a855f7', paddingLeft: '10px', fontWeight: '700' }}>Assets & Presets</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assets.length === 0 ? <p style={{ color: '#64748b', fontSize: '13px' }}>Empty.</p> : assets.map(item => (
                <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="interactive-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '14px 18px', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'block' }}>
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 3: CINEMATIC SHOWCASE WIDESCREEN BLOCKS */}
          <div className="animate-fade-in column-delay-3" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase', borderLeft: '3px solid #10b981', paddingLeft: '10px', fontWeight: '700' }}>My Work</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {myWork.length === 0 ? <p style={{ color: '#64748b', fontSize: '13px' }}>Empty.</p> : myWork.map(item => (
                <div key={item._id} className="video-card-container" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden', boxSizing: 'border-box' }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
                    <video 
                      src={item.url} 
                      controls 
                      muted 
                      playsInline 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(20,20,25,0.2)' }}>
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
