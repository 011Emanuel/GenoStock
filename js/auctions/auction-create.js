document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('createAuctionForm');
  const authBlock = document.getElementById('authBlock');
  const roleBlock = document.getElementById('roleBlock');
  const imageUrlList = document.getElementById('imageUrlList');
  const imagePreview = document.getElementById('imagePreview');
  const endsAtInput = document.getElementById('endsAt');

  const minDate = new Date(Date.now() + 3600000);
  endsAtInput.min = minDate.toISOString().slice(0, 16);

  if (!AuctionAPI.isAuthenticated()) {
    authBlock.classList.remove('d-none');
    return;
  }

  if (!AuctionAPI.isSeller()) {
    roleBlock.classList.remove('d-none');
    return;
  }

  form.classList.remove('d-none');

  document.getElementById('addImageBtn').addEventListener('click', addImageRow);

  function addImageRow(value = '') {
    const row = document.createElement('div');
    row.className = 'input-group mb-2';
    row.innerHTML = `
      <input type="url" class="form-control image-url-input" placeholder="https://..." value="${value}">
      <button type="button" class="btn btn-outline-secondary remove-image-btn">
        <i class="fas fa-times"></i>
      </button>
    `;
    row.querySelector('.remove-image-btn').addEventListener('click', () => {
      row.remove();
      updateRemoveButtons();
      updatePreview();
    });
    row.querySelector('input').addEventListener('input', updatePreview);
    imageUrlList.appendChild(row);
    updateRemoveButtons();
  }

  function updateRemoveButtons() {
    const rows = imageUrlList.querySelectorAll('.input-group');
    rows.forEach((row, i) => {
      row.querySelector('.remove-image-btn').style.display = rows.length > 1 ? '' : 'none';
    });
  }

  function getImageUrls() {
    return Array.from(document.querySelectorAll('.image-url-input'))
      .map(i => i.value.trim())
      .filter(Boolean);
  }

  function updatePreview() {
    const urls = getImageUrls();
    imagePreview.innerHTML = urls.map(url => `
      <img src="${url}" alt="Preview" onerror="this.style.display='none'">
    `).join('');
  }

  document.querySelector('.image-url-input').addEventListener('input', updatePreview);

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;

    try {
      const body = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        startingPrice: Number(document.getElementById('startingPrice').value),
        endsAt: new Date(document.getElementById('endsAt').value).toISOString(),
        images: getImageUrls()
      };

      const { auction } = await AuctionAPI.createAuction(body);
      AuctionUtils.showNotification('Auction created successfully.', 'success');
      setTimeout(() => {
        window.location.href = `auction-details.html?id=${auction.id}`;
      }, 800);
    } catch (err) {
      AuctionUtils.showNotification(err.message, 'danger');
      submitBtn.disabled = false;
    }
  });
});
