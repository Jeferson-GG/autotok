import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());
app.use(express.json()); // Essential for parsing JSON bodies in proxy requests

// 1. Storage Configuration (Persistent Uploads)
const UPLOADS_DIR = path.join(__dirname, 'upload');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, 'video-' + Date.now() + '.mp4');
    }
});

const upload = multer({ storage: storage });

// 2. Serve Uploads Statically
app.use('/upload', express.static(UPLOADS_DIR));

// 3. API Routes

// Upload Endpoint
app.post('/api/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filename = req.file.filename;
    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}/upload/${filename}`;

    res.json({
        success: true,
        filename: filename,
        url: fullUrl
    });
});

// Upload via URL Endpoint
app.post('/api/upload-url', async (req, res) => {
    try {
        const { videoUrl } = req.body;
        if (!videoUrl) {
            return res.status(400).send('No videoUrl provided.');
        }

        const filename = 'video-' + Date.now() + '.mp4';
        const filepath = path.join(UPLOADS_DIR, filename);

        console.log(`Downloading video from ${videoUrl} to ${filepath}`);

        const response = await fetch(videoUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.statusText}`);
        }

        await pipeline(response.body, fs.createWriteStream(filepath));

        const protocol = req.protocol;
        const host = req.get('host');
        const fullUrl = `${protocol}://${host}/upload/${filename}`;

        res.json({
            success: true,
            filename: filename,
            url: fullUrl
        });

    } catch (error) {
        console.error('Upload URL Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// TikTok User Info Proxy
app.get('/api/tiktok/info', async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) return res.status(401).json({ error: "No token provided" });

        const url = "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name";
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('TikTok Info Error:', data);
            return res.status(response.status).json(data);
        }
        res.json(data);
    } catch (error) {
        console.error('TikTok Info Exception:', error);
        res.status(500).json({ error: error.message });
    }
});

// TikTok Proxy Endpoint
app.post('/api/tiktok/init', async (req, res) => {
    try {
        const { accessToken, videoUrl } = req.body;
        // Construct the video URL depending on environment
        // If it's a relative path starting with /uploads, prepend the domain
        let finalVideoUrl = videoUrl;
        if (videoUrl.startsWith('/')) {
            // In production, use HTTPS. In dev (localhost), use HTTP.
            const host = req.get('host'); // e.g., autotok.ggsolution.site or localhost:3001
            const protocol = host.includes('localhost') ? 'http' : 'https';
            finalVideoUrl = `${protocol}://${host}${videoUrl}`;
        }

        console.log('Proxying to TikTok with Video URL:', finalVideoUrl);

        const url = "https://open.tiktokapis.com/v2/post/publish/video/init/";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                post_info: {
                    title: "Test Video from AutoTok",
                    privacy_level: "SELF_ONLY",
                    disable_duet: false,
                    disable_comment: false,
                    disable_stitch: false,
                },
                source_info: {
                    source: "PULL_FROM_URL",
                    video_url: finalVideoUrl
                }
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('TikTok Proxy Error:', data);
            return res.status(response.status).json(data);
        }
        res.json(data);
    } catch (error) {
        console.error('TikTok Proxy Exception:', error);
        res.status(500).json({ error: error.message });
    }
});

// Gemini Proxy Endpoint
app.post('/api/gemini/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        let apiKey = process.env.VITE_GEMINI_API_KEY;

        // Manual fallback for .env file
        if (!apiKey && fs.existsSync(path.join(__dirname, '.env'))) {
            const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
            const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
            if (match) apiKey = match[1].trim();
        }

        if (!apiKey) {
            return res.status(500).json({ error: "Server Error: Gemini API Key not found." });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // Log response for debugging
        console.log('Gemini API Response Status:', response.status);
        console.log('Gemini API Response:', JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.error('Gemini API Error:', data);
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('Gemini Proxy Exception:', error);
        res.status(500).json({ error: error.message });
    }
});


// 4. Serve Frontend (dist)
const DIST_DIR = path.join(__dirname, 'dist');
const indexHtml = path.join(DIST_DIR, 'index.html');

if (fs.existsSync(DIST_DIR)) {
    console.log('Serving React app from ./dist');
    app.use(express.static(DIST_DIR));

    // SPA Fallback (Express 5 safe)
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
            res.sendFile(indexHtml);
        } else {
            next();
        }
    });
} else {
    console.log('WARNING: ./dist folder not found. Only API is running.');
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
