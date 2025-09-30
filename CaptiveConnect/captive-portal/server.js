const express = require('express');const express = require('express');const express = require('express');

const http = require('http');

const WebSocket = require('ws');const http = require('http');const http = require('http');

const path = require('path');

const WebSocket = require('ws');const WebSocket = require('ws');

const app = express();

const server = http.createServer(app);const path = require('path');const path = require('path');

const wss = new WebSocket.Server({ server });

const app = express();const app = express();

// 连接的客户端

const clients = new Map();const server = http.createServer(app);const server = http.createServer(app);



// 静态文件服务const wss = new WebSocket.Server({ server });const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));



// 所有HTTP请求都重定向到捕获页面

app.get('*', (req, res) => {// 连接的客户端// 连接的客户端

  res.sendFile(path.join(__dirname, 'public', 'index.html'));

});const clients = new Map();const clients = new Map();



// WebSocket处理

wss.on('connection', (ws, req) => {

  const ip = req.connection.remoteAddress;// 静态文件服务// 静态文件服务

  console.log(`New client connected: ${ip}`);

  app.use(express.static(path.join(__dirname, 'src')));app.use(express.static(path.join(__dirname, 'src')));

  // 存储客户端连接

  clients.set(ip, {

    ws,

    connectedAt: new Date(),// 所有HTTP请求都重定向到捕获页面// 所有HTTP请求都重定向到捕获页面

    deviceInfo: null

  });app.get('*', (req, res) => {app.get('*', (req, res) => {

  

  // 发送欢迎消息  res.sendFile(path.join(__dirname, 'src', 'index.html'));  res.sendFile(path.join(__dirname, 'src', 'index.html'));

  ws.send(JSON.stringify({

    type: 'welcome',});});

    message: 'Connected to CaptiveConnect'

  }));

  

  // 接收消息// WebSocket处理// WebSocket处理

  ws.on('message', (message) => {

    try {wss.on('connection', (ws, req) => {wss.on('connection', (ws, req) => {

      const data = JSON.parse(message);

        const ip = req.connection.remoteAddress;  const ip = req.connection.remoteAddress;

      if (data.type === 'deviceInfo') {

        // 存储设备信息  console.log(`New client connected: ${ip}`);  console.log(`New client connected: ${ip}`);

        clients.get(ip).deviceInfo = data.info;

        console.log(`Device info received from ${ip}:`, data.info);    

        

        // 广播新设备连接到主机应用  // 存储客户端连接  // 存储客户端连接

        broadcastToHost({

          type: 'newDevice',  clients.set(ip, {  clients.set(ip, {

          ip,

          info: data.info    ws,    ws,

        });

      }    connectedAt: new Date(),    connectedAt: new Date(),

    } catch (e) {

      console.error('Error processing message:', e);    deviceInfo: null    deviceInfo: null

    }

  });  });  });

  

  // 连接关闭    

  ws.on('close', () => {

    console.log(`Client disconnected: ${ip}`);  // 发送欢迎消息  // 发送欢迎消息

    clients.delete(ip);

      ws.send(JSON.stringify({  ws.send(JSON.stringify({

    // 通知主机应用设备断开

    broadcastToHost({    type: 'welcome',    type: 'welcome',

      type: 'deviceDisconnected',

      ip    message: 'Connected to CaptiveConnect'    message: 'Connected to CaptiveConnect'

    });

  });  }));  }));

});

    

// 向主机应用广播消息

function broadcastToHost(message) {  // 接收消息  // 接收消息

  // 假设主机IP是192.168.43.1（典型的Android热点IP）

  const hostClient = Array.from(clients.entries())  ws.on('message', (message) => {  ws.on('message', (message) => {

    .find(([ip]) => ip.includes('192.168.43.1'));

      try {    try {

  if (hostClient && hostClient[1].ws.readyState === WebSocket.OPEN) {

    hostClient[1].ws.send(JSON.stringify(message));      const data = JSON.parse(message);      const data = JSON.parse(message);

  }

}            



// 启动服务器      if (data.type === 'deviceInfo') {      if (data.type === 'deviceInfo') {

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {        // 存储设备信息        // 存储设备信息

  console.log(`Server running on port ${PORT}`);

});        clients.get(ip).deviceInfo = data.info;        clients.get(ip).deviceInfo = data.info;

        console.log(`Device info received from ${ip}:`, data.info);        console.log(`Device info received from ${ip}:`, data.info);

                

        // 广播新设备连接到主机应用        // 广播新设备连接到主机应用

        broadcastToHost({        broadcastToHost({

          type: 'newDevice',          type: 'newDevice',

          ip,          ip,

          info: data.info          info: data.info

        });        });

      }      }

    } catch (e) {    } catch (e) {

      console.error('Error processing message:', e);      console.error('Error processing message:', e);

    }    }

  });  });

    

  // 连接关闭  // 连接关闭

  ws.on('close', () => {  ws.on('close', () => {

    console.log(`Client disconnected: ${ip}`);    console.log(`Client disconnected: ${ip}`);

    clients.delete(ip);    clients.delete(ip);

        

    // 通知主机应用设备断开    // 通知主机应用设备断开

    broadcastToHost({    broadcastToHost({

      type: 'deviceDisconnected',      type: 'deviceDisconnected',

      ip      ip

    });    });

  });  });

});});



// 向主机应用广播消息// 向主机应用广播消息

function broadcastToHost(message) {function broadcastToHost(message) {

  // 假设主机IP是192.168.43.1（典型的Android热点IP）  // 假设主机IP是192.168.43.1（典型的Android热点IP）

  const hostClient = Array.from(clients.entries())  const hostClient = Array.from(clients.entries())

    .find(([ip]) => ip.includes('192.168.43.1'));    .find(([ip]) => ip.includes('192.168.43.1'));

    

  if (hostClient && hostClient[1].ws.readyState === WebSocket.OPEN) {  if (hostClient && hostClient[1].ws.readyState === WebSocket.OPEN) {

    hostClient[1].ws.send(JSON.stringify(message));    hostClient[1].ws.send(JSON.stringify(message));

  }  }

}}



// 启动服务器// 启动服务器

const PORT = process.env.PORT || 3000;const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {server.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);  console.log(`Server running on port ${PORT}`);

});});
