# Text Sending Web 📱

A simple website for sending text from one device to another **without any login**. Text is stored for **30 minutes** and can be accessed from any device visiting the same website URL.

## ✨ Features

- ✅ **No authentication required** - Just open and use
- ✅ **30-minute storage** - Text stays available for 30 minutes then auto-deletes
- ✅ **Real-time sync** - Auto-refreshes every 5 seconds
- ✅ **Mobile-friendly** - Works perfectly on phones and tablets
- ✅ **One-click copy** - Copy text with a single button
- ✅ **Free hosting** - Deploy on Vercel in seconds

## 📱 How to Use

### On Device A (where you have the text):
1. Open the website on your browser
2. Type or paste your text in the textarea
3. Click **"Send Text (30 min)"**
4. That's it! Your text is now saved for 30 minutes

### On Device B (where you want the text):
1. Open the **same website URL** on the other device
2. The text will appear automatically (refreshes every 5 seconds)
3. Click **"Copy Text"** to copy it to clipboard

### Timer
- The timer shows how much time is left before the text expires
- After 30 minutes, the text is automatically deleted

## 🚀 Deployment to Vercel

### Method 1: One-Click Deploy (Recommended)
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click on **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Click **"Deploy"** - No configuration needed!
5. Your site will be live in seconds

### Method 2: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project directory
cd text-sending-web-based

# Deploy
vercel
```

### Method 3: Drag and Drop
1. Download/clone this repository
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Drag and drop the project folder
4. Click **"Deploy"**

## 📁 Project Structure

```
text-sending-web-based/
├── index.html          # Main webpage
├── style.css           # Styling (mobile-responsive)
├── script.js           # Frontend JavaScript
├── api/
│   ├── get-text.js     # API to retrieve stored text
│   ├── set-text.js     # API to save text
│   └── clear-text.js   # API to clear text
├── data/
│   └── .gitkeep        # Directory for storing text.json
├── package.json        # Node.js dependencies
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## 🔧 How It Works

1. When you click "Send Text", the text is sent to the server via `/api/set-text`
2. The server saves the text with a timestamp in `data/text.json`
3. When any device visits the page, it calls `/api/get-text` every 5 seconds
4. The server checks if the text is less than 30 minutes old
5. If valid, it returns the text; otherwise, it returns empty
6. After 30 minutes, the text is automatically considered expired

## 💡 Use Cases

- Transfer text from one phone to another when messaging apps don't work
- Share notes between devices quickly
- Send code snippets, addresses, or any text content
- Perfect for areas with poor internet where messaging apps fail

## 🎨 Customization

You can easily customize:
- **Storage duration**: Change the 30-minute limit in `api/get-text.js`
- **Auto-refresh interval**: Modify the 5000ms in `script.js`
- **Styling**: Edit `style.css` to change colors and layout

## 📝 Notes

- The text is **shared globally** - anyone with the website URL can see it
- Text **expires after 30 minutes** for security
- No database required - uses simple JSON file storage
- Works on **Vercel, Netlify, or any Node.js hosting**

## 🤝 Contributing

Feel free to fork and improve this project!

---

**Made with ❤️ for easy text sharing**
