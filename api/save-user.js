// Vercel Serverless Function for saving user data
// Note: Vercel has a read-only filesystem. For production, use:
// - Vercel KV (Redis)
// - Vercel Postgres
// - External database (MongoDB, Firebase, etc.)

// This temporary implementation stores data in memory (will reset on each deployment)
// For testing purposes only

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get JSON data from request
  const userData = req.body;

  if (!userData) {
    return res.status(400).json({ error: 'Invalid JSON data' });
  }

  // WARNING: This is a temporary solution
  // In production, save to a database instead
  // For now, we'll just return success without persisting data
  
  return res.status(200).json({
    success: true,
    message: 'User received successfully (Note: Data not persisted - use database for production)',
    user: userData,
    warning: 'This is a prototype endpoint. Implement proper database storage for production.'
  });
}
