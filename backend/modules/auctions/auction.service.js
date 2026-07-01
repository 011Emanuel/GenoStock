const { getDb } = require('../../db/database');

function parseImages(row) {
  try {
    return JSON.parse(row.images || '[]');
  } catch {
    return [];
  }
}

function formatAuction(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    images: parseImages(row),
    startingPrice: row.starting_price,
    currentPrice: row.current_price,
    sellerUsername: row.seller_username,
    sellerName: row.seller_name,
    endsAt: row.ends_at,
    status: row.status,
    winnerUsername: row.winner_username,
    winnerName: row.winner_name,
    winningBid: row.winning_bid,
    createdAt: row.created_at,
    bidCount: row.bid_count ?? 0
  };
}

function formatBid(row) {
  return {
    id: row.id,
    auctionId: row.auction_id,
    bidderUsername: row.bidder_username,
    bidderName: row.bidder_name,
    amount: row.amount,
    createdAt: row.created_at
  };
}

function listAuctions({ status } = {}) {
  const db = getDb();
  let sql = `
    SELECT a.*, COUNT(b.id) AS bid_count
    FROM auctions a
    LEFT JOIN auction_bids b ON b.auction_id = a.id
  `;
  const params = [];

  if (status) {
    sql += ' WHERE a.status = ?';
    params.push(status);
  }

  sql += ' GROUP BY a.id ORDER BY a.ends_at ASC';

  const rows = db.prepare(sql).all(...params);
  db.close();
  return rows.map(formatAuction);
}

function getAuctionById(id) {
  const db = getDb();
  const row = db.prepare(`
    SELECT a.*, COUNT(b.id) AS bid_count
    FROM auctions a
    LEFT JOIN auction_bids b ON b.auction_id = a.id
    WHERE a.id = ?
    GROUP BY a.id
  `).get(id);
  db.close();
  return formatAuction(row);
}

function getBidHistory(auctionId) {
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM auction_bids
    WHERE auction_id = ?
    ORDER BY created_at DESC
  `).all(auctionId);
  db.close();
  return rows.map(formatBid);
}

function createAuction({ title, description, images, startingPrice, endsAt, seller }) {
  const db = getDb();
  const endsDate = new Date(endsAt);
  if (Number.isNaN(endsDate.getTime()) || endsDate <= new Date()) {
    db.close();
    throw new Error('End date must be in the future.');
  }
  if (!title?.trim() || !description?.trim()) {
    db.close();
    throw new Error('Title and description are required.');
  }
  if (startingPrice <= 0) {
    db.close();
    throw new Error('Starting price must be greater than zero.');
  }

  const result = db.prepare(`
    INSERT INTO auctions (title, description, images, starting_price, current_price, seller_username, seller_name, ends_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title.trim(),
    description.trim(),
    JSON.stringify(images || []),
    startingPrice,
    startingPrice,
    seller.username,
    seller.name,
    endsDate.toISOString()
  );

  const auction = getAuctionById(result.lastInsertRowid);
  db.close();
  return auction;
}

function placeBid(auctionId, { amount, bidder }) {
  const db = getDb();

  const finalizeExpired = db.transaction(() => {
    const auction = db.prepare('SELECT * FROM auctions WHERE id = ?').get(auctionId);
    if (!auction) {
      throw new Error('Auction not found.');
    }

    if (auction.status === 'ended' || new Date(auction.ends_at) <= new Date()) {
      if (auction.status === 'active') {
        finalizeAuctionRecord(db, auction);
      }
      throw new Error('This auction has ended. Bidding is closed.');
    }

    if (auction.seller_username === bidder.username) {
      throw new Error('Sellers cannot bid on their own auctions.');
    }

    const minBid = auction.current_price + 1;
    if (amount < minBid) {
      throw new Error(`Bid must be at least $${minBid.toFixed(2)} (greater than current offer).`);
    }

    const bidResult = db.prepare(`
      INSERT INTO auction_bids (auction_id, bidder_username, bidder_name, amount)
      VALUES (?, ?, ?, ?)
    `).run(auctionId, bidder.username, bidder.name, amount);

    db.prepare('UPDATE auctions SET current_price = ? WHERE id = ?').run(amount, auctionId);

    const bid = db.prepare('SELECT * FROM auction_bids WHERE id = ?').get(bidResult.lastInsertRowid);
    const updated = db.prepare('SELECT * FROM auctions WHERE id = ?').get(auctionId);

    return { bid: formatBid(bid), auction: formatAuction(updated) };
  });

  try {
    const result = finalizeExpired();
    db.close();
    return result;
  } catch (err) {
    db.close();
    throw err;
  }
}

function finalizeAuctionRecord(db, auction) {
  const topBid = db.prepare(`
    SELECT * FROM auction_bids
    WHERE auction_id = ?
    ORDER BY amount DESC, created_at ASC
    LIMIT 1
  `).get(auction.id);

  if (topBid) {
    db.prepare(`
      UPDATE auctions
      SET status = 'ended',
          winner_username = ?,
          winner_name = ?,
          winning_bid = ?,
          current_price = ?
      WHERE id = ?
    `).run(topBid.bidder_username, topBid.bidder_name, topBid.amount, topBid.amount, auction.id);
  } else {
    db.prepare(`
      UPDATE auctions SET status = 'ended' WHERE id = ?
    `).run(auction.id);
  }
}

function finalizeExpiredAuctions() {
  const db = getDb();
  const expired = db.prepare(`
    SELECT * FROM auctions
    WHERE status = 'active' AND ends_at <= datetime('now')
  `).all();

  const finalized = [];
  const tx = db.transaction(() => {
    for (const auction of expired) {
      finalizeAuctionRecord(db, auction);
      finalized.push(getAuctionById(auction.id));
    }
  });
  tx();
  db.close();
  return finalized;
}

function seedSampleAuctions() {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) AS c FROM auctions').get().c;
  db.close();

  if (count > 0) return;

  const samples = [
    {
      title: 'Premium Brahman Bull — Lot #101',
      description: 'Registered Brahman bull, 900 kg, excellent genetics for tropical climates. Full health certificate included.',
      images: ['https://static.vecteezy.com/system/resources/previews/024/940/349/non_2x/beef-cattle-breeder-american-brahman-red-on-the-ground-in-the-fram-big-male-brahman-cow-photo.jpg'],
      startingPrice: 1200,
      hoursFromNow: 48,
      seller: { username: 'rancher1', name: 'Juan Pérez' }
    },
    {
      title: 'Nelore Cow Pair — Lot #205',
      description: 'Two healthy Nelore cows, ideal for breeding program. Located in Chiriquí.',
      images: ['https://img.freepik.com/fotos-premium/ganado-vacuno-criador-brahman-americano-rojo-suelo-fram-vaca-brahman-macho-grande_532332-2481.jpg'],
      startingPrice: 800,
      hoursFromNow: 24,
      seller: { username: 'rancher2', name: 'María López' }
    },
    {
      title: 'Holstein Dairy Heifer — Lot #312',
      description: 'Young Holstein heifer with strong milk production lineage. Vaccinated and dewormed.',
      images: ['https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg'],
      startingPrice: 950,
      hoursFromNow: 72,
      seller: { username: 'rancher1', name: 'Juan Pérez' }
    }
  ];

  for (const s of samples) {
    const endsAt = new Date(Date.now() + s.hoursFromNow * 60 * 60 * 1000).toISOString();
    createAuction({
      title: s.title,
      description: s.description,
      images: s.images,
      startingPrice: s.startingPrice,
      endsAt,
      seller: s.seller
    });
  }
}

module.exports = {
  listAuctions,
  getAuctionById,
  getBidHistory,
  createAuction,
  placeBid,
  finalizeExpiredAuctions,
  seedSampleAuctions,
  formatAuction
};
