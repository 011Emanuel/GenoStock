document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('auctionsGrid');
  const loading = document.getElementById('auctionsLoading');
  const errorEl = document.getElementById('auctionsError');
  const emptyEl = document.getElementById('auctionsEmpty');
  const createBtn = document.getElementById('createAuctionBtn');

  let currentFilter = 'active';
  let auctions = [];
  let countdownTimer = null;

  if (AuctionAPI.isSeller()) {
    createBtn.style.display = 'inline-block';
  }

  document.querySelectorAll('.auction-filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.auction-filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      renderAuctions();
    });
  });

  function filteredAuctions() {
    if (currentFilter === 'all') return auctions;
    return auctions.filter(a => a.status === currentFilter);
  }

  function renderAuctionCard(auction) {
    const image = auction.images[0] || 'https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg';
    const countdown = AuctionUtils.getCountdownParts(auction.endsAt);
    const countdownClass = auction.status === 'ended' || countdown.ended
      ? 'ended'
      : countdown.urgent ? 'urgent' : '';

    return `
      <div class="col-md-6 col-lg-4" data-auction-id="${auction.id}">
        <div class="auction-card">
          <img src="${image}" class="auction-card-image" alt="${auction.title}">
          <div class="auction-card-body">
            <span class="auction-status-badge ${auction.status}">${auction.status === 'active' ? 'Activa' : 'Finalizada'}</span>
            <h5 class="auction-card-title mt-2">${auction.title}</h5>
            <p class="auction-current-price">${AuctionUtils.formatCurrency(auction.currentPrice)}</p>
            <p class="auction-meta"><i class="fas fa-user"></i> ${auction.sellerName}</p>
            <p class="auction-meta"><i class="fas fa-gavel"></i> ${auction.bidCount} oferta(s)</p>
            <div class="auction-countdown ${countdownClass}" data-ends-at="${auction.endsAt}" data-status="${auction.status}">
              <i class="fas fa-clock"></i>
              <span class="countdown-text">${auction.status === 'ended' || countdown.ended ? 'Finalizada' : countdown.text}</span>
            </div>
            <a href="auction-details.html?id=${auction.id}" class="btn btn-dark-green w-100 mt-3">
              <i class="fas fa-eye"></i> Ver subasta
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function renderAuctions() {
    const list = filteredAuctions();
    loading.classList.add('d-none');

    if (list.length === 0) {
      grid.classList.add('d-none');
      emptyEl.classList.remove('d-none');
      return;
    }

    emptyEl.classList.add('d-none');
    grid.classList.remove('d-none');
    grid.innerHTML = list.map(renderAuctionCard).join('');
    updateCountdowns();
  }

  function updateCountdowns() {
    document.querySelectorAll('.auction-countdown, .agenda-event-countdown[data-ends-at]').forEach(el => {
      const status = el.dataset.status;
      if (status === 'ended') return;

      const cd = AuctionUtils.getCountdownParts(el.dataset.endsAt);
      const textEl = el.querySelector('.countdown-text');
      if (cd.ended) {
        el.classList.add('ended');
        if (textEl) textEl.textContent = 'Finalizada';
      } else {
        el.classList.toggle('urgent', cd.urgent);
        if (textEl) textEl.textContent = cd.text;
      }
    });
  }

  async function loadAuctions() {
    try {
      errorEl.classList.add('d-none');
      const data = await AuctionAPI.listAuctions();
      auctions = data.auctions;
      AuctionSchedule.render(auctions);
      AuctionLots.render(auctions);
      renderAuctions();
    } catch (err) {
      loading.classList.add('d-none');
      AuctionSchedule.render([]);
      AuctionLots.render([]);
      errorEl.textContent = 'No se pudo conectar con el servidor de subastas. Ejecuta: cd backend && npm install && npm start';
      errorEl.classList.remove('d-none');
    }
  }

  function refreshAuction(updated) {
    const idx = auctions.findIndex(a => a.id === updated.id);
    if (idx >= 0) {
      auctions[idx] = { ...auctions[idx], ...updated };
    } else {
      auctions.push(updated);
    }
    AuctionSchedule.render(auctions);
    AuctionLots.render(auctions);
    renderAuctions();
  }

  AuctionAPI.connectSocket();
  AuctionAPI.on('auction:bid', ({ auction }) => refreshAuction(auction));
  AuctionAPI.on('auction:ended', ({ auction }) => refreshAuction(auction));
  AuctionAPI.on('auction:created', (auction) => {
    auctions.unshift(auction);
    AuctionSchedule.render(auctions);
    AuctionLots.render(auctions);
    renderAuctions();
  });

  AuctionCountdown.init();
  loadAuctions();
  countdownTimer = setInterval(function () {
    updateCountdowns();
    AuctionCountdown.tick();
  }, 1000);

  AuctionSchedule.render([]);
  AuctionLots.render([]);
});
