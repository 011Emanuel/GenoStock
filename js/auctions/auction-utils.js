function formatCurrency(amount) {
  return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('es-PA', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function getCountdownParts(endsAt) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return { ended: true, text: 'Finalizada', parts: null };

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  let text;
  if (days > 0) {
    text = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else {
    text = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return { ended: false, text, urgent: diff < 3600000, parts: { days, hours, minutes, seconds } };
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
  notification.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

window.AuctionUtils = { formatCurrency, formatDateTime, getCountdownParts, showNotification };
