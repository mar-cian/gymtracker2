# Gym Tracker 2026

Mobile-First Full-Stack Web Application for tracking workouts with a heatmap visualization.

## Features
- **Users**: Giani, Angie, Sämi
- **Heatmap**: 365-day visualization for 2026 (Blue = Cardio, Green = Strength)
- **Mobile Optimized**: Horizontal scrolling, touch-friendly
- **Easter Egg**: Type "gravity" (or tap title and type in hidden field) to activate physics mode!

## Installation on Debian Server

1. **Update System & Install Node.js**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm
   ```

2. **Clone/Copy Project**
   Copy the files to your server (e.g., via `git clone` or `scp`).
   ```bash
   mkdir gym-tracker
   cd gym-tracker
   # (Upload files here)
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start the Server**
   ```bash
   npm start
   ```
   Or for background execution (using pm2):
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "gym-tracker"
   ```

5. **Access**
   Open `http://YOUR_SERVER_IP:3000` in your browser.

## Tech Stack
- **Backend**: Node.js + Express
- **Database**: SQLite (stored in `gym.db`)
- **Frontend**: Vanilla HTML/CSS/JS + Matter.js (CDN)

## Production Deployment (Cloudflare Tunnel)

Since you are using Cloudflare Tunnel, simply point your Tunnel configuration (in the Cloudflare Dashboard) to your server.

**Option A: Direct (Easiest)**
Point your Tunnel Service to: `http://localhost:3000`

**Option B: Via Nginx (Optional)**
If you prefer to route through Nginx (e.g. for logs), use the provided `nginx.conf`.
1. Copy config: `sudo cp nginx.conf /etc/nginx/sites-available/gymtracker`
2. Link: `sudo ln -s /etc/nginx/sites-available/gymtracker /etc/nginx/sites-enabled/`
3. Restart: `sudo systemctl restart nginx`
4. Point your Tunnel Service to: `http://localhost:80`

### Optional: Manual SSL (If not using Tunnel SSL)
If you want to use your own certificates (e.g. from Let's Encrypt) on the server:

1.  **Modify** `/etc/nginx/sites-available/gymtracker`:
    ```nginx
    server {
        listen 443 ssl;
        server_name giani.cc;

        ssl_certificate /etc/letsencrypt/live/giani.cc/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/giani.cc/privkey.pem;

        location / {
            proxy_pass http://localhost:3000;
            # ... (keep other proxy settings)
        }
    }
    server {
        listen 80;
        server_name giani.cc;
        return 301 https://$host$request_uri;
    }
    ```
2.  **Restart Nginx**: `sudo systemctl restart nginx`

### Node.js App Management (Keep it running)
Use `pm2` to keep the app running in the background:
```bash
sudo npm install -g pm2
pm2 start server.js --name "gym-tracker"
pm2 save
pm2 startup
```