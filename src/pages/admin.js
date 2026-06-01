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

  const [block1Name, setBlock1Name] = useState('');
  const [block2Name, setBlock2Name] = useState('');
  const [block3Name, setBlock3Name] = useState('');
  const [block4Name, setBlock4Name] = useState('');
  const [block5Name, setBlock5Name] = useState('');
  const [block6Name, setBlock6Name] = useState('');

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [targetBlock, setTargetBlock] = useState('socials');
  const [parentId, setParentId] = useState('');

  const [rawInputUrl, setRawInputUrl] = useState('');
  const [draggedItemId, setDraggedItemId] = useState(null);

  const fetchDashboardData = async (token = password) => {
    try {
      const res = await fetch('/api/links', { headers: { 'admin-password': token } });
      if (res.status === 200) {
        const data = await res.json();
        setSocials(data.socials || []);
        setAssets(data.assets || []);
        setMyWork(data.myWork || []);
        if (data.profile) {
          setUsername(data.profile.username || '');
          setBio(data.profile.bio || '');
          setAvatarUrl(data.profile.avatarUrl || '');
          setVideoUrl(data.profile.videoUrl || '');
          setSubtitle(data.profile.subtitle || '');
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
        if (typeof window !== 'undefined') sessionStorage.removeItem('admin_session_pass');
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    document.body.style.margin = "0"; document.body.style.padding = "0";
    document.body.style.backgroundColor = "#0a0a0f";
    if (typeof window !== 'undefined') {
      const savedPass = sessionStorage.getItem('admin_session_pass');
      if (savedPass) { setPassword(savedPass); fetchDashboardData(savedPass); }
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') sessionStorage.setItem('admin_session_pass', password);
    fetchDashboardData(password);
  };

  const handleUrlConversionAction = () => {
    if (!rawInputUrl) return alert('Please enter a GitHub URL link first.');
    let processedUrl = rawInputUrl.trim();
    if (processedUrl.includes('github.com') && processedUrl.includes('/blob/')) {
      processedUrl = processedUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      setUrl(processedUrl); setBgVideoUrl(processedUrl); setRawInputUrl('');
      alert(`Parsed URL formatting:\n\n${processedUrl}`);
    } else { alert('Invalid layout parameters.'); }
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
    await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ 
        type: 'update_profile', username, bio, avatarUrl, videoUrl, subtitle, bgVideoUrl, audioBgUrl, audioHoverUrl, announcement,
        block1Name, block2Name, block3Name, block4Name, block5Name, block6Name
      }),
    });
    alert('Matrix labels saved cleanly.');
  };

  const handleCreateElement = async (e) => {
    e.preventDefault();
    await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ title, url: url || '', blockType: targetBlock, parentId: parentId || null }),
    });
    setTitle(''); setUrl(''); setParentId(''); fetchDashboardData(password);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/links?id=${id}`, { method: 'DELETE', headers: { 'admin-password': password } });
    if (res.ok) fetchDashboardData(password);
  };

  // ================= HTML5 NATIVE DRAG AND DROP HANDLERS =================
  const handleDragStart = (id) => {
    setDraggedItemId(id);
  };

  const handleDragOver = (e, targetId, listType, currentList) => {
    e.preventDefault();
    if (draggedItemId === null || draggedItemId === targetId) return;

    const draggedIndex = currentList.findIndex(item => item._id === draggedItemId);
    const targetIndex = currentList.findIndex(item => item._id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedList = [...currentList];
    const [draggedItem] = updatedList.splice(draggedIndex, 1);
    updatedList.splice(targetIndex, 0, draggedItem);

    if (listType === 'socials') setSocials(updatedList);
    if (listType === 'assets') setAssets(updatedList);
    if (listType === 'my_work') setMyWork(updatedList);
  };

  const handleDragEnd = async (listType, currentList) => {
    setDraggedItemId(null);
    const orderedIds = currentList.map(item => item._id);
    
    // Mass push new layout index positions to DB pipeline
    await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ type: 'update_order', orderedIds })
    });
  };

  if (!isAuthorized) {
    return (
      <form onSubmit={handleLoginSubmit} style={{ background: '#0a0a0f', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', fontFamily: 'sans-serif' }}>
        <h3>Master Console Authorization</h3>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '12px', width: '240px', background: '#13131a', border: '1px solid #222', borderRadius: '8px', color: '#fff', marginBottom: '15px', textAlign: 'center' }} />
        <button type="submit" style={{ padding: '12px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Access Panel</button>
      </form>
    );
  }

  const allParentOptionsCombined = [...socials, ...assets, ...myWork].filter(item => !item.parentId);
  const isLowerRowBlock = title.toLowerCase().match(/\[activation\]|\[othersite\]|\[lowertutorial\]/);
  const isTextNode = title.toLowerCase().includes('[password]') || title.toLowerCase().includes('[note]') || isLowerRowBlock;

  const cleanTitle = (titleStr) => {
    return titleStr.replace(/\[windows\]/i, '').replace(/\[mac\]/i, '').replace(/\[activation\]/i, '').replace(/\[othersite\]/i, '').replace(/\[lowertutorial\]/i).trim();
  };

  return (
    <div style={{ background: '#0a0a0f', color: '#fff', minHeight: '100vh', padding: '40px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      
      <style jsx>{`
        .drag-tile-row {
          display: flex; justify-content: space-between; align-items: center; 
          background: #13131a; padding: 14px; border-radius: 10px; 
          border: 1px solid #1e1e24; cursor: grab; transition: background 0.2s ease;
        }
        .drag-tile-row:active { cursor: grabbing; background: #1a1a24; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Global Customizer Dash</h2>
        <button onClick={() => setIsAuthorized(false)} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Sign Out</button>
      </div>

      {/* PARSER UTILITY WIDGET */}
      <div style={{ background: '#13131a', padding: '20px', borderRadius: '12px', border: '1px solid #a855f7', marginBottom: '35px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#a855f7', fontSize: '15px' }}>Core GitHub Raw URL Converter</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" placeholder="Paste link here..." value={rawInputUrl || ''} onChange={(e) => setRawInputUrl(e.target.value)} style={{ flex: 1, padding: '12px', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          <button type="button" onClick={handleUrlConversionAction} style={{ padding: '12px 20px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Parse to Raw</button>
        </div>
      </div>
      
      {/* IDENTITY CONFIG MATRIX */}
      <div style={{ background: '#13131a', padding: '25px', borderRadius: '12px', border: '1px solid #1e1e24', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#6366f1' }}>Core Presets & Header Customizations</h3>
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: '#0a0a0f', padding: '20px', borderRadius: '8px', border: '1px solid #222' }}>
            <div style={{ fontSize: '13px', color: '#a855f7', fontWeight: 'bold', marginBottom: '15px' }}>🛠️ Custom Grid Header Titles Config (Blocks 1-6)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 1 Title</label><input type="text" value={block1Name || ''} onChange={(e) => setBlock1Name(e.target.value)} style={{ padding: '10px', width: '100%', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 2 Title</label><input type="text" value={block2Name || ''} onChange={(e) => setBlock2Name(e.target.value)} style={{ padding: '10px', width: '100%', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 3 Title</label><input type="text" value={block3Name || ''} onChange={(e) => setBlock3Name(e.target.value)} style={{ padding: '10px', width: '100%', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 4 Title</label><input type="text" value={block4Name || ''} onChange={(e) => setBlock4Name(e.target.value)} style={{ padding: '10px', width: '100%', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 5 Title</label><input type="text" value={block5Name || ''} onChange={(e) => setBlock5Name(e.target.value)} style={{ padding: '10px', width: '100%', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Block 6 Title</label><input type="text" value={block6Name || ''} onChange={(e) => setBlock6Name(e.target.value)} style={{ padding: '10px', width: '100%', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} /></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Handle</label><input type="text" value={username || ''} onChange={(e) => setUsername(e.target.value)} required style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Subtitle Tag Line</label><input type="text" value={subtitle || ''} onChange={(e) => setSubtitle(e.target.value)} required style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Avatar URL</label><input type="url" value={avatarUrl || ''} onChange={(e) => setAvatarUrl(e.target.value)} required style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Sound Action URL</label><input type="url" value={audioHoverUrl || ''} onChange={(e) => setAudioHoverUrl(e.target.value)} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
          </div>
          <div style={{ background: '#0a0a0f', padding: '15px', borderRadius: '8px', border: '1px dashed #6366f1' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#6366f1', marginBottom: '5px', fontWeight: 'bold' }}>📰 Top Header Scrolling Announcement Text</label>
            <input type="text" value={announcement || ''} onChange={(e) => setAnnouncement(e.target.value)} style={{ padding: '12px', width: '100%', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          </div>
          <div style={{ background: '#0a0a0f', padding: '15px', borderRadius: '8px', border: '1px solid #a855f7' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#a855f7', marginBottom: '5px', fontWeight: 'bold' }}>Main Website Background Video Link URL</label>
            <input type="url" value={bgVideoUrl || ''} onChange={(e) => setBgVideoUrl(e.target.value)} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Main Intro Showreel Video URL</label><input type="url" value={videoUrl || ''} onChange={(e) => setVideoUrl(e.target.value)} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
            <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Looping Background Music Track URL</label><input type="url" value={audioBgUrl || ''} onChange={(e) => setAudioBgUrl(e.target.value)} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} /></div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Bio Field Summary</label>
            <textarea value={bio || ''} onChange={(e) => setBio(e.target.value)} required rows="2" style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          </div>
          <button type="submit" style={{ padding: '14px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Save Settings Matrix</button>
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
              <input type="text" placeholder="e.g., Asset Name or Pass Key" value={title || ''} onChange={(e) => setTitle(e.target.value)} required style={{ flex: 1, padding: '12px', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
              <div style={{ display: 'flex', gap: '4px', width: '100%', marginTop: '6px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => injectOsPrefix('win')} style={{ padding: '8px 12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>+ Windows App</button>
                <button type="button" onClick={() => injectOsPrefix('mac')} style={{ padding: '8px 12px', background: '#be123c', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>+ Mac OS App</button>
                {targetBlock === 'assets' && (
                  <>
                    <button type="button" onClick={() => injectOsPrefix('pass')} style={{ padding: '8px 12px', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>+ Password Node</button>
                    <button type="button" onClick={() => injectOsPrefix('note')} style={{ padding: '8px 12px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>+ Note Node</button>
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
          <label style={{ display: 'block', fontSize: '12px', color: '#a855f7', marginBottom: '5px', fontWeight: 'bold' }}>🔗 Attach Directly to Parent App Link (Optional)</label>
          <select value={parentId || ''} onChange={(e) => setParentId(e.target.value)} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #a855f7', color: '#fff', borderRadius: '6px', fontWeight: 'bold' }}>
            <option value="">-- Standalone Item (No Parent Assignment) --</option>
            {allParentOptionsCombined.map(parent => (
              <option key={parent._id} value={parent._id}>
                [{parent.blockType.toUpperCase()}] {cleanTitle(parent.title)} ({parent.url.substring(0, 40)}...)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: isTextNode ? '#a855f7' : '#64748b', marginBottom: '5px', fontWeight: isTextNode ? 'bold' : 'normal' }}>
            {isTextNode ? "🔒 Type the Raw Instructions Guide or Password Values Here" : "Resource Value (Paste links or handles)"}
          </label>
          {isTextNode ? (
            <textarea rows="6" placeholder="Paste text here..." value={url || ''} onChange={(e) => setUrl(e.target.value)} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #a855f7', color: '#fff', borderRadius: '6px', fontFamily: 'monospace', fontSize: '13px' }} />
          ) : (
            <input type="text" placeholder="https://..." value={url || ''} onChange={(e) => setUrl(e.target.value)} style={{ padding: '12px', width: '100%', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          )}
        </div>

        <button type="submit" style={{ padding: '14px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Publish Element Matrix Object</button>
      </form>

      {/* DYNAMIC DRAG AND DROP REORDER LISTS CONTAINER */}
      <h3 style={{ borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>Active Structured Portfolio Layout Architecture (Drag elements to change position)</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* SOCIALS STACK TRACK */}
        <div>
          <h4 style={{ color: '#6366f1', margin: '0 0 10px 0' }}>Lane 1 Layout Blocks (Socials & Activations)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {socials.map(item => (
              <div 
                key={item._id} 
                className="drag-tile-row"
                draggable
                onDragStart={() => handleDragStart(item._id)}
                onDragOver={(e) => handleDragOver(e, item._id, 'socials', socials)}
                onDragEnd={() => handleDragEnd('socials', socials)}
              >
                <div><strong>{item.parentId ? '↳ ' : ''}{item.title}</strong><br/><span style={{ fontSize: '11px', color: '#64748b' }}>{item.url.substring(0, 60)}</span></div>
                <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* ASSETS STACK TRACK */}
        <div>
          <h4 style={{ color: '#a855f7', margin: '0 0 10px 0' }}>Lane 2 Layout Blocks (Assets, Presets & Passwords)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {assets.map(item => (
              <div 
                key={item._id} 
                className="drag-tile-row"
                draggable
                onDragStart={() => handleDragStart(item._id)}
                onDragOver={(e) => handleDragOver(e, item._id, 'assets', assets)}
                onDragEnd={() => handleDragEnd('assets', assets)}
              >
                <div><strong>{item.parentId ? '↳ ' : ''}{item.title}</strong><br/><span style={{ fontSize: '11px', color: '#64748b' }}>{item.url.substring(0, 60)}</span></div>
                <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* MY WORK STACK TRACK */}
        <div>
          <h4 style={{ color: '#10b981', margin: '0 0 10px 0' }}>Lane 3 Layout Blocks (Showcases & Video Tutorials)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myWork.map(item => (
              <div 
                key={item._id} 
                className="drag-tile-row"
                draggable
                onDragStart={() => handleDragStart(item._id)}
                onDragOver={(e) => handleDragOver(e, item._id, 'my_work', myWork)}
                onDragEnd={() => handleDragEnd('my_work', myWork)}
              >
                <div><strong>{item.parentId ? '↳ ' : ''}{item.title}</strong><br/><span style={{ fontSize: '11px', color: '#64748b' }}>{item.url.substring(0, 60)}</span></div>
                <button onClick={() => handleDelete(item._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '4px' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
