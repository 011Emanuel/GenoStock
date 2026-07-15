/**
 * Contador regresivo de la próxima subasta en línea (footer de la página).
 */
const AuctionCountdown = (function () {
  let targetDate = null;
  let sessionInfo = null;

  function setTarget(datetime, session) {
    targetDate = datetime;
    sessionInfo = session;
    updateDisplay();
    updateHeader();
  }

  function updateHeader() {
    const titleEl = document.getElementById('nextAuctionTitle');
    const dateEl = document.getElementById('nextAuctionDate');
    if (!titleEl || !sessionInfo) return;

    titleEl.textContent = sessionInfo.template.title;
    const iso = sessionInfo.date.toISOString();
    dateEl.textContent = `${AuctionUtils.formatFullDate(iso)} · ${sessionInfo.startTime}`;
  }

  function updateDisplay() {
    const container = document.getElementById('nextAuctionCountdown');
    if (!container || !targetDate) return;

    const cd = AuctionUtils.getCountdownParts(targetDate);
    const parts = cd.parts || { days: 0, hours: 0, minutes: 0, seconds: 0 };

    container.querySelector('[data-unit="days"]').textContent = String(parts.days).padStart(2, '0');
    container.querySelector('[data-unit="hours"]').textContent = String(parts.hours).padStart(2, '0');
    container.querySelector('[data-unit="minutes"]').textContent = String(parts.minutes).padStart(2, '0');
    container.querySelector('[data-unit="seconds"]').textContent = String(parts.seconds).padStart(2, '0');

    container.classList.toggle('is-live', cd.ended);
    if (cd.ended) {
      const titleEl = document.getElementById('nextAuctionTitle');
      if (titleEl) titleEl.textContent = '¡Subasta en curso!';
    }
  }

  function init() {
    const next = AuctionSchedule.getNextAuctionDateTime();
    if (next) {
      setTarget(next.datetime, next.session);
    } else {
      const titleEl = document.getElementById('nextAuctionTitle');
      const dateEl = document.getElementById('nextAuctionDate');
      if (titleEl) titleEl.textContent = 'Próximamente';
      if (dateEl) dateEl.textContent = 'Consulta la agenda para fechas';
    }
  }

  function tick() {
    if (targetDate) updateDisplay();
  }

  return { init, tick, setTarget };
})();

window.AuctionCountdown = AuctionCountdown;
