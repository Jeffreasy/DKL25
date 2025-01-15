import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  return response.status(200).json({
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
} 