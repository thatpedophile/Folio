import { useState, useEffect, useRef } from 'react';
import { upload } from '@vercel/blob/client';

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

  // Creation Form States
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [entryType, setEntryType] = useState('standard');

  // File Upload Interface UI Tracking States
  const [uploadingTarget, setUploadingTarget] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const heroVideoInputRef = useRef(null);
  const bgAudioInputRef = useRef(null);
  const portfolioUnitInputRef = useRef(null);

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

  const processFileUploadAction = async (file, targetContext) => {
    if (!file) return;
    setUploadingTarget(targetContext);
    setUploadProgress(10);

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload', // <-- FIXED URL (Clean path)
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round(progressEvent.percentage));
        }
      });

      if (targetContext === 'hero_video') setVideoUrl(newBlob.url);
      if (targetContext === 'bg_audio') setAudioBgUrl(newBlob.url);
      if (targetContext === 'portfolio_unit') setUrl(newBlob.url);

      setUploadProgress(100);
      setTimeout(() => setUploadingTarget(null), 1000);
    } catch (error) {
      alert(`File processing upload failure: ${error.message}`);
      setUploadingTarget(null);
    }
  };

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

  const renderFileDropperBox = (targetContext, labelText, acceptedFormats, clickRef) => {
    const isCurrentUploading = uploadingTarget === targetContext;
    return (
      <div 
        onClick={() => clickRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#a855f7'; }}
        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#222'; }}
        onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#222'; processFileUploadAction(e.dataTransfer.files[0], targetContext); }}
        style={{
          border: '2px dashed #222', padding: '20px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: '#0a0a0f', transition: 'all 0.2s', position: 'relative', overflow: 'hidden', minHeight: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}
      >
        <input type="file" ref={clickRef} accept={acceptedFormats} style={{ display: 'none' }} onChange={(e) => processFileUploadAction(e.target.files[0], targetContext)} />
        {isCurrentUploading ? (
          <div style={{ width: '100%' }}>
            <span style={{ fontSize: '12px', color: '#a855f7', fontWeight: '600' }}>Uploading Asset: {uploadProgress}%</span>
            <div style={{ width: '100%', height: '4px', background: '#222', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#a855f7', transition: 'width 0.1s' }} />
            </div>
          </div>
        ) : (
          <div>
            <span style={{ fontSize: '13px', color: '#64748b', display: 'block' }}>{labelText}</span>
            <span style={{ fontSize: '11px', color: '#444' }}>Drag file from desktop or click here</span>
          </div>
        )}
      </div>
    );
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
      
      <div style={{ background: '#13131a', padding: '25px', borderRadius: '12px', border: '1px solid #1e1e24', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>Branding, Presets & Audio System Variables</h3>
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
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Link Interface Hover Sound Action Effect URL (.wav / .mp3)</label>
              <input type="url" value={audioHoverUrl} onChange={(e) => setAudioHoverUrl(e.target.value)} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', background: '#0a0a0f', padding: '15px', borderRadius: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#a855f7', marginBottom: '5px', fontWeight: '600' }}>1. Main Intro Showreel Video (.mp4)</label>
              {renderFileDropperBox('hero_video', 'Drop Hero Video Edit', 'video/mp4,video/webm', heroVideoInputRef)}
              {videoUrl && <video src={videoUrl} controls style={{ width: '100%', borderRadius: '6px', marginTop: '10px', height: '100px', objectFit: 'cover' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#a855f7', marginBottom: '5px', fontWeight: '600' }}>2. Looping Background Music Track (.mp3)</label>
              {renderFileDropperBox('bg_audio', 'Drop Loop Background Sound', 'audio/mpeg,audio/mp3,audio/wav', bgAudioInputRef)}
              {audioBgUrl && <audio src={audioBgUrl} controls style={{ width: '100%', marginTop: '10px' }} />}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Bio Summary Text Field</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} required rows="2" style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px', resize: 'vertical' }} />
          </div>

          <button type="submit" style={{ padding: '14px', background: '#a855f7', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Save Core Framework Matrix</button>
        </form>
      </div>

      <h3 style={{ margin: '0 0 15px 0', color: '#6366f1' }}>Publish Portfolio Content Units</h3>
      <form onSubmit={handleCreateElement} style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#13131a', padding: '25px', borderRadius: '12px', border: '1px solid #1e1e24', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Content Entry Category</label>
            <select value={entryType} onChange={(e) => setEntryType(e.target.value)} style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }}>
              <option value="standard">Standard Hyperlink Button Link (Text URL Input)</option>
              <option value="video_project">Embedded Video Portfolio Edit Card Sample (File Drag-and-Drop)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Title Label / Edit Caption Description</label>
            <input type="text" placeholder="e.g., After Effects Presets Pack or TikTok Edit" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Asset Location Target URL (Populated automatically if file is dropped below)</label>
          <input type="url" placeholder="https://..." value={url} onChange={(setUrlValue) => setUrl(setUrlValue.target.value)} required style={{ padding: '12px', width: '100%', boxSizing: 'border-box', background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px', marginBottom: '10px' }} />
          
          {entryType === 'video_project' && (
            <div>
              {renderFileDropperBox('portfolio_unit', 'Drop Portfolio Work Video File Here (.mp4)', 'video/mp4,video/webm', portfolioUnitInputRef)}
              {url && <video src={url} controls style={{ width: '100%', borderRadius: '12px', marginTop: '12px', aspectRatio: '16/9', objectFit: 'cover' }} />}
            </div>
          )}
        </div>

        <button type="submit" style={{ padding: '14px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Publish Content Unit Asset</button>
      </form>

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
