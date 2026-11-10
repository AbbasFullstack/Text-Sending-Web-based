// API endpoint to clear stored text

export default async function handler(req, res) {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const dataPath = path.join(process.cwd(), 'data', 'text.json');
    
    // Clear the text
    if (fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, JSON.stringify({ text: '', timestamp: 0 }));
    }
    
    return res.status(200).json({ success: true, message: 'Text cleared!' });
  } catch (error) {
    console.error('Error clearing text:', error);
    return res.status(500).json({ error: 'Failed to clear text' });
  }
}

// For Vercel Serverless Functions v2
export const config = {
  api: {
    bodyParser: false,
  },
};
