import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Basic logging
  console.log('Request received:', {
    method: req.method,
    body: req.body
  });

  // Test response
  return res.status(200).json({ 
    success: true,
    message: 'API endpoint works!',
    received: req.body
  });
} 