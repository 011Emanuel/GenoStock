-- Auctions module schema (independent from Marketplace)

CREATE TABLE IF NOT EXISTS auctions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT NOT NULL DEFAULT '[]',
  starting_price REAL NOT NULL,
  current_price REAL NOT NULL,
  seller_username TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  winner_username TEXT,
  winner_name TEXT,
  winning_bid REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS auction_bids (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  auction_id INTEGER NOT NULL,
  bidder_username TEXT NOT NULL,
  bidder_name TEXT NOT NULL,
  amount REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_ends_at ON auctions(ends_at);
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction_id ON auction_bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_bids_created_at ON auction_bids(created_at);
