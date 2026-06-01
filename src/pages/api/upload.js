import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Approves videos, audio, and images up to 50MB
        return {
          allowedContentTypes: ['video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'audio/mp3', 'image/jpeg', 'image/png'],
          maximumSizeInBytes: 50 * 1024 * 1024, 
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Asset successfully hosted:', blob.url);
      },
    });
    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
