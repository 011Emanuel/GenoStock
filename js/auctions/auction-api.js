/**
 * Shared Auction API client with Supabase & REST/Socket.io dual support.
 */
const AuctionAPI = (function () {
  const DEFAULT_BASE = window.location.port === '3001'
    ? ''
    : 'http://localhost:3001';

  let socket = null;
  let socketListeners = new Map();
  let supabaseChannel = null;

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

  function getSupabase() {
    return (window.getSupabase && window.isSupabaseConfigured && window.isSupabaseConfigured())
      ? window.getSupabase()
      : null;
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
    const supabase = getSupabase();
    if (supabase) {
      if (!supabaseChannel) {
        supabaseChannel = supabase
          .channel('public:auctions_and_bids')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids' }, (payload) => {
            emit('auction:bid', payload.new);
          })
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'auctions' }, (payload) => {
            emit('auction:created', payload.new);
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'auctions' }, (payload) => {
            emit('auction:updated', payload.new);
            if (payload.new.status === 'ended') {
              emit('auction:ended', payload.new);
            }
          })
          .subscribe();
      }
      return supabaseChannel;
    }

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
    if (socket) socket.emit('join:auction', auctionId);
  }

  function leaveAuction(auctionId) {
    if (socket) socket.emit('leave:auction', auctionId);
  }

  // Supabase Database CRUD wrappers with REST fallbacks
  async function listAuctions(status) {
    const supabase = getSupabase();
    if (supabase) {
      let query = supabase.from('auctions').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data;
    }
    return request(`/api/auctions${status ? `?status=${status}` : ''}`);
  }

  async function getAuction(id) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('auctions').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data;
    }
    return request(`/api/auctions/${id}`);
  }

  async function getBids(id) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('bids').select('*').eq('auction_id', id).order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    }
    return request(`/api/auctions/${id}/bids`);
  }

  async function createAuction(body) {
    const supabase = getSupabase();
    if (supabase) {
      const user = await window.getCurrentUser();
      const newAuction = {
        title: body.title,
        breed: body.breed || 'Standard',
        starting_price: parseFloat(body.startingPrice || body.starting_price),
        current_price: parseFloat(body.startingPrice || body.starting_price),
        min_bid_increment: parseFloat(body.minIncrement || body.min_bid_increment || 100),
        status: 'active',
        ends_at: body.endsAt || body.ends_at,
        seller_id: user ? user.id : null
      };

      const { data, error } = await supabase.from('auctions').insert([newAuction]).select().single();
      if (error) throw new Error(error.message);
      return data;
    }
    return request('/api/auctions', { method: 'POST', body: JSON.stringify(body) });
  }

  async function placeBid(id, amount) {
    const supabase = getSupabase();
    if (supabase) {
      const user = await window.getCurrentUser();
      const bidderName = user?.user_metadata?.full_name || localStorage.getItem('username') || 'Bidder';
      
      const { data: auction, error: fetchErr } = await supabase.from('auctions').select('*').eq('id', id).single();
      if (fetchErr) throw new Error(fetchErr.message);

      if (auction.status !== 'active') throw new Error('Esta subasta ha finalizado');
      if (amount <= auction.current_price) throw new Error(`La puja debe ser mayor que $${auction.current_price}`);

      // Insert bid
      const { data: bid, error: bidErr } = await supabase.from('bids').insert([{
        auction_id: id,
        bidder_id: user?.id,
        bidder_name: bidderName,
        amount: amount
      }]).select().single();

      if (bidErr) throw new Error(bidErr.message);

      // Update current price in auction
      await supabase.from('auctions').update({ current_price: amount }).eq('id', id);

      return bid;
    }
    return request(`/api/auctions/${id}/bids`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  }

  return {
    getBaseUrl,
    isAuthenticated,
    isSeller,
    getAuthHeaders,
    listAuctions,
    getAuction,
    getBids,
    createAuction,
    placeBid,
    connectSocket,
    joinAuction,
    leaveAuction,
    on,
    off
  };
})();

window.AuctionAPI = AuctionAPI;
