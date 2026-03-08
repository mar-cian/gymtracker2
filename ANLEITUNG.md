# Gym Tracker 2026 - Installations- und Setup-Anleitung

Diese Anleitung erklärt dir Schritt für Schritt, wie du den Gym Tracker 2026 auf deinem Server (Debian/Ubuntu) installierst und über das Internet zugänglich machst.

## 1. Voraussetzungen auf dem Server vorbereiten
Die Web-App läuft mit Node.js. Stelle sicher, dass Node.js (sowie npm) auf dem Server installiert ist:
```bash
sudo apt update
sudo apt install -y nodejs npm
```

## 2. Dateien auf den Server übertragen
Lege ein neues Verzeichnis für den Gym-Tracker an und lade den Programmcode dorthin auf deinen Server hoch:
```bash
mkdir -p ~/gym-tracker
cd ~/gym-tracker
```
> [!NOTE]
> Füge alle Projektdateien (inklusive `server.js`, `package.json`, `nginx.conf` und dem `public`-Ordner) per FTP, SCP oder Git in dieses Verzeichnis ein.

## 3. Abhängigkeiten installieren
Nun müssen die benötigten Node.js-Pakete (wie Express und SQLite) geladen werden. Führe dazu im Projektordner folgenden Befehl aus:
```bash
npm install
```

## 4. App im Hintergrund betreiben (mit PM2)
Wenn du den Server mit `node server.js` startest, wird die App beendet, sobald du dein Terminalfenster schließt. Um dies zu verhindern, nutzen wir PM2.

```bash
# PM2 global installieren
sudo npm install -g pm2

# Gym-Tracker im Hintergrund starten
pm2 start server.js --name "gym-tracker"

# PM2 so konfigurieren, dass die App nach einem Server-Neustart automatisch startet
pm2 save
pm2 startup
```
> [!IMPORTANT]
> Führe den Befehl aus, den dir `pm2 startup` ganz am Ende im Terminal als Text ausgibt, um die Einrichtung endgültig abzuschließen.

## 5. Erreichbarkeit und Sicherheit
Der Server ist nun standardmäßig unter Port `3000` auf deinem Server erreichbar. Die Datenbank-Fehler der ersten Version (bei fehlender `gym.db`) sind im aktuellen Code behoben.

### Warum war die Seite nicht erreichbar? (Fehler aus dem Screenshot)
Der Fehler aus deinem Screenshot zeigt an, dass gar keine Verbindung zu Port 3000 auf der IP-Adresse aufgebaut werden konnte, wobei das Logo von **NordVPN** sichtbar ist.

Dies kann folgende Gründe haben:
1. **Node Server läuft nicht:** Hast du den Server (`server.js`) auf dem Server, der diese IP-Adresse hat, tatsächlich gestartet?
2. **Firewall auf dem Server:** Port 3000 ist höchstwahrscheinlich in deiner Server-Firewall (z.B. UFW) nicht nach außen freigegeben. (`sudo ufw allow 3000`).
3. **NordVPN blockiert den Traffic:** Oftmals fungiert NordVPN als Proxy, um deine Identität zu schützen. NordVPN verweigert dabei den Zugriff auf ungewöhnliche IP-Port Kombinationen, wenn es denkt, das Netzwerk sei "down". Versuch NordVPN für den Verbindungsaufbau zu pausieren.

### Empfohlener Weg: Cloudflare Tunnel (Zero Trust)
Da du die App sicher und nur für dich zugänglich machen willst, solltest du am besten nicht direkt über die IP auf Port 3000 zugreifen. Richte stattdessen deinen **Cloudflare Tunnel** ein.

1. Richte den Tunnel in Cloudflare so ein, dass er auf `http://localhost:3000` (auf dem Server) zeigt.
2. Der gesamte Verkehr läuft ab sofort gesichert und verschlüsselt über deine Domain `giani.cc`.
3. Es ist dann komplett egal, ob deine Server-Firewall Port 3000 für die Außenwelt blockiert (das ist sogar gewollt!). Cloudflare kann die App trotzdem aus dem inneren Netz heraus über den Tunnel erreichen.
