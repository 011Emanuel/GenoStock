/**
 * Shared Auction API client with Supabase (cloud) and REST/Socket.io (local) support.
 * When Supabase is configured, all reads and writes go to the cloud database.
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

  function parseImages(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (!value) return [];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch {
        return value.startsWith('http') ? [value] : [];
      }
    }
    return [];
  }

  function normalizeAuction(row) {
    if (!row) return null;
    if (row.currentPrice !== undefined && row.startingPrice !== undefined && !row.starting_price) {
      return {
        ...row,
        images: parseImages(row.images)
      };
    }

    const seller = row.seller || row.profiles || {};
    const bidRel = row.bids;
    let bidCount = row.bid_count ?? row.bidCount ?? 0;
    if (Array.isArray(bidRel)) {
      if (bidRel[0] && typeof bidRel[0].count === 'number') bidCount = bidRel[0].count;
      else bidCount = bidRel.length;
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description || '',
      images: parseImages(row.images),
      breed: row.breed || '',
      startingPrice: Number(row.starting_price ?? row.startingPrice ?? 0),
      currentPrice: Number(row.current_price ?? row.currentPrice ?? 0),
      sellerId: row.seller_id || row.sellerId || null,
      sellerUsername: row.seller_username || seller.username || '',
      sellerName: row.seller_name || seller.full_name || seller.username || 'Seller',
      endsAt: row.ends_at || row.endsAt,
      status: row.status,
      winnerId: row.winner_id || row.winnerId || null,
      winnerUsername: row.winner_username || row.winnerUsername || null,
      winnerName: row.winner_name || row.winnerName || null,
      winningBid: row.winning_bid ?? row.winningBid ?? null,
      createdAt: row.created_at || row.createdAt,
      bidCount,
      cattleId: row.cattle_id || row.cattleId || null
    };
  }

  function normalizeBid(row) {
    if (!row) return null;
    if (row.bidderName !== undefined && row.auctionId !== undefined && !row.auction_id) {
      return row;
    }
    return {
      id: row.id,
      auctionId: row.auction_id ?? row.auctionId,
      bidderId: row.bidder_id ?? row.bidderId ?? null,
      bidderUsername: row.bidder_username || row.bidderUsername || '',
      bidderName: row.bidder_name || row.bidderName || 'Bidder',
      amount: Number(row.amount),
      createdAt: row.created_at || row.createdAt
    };
  }

  function auctionSelect() {
    return '*, seller:profiles!seller_id(username, full_name), bids(count)';
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

  function emit(event, data) {
    const listeners = socketListeners.get(event) || [];
    listeners.forEach(fn => fn(data));
  }

  function connectSocket() {
    const supabase = getSupabase();
    if (supabase) {
      if (!supabaseChannel) {
        supabaseChannel = supabase
          .channel('public:auctions_and_bids')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids' }, async (payload) => {
            const bid = normalizeBid(payload.new);
            try {
              const { data } = await supabase.from('auctions').select(auctionSelect()).eq('id', bid.auctionId).single();
              const auction = normalizeAuction(data);
              emit('auction:bid', { auctionId: bid.auctionId, bid, auction });
            } catch {
              emit('auction:bid', { auctionId: bid.auctionId, bid, auction: null });
            }
          })
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'auctions' }, (payload) => {
            emit('auction:created', normalizeAuction(payload.new));
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'auctions' }, (payload) => {
            const auction = normalizeAuction(payload.new);
            emit('auction:updated', auction);
            if (auction.status === 'ended') {
              emit('auction:ended', { auctionId: auction.id, auction });
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

  async function listAuctions(status) {
    const supabase = getSupabase();
    if (supabase) {
      const run = (columns) => {
        let query = supabase.from('auctions').select(columns).order('created_at', { ascending: false });
        if (status) query = query.eq('status', status);
        return query;
      };
      let { data, error } = await run(auctionSelect());
      if (error) ({ data, error } = await run('*'));
      if (error) throw new Error(error.message);
      return { auctions: (data || []).map(normalizeAuction) };
    }
    return request(`/api/auctions${status ? `?status=${status}` : ''}`);
  }

  async function getAuction(id) {
    const supabase = getSupabase();
    if (supabase) {
      let { data, error } = await supabase.from('auctions').select(auctionSelect()).eq('id', id).single();
      if (error) ({ data, error } = await supabase.from('auctions').select('*').eq('id', id).single());
      if (error) throw new Error(error.message);
      const { data: bidRows, error: bidErr } = await supabase
        .from('bids')
        .select('*')
        .eq('auction_id', id)
        .order('created_at', { ascending: false });
      if (bidErr) throw new Error(bidErr.message);
      return {
        auction: normalizeAuction(data),
        bids: (bidRows || []).map(normalizeBid)
      };
    }
    return request(`/api/auctions/${id}`);
  }

  async function getBids(id) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('auction_id', id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return { bids: (data || []).map(normalizeBid) };
    }
    return request(`/api/auctions/${id}/bids`);
  }

  async function createAuction(body) {
    const supabase = getSupabase();
    if (supabase) {
      const user = await window.getCurrentUser();
      if (!user || !user.id || String(user.id).startsWith('local-')) {
        throw new Error('You must sign in with a Supabase account to publish to the database.');
      }

      if (window.ensureUserProfile) {
        const { error: profileErr } = await window.ensureUserProfile(user);
        if (profileErr) {
          throw new Error('Could not save the seller profile. Run supabase-schema.sql in the SQL Editor.');
        }
      }

      const startingPrice = parseFloat(body.startingPrice || body.starting_price);
      const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];
      const breed = body.breed || 'Standard';
      const sellerName = user.user_metadata?.full_name || localStorage.getItem('name') || localStorage.getItem('username') || 'Seller';
      const sellerUsername = user.user_metadata?.username || localStorage.getItem('username') || '';

      let cattleId = null;
      const { data: cattle, error: cattleErr } = await supabase.from('cattle').insert([{
        seller_id: user.id,
        title: body.title,
        breed,
        price: startingPrice,
        location: user.user_metadata?.location || localStorage.getItem('location') || null,
        image_url: images[0] || null,
        description: body.description || null,
        status: 'active'
      }]).select('id').single();

      if (cattleErr) {
        console.error('GenoStock: cattle insert failed:', cattleErr);
        throw new Error(cattleErr.message || 'Could not save the livestock listing to the database.');
      }
      cattleId = cattle?.id || null;

      const newAuction = {
        title: body.title,
        description: body.description || '',
        images,
        breed,
        starting_price: startingPrice,
        current_price: startingPrice,
        min_bid_increment: parseFloat(body.minIncrement || body.min_bid_increment || 100),
        status: 'active',
        ends_at: body.endsAt || body.ends_at,
        seller_id: user.id,
        seller_name: sellerName,
        seller_username: sellerUsername,
        cattle_id: cattleId
      };

      let { data, error } = await supabase.from('auctions').insert([newAuction]).select(auctionSelect()).single();
      if (error && /column|schema cache/i.test(error.message || '')) {
        const minimal = {
          title: newAuction.title,
          breed,
          starting_price: startingPrice,
          current_price: startingPrice,
          min_bid_increment: newAuction.min_bid_increment,
          status: 'active',
          ends_at: newAuction.ends_at,
          seller_id: user.id,
          cattle_id: cattleId
        };
        const retry = await supabase.from('auctions').insert([minimal]).select(auctionSelect()).single();
        data = retry.data;
        error = retry.error;
      }
      if (error) {
        throw new Error(error.message || 'Could not save the auction to the database. Run supabase-schema.sql in the SQL Editor.');
      }
      return { auction: normalizeAuction(data) };
    }

    return request('/api/auctions', { method: 'POST', body: JSON.stringify(body) });
  }

  async function placeBid(id, amount) {
    const supabase = getSupabase();
    if (supabase) {
      const user = await window.getCurrentUser();
      if (!user || !user.id || String(user.id).startsWith('local-')) {
        throw new Error('You must sign in with a Supabase account to place a bid.');
      }

      if (window.ensureUserProfile) {
        await window.ensureUserProfile(user);
      }

      const bidderName = user.user_metadata?.full_name || localStorage.getItem('username') || 'Bidder';

      const { data: auctionRow, error: fetchErr } = await supabase.from('auctions').select('*').eq('id', id).single();
      if (fetchErr) throw new Error(fetchErr.message);

      const auction = normalizeAuction(auctionRow);
      if (auction.status !== 'active') throw new Error('This auction has ended.');
      if (amount <= auction.currentPrice) throw new Error(`The bid must be higher than $${auction.currentPrice}`);
      if (auction.sellerId && auction.sellerId === user.id) {
        throw new Error('You cannot bid on your own auction.');
      }

      const { data: bidRow, error: bidErr } = await supabase.from('bids').insert([{
        auction_id: id,
        bidder_id: user.id,
        bidder_name: bidderName,
        amount: amount
      }]).select().single();

      if (bidErr) throw new Error(bidErr.message);

      // Prefer the DB trigger to raise current_price (bidders cannot update another seller's row).
      // Refetch so the UI still gets the new price if the client UPDATE is blocked by RLS.
      await supabase.from('auctions').update({ current_price: amount }).eq('id', id);
      const refreshed = await getAuction(id);

      return {
        auctionId: id,
        bid: normalizeBid(bidRow),
        auction: refreshed.auction
      };
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
