// Shared auth — mirrors login.js users; does not depend on Marketplace
const KNOWN_USERS = [
  { username: 'rancher1', name: 'Juan Pérez', role: 'rancher' },
  { username: 'rancher2', name: 'María López', role: 'rancher' },
  { username: 'trader1', name: 'Carlos Ruiz', role: 'trader' },
  { username: 'trader2', name: 'Ana Torres', role: 'trader' },
  { username: 'trader3', name: 'Luis Gómez', role: 'trader' }
];

const SELLER_ROLES = new Set(['rancher', 'buyer']);

function findUser(username) {
  return KNOWN_USERS.find(u => u.username === username);
}

function requireAuth(req, res, next) {
  const username = req.headers['x-username'];
  const role = req.headers['x-role'];
  const name = req.headers['x-name'] || username;

  if (!username || !role) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const known = findUser(username);
  req.user = {
    username,
    role,
    name: known ? known.name : name
  };
  next();
}

function requireSeller(req, res, next) {
  if (!SELLER_ROLES.has(req.user.role)) {
    return res.status(403).json({ error: 'Only sellers (ranchers) can create auctions.' });
  }
  next();
}

module.exports = { requireAuth, requireSeller, KNOWN_USERS, SELLER_ROLES };
