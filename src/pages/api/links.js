import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('biolink');

  const password = req.headers['admin-password'];
  const isAdminRequest = req.headers['admin-password'] !== undefined;

  if (req.method === 'GET') {
    if (isAdminRequest && password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      {/* FIXED: Elements now pull strictly by their custom order index numbers */}
      const socials = await db.collection('links').find({ blockType: 'socials' }).sort({ order: 1, createdAt: -1 }).toArray();
      const assets = await db.collection('links').find({ blockType: 'assets' }).sort({ order: 1, createdAt: -1 }).toArray();
      const myWork = await db.collection('links').find({ blockType: 'my_work' }).sort({ order: 1, createdAt: -1 }).toArray();
      const config = await db.collection('config').findOne({ key: 'profile_settings' });
      
      const profile = {
        username: config?.username || 'sh1vx',
        bio: config?.bio || 'Welcome to my portfolio.',
        avatarUrl: config?.avatarUrl || '',
        videoUrl: config?.videoUrl || '',
        subtitle: config?.subtitle || 'VFX PORTFOLIO ENGINE',
        bgVideoUrl: config?.bgVideoUrl || '',
        audioBgUrl: config?.audioBgUrl || '',
        audioHoverUrl: config?.audioHoverUrl || '',
        announcement: config?.announcement || '',
        block1Name: config?.block1Name || 'Socials',
        block2Name: config?.block2Name || 'Assets & Presets',
        block3Name: config?.block3Name || 'My Work',
        block4Name: config?.block4Name || 'System Activation',
        block5Name: config?.block5Name || 'Other Sites',
        block6Name: config?.block6Name || 'Tutorials'
      };

      return res.status(200).json({ socials, assets, myWork, profile });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { 
      title, url, blockType, type, username, bio, avatarUrl, videoUrl, subtitle, bgVideoUrl, audioBgUrl, audioHoverUrl, announcement,
      block1Name, block2Name, block3Name, block4Name, block5Name, block6Name, orderedIds
    } = req.body;

    if (type === 'update_profile') {
      try {
        await db.collection('config').updateOne(
          { key: 'profile_settings' },
          { $set: { 
            username, bio, avatarUrl, videoUrl, subtitle, bgVideoUrl, audioBgUrl, audioHoverUrl, announcement,
            block1Name, block2Name, block3Name, block4Name, block5Name, block6Name,
            updatedAt: new Date() 
          } },
          { upsert: true }
        );
        return res.status(200).json({ message: 'Saved successfully.' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    {/* NEW: Receives rearranged arrays and mass updates index properties inside MongoDB */}
    if (type === 'update_order') {
      try {
        const bulkOps = orderedIds.map((id, index) => ({
          updateOne: {
            filter: { _id: new ObjectId(id) },
            update: { $set: { order: index } }
          }
        }));
        if (bulkOps.length > 0) {
          await db.collection('links').bulkWrite(bulkOps);
        }
        return res.status(200).json({ message: 'Order index synchronized successfully.' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

    try {
      {/* Increments fallback order index for new additions */}
      const existingCount = await db.collection('links').countDocuments({ blockType });
      const entry = { title, url: url || '', blockType: blockType || 'socials', order: existingCount, createdAt: new Date() };
      await db.collection('links').insertOne(entry);
      return res.status(201).json(entry);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await db.collection('links').deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: 'Deleted successfully' });
  }
}
