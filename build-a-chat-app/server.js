import http from "http";
import fs from "fs";
import { WebSocketServer, WebSocket } from "ws";

const PORT = 3001;

const server = http.createServer((req, res) => {
  const isScript = req.url === "/script.js";
  const filePath = isScript ? "./public/script.js" : "./public/index.html";
  const contentType = isScript ? "application/javascript" : "text/html";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading page");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

function broadcast(message) {
  const payload = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

wss.on("connection", (socket, req) => {
  const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",
  );

  broadcast({ type: "system", text: `${username} joined` });

  socket.on("message", (data) => {
    try {
      const { username, text } = JSON.parse(data.toString());
      broadcast({ type: "chat", username, text });
    } catch (err) {
      console.error("Invalid message:", err.message);
    }
  });

  socket.on("close", () => {
    broadcast({ type: "system", text: `${username} left` });
  });
});

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});
