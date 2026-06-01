import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('biolink');

  // 1. GET: Fetch links and avatar setup
  if (req.method === 'GET') {
    try {
      const links = await db.collection('links').find({}).sort({ createdAt: -1 }).toArray();
      const config = await db.collection('config').findOne({ key: 'avatar' });
      const avatarUrl = config ? config.url : 'https://api.dicebear.com/7.x/shapes/svg?seed=sh1vx69';
      return res.status(200).json({ links, avatarUrl });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Admin Security Verification
  const password = req.headers['admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 2. POST: Process dynamic submissions
  if (req.method === 'POST') {
    const { title, url, type, avatarUrl } = req.body;

    if (type === 'update_avatar') {
      await db.collection('config').updateOne(
        { key: 'avatar' },
        { $set: { url: avatarUrl, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.status(200).json({ message: 'Avatar updated!' });
    }

    if (!title || !url) return res.status(400).json({ message: 'Missing fields' });
    const newLink = { title, url, createdAt: new Date() };
    await db.collection('links').insertOne(newLink);
    return res.status(201).json(newLink);
  }

  // 3. DELETE: Drop active items
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await db.collection('links').deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: 'Deleted successfully' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
