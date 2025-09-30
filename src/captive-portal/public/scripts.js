/**
 * CaptiveConnect Portal Client
 * Manages WebSocket connection and user interface interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connectBtn');
    const statusEl = document.getElementById('status');
    let ws = null;
    
    /**
     * Attempts to establish a WebSocket connection to the server
     */
    function connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;
        
        ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
            statusEl.textContent = 'Connected to server';
            statusEl.className = 'status connected';
            connectBtn.disabled = false;
        };
        
        ws.onclose = () => {
            statusEl.textContent = 'Server connection lost';
            statusEl.className = 'status error';
            connectBtn.disabled = true;
            
            // Attempt reconnection after delay
            setTimeout(connectWebSocket, 3000);
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            statusEl.textContent = 'Connection error';
            statusEl.className = 'status error';
        };
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.type === 'welcome') {
                    console.log('Welcome message received:', data.message);
                }
            } catch (e) {
                console.error('Error parsing message:', e);
            }
        };
    }
    
    // Handle connect button clicks
    connectBtn.addEventListener('click', () => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            statusEl.textContent = 'Connecting...';
            connectWebSocket();
            return;
        }
        
        // Collect and send device information
        const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            timestamp: new Date().toISOString()
        };
        
        ws.send(JSON.stringify({
            type: 'deviceInfo',
            info: deviceInfo
        }));
        
        // Update UI to show success
        statusEl.textContent = 'Successfully connected!';
        statusEl.className = 'status success';
        connectBtn.textContent = 'Connected';
        connectBtn.disabled = true;
        
        // Redirect to success page after delay
        setTimeout(() => {
            window.location.href = '/connected.html';
        }, 2000);
    });
    
    // Initialize connection when page loads
    connectWebSocket();
});