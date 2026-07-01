const express = require('express');
const { requireAuth, requireSeller } = require('../../middleware/auth');
const auctionService = require('./auction.service');

function createAuctionRouter(broadcast) {
  const router = express.Router();

  router.get('/', (req, res) => {
    try {
      auctionService.finalizeExpiredAuctions();
      const status = req.query.status || undefined;
      const auctions = auctionService.listAuctions({ status });
      res.json({ auctions });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', (req, res) => {
    try {
      auctionService.finalizeExpiredAuctions();
      const auction = auctionService.getAuctionById(Number(req.params.id));
      if (!auction) {
        return res.status(404).json({ error: 'Auction not found.' });
      }
      const bids = auctionService.getBidHistory(auction.id);
      res.json({ auction, bids });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id/bids', (req, res) => {
    try {
      const auction = auctionService.getAuctionById(Number(req.params.id));
      if (!auction) {
        return res.status(404).json({ error: 'Auction not found.' });
      }
      const bids = auctionService.getBidHistory(auction.id);
      res.json({ bids });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', requireAuth, requireSeller, (req, res) => {
    try {
      const { title, description, images, startingPrice, endsAt } = req.body;
      const auction = auctionService.createAuction({
        title,
        description,
        images: Array.isArray(images) ? images : [],
        startingPrice: Number(startingPrice),
        endsAt,
        seller: req.user
      });
      if (broadcast) broadcast('auction:created', auction);
      res.status(201).json({ auction });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/:id/bids', requireAuth, (req, res) => {
    try {
      const amount = Number(req.body.amount);
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid bid amount.' });
      }

      auctionService.finalizeExpiredAuctions();
      const { bid, auction } = auctionService.placeBid(Number(req.params.id), {
        amount,
        bidder: req.user
      });

      const payload = { auctionId: auction.id, bid, auction };
      if (broadcast) broadcast('auction:bid', payload);

      res.status(201).json(payload);
    } catch (err) {
      const status = err.message.includes('ended') ? 403 : 400;
      res.status(status).json({ error: err.message });
    }
  });

  return router;
}

module.exports = { createAuctionRouter };
