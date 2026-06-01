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
  const [announcement, setAnnouncement] = useState('');

  // BLOCK HEADER NAMES STATE HOOKS
  const [block1Name, setBlock1Name] = useState('');
  const [block2Name, setBlock2Name] = useState('');
  const [block3Name, setBlock3Name] = useState('');
  const [block4Name, setBlock4Name] = useState('');
  const [block5Name, setBlock5Name] = useState('');
  const [block6Name, setBlock6Name] = useState('');

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
          setAnnouncement(data.profile.announcement || '');
          
          setBlock1Name(data.profile.block1Name || 'Socials');
          setBlock2Name(data.profile.block2Name || 'Assets & Presets');
          setBlock3Name(data.profile.block3Name || 'My Work');
          setBlock4Name(data.profile.block4Name || 'System Activation');
          setBlock5Name(data.profile.block5Name || 'Other Sites');
          setBlock6Name(data.profile.block6Name || 'Tutorials');
        }
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('admin_session_pass');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#0a0a0f";
    
    if (typeof window !== 'undefined') {
      const savedPass = sessionStorage.getItem('admin_session_pass');
      if (savedPass) {
        setPassword(savedPass);
        fetchDashboardData(savedPass);
      }
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('admin_session_pass', password);
    }
    fetchDashboardData(password);
  };

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
      alert(`Link successfully parsed to raw streaming CDN address format:\n\n${processedUrl}`);
    } else {
      alert('Invalid URL structure. Ensure it contains /blob/ from the repository window branch.');
    }
  };

  const injectOsPrefix = (systemType) => {
    let baseTitle = title.replace(/\[windows\]/i, '').replace(/\[mac\]/i, '').replace(/\[password\]/i, '').replace(/\[note\]/i, '').replace(/\[activation\]/i, '').replace(/\[othersite\]/i, '').replace(/\[lowertutorial\]/i, '').trim();
    if (systemType === 'win') setTitle(`[Windows] ${baseTitle}`);
    if (systemType === 'mac') setTitle(`[Mac] ${baseTitle}`);
    if (systemType === 'pass') setTitle(`[Password] ${baseTitle}`);
    if (systemType === 'note') setTitle(`[Note] ${baseTitle}`);
    if (systemType === 'act') setTitle(`[Activation] ${baseTitle}`);
    if (systemType === 'site') setTitle(`[OtherSite] ${baseTitle}`);
    if (systemType === 'tute') setTitle(`[LowerTutorial] ${baseTitle}`);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ 
        type: 'update_profile', username, bio, avatarUrl, videoUrl, subtitle, bgVideoUrl, audioBgUrl, audioHoverUrl, announcement,
        block1Name, block2Name, block3Name, block4Name, block5Name, block6Name
      }),
    });
    if (res.ok) alert('Identity variables saved safely.');
  };

  const handleCreateElement = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ title, url: url || '', blockType: targetBlock }),
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

  const isLowerGridRowBlock = title.toLowerCase().match(/\[activation\]|\[othersite\]|\[lowertutorial\]/);
  const isTextNode = title.toLowerCase().includes('[password]') || title.toLowerCase().includes('[note]') || isLowerGridRowBlock;

  return (
    <div style={{ background: '#0a0a0f', color: '#fff', minHeight: '100vh', padding: '40px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Global Customizer Dash</h2>
        <button onClick={() => { if (typeof window !== 'undefined') { sessionStorage.removeItem('admin_session_pass'); } setIsAuthorized(false); }} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Sign Out</button>
      </div>

      {/* PARSER UTILITY WIDGET */}
      <div style={{ background: '#13131a', padding: '20px', borderRadius: '12px', border: '1px solid #a855f7', marginBottom: '35px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#a855f7', fontSize: '15px' }}>⚡ Core GitHub Raw URL Converter Widget</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" placeholder="https://github.com/.../blob/main/file.mp4" value={rawInputUrl} onChange={(e) => setRawInputUrl(e.target.value)} style={{ flex: 1, padding: '12px', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          <button type="button" onClick={handleUrlConversionAction} style={{ padding: '12px 20px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Parse to Raw</button>
        </div>
      </div>
      
      {/* IDENTITY CONFIG MATRIX */}
      <div style={{ background: '#13131a', padding: '25px', borderRadius: '12px', border: '1px solid #1e1e24', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#6366f1' }}>Branding, Design Presets & Core Configurations</h3>
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: '#0a0a0f', padding: '20px', borderRadius: '8px', border: '1px solid #222' }}>
            <div style={{ fontSize: '13px', color: '#a855f7', fontWeight: 'bold', marginBottom: '15px' }}>🛠️ Custom Grid Header Titles Config (Blocks 1-6)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 1 Title Name</label><input type="text" value={block1Name} onChange={(e) => setBlock1Name(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 2 Title Name</label><input type="text" value={block2Name} onChange={(e) => setBlock2Name(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 3 Title Name</label><input type="text" value={block3Name} onChange={(e) => setBlock3Name(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 4 Title Name</label><input type="text" value={block4Name} onChange={(e) => setBlock4Name(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 5 Title Name</label><input type="text" value={block5Name} onChange={(e) => setBlock5Name(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 6 Title Name</label><input type="text" value={block6Name} onChange={(e) => setBlock6Name(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Handle</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Subtitle Tag Line</label><input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Avatar Photo Link URL</label><input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} required style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Sound Action Effect URL</label><input type="url" value={audioHoverUrl} onChange={(e) => setAudioHoverUrl(e.target.value)} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
          </div>
          <div style={{ background: '#0a0a0f', padding: '15px', borderRadius: '8px', border: '1px dashed #6366f1' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6366f1', marginBottom: '5px', fontWeight: 'bold' }}>📰 Top Header Scrolling Announcement Text Strip</label>
            <input type="text" value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="e.g., SITE MAINTENANCE UNDERWAY" style={{ padding: '12px', width: '100%', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          </div>
          <div style={{ background: '#0a0a0f', padding: '15px', borderRadius: '8px', border: '1px solid #a855f7' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#a855f7', marginBottom: '5px', fontWeight: 'bold' }}>Main Website Background Video Link URL</label>
            <input type="url" value={bgVideoUrl} onChange={(e) => setBgVideoUrl(e.target.value)} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Main Intro Showreel Video URL</label><input type="url" value={videoUrl} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Looping Background Music Track URL</label><input type="url" value={audioBgUrl} onChange={(e) => setAudioBgUrl(e.target.value)} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Bio Summary Text Field</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} required rows="2" style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          </div>
          <button type="submit" style={{ padding: '14px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Save Core Framework Matrix</button>
        </form>
      </div>

      {/* MASTER CREATOR PANEL */}
      <h3 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Publish Portfolio Elements</h3>
      <form onSubmit={handleCreateElement} style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#13131a', padding: '25px', borderRadius: '12px', border: '1px solid #1e1e24', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Choose Target Matrix Column Base Bucket</label>
            <select value={targetBlock} onChange={(e) => setTargetBlock(e.target.value)} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #10b981', color: '#fff', borderRadius: '6px', fontWeight: 'bold' }}>
              <option value="socials">Matrix Lane 1: Socials Group Stack (Block 1 & 4)</option>
              <option value="assets">Matrix Lane 2: Assets & Presets Group Stack (Block 2 & 5)</option>
              <option value="my_work">Matrix Lane 3: My Work Video Group Stack (Block 3 & 6)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Display Label Title / Key Descriptor Box</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <input type="text" placeholder="e.g., Asset Name or Pass Key" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ flex: 1, padding: '12px', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
              
              <div style={{ display: 'flex', gap: '4px', width: '100%', marginTop: '6px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => injectOsPrefix('win')} style={{ padding: '8px 12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>+ Windows App</button>
                <button type="button" onClick={() => injectOsPrefix('mac')} style={{ padding: '8px 12px', background: '#be123c', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>+ Mac OS App</button>
                
                {targetBlock === 'assets' && (
                  <>
                    <button type="button" onClick={() => injectOsPrefix('pass')} style={{ padding: '8px 12px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>+ Password Node (Block 5)</button>
                    <button type="button" onClick={() => injectOsPrefix('note')} style={{ padding: '8px 12px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>+ Note Node (Block 5)</button>
                  </>
                )}
                
                <button type="button" onClick={() => injectOsPrefix('act')} style={{ padding: '8px 12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>🔲 Route to Block 4</button>
                <button type="button" onClick={() => injectOsPrefix('site')} style={{ padding: '8px 12px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>🔲 Route to Block 5</button>
                <button type="button" onClick={() => injectOsPrefix('tute')} style={{ padding: '8px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>🔲 Route to Block 6</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: isTextNode ? '#a855f7' : '#64748b', marginBottom: '5px', fontWeight: isTextNode ? 'bold' : 'normal' }}>
            {isTextNode ? "🔒 Type the Raw Instructions Guide or Password Values Here" : "Resource Value (Paste links or handles)"}
          </label>
          
          {isTextNode ? (
            <textarea rows="6" placeholder="Paste text here..." value={url} onChange={(e) => setUrl(e.target.value)} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #a855f7', color: '#fff', borderRadius: '6px', fontFamily: 'monospace', fontSize: '13px' }} />
          ) : (
            <input type="text" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          )}
        </div>

        <button type="submit" style={{ padding: '14px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Publish Element Matrix Object</button>
      </form>

      {/* RECORD DELETIONS */}
      <h3 style={{ borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>Active Structured Portfolio Layout Architecture</h3>
      
      <h4 style={{ color: '#6366f1', margin: '20px 0 10px 0' }}>Matrix Base Bucket Stack 1: Socials Stack</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {socials.map(item => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#13131a', padding: '14px', borderRadius: '10px', border: '1px solid #1e1e24' }}>
            <div><strong>{item.title}</strong><br/><span style={{ fontSize: '12px', color: '#64748b' }}>{item.url}</span></div>
            <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer', borderRadius: '6px' }}>Delete</button>
          </div>
        ))}
      </div>

      <h4 style={{ color: '#a855f7', margin: '30px 0 10px 0' }}>Matrix Base Bucket Stack 2: Assets Stack</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {assets.map(item => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#13131a', padding: '14px', borderRadius: '10px', border: '1px solid #1e1e24' }}>
            <div><strong>{item.title}</strong><br/><span style={{ fontSize: '12px', color: '#64748b' }}>{item.url}</span></div>
            <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer', borderRadius: '6px' }}>Delete</button>
          </div>
        ))}
      </div>

      <h4 style={{ color: '#10b981', margin: '30px 0 10px 0' }}>Matrix Base Bucket Stack 3: My Work Stack</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {myWork.map(item => (
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
