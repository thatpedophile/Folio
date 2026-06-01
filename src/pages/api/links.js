import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('biolink');

  const password = req.headers['admin-password'];
  const isAdminRequest = req.headers['admin-password'] !== undefined;

  // 1. GET: Fetch data buckets
  if (req.method === 'GET') {
    if (isAdminRequest && password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const socials = await db.collection('links').find({ blockType: 'socials' }).sort({ createdAt: -1 }).toArray();
      const assets = await db.collection('links').find({ blockType: 'assets' }).sort({ createdAt: -1 }).toArray();
      const myWork = await db.collection('links').find({ blockType: 'my_work' }).sort({ createdAt: -1 }).toArray();
      const config = await db.collection('config').findOne({ key: 'profile_settings' });
      
      const profile = {
        username: config?.username || 'sh1vx',
        bio: config?.bio || 'Welcome to my portfolio.',
        avatarUrl: config?.avatarUrl || '',
        videoUrl: config?.videoUrl || '',
        subtitle: config?.subtitle || 'VFX PORTFOLIO ENGINE',
        bgVideoUrl: config?.bgVideoUrl || '',
        audioBgUrl: config?.audioBgUrl || '',
        audioHoverUrl: config?.audioHoverUrl || ''
      };

      return res.status(200).json({ socials, assets, myWork, profile });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Security Access Barrier
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 2. POST: Handle Creation
  if (req.method === 'POST') {
    const { title, url, blockType, note, type, username, bio, avatarUrl, videoUrl, subtitle, bgVideoUrl, audioBgUrl, audioHoverUrl } = req.body;

    if (type === 'update_profile') {
      try {
        await db.collection('config').updateOne(
          { key: 'profile_settings' },
          { $set: { username, bio, avatarUrl, videoUrl, subtitle, bgVideoUrl, audioBgUrl, audioHoverUrl, updatedAt: new Date() } },
          { upsert: true }
        );
        return res.status(200).json({ message: 'Saved successfully.' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    try {
      const entry = { 
        title, 
        url, 
        blockType: blockType || 'socials', 
        note: note || '', // SAVES THE FILE PASSWORDS / INFO METADATA CLEANLY
        createdAt: new Date() 
      };
      await db.collection('links').insertOne(entry);
      return res.status(201).json(entry);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 3. DELETE: Drop data
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await db.collection('links').deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: 'Deleted successfully' });
  }
}
