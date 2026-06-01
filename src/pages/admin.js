import { useState, useEffect } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const [socials, setSocials] = useState([]);
  const [assets, setAssets] = useState([]);
  const [myWork, setMyWork] = useState([]);
  
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [bgVideoUrl, setBgVideoUrl] = useState('');
  const [audioBgUrl, setAudioBgUrl] = useState('');
  const [audioHoverUrl, setAudioHoverUrl] = useState('');

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [targetBlock, setTargetBlock] = useState('socials');

  const [rawInputUrl, setRawInputUrl] = useState('');

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
    document.body.style.backgroundColor = "#060608";
    
    const savedPass = sessionStorage.getItem('admin_session_pass');
    if (savedPass) {
      setPassword(savedPass);
      fetchDashboardData(savedPass);
    }
  }, []);

  const handleUrlConversionAction = () => {
    if (!rawInputUrl) return alert('Please enter a GitHub URL link first.');
    let processedUrl = rawInputUrl.trim();
    if (processedUrl.includes('github.com') && processedUrl.includes('/blob/')) {
      processedUrl = processedUrl
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
      
      setUrl(processedUrl);
      setBgVideoUrl(processedUrl);
      setRawInputUrl('');
      alert(`Link successfully parsed to raw content streaming address:\n\n${processedUrl}`);
    } else {
      alert('Invalid URL pattern. Paste a valid link with /blob/ from your repository browser bar.');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('admin_session_pass', password);
    fetchDashboardData(password);
  };

  const handleLogOutAction = () => {
    sessionStorage.removeItem('admin_session_pass');
    setPassword('');
    setIsAuthorized(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ type: 'update_profile', username, bio, avatarUrl, videoUrl, subtitle, bgVideoUrl, audioBgUrl, audioHoverUrl }),
    });
    if (res.ok) alert('Identity variables updated safely.');
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
      <form onSubmit={handleLoginSubmit} style={{ background: '#060608', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'monospace' }}>
        <h3 style={{ letterSpacing: '1px', marginBottom: '20px' }}>// AUTHORIZE_CONSOLE_ENTRY</h3>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '14px', width: '260px', background: '#0b0b0f', border: '1px solid #16161f', borderRadius: '6px', color: '#fff', marginBottom: '16px', textAlign: 'center', fontFamily: 'monospace' }} placeholder="ACCESS_KEY" />
        <button type="submit" style={{ padding: '12px 28px', borderRadius: '6px', cursor: 'pointer', background: '#a855f7', color: '#fff', border: 'none', fontWeight: 'bold', fontFamily: 'monospace' }}>EXECUTE()</button>
      </form>
    );
  }

  return (
    <div style={{ background: '#060608', color: '#94a3b8', minHeight: '100vh', padding: '40px 20px', boxSizing: 'border-box', fontFamily: 'ui-monospace, monospace' }}>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #16161f', paddingBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>// CENTRAL_CONTROL_DASHBOARD</h2>
          <button onClick={handleLogOutAction} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', fontFamily: 'monospace' }}>DISCONNECT</button>
        </div>

        {/* PARSER WORKBENCH */}
        <div style={{ background: '#0b0b0f', padding: '20px', borderRadius: '8px', border: '1px solid #a855f7', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '14px' }}>⚡ GITHUB LINK CONVERTER ENGINE</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>Converts standard browser view paths into direct streamable raw data links.</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input type="text" placeholder="https://github.com/.../blob/main/video.mp4" value={rawInputUrl} onChange={(e) => setRawInputUrl(e.target.value)} style={{ flex: 1, padding: '12px', background: '#060608', border: '1px solid #16161f', color: '#fff', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }} />
            <button type="button" onClick={handleUrlConversionAction} style={{ padding: '12px 20px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '12px' }}>PARSE_RAW</button>
          </div>
        </div>

        {/* SITE LAYOUT FORMS */}
        <div style={{ background: '#0b0b0f', padding: '24px', borderRadius: '8px', border: '1px solid #16161f', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '14px' }}>// CORE_IDENTITY_MANIFEST</h3>
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>HANDLE_NAME</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#060608', border: '1px solid #16161f', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
              </div>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>TAG_SUBTITLE</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#060608', border: '1px solid #16161f', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>AVATAR_IMAGE_URL</label>
                <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#060608', border: '1px solid #16161f', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
              </div>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>BACKGROUND_WALLPAPER_VIDEO_URL</label>
                <input type="url" value={bgVideoUrl} onChange={(e) => setBgVideoUrl(e.target.value)} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#060608', border: '1px solid #16161f', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>BIOGRAPHY_LOG_DATA</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} required rows="3" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#060608', border: '1px solid #16161f', color: '#fff', borderRadius: '4px', resize: 'vertical', fontFamily: 'monospace' }} />
            </div>

            <button type="submit" style={{ padding: '14px', background: '#14141a', color: '#fff', border: '1px solid #16161f', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '12px' }}>SYNC_CORE_PROPERTIES()</button>
          </form>
        </div>

        {/* CONTENT MANAGER CONTAINER */}
        <div style={{ background: '#0b0b0f', padding: '24px', borderRadius: '8px', border: '1px solid #16161f', marginBottom: '40px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '14px' }}>// DEPLOY_PORTFOLIO_OBJECT</h3>
          <form onSubmit={handleCreateElement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>DESTINATION_MATRIX_BLOCK</label>
                <select value={targetBlock} onChange={(e) => setTargetBlock(e.target.value)} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#060608', border: '1px solid #16161f', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }}>
                  <option value="socials">Network Links Segment</option>
                  <option value="assets">Utility Assets / Presets Segment</option>
                  <option value="my_work">Cinematic Production Work (16:9 Video Showcase)</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>OBJECT_LABEL_TITLE</label>
                <input type="text" placeholder="e.g., After Effects Shake Preset" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#060608', border: '1px solid #16161f', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>OBJECT_RESOURCE_URL</label>
              <input type="url" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#060608', border: '1px solid #16161f', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }} />
            </div>

            <button type="submit" style={{ padding: '14px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '12px' }}>PUBLISH_ELEMENT_ARRAY()</button>
          </form>
        </div>

        {/* ACTIVE NODES SUMMARY */}
        <h3 style={{ color: '#fff', fontSize: '14px', margin: '0 0 20px 0' }}>// ACTIVE_ROUTING_TABLES</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#6366f1', marginBottom: '10px' }}>[BLOCK_01 // SOCIALS]</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {socials.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b0b0f', padding: '12px', borderRadius: '4px', border: '1px solid #16161f' }}>
                  <div style={{ fontSize: '12px' }}><span style={{ color: '#fff' }}>{item.title}</span> — <span style={{ color: '#4b5563' }}>{item.url}</span></div>
                  <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px' }}>DROP</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#a855f7', marginBottom: '10px' }}>[BLOCK_02 // UTILITY_ASSETS]</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {assets.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b0b0f', padding: '12px', borderRadius: '4px', border: '1px solid #16161f' }}>
                  <div style={{ fontSize: '12px' }}><span style={{ color: '#fff' }}>{item.title}</span> — <span style={{ color: '#4b5563' }}>{item.url}</span></div>
                  <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px' }}>DROP</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#10b981', marginBottom: '10px' }}>[BLOCK_03 // VISUAL_WORKS]</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {myWork.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b0b0f', padding: '12px', borderRadius: '4px', border: '1px solid #16161f' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#fff' }}>{item.title}</div>
                    <video src={item.url} muted style={{ width: '120px', aspectRatio: '16/9', display: 'block', marginTop: '8px', borderRadius: '4px', objectFit: 'cover', background: '#000', border: '1px solid #16161f' }} />
                  </div>
                  <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px' }}>DROP</button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
