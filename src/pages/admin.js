import { useState, useEffect } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Separation Arrays for Display Blocks
  const [socials, setSocials] = useState([]);
  const [assets, setAssets] = useState([]);
  const [myWork, setMyWork] = useState([]);
  
  // Custom Settings State Matrix Setup
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [bgVideoUrl, setBgVideoUrl] = useState('');
  const [audioBgUrl, setAudioBgUrl] = useState('');
  const [audioHoverUrl, setAudioHoverUrl] = useState('');

  // Creation Form States
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [targetBlock, setTargetBlock] = useState('socials'); // Tracks designated display area

  const fetchDashboardData = async (token = password) => {
    try {
      const res = await fetch('/api/links', {
        headers: { 'admin-password': token }
      });
      if (res.status === 200) {
        const data = await res.json();
        setSocials(data.socials || []);
        setAssets(data.assets || []);
        setMyWork(data.myWork || []);
        if (data.profile) {
          setUsername(data.profile.username);
          setBio(data.profile.bio);
          setAvatarUrl(data.profile.avatarUrl);
          setVideoUrl(data.profile.videoUrl);
          setSubtitle(data.profile.subtitle);
          setBgVideoUrl(data.profile.bgVideoUrl || '');
          setAudioBgUrl(data.profile.audioBgUrl || '');
          setAudioHoverUrl(data.profile.audioHoverUrl || '');
        }
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        sessionStorage.removeItem('admin_session_pass');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#0a0a0f";
    
    const savedPass = sessionStorage.getItem('admin_session_pass');
    if (savedPass) {
      setPassword(savedPass);
      fetchDashboardData(savedPass);
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('admin_session_pass', password);
    fetchDashboardData(password);
  };

  const handleLogOutAction = () => {
    sessionStorage.removeItem('admin_session_pass');
    setPassword('');
    setIsAuthorized(false);
    alert('Session terminated safely.');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ type: 'update_profile', username, bio, avatarUrl, videoUrl, subtitle, bgVideoUrl, audioBgUrl, audioHoverUrl }),
    });
    if (res.ok) alert('Core design properties updated successfully!');
  };

  const handleCreateElement = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ title, url, blockType: targetBlock }),
    });
    if (res.ok) { setTitle(''); setUrl(''); fetchDashboardData(password); }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/links?id=${id}`, {
      method: 'DELETE',
      headers: { 'admin-password': password },
    });
    if (res.ok) fetchDashboardData(password);
  };

  if (!isAuthorized) {
    return (
      <form onSubmit={handleLoginSubmit} style={{ background: '#0a0a0f', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'sans-serif' }}>
        <h3>Master Console Authorization</h3>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', width: '240px', background: '#13131a', border: '1px solid #222', borderRadius: '8px', color: '#fff', marginBottom: '15px', textAlign: 'center' }} placeholder="••••••••" />
        <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', background: '#6366f1', color: '#fff', border: 'none', fontWeight: '600' }}>Access Panel</button>
      </form>
    );
  }

  return (
    <div style={{ background: '#0a0a0f', color: '#fff', minHeight: '100vh', padding: '40px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>Global Customizer Dash</h2>
        <button onClick={handleLogOutAction} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Sign Out</button>
      </div>
      
      {/* BRANDING AND CUSTOM BACKGROUND FORM FRAME */}
      <div style={{ background: '#13131a', padding: '25px', borderRadius: '12px', border: '1px solid #1e1e24', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>Branding, Presets & Background Video Settings</h3>
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Handle</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Subtitle Tag Line</label>
              <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Avatar Photo Link URL</label>
              <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Link Interface Hover Sound Effect URL (.wav / .mp3)</label>
              <input type="url" value={audioHoverUrl} onChange={(e) => setAudioHoverUrl(e.target.value)} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#a855f7', marginBottom: '5px', fontWeight: '600' }}>Main Background Web Page Video URL (.mp4 / GitHub link)</label>
              <input type="url" value={bgVideoUrl} onChange={(e) => setBgVideoUrl(e.target.value)} placeholder="Paste raw GitHub .mp4 video link here to change site background" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #a855f7', color: '#fff', borderRadius: '6px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Main Intro Showreel Video URL (.mp4)</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Paste showreel video link here" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Looping Background Music Track URL (.mp3)</label>
              <input type="url" value={audioBgUrl} onChange={(e) => setAudioBgUrl(e.target.value)} placeholder="Paste background audio link here" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Bio Summary Text Field</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} required rows="2" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px', resize: 'vertical' }} />
          </div>

          <button type="submit" style={{ padding: '14px', background: '#a855f7', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Save Core Framework Matrix</button>
        </form>
      </div>

      {/* THREE INTERACTIVE PORTFOLIO BLOCK CREATOR FORM */}
      <h3 style={{ margin: '0 0 15px 0', color: '#6366f1' }}>Publish Portfolio Elements</h3>
      <form onSubmit={handleCreateElement} style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#13131a', padding: '25px', borderRadius: '12px', border: '1px solid #1e1e24', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Designated Content Block Location</label>
            <select value={targetBlock} onChange={(e) => setTargetBlock(e.target.value)} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #a855f7', color: '#fff', borderRadius: '6px', fontWeight: '600' }}>
              <option value="socials">1. Socials Section Block</option>
              <option value="assets">2. Assets & Presets Section Block</option>
              <option value="my_work">3. My Work (Video Portfolio Content) Block</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Display Label / Caption Description</label>
            <input type="text" placeholder="e.g., Follow my Instagram, Editing Shake Preset, Valorant AMV Edit" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Asset Resource URL Link (e.g., raw GitHub .mp4 link or hyperlink)</label>
          <input type="url" placeholder="https://raw.githubusercontent.com/..." value={url} onChange={(e) => setUrl(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
        </div>

        <button type="submit" style={{ padding: '14px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Publish Element to Selected Block</button>
      </form>

      {/* RENDER CURRENT STRUCTURED STORAGE ARRAYS */}
      <h3 style={{ borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>Active Structured Portfolio Layout Architecture</h3>
      
      {/* SOCIALS DISPLAY AREA BOX BLOCK */}
      <h4 style={{ color: '#6366f1', margin: '20px 0 10px 0' }}>Block 1: Social Links</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {socials.length === 0 ? <p style={{ color: '#444', fontSize: '13px' }}>Empty Block.</p> : socials.map(item => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#13131a', padding: '14px', borderRadius: '10px', border: '1px solid #1e1e24' }}>
            <div><strong>{item.title}</strong><br/><span style={{ fontSize: '12px', color: '#64748b' }}>{item.url}</span></div>
            <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer', borderRadius: '6px' }}>Delete</button>
          </div>
        ))}
      </div>

      {/* ASSETS AND PRESETS DISPLAY AREA BOX BLOCK */}
      <h4 style={{ color: '#a855f7', margin: '30px 0 10px 0' }}>Block 2: Assets & Presets</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {assets.length === 0 ? <p style={{ color: '#444', fontSize: '13px' }}>Empty Block.</p> : assets.map(item => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#13131a', padding: '14px', borderRadius: '10px', border: '1px solid #1e1e24' }}>
            <div><strong>{item.title}</strong><br/><span style={{ fontSize: '12px', color: '#64748b' }}>{item.url}</span></div>
            <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer', borderRadius: '6px' }}>Delete</button>
          </div>
        ))}
      </div>

      {/* VIDEO PROJECTS DISPPLAY AREA BOX BLOCK */}
      <h4 style={{ color: '#10b981', margin: '30px 0 10px 0' }}>Block 3: My Work (Video Showcases)</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {myWork.length === 0 ? <p style={{ color: '#444', fontSize: '13px' }}>Empty Block.</p> : myWork.map(item => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#13131a', padding: '14px', borderRadius: '10px', border: '1px solid #1e1e24' }}>
            <div>
              <strong>{item.title}</strong><br/><span style={{ fontSize: '12px', color: '#64748b' }}>{item.url}</span>
              <video src={item.url} controls muted style={{ width: '140px', height: '80px', display: 'block', marginTop: '10px', borderRadius: '6px', objectFit: 'cover', background: '#000' }} />
            </div>
            <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer', borderRadius: '6px' }}>Delete</button>
          </div>
        ))}
      </div>

    </div>
  );
}
