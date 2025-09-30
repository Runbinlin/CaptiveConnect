document.addEventListener('DOMContentLoaded', () => {document.addEventListener('DOMContentLoaded', () => {

    const connectBtn = document.getElementById('connectBtn');    const connectBtn = document.getElementById('connectBtn');

    const statusEl = document.getElementById('status');    const statusEl = document.getElementById('status');

    let ws = null;    let ws = null;

        

    /**    // 尝试连接WebSocket

     * Attempts to establish a WebSocket connection to the server    function connectWebSocket() {

     */        // 使用当前主机名，端口80

    function connectWebSocket() {        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

        // Use current hostname with port 80        const wsUrl = `${protocol}//${window.location.host}`;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';        

        const wsUrl = `${protocol}//${window.location.host}`;        ws = new WebSocket(wsUrl);

                

        ws = new WebSocket(wsUrl);        ws.onopen = () => {

                    statusEl.textContent = '已连接到服务器';

        ws.onopen = () => {            statusEl.className = 'status connected';

            statusEl.textContent = 'Connected to server';            connectBtn.disabled = false;

            statusEl.className = 'status connected';        };

            connectBtn.disabled = false;        

        };        ws.onclose = () => {

                    statusEl.textContent = '服务器连接已断开';

        ws.onclose = () => {            statusEl.className = 'status error';

            statusEl.textContent = 'Server connection lost';            connectBtn.disabled = true;

            statusEl.className = 'status error';            

            connectBtn.disabled = true;            // 尝试重新连接

                        setTimeout(connectWebSocket, 3000);

            // Attempt reconnection        };

            setTimeout(connectWebSocket, 3000);        

        };        ws.onerror = (error) => {

                    console.error('WebSocket错误:', error);

        ws.onerror = (error) => {            statusEl.textContent = '连接错误';

            console.error('WebSocket error:', error);            statusEl.className = 'status error';

            statusEl.textContent = 'Connection error';        };

            statusEl.className = 'status error';        

        };        ws.onmessage = (event) => {

                    try {

        ws.onmessage = (event) => {                const data = JSON.parse(event.data);

            try {                

                const data = JSON.parse(event.data);                if (data.type === 'welcome') {

                                    console.log('收到欢迎消息:', data.message);

                if (data.type === 'welcome') {                }

                    console.log('Welcome message received:', data.message);            } catch (e) {

                }                console.error('解析消息错误:', e);

            } catch (e) {            }

                console.error('Error parsing message:', e);        };

            }    }

        };    

    }    // 点击连接按钮

        connectBtn.addEventListener('click', () => {

    // Connect button click handler        if (!ws || ws.readyState !== WebSocket.OPEN) {

    connectBtn.addEventListener('click', () => {            statusEl.textContent = '正在连接...';

        if (!ws || ws.readyState !== WebSocket.OPEN) {            connectWebSocket();

            statusEl.textContent = 'Connecting...';            return;

            connectWebSocket();        }

            return;        

        }        // 收集设备信息

                const deviceInfo = {

        // Collect device information            userAgent: navigator.userAgent,

        const deviceInfo = {            platform: navigator.platform,

            userAgent: navigator.userAgent,            language: navigator.language,

            platform: navigator.platform,            screenSize: `${window.screen.width}x${window.screen.height}`,

            language: navigator.language,            timestamp: new Date().toISOString()

            screenSize: `${window.screen.width}x${window.screen.height}`,        };

            timestamp: new Date().toISOString()        

        };        // 发送设备信息

                ws.send(JSON.stringify({

        // Send device information            type: 'deviceInfo',

        ws.send(JSON.stringify({            info: deviceInfo

            type: 'deviceInfo',        }));

            info: deviceInfo        

        }));        statusEl.textContent = '已成功连接！';

                statusEl.className = 'status success';

        statusEl.textContent = 'Successfully connected!';        connectBtn.textContent = '已连接';

        statusEl.className = 'status success';        connectBtn.disabled = true;

        connectBtn.textContent = 'Connected';        

        connectBtn.disabled = true;        // 延迟后重定向到成功页面

                setTimeout(() => {

        // Redirect to success page after delay            window.location.href = '/connected.html';

        setTimeout(() => {        }, 2000);

            window.location.href = '/connected.html';    });

        }, 2000);    

    });    // 初始连接

        connectWebSocket();

    // Initialize connection});

    connectWebSocket();
});