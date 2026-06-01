import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('biolink');

  const password = req.headers['admin-password'];
  const isAdminRequest = req.headers['admin-password'] !== undefined;

  // 1. GET: Fetch elements organized by structural blocks
  if (req.method === 'GET') {
    if (isAdminRequest && password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Pull and sort items into separate array buckets
      const socials = await db.collection('links').find({ blockType: 'socials' }).sort({ createdAt: -1 }).toArray();
      const assets = await db.collection('links').find({ blockType: 'assets' }).sort({ createdAt: -1 }).toArray();
      const myWork = await db.collection('links').find({ blockType: 'my_work' }).sort({ createdAt: -1 }).toArray();
      
      const config = await db.collection('config').findOne({ key: 'profile_settings' });
      
      const profile = {
        username: config?.username || 'sh1vx',
        bio: config?.bio || 'Welcome to my portfolio. Check out my latest edits and assets below.',
        avatarUrl: config?.avatarUrl || '',
        videoUrl: config?.videoUrl || '', // Main showreel / introduction edit
        subtitle: config?.subtitle || 'VFX PORTFOLIO ENGINE',
        bgVideoUrl: config?.bgVideoUrl || '', // Custom dynamic video background
        audioBgUrl: config?.audioBgUrl || '',
        audioHoverUrl: config?.audioHoverUrl || 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav'
      };

      return res.status(200).json({ socials, assets, myWork, profile });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Security Access Wall for Data Modifications
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 2. POST: Process Framework Configurations and Card Elements
  if (req.method === 'POST') {
    const { title, url, blockType, type, username, bio, avatarUrl, videoUrl, subtitle, bgVideoUrl, audioBgUrl, audioHoverUrl } = req.body;

    if (type === 'update_profile') {
      try {
        await db.collection('config').updateOne(
          { key: 'profile_settings' },
          { $set: { username, bio, avatarUrl, videoUrl, subtitle, bgVideoUrl, audioBgUrl, audioHoverUrl, updatedAt: new Date() } },
          { upsert: true }
        );
        return res.status(200).json({ message: 'Layout engine saved perfectly!' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    try {
      const entry = { 
        title, 
        url, 
        blockType: blockType || 'socials', // Default block assignment
        createdAt: new Date() 
      };
      await db.collection('links').insertOne(entry);
      return res.status(201).json(entry);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 3. DELETE: Wipe asset objects out of database records
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await db.collection('links').deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: 'Deleted successfully' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
