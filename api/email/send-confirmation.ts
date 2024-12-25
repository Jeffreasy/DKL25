import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers toevoegen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS request afhandelen voor CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Alleen POST toestaan
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Only POST requests are allowed'
    });
  }

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