import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('biolink');

  // 1. GET: Fetch links, videos, and master design settings
  if (req.method === 'GET') {
    try {
      const links = await db.collection('links').find({ type: { $ne: 'video_project' } }).sort({ createdAt: -1 }).toArray();
      const videoProjects = await db.collection('links').find({ type: 'video_project' }).sort({ createdAt: -1 }).toArray();
      const config = await db.collection('config').findOne({ key: 'profile_settings' });
      
      const profile = {
        username: config?.username || 'sh1vx',
        bio: config?.bio || 'Welcome to my biolink platform. Check out my latest presets, project mirrors, and socials below.',
        avatarUrl: config?.avatarUrl || '',
        videoUrl: config?.videoUrl || '',
        subtitle: config?.subtitle || 'VFX PORTFOLIO ENGINE',
        bgPreset: config?.bgPreset || 'cosmic_purple',
        audioBgUrl: config?.audioBgUrl || '',
        audioHoverUrl: config?.audioHoverUrl || 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav'
      };

      return res.status(200).json({ links, videoProjects, profile });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Admin Security Gateway
  const password = req.headers['admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 2. POST: Handle Settings, Custom Links, and Showcase Videos
  if (req.method === 'POST') {
    const { title, url, type, username, bio, avatarUrl, videoUrl, subtitle, bgPreset, audioBgUrl, audioHoverUrl } = req.body;

    if (type === 'update_profile') {
      try {
        await db.collection('config').updateOne(
          { key: 'profile_settings' },
          { $set: { username, bio, avatarUrl, videoUrl, subtitle, bgPreset, audioBgUrl, audioHoverUrl, updatedAt: new Date() } },
          { upsert: true }
        );
        return res.status(200).json({ message: 'Configuration saved!' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    try {
      const entry = { 
        title, 
        url, 
        type: type === 'video_project' ? 'video_project' : 'standard', 
        createdAt: new Date() 
      };
      await db.collection('links').insertOne(entry);
      return res.status(201).json(entry);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 3. DELETE: Drop database objects
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await db.collection('links').deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: 'Deleted successfully' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
