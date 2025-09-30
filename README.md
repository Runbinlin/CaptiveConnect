# CaptiveConnect

A wireless hotspot management system with captive portal functionality.

## Project Structure

```
CaptiveConnect/
├── README.md                     # Project overview and quick start guide
├── LICENSE                       # MIT License
├── .gitignore                    # Git ignore rules
├── android/                      # Android application
│   ├── build.gradle             # Root build configuration
│   └── src/
│       ├── AndroidManifest.xml
│       ├── app/                 # Application components
│       │   └── CaptiveConnectApp.kt
│       ├── service/            # Background services
│       │   └── HotspotService.kt
│       ├── ui/                 # User interface components
│       │   └── MainActivity.kt
│       └── util/               # Utility classes
│
├── captive-portal/              # Captive Portal web interface
│   ├── public/                 # Static assets root
│   │   ├── index.html         # Portal landing page
│   │   └── scripts.js         # Client-side JavaScript
│   └── server.js              # WebSocket server implementation
│
├── docs/                        # Technical documentation
│
├── edge-scripts/               # System scripts for edge device
│   └── setup-hotspot.sh       # WiFi hotspot configuration script
│
├── config/                     # Configuration files
│
├── tests/                      # Automated tests
│   ├── e2e/                   # End-to-end tests
│   ├── integration/           # Integration tests
│   └── unit/                  # Unit tests
│
└── tools/                      # Auxiliary utilities
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
cd android
./gradlew build
```

2. Captive Portal Server
```bash
cd captive-portal
npm install
npm start
```

3. System Configuration
```bash
sudo ./edge-scripts/setup-hotspot.sh
```

## License

MIT License