# Livestock Auctions Module

Independent module from Marketplace. Does not modify `marketplace.html` or `js/marketplace.js`.

## Structure

```
backend/
  server.js                    # Express + Socket.io server
  package.json
  migrations/
    001_create_auctions.sql    # auctions and auction_bids tables
  db/
    database.js                # SQLite + migrations
    migrate.js
  middleware/
    auth.js                    # Shared auth (headers)
  modules/auctions/
    auction.service.js         # Business logic
    auction.routes.js          # REST endpoints

auctions.html                  # Auction listing
auction-details.html           # Detail, bids, and history
auction-create.html            # Create auction (sellers)
css/auctions.css
js/auctions/
  auction-api.js               # API client + WebSocket
  auction-utils.js             # UI utilities
  auctions-list.js
  auction-details.js
  auction-create.js
```

## Database

| Table | Main fields |
|-------|-------------|
| `auctions` | title, description, images (JSON), starting_price, current_price, seller, ends_at, status, winner |
| `auction_bids` | auction_id, bidder, amount, created_at |

## API Endpoints

| Method | Route | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/auctions` | No | List auctions (`?status=active\|ended`) |
| GET | `/api/auctions/:id` | No | Detail + bid history |
| GET | `/api/auctions/:id/bids` | No | Bid history only |
| POST | `/api/auctions` | Yes (rancher/buyer) | Create auction |
| POST | `/api/auctions/:id/bids` | Yes | Place bid |

Auth headers (from existing login localStorage):
- `X-Username`, `X-Role`, `X-Name`

## Real-time (Socket.io)

Events emitted:
- `auction:bid` — new bid
- `auction:ended` — auction finished
- `auction:created` — new auction published

## Business rules

- Bid must be **greater** than the current offer (minimum: current_price + 1)
- No bids allowed on ended auctions
- Sellers cannot bid on their own auctions
- On end: bids are blocked and winner is selected automatically
- Full history stored in `auction_bids`

## Setup

```bash
cd backend
npm install
npm start
```

Open: **http://localhost:3001/auctions.html**

Test users (existing login):
- Seller: `rancher1@email.com` / `1234`
- Buyer: `trader1@email.com` / `1234`

## Marketplace

Marketplace remains unchanged in `marketplace.html`. Only an "Auctions" link was added to the shared header.
