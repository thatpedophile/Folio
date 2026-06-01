import { useState, useEffect } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [links, setLinks] = useState([]);
  const [newAvatar, setNewAvatar] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data.links || []);
    } catch (err) {
      console.error("Error communicating with DB endpoints:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddLink = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ title, url }),
    });
    if (res.ok) { setTitle(''); setUrl(''); fetchDashboardData(); }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'admin-password': password },
      body: JSON.stringify({ type: 'update_avatar', avatarUrl: newAvatar }),
    });
    if (res.ok) { alert('Avatar image modified successfully!'); setNewAvatar(''); }
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
        <h3 style={{ marginBottom: '15px', letterSpacing: '-0.01em' }}>Secure Gate Access</h3>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', width: '240px', background: '#13131a', border: '1px solid #222', borderRadius: '8px', color: '#fff', marginBottom: '15px', textAlign: 'center' }} placeholder="••••••••" />
        <button onClick={() => setIsAuthorized(true)} style={{ padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', background: '#6366f1', color: '#fff', border: 'none', fontWeight: '600' }}>Authorize</button>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0a0f', color: '#fff', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '30px' }}>Control Dashboard</h2>
      
      {/* Image Manager Form */}
      <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Modify Brand Image Profile URL</h4>
      <form onSubmit={handleUpdateAvatar} style={{ display: 'flex', gap: '10px', marginBottom: '40px', background: '#13131a', padding: '15px', borderRadius: '10px', border: '1px solid #1e1e24' }}>
        <input type="url" placeholder="Paste direct image link (.png, .jpg, .webp)" value={newAvatar} onChange={(e) => setNewAvatar(e.target.value)} required style={{ padding: '10px', flex: 1, background: '#0a0a0f', border: '1px solid #222', color: '#fff', borderRadius: '6px' }} />
        <button type="submit" style={{ padding: '10px 20px', background: '#a855f7', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '6px', fontWeight: '600' }}>Update Profile Picture</button>
      </form>

      {/* Element Creation Row Form */}
      <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Create New Destination Link</h4>
      <form onSubmit={handleAddLink} style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
        <input type="text" placeholder="Link Button Text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '12px', flex: 1, background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '8px' }} />
        <input type="url" placeholder="Redirect Destination URL" value={url} onChange={(e) => setUrl(e.target.value)} required style={{ padding: '12px', flex: 2, background: '#13131a', border: '1px solid #222', color: '#fff', borderRadius: '8px' }} />
        <button type="submit" style={{ padding: '12px 24px', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: '600' }}>Publish Link</button>
      </form>

      {/* Dynamic Item Records Management */}
      <h3 style={{ borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>Active Navigation Points</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {links.length === 0 ? <p style={{ color: '#555' }}>No active buttons loaded yet.</p> : links.map(link => (
          <div key={link._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#13131a', padding: '16px', borderRadius: '10px', border: '1px solid #1e1e24' }}>
            <div>
              <strong style={{ display: 'block', color: '#fff' }}>{link.title}</strong>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{link.url}</span>
            </div>
            <button onClick={() => handleDelete(link._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', cursor: 'pointer', borderRadius: '6px', fontWeight: '600' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
