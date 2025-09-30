# CaptiveConnect

A wireless hotspot management system with captive portal functionality.

## Project Structure

```
CaptiveConnect/
├── src/
│   ├── android/          # Android application
│   │   └── app/
│   │       └── java/
│   │           └── com/
│   │               └── captiveconnect/
│   │                   └── hotspot/
│   │                       └── HotspotManager.kt
│   ├── captive-portal/   # Web portal
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   ├── styles.css
│   │   │   └── scripts.js
│   │   └── server.js
│   └── scripts/          # System scripts
│       ├── setup-hotspot.sh
│       └── iptables-rules.sh
├── docs/                 # Documentation
└── tests/                # Test files
```

## Features

- Android WiFi Hotspot Management
- Captive Portal Web Interface
- Device Connection Management
- System Configuration Scripts

## Requirements

- Android Studio for mobile app development
- Node.js for captive portal server
- Linux system for hotspot configuration

## Setup

1. Android Application
```bash
cd src/android
./gradlew build
```

2. Captive Portal Server
```bash
cd src/captive-portal
npm install
npm start
```

3. System Configuration
```bash
sudo ./src/scripts/setup-hotspot.sh
```

## License

MIT License