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

## 🗄️ Storage: Upstash Redis

Serverless platforms like Vercel have a **read-only filesystem**, so text cannot be saved to files. This project stores text in a free [Upstash Redis](https://upstash.com) database (free tier: 10,000 commands/day).

### One-time setup

1. Create a free Redis database at [console.upstash.com](https://console.upstash.com)
   (or from Vercel: **Storage → Create Database → Upstash**)
2. Copy the **REST URL** and the **REST Token** from the database page
3. Add them as environment variables in your Vercel project
   (**Settings → Environment Variables**), for Production, Preview and Development:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Redeploy the project

Without these variables the API returns a helpful error instead of silently failing.

## 🚀 Deployment to Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import this GitHub repository
3. Click **"Deploy"** - no build configuration needed
4. Add the Upstash environment variables (see above) and redeploy

## 📁 Project Structure

```
text-sending-web-based/
├── index.html          # Main webpage
├── style.css           # Styling (mobile-responsive)
├── script.js            # Frontend JavaScript
├── api/
│   ├── _upstash.js      # Shared Upstash Redis helpers (not an endpoint)
│   ├── get-text.js      # API to retrieve stored text
│   ├── set-text.js      # API to save text
│   └── clear-text.js    # API to clear text
├── package.json         # No runtime dependencies
├── vercel.json          # Minimal Vercel configuration
└── README.md
```

## 🔧 How It Works

1. When you click "Send Text", the text is sent to `/api/set-text`
2. The API stores the text as JSON in Upstash Redis with a **30-minute TTL** (Redis deletes it automatically)
3. When any device visits the page, it calls `/api/get-text` every 5 seconds
4. `/api/clear-text` removes the text immediately

Text size is capped at 100,000 characters.

## 📝 Notes

- The text is **shared globally** - anyone with the website URL can see it
- Text **expires after 30 minutes** (even if nobody visits the site)
- No database server to manage - Upstash free tier is enough for personal use

---

**Made with ❤️ for easy text sharing**
