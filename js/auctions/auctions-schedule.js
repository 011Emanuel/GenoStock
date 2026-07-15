/**
 * Renders the auction agenda — weekly sessions + dynamic events from live auctions.
 */
const AuctionSchedule = (function () {
  const RECURRING_SESSIONS = [
    {
      weekday: 2,
      label: 'Martes',
      title: 'Subasta de engorde',
      startHour: 9,
      startMinute: 0,
      endHour: 12,
      endMinute: 0,
      icon: 'fa-cow'
    },
    {
      weekday: 4,
      label: 'Jueves',
      title: 'Subasta de reproductores',
      startHour: 14,
      startMinute: 0,
      endHour: 17,
      endMinute: 0,
      icon: 'fa-dna'
    },
    {
      weekday: 6,
      label: 'Sábado',
      title: 'Gran remate especial',
      startHour: 8,
      startMinute: 0,
      endHour: 11,
      endMinute: 0,
      icon: 'fa-star'
    }
  ];


  function formatSessionTime(hour, minute) {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d.toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' });
  }

  function getNextSessionDates(count = 6) {
    const sessions = [];
    const seen = new Set();
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    for (let week = 0; sessions.length < count && week < 8; week++) {
      for (const template of RECURRING_SESSIONS) {
        const sessionDate = new Date(start);
        sessionDate.setDate(start.getDate() + week * 7);

        const dayDiff = (template.weekday - sessionDate.getDay() + 7) % 7;
        sessionDate.setDate(sessionDate.getDate() + dayDiff);

        const key = `${sessionDate.toISOString().slice(0, 10)}-${template.weekday}`;
        if (seen.has(key)) continue;
        seen.add(key);

        sessions.push({
          key,
          date: sessionDate,
          template,
          startTime: formatSessionTime(template.startHour, template.startMinute),
          endTime: formatSessionTime(template.endHour, template.endMinute)
        });

        if (sessions.length >= count) break;
      }
    }

    return sessions.sort((a, b) => a.date - b.date).slice(0, count);
  }

  function isSessionLive(session, auctions) {
    const now = new Date();
    const start = new Date(session.date);
    start.setHours(session.template.startHour, session.template.startMinute, 0, 0);
    const end = new Date(session.date);
    end.setHours(session.template.endHour, session.template.endMinute, 0, 0);

    const activeOnDay = auctions.filter(a => {
      if (a.status !== 'active') return false;
      return AuctionUtils.dateKey(a.endsAt) === AuctionUtils.dateKey(session.date.toISOString());
    });

    if (activeOnDay.length > 0 && now >= start && now <= end) return true;
    if (activeOnDay.length > 0 && now < end && now.toDateString() === session.date.toDateString()) return true;
    return false;
  }

  function countLotsForSession(session, auctions) {
    return auctions.filter(a => {
      if (a.status !== 'active') return false;
      return AuctionUtils.dateKey(a.endsAt) === AuctionUtils.dateKey(session.date.toISOString());
    }).length;
  }

  function renderSessionCard(session, auctions) {
    const live = isSessionLive(session, auctions);
    const lots = countLotsForSession(session, auctions);
    const iso = session.date.toISOString();
    const isToday = new Date().toDateString() === session.date.toDateString();

    return `
      <div class="agenda-session-card ${live ? 'is-live' : ''} ${isToday ? 'is-today' : ''}" data-aos="fade-up">
        <div class="agenda-session-date">
          <span class="agenda-day-name">${AuctionUtils.formatDayShort(iso)}</span>
          <span class="agenda-day-num">${AuctionUtils.formatDayNumber(iso)}</span>
          <span class="agenda-month">${AuctionUtils.formatMonthShort(iso)}</span>
        </div>
        <div class="agenda-session-body">
          ${live ? '<span class="agenda-live-badge"><i class="fas fa-circle"></i> EN VIVO</span>' : ''}
          <h4 class="agenda-session-title">${session.template.title}</h4>
          <p class="agenda-session-time">
            <i class="far fa-clock"></i>
            ${session.startTime} – ${session.endTime}
          </p>
          <p class="agenda-session-meta">
            <i class="fas ${session.template.icon}"></i>
            ${session.template.label} · ${lots > 0 ? `${lots} lote(s) programado(s)` : 'Próximamente'}
          </p>
        </div>
      </div>
    `;
  }

  function renderUpcomingEvents(auctions) {
    const active = auctions
      .filter(a => a.status === 'active')
      .sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt))
      .slice(0, 8);

    if (active.length === 0) {
      return `
        <div class="agenda-events-empty">
          <i class="fas fa-calendar-check"></i>
          <p>No hay lotes activos en este momento. Revisa la agenda semanal arriba.</p>
        </div>
      `;
    }

    return active.map(auction => {
      const countdown = AuctionUtils.getCountdownParts(auction.endsAt);
      return `
        <div class="agenda-event-row" data-aos="fade-left">
          <div class="agenda-event-date-block">
            <span class="agenda-event-day">${AuctionUtils.formatDayShort(auction.endsAt)}</span>
            <span class="agenda-event-date">${AuctionUtils.formatDayNumber(auction.endsAt)} ${AuctionUtils.formatMonthShort(auction.endsAt)}</span>
            <span class="agenda-event-hour">${AuctionUtils.formatTimeOnly(auction.endsAt)}</span>
          </div>
          <div class="agenda-event-line"></div>
          <div class="agenda-event-content">
            <span class="auction-status-badge active">Cierra</span>
            <h5>${auction.title}</h5>
            <p class="agenda-event-detail">
              <span><i class="fas fa-gavel"></i> ${AuctionUtils.formatCurrency(auction.currentPrice)}</span>
              <span><i class="fas fa-user"></i> ${auction.sellerName}</span>
              <span class="agenda-event-countdown ${countdown.urgent ? 'urgent' : ''}" data-ends-at="${auction.endsAt}">
                <i class="fas fa-hourglass-half"></i> <span class="countdown-text">${countdown.ended ? 'Finalizada' : countdown.text}</span>
              </span>
            </p>
            <a href="auction-details.html?id=${auction.id}" class="agenda-event-link">
              Ver lote <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  function getNextAuctionDateTime() {
    const sessions = getNextSessionDates(12);
    const now = new Date();

    for (const session of sessions) {
      const start = new Date(session.date);
      start.setHours(session.template.startHour, session.template.startMinute, 0, 0);
      if (start > now) {
        return { datetime: start.toISOString(), session };
      }
    }

    return null;
  }

  function render(auctions = []) {
    const sessionsEl = document.getElementById('agendaSessions');
    const eventsEl = document.getElementById('agendaEvents');
    const statsEl = document.getElementById('auctionHeroStats');

    if (!sessionsEl) return;

    const sessions = getNextSessionDates(6);
    sessionsEl.innerHTML = sessions.map(s => renderSessionCard(s, auctions)).join('');

    if (eventsEl) {
      eventsEl.innerHTML = renderUpcomingEvents(auctions);
    }

    if (statsEl) {
      const activeCount = auctions.filter(a => a.status === 'active').length;
      const totalBids = auctions.reduce((sum, a) => sum + (a.bidCount || 0), 0);
      const nextSession = sessions.find(s => s.date >= new Date()) || sessions[0];

      statsEl.innerHTML = `
        <div class="auction-stat">
          <span class="auction-stat-value">${activeCount}</span>
          <span class="auction-stat-label">Subastas activas</span>
        </div>
        <div class="auction-stat">
          <span class="auction-stat-value">${totalBids}</span>
          <span class="auction-stat-label">Ofertas totales</span>
        </div>
        <div class="auction-stat">
          <span class="auction-stat-value">${nextSession ? AuctionUtils.formatDayShort(nextSession.date.toISOString()) : '—'}</span>
          <span class="auction-stat-label">Próxima sesión</span>
        </div>
      `;
    }

    if (typeof AOS !== 'undefined') {
      AOS.refreshHard();
    }
  }

  return { render, getNextSessionDates, getNextAuctionDateTime };
})();

window.AuctionSchedule = AuctionSchedule;
