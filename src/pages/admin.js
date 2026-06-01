import { useState, useEffect } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [links, setLinks] = useState([]);
  
  // Custom Profile Configuration Form Inputs
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Button Links Setup State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data.links || []);
      if (data.profile) {
        setUsername(data.profile.username);
        setBio(data.profile.bio);
        setAvatarUrl(data.profile.avatarUrl);
        setVideoUrl(data.profile.videoUrl);
      }
    } catch (err) {
      console.error("Dashboard engine access breakdown Error:", err);
    }
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#0a0a0f";
    fetchDashboardData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ type: 'update_profile', username, bio, avatarUrl, videoUrl }),
    });
    
    if (res.ok) {
      alert('Core layout profiles modified successfully!');
    } else {
      alert('Failed to update profile settings. Try logging in again.');
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ title, url }),
    });
    if (res.ok) { setTitle(''); setUrl(''); fetchDashboardData(); }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/links?id=${id}`, {
      method: 'DELETE',
      headers: { 'admin-password': password },
    });
    if (res.ok) fetchDashboardData();
  };

  if (!isAuthorized) {
    return (
      <div style={{ background: '#0a0a0f', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'sans-serif' }}>
        <h3 style={{ marginBottom: '15px' }}>Secure System Gateway</h3>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', width: '240px', background: '#13131a', border: '1px solid #222', borderRadius: '8px', color: '#fff', marginBottom: '15px', textAlign: 'center' }} placeholder="••••••••" />
        <button onClick={() => setIsAuthorized(true)} style={{ padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', background: '#6366f1', color: '#fff', border: 'none', fontWeight: '600' }}>Authorize Access</button>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0a0f', color: '#fff', minHeight: '100vh', padding: '40px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '30px', letterSpacing: '-0.02em' }}>Control Dashboard</h2>
      
      {/* 1. Profile Matrix Editor */}
      <div style={{ background: '#13131a', padding: '25px', borderRadius: '12px', border: '1px solid #1e1e24', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>Portfolio Layout Variables</h3>
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Username Handle</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Profile Pic Image Asset Link URL</label>
              <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Portfolio Showcase Direct Video Stream URL (.mp4 / .webm)</label>
            <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Paste direct file URL link (Leave empty to hide player)" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Bio Blurb Text Content</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} required rows="3" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px', resize: 'vertical', fontFamily: 'sans-serif' }} />
          </div>

          <button type="submit" style={{ padding: '14px', background: '#a855f7', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600', marginTop: '5px' }}>Save Profile Structure</button>
        </form>
      </div>

      {/* 2. Anchor Action Management */}
      <h3 style={{ margin: '0 0 10px 0', color: '#6366f1' }}>Publish New Core Target Link</h3>
      <form onSubmit={handleAddLink} style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
        <input type="text" placeholder="Button Text (e.g., My Portfolio)" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '12px', flex: 1, background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '8px' }} />
        <input type="url" placeholder="Redirect URL (https://...)" value={url} onChange={(e) => setUrl(e.target.value)} required style={{ padding: '12px', flex: 2, background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '8px' }} />
        <button type="submit" style={{ padding: '12px 24px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Add Element</button>
      </form>

      {/* 3. Items Output Iteration */}
      <h3 style={{ borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>Active System Links</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {links.length === 0 ? <p style={{ color: '#444' }}>No navigation assets generated yet.</p> : links.map(link => (
          <div key={link._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#13131a', padding: '16px', borderRadius: '10px', border: '1px solid #1e1e24' }}>
            <div>
              <strong style={{ display: 'block', color: '#fff' }}>{link.title}</strong>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{link.url}</span>
            </div>
            <button onClick={() => handleDelete(link._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer', borderRadius: '6px', fontWeight: '600' }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
