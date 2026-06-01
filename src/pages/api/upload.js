import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed.' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            'video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo',
            'audio/mpeg', 'audio/wav', 'audio/mp3',
            'image/jpeg', 'image/png', 'image/gif', 'image/webp'
          ],
          // This is the crucial missing line: Raises the upload cap to 100MB
          maximumSizeInBytes: 100 * 1024 * 1024, 
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Asset successfully hosted at:', blob.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Vercel Blob Upload Error:", error);
    return res.status(400).json({ error: error.message });
  }
}
