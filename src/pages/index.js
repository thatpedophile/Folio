import { useEffect, useState } from 'react';

export default function Home() {
  const [links, setLinks] = useState([]);
  const [avatar, setAvatar] = useState('');

  const loadData = () => {
    fetch('/api/links')
      .then((res) => res.json())
      .then((data) => {
        setLinks(data.links || []);
        setAvatar(data.avatarUrl);
      })
      .catch((err) => console.error("Error loading frontend structural data:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{
      backgroundColor: '#050508',
      backgroundImage: 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, #050508 60%)',
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Upper Bio Unit */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{
            position: 'absolute',
            top: '-4px', left: '-4px', right: '-4px', bottom: '-4px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #6366f1, #a855f7, #ec4899)',
            opacity: '0.6',
            filter: 'blur(8px)',
            zIndex: 0
          }}></div>
          
          <img 
            src={avatar || 'https://api.dicebear.com/7.x/shapes/svg?seed=sh1vx69'} 
            alt="sh1vx69"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              zIndex: 1,
              objectFit: 'cover'
            }}
          />
        </div>

        <h1 style={{ 
          fontSize: '26px', fontWeight: '700', margin: '15px 0 5px 0', letterSpacing: '-0.02em',
          background: 'linear-gradient(to right, #fff, #cbd5e1)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          sh1vx69
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0' }}>VFX Editor & Developer</p>
      </div>

      {/* Main UI Body Content Layout */}
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px',
          textAlign: 'center', fontSize: '14px', color: '#94a3b8', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
        }}>
          Welcome to my biolink platform. Check out my latest presets, project mirrors, and socials below.
        </div>

        {links.map((link) => (
          <a
            key={link._id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              color: '#f8fafc', textDecoration: 'none', textAlign: 'center', padding: '18px', borderRadius: '14px',
              fontWeight: '600', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );
}
