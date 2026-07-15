document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const auctionId = Number(params.get('id'));

  if (!auctionId) {
    showError('Invalid auction ID.');
    return;
  }

  let auction = null;
  let bids = [];
  let countdownTimer = null;

  const els = {
    loading: document.getElementById('detailLoading'),
    error: document.getElementById('detailError'),
    content: document.getElementById('detailContent'),
    title: document.getElementById('auctionTitle'),
    breadcrumb: document.getElementById('breadcrumbTitle'),
    description: document.getElementById('auctionDescription'),
    sellerName: document.getElementById('sellerName'),
    endsAtLabel: document.getElementById('endsAtLabel'),
    currentPrice: document.getElementById('currentPrice'),
    leaderName: document.getElementById('leaderName'),
    countdown: document.getElementById('detailCountdown'),
    mainImage: document.getElementById('mainImage'),
    thumbnailRow: document.getElementById('thumbnailRow'),
    bidHistory: document.getElementById('bidHistory'),
    bidForm: document.getElementById('bidForm'),
    bidAmount: document.getElementById('bidAmount'),
    minBidHint: document.getElementById('minBidHint'),
    bidAuthWarning: document.getElementById('bidAuthWarning'),
    bidClosedMsg: document.getElementById('bidClosedMsg'),
    bidSubmitBtn: document.getElementById('bidSubmitBtn'),
    winnerBanner: document.getElementById('winnerBanner'),
    winnerText: document.getElementById('winnerText')
  };

  function showError(msg) {
    els.loading.classList.add('d-none');
    els.error.textContent = msg;
    els.error.classList.remove('d-none');
  }

  function isActive() {
    return auction && auction.status === 'active' && new Date(auction.endsAt) > new Date();
  }

  function renderGallery() {
    const images = auction.images.length
      ? auction.images
      : ['https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg'];

    els.mainImage.src = images[0];
    els.thumbnailRow.innerHTML = images.map((src, i) => `
      <img src="${src}" alt="Image ${i + 1}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;cursor:pointer;border:2px solid ${i === 0 ? '#2c5530' : '#ddd'};"
           data-index="${i}">
    `).join('');

    els.thumbnailRow.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => {
        els.mainImage.src = img.src;
        els.thumbnailRow.querySelectorAll('img').forEach(t => t.style.borderColor = '#ddd');
        img.style.borderColor = '#2c5530';
      });
    });
  }

  function renderBidHistory() {
    if (!bids.length) {
      els.bidHistory.innerHTML = '<p class="text-muted text-center py-4 mb-0">No bids yet</p>';
      els.leaderName.textContent = '—';
      return;
    }

    els.leaderName.textContent = bids[0].bidderName;
    els.bidHistory.innerHTML = bids.map((b, i) => `
      <div class="bid-history-item">
        <div>
          ${i === 0 ? '<i class="fas fa-crown text-warning me-1"></i>' : ''}
          <strong>${b.bidderName}</strong>
          <div class="bid-time">${AuctionUtils.formatDateTime(b.createdAt)}</div>
        </div>
        <span class="bid-amount">${AuctionUtils.formatCurrency(b.amount)}</span>
      </div>
    `).join('');
  }

  function updateCountdown() {
    if (!auction) return;
    const cd = AuctionUtils.getCountdownParts(auction.endsAt);

    if (auction.status === 'ended' || cd.ended) {
      els.countdown.textContent = 'ENDED';
      els.countdown.classList.add('ended');
      disableBidding();
      return;
    }

    els.countdown.textContent = cd.text;
    els.countdown.classList.toggle('ended', false);
  }

  function disableBidding() {
    els.bidForm.classList.add('d-none');
    els.bidClosedMsg.classList.remove('d-none');
  }

  function updateBidUI() {
    const minBid = auction.currentPrice + 1;
    els.minBidHint.textContent = `Minimum bid: ${AuctionUtils.formatCurrency(minBid)}`;
    els.bidAmount.min = minBid;
    els.bidAmount.placeholder = minBid.toFixed(2);

    if (!AuctionAPI.isAuthenticated()) {
      els.bidAuthWarning.classList.remove('d-none');
      els.bidSubmitBtn.disabled = true;
      return;
    }

    els.bidAuthWarning.classList.add('d-none');
    els.bidSubmitBtn.disabled = !isActive();

    if (!isActive()) {
      disableBidding();
    }

    if (auction.winnerUsername) {
      els.winnerBanner.classList.remove('d-none');
      els.winnerText.textContent = `Winner: ${auction.winnerName} — ${AuctionUtils.formatCurrency(auction.winningBid)}`;
    } else if (auction.status === 'ended') {
      els.winnerBanner.classList.remove('d-none');
      els.winnerText.textContent = 'Auction ended with no bids.';
    }
  }

  function renderAll() {
    els.title.textContent = auction.title;
    els.breadcrumb.textContent = auction.title;
    els.description.textContent = auction.description;
    els.sellerName.textContent = auction.sellerName;
    els.endsAtLabel.textContent = AuctionUtils.formatDateTime(auction.endsAt);
    els.currentPrice.textContent = AuctionUtils.formatCurrency(auction.currentPrice);

    renderGallery();
    renderBidHistory();
    updateCountdown();
    updateBidUI();

    els.loading.classList.add('d-none');
    els.content.classList.remove('d-none');
  }

  async function loadAuction() {
    try {
      const data = await AuctionAPI.getAuction(auctionId);
      auction = data.auction;
      bids = data.bids;
      renderAll();
    } catch (err) {
      showError(err.message || 'Could not load the auction.');
    }
  }

  els.bidForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!AuctionAPI.isAuthenticated()) {
      AuctionUtils.showNotification('You must log in to place a bid.', 'warning');
      return;
    }

    const amount = Number(els.bidAmount.value);
    try {
      els.bidSubmitBtn.disabled = true;
      const result = await AuctionAPI.placeBid(auctionId, amount);
      auction = result.auction;
      bids.unshift(result.bid);
      renderAll();
      els.bidAmount.value = '';
      AuctionUtils.showNotification('Bid placed successfully!', 'success');
    } catch (err) {
      AuctionUtils.showNotification(err.message, 'danger');
    } finally {
      if (isActive()) els.bidSubmitBtn.disabled = false;
    }
  });

  AuctionAPI.connectSocket();
  AuctionAPI.joinAuction(auctionId);

  AuctionAPI.on('auction:bid', ({ auctionId: id, bid, auction: updated }) => {
    if (id !== auctionId) return;
    auction = updated;
    const exists = bids.some(b => b.id === bid.id);
    if (!exists) bids.unshift(bid);
    els.currentPrice.textContent = AuctionUtils.formatCurrency(auction.currentPrice);
    renderBidHistory();
    updateBidUI();
  });

  AuctionAPI.on('auction:ended', ({ auctionId: id, auction: updated }) => {
    if (id !== auctionId) return;
    auction = updated;
    renderAll();
  });

  loadAuction();
  countdownTimer = setInterval(updateCountdown, 1000);

  window.addEventListener('beforeunload', () => {
    AuctionAPI.leaveAuction(auctionId);
    clearInterval(countdownTimer);
  });
});
