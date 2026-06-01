import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/links')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  if (!data) {
    return (
      <div style={{ background: '#07070a', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace', letterSpacing: '2px' }}>
        LOADING_SYSTEM_MATRIX...
      </div>
    );
  }

  const { profile, socials, assets, myWork } = data;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#060608', color: '#e2e8f0', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', padding: '60px 20px', boxSizing: 'border-box' }}>
      
      {/* CSS STYLE CONFIG MATRIX */}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background-color: #060608;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-ui {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .grid-link-item {
          transition: all 0.25s ease-in-out;
        }
        .grid-link-item:hover {
          background: rgba(255, 255, 255, 0.03) !important;
          border-color: rgba(168, 85, 247, 0.4) !important;
          color: #fff !important;
          padding-left: 24px !important;
        }
        .work-video-card {
          transition: all 0.3s ease;
        }
        .work-video-card:hover {
          border-color: rgba(168, 85, 247, 0.4) !important;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.1);
        }
        /* Handle Custom Responsive Column Splits */
        .layout-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
        }
        .col-left { grid-column: span 4; }
        .col-right { grid-column: span 8; }

        @media (max-width: 968px) {
          .layout-grid { display: flex; flexDirection: column; gap: 30px; }
          .col-left, .col-right { width: 100%; }
        }
      `}</style>

      {/* 1. IMMERSIVE BASE VIDEO WALLPAPER LAYER */}
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

      {/* 2. AMBIENT SHIELD GRID BLUR MATTE */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'radial-gradient(circle at center, rgba(6,6,8,0.4) 0%, rgba(6,6,8,0.85) 100%)', backdropFilter: 'blur(12px)', zIndex: -2, pointerEvents: 'none' }} />
      
      {/* 3. OPTIONAL SCI-FI SUBTLE DOT/GRID OVERLAY PATTERN */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 0)', backgroundSize: '24px 24px', zIndex: -1, pointerEvents: 'none' }} />

      {/* CORE FRAME LAYOUT STRUCTURE */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* TOP BRAND EMBLEM SECTION */}
        <div className="animate-ui" style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #16161f', paddingBottom: '30px', marginBottom: '40px' }}>
          {profile.avatarUrl && (
            <img 
              src={profile.avatarUrl} 
              alt="Avatar Profile" 
              style={{ width: '64px', height: '64px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #1c1c26' }} 
            />
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px', color: '#fff' }}>{profile.username}</h1>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#a855f7', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #a855f7' }}></span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>{profile.subtitle}</p>
          </div>
        </div>

        {/* REBUILT MAIN SYLVRIXS-STYLE MATRIX GRID */}
        <div className="layout-grid animate-ui" style={{ animationDelay: '0.1s' }}>
          
          {/* LEFT SIDEBAR SECTION: BIO SUMMARY & SOCIAL CHANNELS */}
          <div className="col-left" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* ABOUT ME BLOCK */}
            <div style={{ background: 'rgba(9, 9, 12, 0.55)', border: '1px solid #16161f', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', fontWeight: '600' }}>// BACKGROUND_MANIFEST</div>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#94a3b8' }}>{profile.bio}</p>
            </div>

            {/* CONNECT DIRECTORY BLOCK */}
            <div style={{ background: 'rgba(9, 9, 12, 0.55)', border: '1px solid #16161f', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', fontWeight: '600' }}>// NETWORK_INDEX</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {socials.length === 0 ? (
                  <div style={{ color: '#4b5563', fontSize: '12px' }}>Index empty.</div>
                ) : (
                  socials.map(item => (
                    <a 
                      key={item._id} 
                      href={item.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="grid-link-item" 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b0b0f', border: '1px solid #14141a', padding: '12px 16px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}
                    >
                      <span>{item.title}</span>
                      <span style={{ fontSize: '10px', color: '#4b5563' }}>↗</span>
                    </a>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT HUB: ASSETS DIRECTORY & HORIZONTAL widescreen SHOWCASE CONTAINER */}
          <div className="col-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* ASSETS AND PRESETS SECTIONS ARCHITECTURE */}
            <div style={{ background: 'rgba(9, 9, 12, 0.55)', border: '1px solid #16161f', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px', fontWeight: '600' }}>// ENGINE_UTILITIES_AND_PRESETS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {assets.length === 0 ? (
                  <div style={{ color: '#4b5563', fontSize: '12px' }}>No utility arrays mapped.</div>
                ) : (
                  assets.map(item => (
                    <a 
                      key={item._id} 
                      href={item.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="grid-link-item" 
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b0b0f', border: '1px solid #14141a', padding: '14px 16px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}
                    >
                      <span>{item.title}</span>
                      <span style={{ fontSize: '10px', color: '#4b5563' }}>↓</span>
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* REBUILT WORK SHOWCASES: PURE 16:9 LANDSCAPE CINEMATIC SYSTEM */}
            <div style={{ background: 'rgba(9, 9, 12, 0.55)', border: '1px solid #16161f', borderRadius: '8px', padding: '20px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px', fontWeight: '600' }}>// VISUAL_WORKS_BROADCAST</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {myWork.length === 0 ? (
                  <div style={{ color: '#4b5563', fontSize: '12px' }}>Broadcast channel idle.</div>
                ) : (
                  myWork.map(item => (
                    <div 
                      key={item._id} 
                      className="work-video-card" 
                      style={{ background: '#0b0b0f', border: '1px solid #14141a', borderRadius: '6px', overflow: 'hidden' }}
                    >
                      {/* Strictly maintains standard responsive widescreen architecture */}
                      <div style={{ width: '100%', aspectRatio: '16/9', background: '#020203', position: 'relative' }}>
                        <video 
                          src={item.url} 
                          controls 
                          muted 
                          playsInline 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                        />
                      </div>
                      <div style={{ padding: '14px', borderTop: '1px solid #14141a' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                        <div style={{ fontSize: '10px', color: '#4b5563', marginTop: '4px', fontFamily: 'monospace' }}>RES: 1920X1080 // STREAM_OK</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM MINIMAL DESIGN FOOTER EXPANSION */}
        <div style={{ marginTop: '60px', borderTop: '1px solid #16161f', paddingTop: '20px', textAlign: 'center', fontSize: '11px', color: '#4b5563', letterSpacing: '1px' }}>
          CORE_MATRIX_v2.0 // ALL CHANNELS ACTIVE
        </div>

      </div>
    </div>
  );
}
