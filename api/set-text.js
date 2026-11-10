// API endpoint to store text
// Saves text with current timestamp

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const dataPath = path.join(dataDir, 'text.json');
    
    // Get text from request body
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Save text with timestamp
    const data = {
      text: text,
      timestamp: Date.now()
    };
    
    fs.writeFileSync(dataPath, JSON.stringify(data));
    
    return res.status(200).json({ 
      success: true, 
      message: 'Text saved successfully!',
      expiresIn: 1800 // 30 minutes in seconds
    });
  } catch (error) {
    console.error('Error saving text:', error);
    return res.status(500).json({ error: 'Failed to save text' });
  }
}

// For Vercel Serverless Functions v2
export const config = {
  api: {
    bodyParser: true,
  },
};
