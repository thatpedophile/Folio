import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  // Only allow POST requests for uploads
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      // Explicitly tell the handler where to find your token
      token: process.env.BLOB_READ_WRITE_TOKEN, 
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            'video/mp4', 'video/quicktime', 'video/webm', // Video formats
            'audio/mpeg', 'audio/wav', 'audio/mp3',       // Audio formats
            'image/jpeg', 'image/png', 'image/gif'        // Image formats
          ],
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB file limit
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Asset successfully hosted at:', blob.url);
      },
    });
    
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Vercel Blob Handshake Error:", error);
    return res.status(400).json({ error: error.message });
  }
}
