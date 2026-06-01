import { useState, useEffect } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [links, setLinks] = useState([]);
  const [videoProjects, setVideoProjects] = useState([]);
  
  // Custom Settings State Matrix Setup
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [bgPreset, setBgPreset] = useState('cosmic_purple');
  const [audioBgUrl, setAudioBgUrl] = useState('');
  const [audioHoverUrl, setAudioHoverUrl] = useState('');

  // Creation State Controls
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [entryType, setEntryType] = useState('standard');

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data.links || []);
      setVideoProjects(data.videoProjects || []);
      if (data.profile) {
        setUsername(data.profile.username);
        setBio(data.profile.bio);
        setAvatarUrl(data.profile.avatarUrl);
        setVideoUrl(data.profile.videoUrl);
        setSubtitle(data.profile.subtitle);
        setBgPreset(data.profile.bgPreset);
        setAudioBgUrl(data.profile.audioBgUrl || '');
        setAudioHoverUrl(data.profile.audioHoverUrl || '');
      }
    } catch (err) {
      console.error(err);
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
      body: JSON.stringify({ type: 'update_profile', username, bio, avatarUrl, videoUrl, subtitle, bgPreset, audioBgUrl, audioHoverUrl }),
    });
    if (res.ok) alert('Layout variables saved perfectly!');
  };

  const handleCreateElement = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ title, url, type: entryType }),
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
        <h3>Master Console Authorization</h3>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', width: '240px', background: '#13131a', border: '1px solid #222', borderRadius: '8px', color: '#fff', marginBottom: '15px', textAlign: 'center' }} placeholder="••••••••" />
        <button onClick={() => setIsAuthorized(true)} style={{ padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', background: '#6366f1', color: '#fff', border: 'none', fontWeight: '600' }}>Access Panel</button>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0a0f', color: '#fff', minHeight: '100vh', padding: '40px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '30px' }}>Global Customizer Dash</h2>
      
      {/* CORE DESIGN AND AUDIO VARIABLE CONTROL CONTAINER */}
      <div style={{ background: '#13131a', padding: '25px', borderRadius: '12px', border: '1px solid #1e1e24', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>Branding, Presets & Audio System Variables</h3>
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Handle</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Subtitle Tag Line</label>
              <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Website UI Background Theme</label>
              <select value={bgPreset} onChange={(e) => setBgPreset(e.target.value)} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }}>
                <option value="cosmic_purple">Cosmic Radial Purple</option>
                <option value="deep_void">Pure Dark Void (Clean Black)</option>
                <option value="liquid_emerald">Liquid Emerald Glow</option>
                <option value="ruby_glow">Ruby Red Aurora Glow</option>
                <option value="neon_cyber">Cyberpunk Abstract Offset</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Avatar Photo Link URL</label>
              <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Main Intro Showreel Video URL (.mp4)</label>
              <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Leave empty to turn off top hero player" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Looping Background Music Track URL (.mp3 / direct stream link)</label>
              <input type="url" value={audioBgUrl} onChange={(e) => setAudioBgUrl(e.target.value)} placeholder="Paste direct streamable sound link (Leave empty to disable)" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Link Interface Hover Sound Action Effect URL (.wav / .mp3)</label>
              <input type="url" value={audioHoverUrl} onChange={(e) => setAudioHoverUrl(e.target.value)} placeholder="Defaults to premium UI audio tap snippet if left empty" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Bio Summary Text Field</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} required rows="2" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px', resize: 'vertical' }} />
          </div>

          <button type="submit" style={{ padding: '14px', background: '#a855f7', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Save Core Framework Matrix</button>
        </form>
      </div>

      {/* CREATE ELEMENT PORTFOLIO MANAGER FORM */}
      <h3 style={{ margin: '0 0 15px 0', color: '#6366f1' }}>Publish Portfolio Content Units</h3>
      <form onSubmit={handleCreateElement} style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#13131a', padding: '25px', borderRadius: '12px', border: '1px solid #1e1e24', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Content Entry Category</label>
            <select value={entryType} onChange={(e) => setEntryType(e.target.value)} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }}>
              <option value="standard">Standard Hyperlink Button Link</option>
              <option value="video_project">Embedded Video Portfolio Edit Card Sample</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Title Label / Edit Caption Description</label>
            <input type="text" placeholder="e.g., After Effects Presets Pack or TikTok Edit" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Destination Direct Link (.mp4 for videos, regular link for buttons)</label>
          <input type="url" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
        </div>

        <button type="submit" style={{ padding: '14px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Publish Content Unit Asset</button>
      </form>

      {/* ELEMENT RENDER MAP COMPONENT */}
      <h3 style={{ borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>Active Portfolio Elements</h3>
      
      <h4 style={{ color: '#a855f7', margin: '0 0 10px 0' }}>Embedded Video Projects</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
        {videoProjects.length === 0 ? <p style={{ color: '#444', fontSize: '14px' }}>No video files attached yet.</p> : videoProjects.map(proj => (
          <div key={proj._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#13131a', padding: '16px', borderRadius: '10px', border: '1px solid #1e1e24' }}>
            <div><strong>{proj.title}</strong><br/><span style={{ fontSize: '12px', color: '#64748b' }}>{proj.url}</span></div>
            <button onClick={() => handleDelete(proj._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer', borderRadius: '6px', fontWeight: '600' }}>Delete</button>
          </div>
        ))}
      </div>

      <h4 style={{ color: '#6366f1', margin: '0 0 10px 0' }}>Standard Hyperlink Buttons</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {links.length === 0 ? <p style={{ color: '#444', fontSize: '14px' }}>No button hyper links linked yet.</p> : links.map(link => (
          <div key={link._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#13131a', padding: '16px', borderRadius: '10px', border: '1px solid #1e1e24' }}>
            <div><strong>{link.title}</strong><br/><span style={{ fontSize: '12px', color: '#64748b' }}>{link.url}</span></div>
            <button onClick={() => handleDelete(link._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer', borderRadius: '6px', fontWeight: '600' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
