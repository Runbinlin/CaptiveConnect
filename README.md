# CaptiveConnect

A wireless hotspot management system with captive portal functionality.

## Project Structure

```
CaptiveConnect/
├── README.md                     # Project overview and quick start guide
├── LICENSE                       # MIT License (pending)
├── .gitignore                    # Git ignore rules
├── android/                      # Android application
│   └── app/                      # Root directory for Android Studio
│       ├── src/main/
│       │   ├── java/com/captiveconnect/
│       │   │   ├── app/          # Application class
│       │   │   ├── service/      # Hotspot management service
│       │   │   ├── ui/           # Activities/Fragments
│       │   │   └── util/         # Utility classes
│       │   ├── res/              # Android resources
│       │   └── AndroidManifest.xml
│       └── build.gradle
│
├── captive-portal/               # Captive Portal web interface
│   ├── public/                   # Static assets root
│   │   ├── index.html
│   │   └── scripts.js
│   └── server.js                 # Node.js server
│
├── docs/                         # Technical documentation
│   └── architecture.md           # System architecture (pending)
│
├── edge-scripts/                 # System scripts for edge device
│
├── config/                       # Configuration files
│
├── tests/                        # Automated tests
│
└── tools/                        # Auxiliary utilities
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