import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/links')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div style={{ background: '#0a0a0f', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Engine...</div>;

  const { profile, socials, assets, myWork } = data;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', overflowX: 'hidden', padding: '60px 20px' }}>
      
      {/* LIVE ADMIN CUSTOM BACKGROUND VIDEO PLAYER */}
      {profile.bgVideoUrl && (
        <video 
          src={profile.bgVideoUrl} 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: -2, pointerEvents: 'none' }} 
        />
      )}
      
      {/* Ambient Backdrop Fallback Blur Tint Overlay Layer */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(10, 10, 15, 0.75)', backdropFilter: 'blur(12px)', zIndex: -1 }} />

      <div style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
        {/* AVATAR BRAND SECTOR COMPONENT */}
        {profile.avatarUrl && <img src={profile.avatarUrl} alt="avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', objectFit: 'cover', marginBottom: '15px' }} />}
        <h1 style={{ margin: '0 0 5px 0', fontSize: '24px', letterSpacing: '1px' }}>{profile.username}</h1>
        <p style={{ margin: '0 0 20px 0', fontSize: '11px', color: '#a855f7', fontWeight: 'bold', letterSpacing: '2px' }}>{profile.subtitle}</p>
        <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '40px' }}>{profile.bio}</p>

        {/* BLOCK 1: SOCIAL LINKS SECTOR BLOCK */}
        <h3 style={{ textAlign: 'left', fontSize: '14px', color: '#6366f1', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px', borderLeft: '3px solid #6366f1', paddingLeft: '10px' }}>Social Networks</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          {socials?.map(item => (
            <a key={item._id} href={item.url} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '12px', color: '#fff', textDecoration: 'none', fontWeight: '600', backdropFilter: 'blur(10px)', display: 'block', transition: 'all 0.2s' }}>
              {item.title}
            </a>
          ))}
        </div>

        {/* BLOCK 2: ASSETS & PRESETS SECTOR BLOCK */}
        <h3 style={{ textAlign: 'left', fontSize: '14px', color: '#a855f7', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px', borderLeft: '3px solid #a855f7', paddingLeft: '10px' }}>Assets & Editing Presets</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          {assets?.map(item => (
            <a key={item._id} href={item.url} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '12px', color: '#fff', textDecoration: 'none', fontWeight: '600', backdropFilter: 'blur(10px)', display: 'block' }}>
              {item.title}
            </a>
          ))}
        </div>

        {/* BLOCK 3: MY WORK SHOWCASE EDITS SECTOR BLOCK */}
        <h3 style={{ textAlign: 'left', fontSize: '14px', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '15px', borderLeft: '3px solid #10b981', paddingLeft: '10px' }}>My Work</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {myWork?.map(item => (
            <div key={item._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden', backdropFilter: 'blur(10px)', textAlign: 'left' }}>
              <video src={item.url} controls muted playsInline style={{ width: '100%', aspectRatio: '16/9', display: 'block', objectFit: 'cover', background: '#000' }} />
              <div style={{ padding: '15px' }}>
                <strong style={{ fontSize: '15px', display: 'block', color: '#fff' }}>{item.title}</strong>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
