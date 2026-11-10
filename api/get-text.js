// API endpoint to retrieve the stored text
// Returns the text if it's less than 30 minutes old

export default async function handler(req, res) {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const dataPath = path.join(process.cwd(), 'data', 'text.json');
    
    // Check if file exists
    if (!fs.existsSync(dataPath)) {
      return res.status(200).json({ text: '', exists: false });
    }
    
    // Read the file
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Check if text is still valid (within 30 minutes)
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    if (data && data.timestamp && now - data.timestamp < thirtyMinutes) {
      return res.status(200).json({ 
        text: data.text || '', 
        timestamp: data.timestamp,
        expiresIn: Math.floor((thirtyMinutes - (now - data.timestamp)) / 1000)
      });
    } else {
      // Text has expired, clear it
      fs.writeFileSync(dataPath, JSON.stringify({ text: '', timestamp: 0 }));
      return res.status(200).json({ text: '', exists: false });
    }
  } catch (error) {
    console.error('Error retrieving text:', error);
    return res.status(500).json({ error: 'Failed to retrieve text' });
  }
}

// For Vercel Serverless Functions v2
export const config = {
  api: {
    bodyParser: true,
  },
};
