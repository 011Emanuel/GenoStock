const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { runMigrations } = require('./db/database');
const { createAuctionRouter } = require('./modules/auctions/auction.routes');
const auctionService = require('./modules/auctions/auction.service');

const PORT = process.env.PORT || 3001;
const ROOT = path.join(__dirname, '..');

runMigrations();
auctionService.seedSampleAuctions();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json({ limit: '5mb' }));

function broadcast(event, data) {
  io.emit(event, data);
  if (data?.auctionId) {
    io.to(`auction:${data.auctionId}`).emit(event, data);
  }
  if (data?.id && event === 'auction:created') {
    io.emit('auction:updated', data);
  }
}

app.use('/api/auctions', createAuctionRouter(broadcast));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', module: 'auctions' });
});

app.use(express.static(ROOT));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.includes('.')) {
    return next();
  }
  res.sendFile(path.join(ROOT, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('join:auction', (auctionId) => {
    socket.join(`auction:${auctionId}`);
  });

  socket.on('leave:auction', (auctionId) => {
    socket.leave(`auction:${auctionId}`);
  });
});

setInterval(() => {
  const finalized = auctionService.finalizeExpiredAuctions();
  for (const auction of finalized) {
    broadcast('auction:ended', { auctionId: auction.id, auction });
  }
}, 1000);

server.listen(PORT, () => {
  console.log(`GenoStock server running at http://localhost:${PORT}`);
  console.log(`Auctions API: http://localhost:${PORT}/api/auctions`);
});
