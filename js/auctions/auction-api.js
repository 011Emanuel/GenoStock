/**
 * Shared Auction API client — independent from Marketplace.
 * Sends auth headers from localStorage (same session as login.js).
 */
const AuctionAPI = (function () {
  const DEFAULT_BASE = window.location.port === '3001'
    ? ''
    : 'http://localhost:3001';

  let socket = null;
  let socketListeners = new Map();

  function getBaseUrl() {
    return window.AUCTION_API_BASE || DEFAULT_BASE;
  }

  function getAuthHeaders() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name') || username;
    const headers = { 'Content-Type': 'application/json' };
    if (username) headers['X-Username'] = username;
    if (role) headers['X-Role'] = role;
    if (name) headers['X-Name'] = name;
    return headers;
  }

  function isAuthenticated() {
    return Boolean(localStorage.getItem('username') && localStorage.getItem('role'));
  }

  function isSeller() {
    const role = localStorage.getItem('role');
    return role === 'rancher' || role === 'buyer';
  }

  async function request(path, options = {}) {
    const url = `${getBaseUrl()}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: { ...getAuthHeaders(), ...(options.headers || {}) }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data;
  }

  function connectSocket() {
    if (socket) return socket;
    const base = getBaseUrl() || window.location.origin;
    if (typeof io === 'undefined') return null;

    socket = io(base, { transports: ['websocket', 'polling'] });

    socket.on('auction:bid', (payload) => emit('auction:bid', payload));
    socket.on('auction:ended', (payload) => emit('auction:ended', payload));
    socket.on('auction:created', (payload) => emit('auction:created', payload));
    socket.on('auction:updated', (payload) => emit('auction:updated', payload));

    return socket;
  }

  function emit(event, data) {
    const listeners = socketListeners.get(event) || [];
    listeners.forEach(fn => fn(data));
  }

  function on(event, callback) {
    if (!socketListeners.has(event)) socketListeners.set(event, []);
    socketListeners.get(event).push(callback);
    connectSocket();
    return () => off(event, callback);
  }

  function off(event, callback) {
    const list = socketListeners.get(event);
    if (!list) return;
    const idx = list.indexOf(callback);
    if (idx >= 0) list.splice(idx, 1);
  }

  function joinAuction(auctionId) {
    connectSocket()?.emit('join:auction', auctionId);
  }

  function leaveAuction(auctionId) {
    connectSocket()?.emit('leave:auction', auctionId);
  }

  return {
    getBaseUrl,
    isAuthenticated,
    isSeller,
    getAuthHeaders,
    listAuctions: (status) => request(`/api/auctions${status ? `?status=${status}` : ''}`),
    getAuction: (id) => request(`/api/auctions/${id}`),
    getBids: (id) => request(`/api/auctions/${id}/bids`),
    createAuction: (body) => request('/api/auctions', { method: 'POST', body: JSON.stringify(body) }),
    placeBid: (id, amount) => request(`/api/auctions/${id}/bids`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    }),
    connectSocket,
    joinAuction,
    leaveAuction,
    on,
    off
  };
})();

window.AuctionAPI = AuctionAPI;
