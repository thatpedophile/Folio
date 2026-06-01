import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('biolink');

  // 1. GET: Fetch links and profile configuration profiles
  if (req.method === 'GET') {
    try {
      const links = await db.collection('links').find({}).sort({ createdAt: -1 }).toArray();
      const config = await db.collection('config').findOne({ key: 'profile_settings' });
      
      const profile = {
        username: config?.username || 'sh1vx69',
        bio: config?.bio || 'Welcome to my biolink platform. Check out my latest presets, project mirrors, and socials below.',
        avatarUrl: config?.avatarUrl || 'https://api.dicebear.com/7.x/shapes/svg?seed=sh1vx69',
        videoUrl: config?.videoUrl || ''
      };

      return res.status(200).json({ links, profile });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Admin Security Verification Gateway
  const password = req.headers['admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 2. POST: Process Link Publishing and Settings Updates
  if (req.method === 'POST') {
    const { title, url, type, username, bio, avatarUrl, videoUrl } = req.body;

    // Separate profile saving logic completely
    if (type === 'update_profile') {
      try {
        await db.collection('config').updateOne(
          { key: 'profile_settings' },
          { $set: { username, bio, avatarUrl, videoUrl, updatedAt: new Date() } },
          { upsert: true }
        );
        return res.status(200).json({ message: 'Profile settings updated!' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    // Link adding logic (only checks title/url if type is NOT update_profile)
    if (!title || !url) {
      return res.status(400).json({ message: 'Missing fields for link creation' });
    }

    try {
      const newLink = { title, url, createdAt: new Date() };
      await db.collection('links').insertOne(newLink);
      return res.status(201).json(newLink);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 3. DELETE: Drop active routing links
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await db.collection('links').deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: 'Deleted successfully' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
