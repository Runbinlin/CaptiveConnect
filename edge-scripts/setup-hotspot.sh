#!/bin/bash

# CaptiveConnect Hotspot Setup Script
# Configures system for WiFi hotspot with captive portal functionality

# Check for root privileges
if [ "$(id -u)" != "0" ]; then
   echo "This script requires root privileges" 1>&2
   exit 1
fi

# Install required packages
echo "Installing required packages..."
apt-get update
apt-get install -y dnsmasq hostapd iptables

# Configure dnsmasq
echo "Configuring DHCP and DNS services..."
cat > /etc/dnsmasq.conf << EOF
# Interface configuration
interface=wlan0
dhcp-range=192.168.43.2,192.168.43.20,255.255.255.0,24h
dhcp-option=3,192.168.43.1
dhcp-option=6,192.168.43.1

# DNS settings
server=8.8.8.8
log-queries
log-dhcp
listen-address=127.0.0.1

# Redirect all DNS requests to captive portal
address=/#/192.168.43.1
EOF

# Configure iptables rules for captive portal
echo "Setting up network routing rules..."
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.43.1:80
iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 192.168.43.1:80

# Start services
echo "Starting services..."
systemctl restart dnsmasq

echo "Hotspot setup complete!"