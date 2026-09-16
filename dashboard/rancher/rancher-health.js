class RancherHealth extends HTMLElement {
  constructor() {
    super();
    this.scheduleList = [];
    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        :host {
          --primary: #2c5530;
          --primary-light: #4a7c59;
          --accent: #ffa726;
          --accent-light: #ffb74d;
          --success: #4caf50;
          --success-light: #81c784;
          --danger: #f44336;
          --warning: #ff9800;
          --warning-light: #ffb74d;
          --info: #2196f3;
          --info-light: #64b5f6;
          --white: #ffffff;
          --light-gray: #f8f9fa;
          --gray: #6c757d;
          --dark-gray: #495057;
          --border: #e9ecef;
          --shadow: 0 4px 20px rgba(44, 85, 48, 0.1);
          --shadow-hover: 0 8px 30px rgba(44, 85, 48, 0.15);
          --gradient-primary: linear-gradient(135deg, #2c5530 0%, #4a7c59 100%);
          --gradient-accent: linear-gradient(135deg, #ffa726 0%, #ffb74d 100%);
          --gradient-success: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
          --gradient-warning: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
          --gradient-info: linear-gradient(135deg, #2196f3 0%, #64b5f6 100%);
          --border-radius: 16px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
          padding: 2rem;
        }

        .health-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-header { 
          margin-bottom: 2rem;
          text-align: center;
          position: relative;
        }
        
        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        
        .section-header p {
          font-size: 1.1rem;
          color: var(--gray);
          margin: 0 0 1rem 0;
        }

        .btn-schedule-main {
          background: var(--gradient-primary);
          color: var(--white);
          border: none;
          padding: 0.8rem 1.6rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-schedule-main:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
        
        /* Health Stats */
        .health-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        
        .health-stat {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          padding: 1.5rem;
          text-align: center;
          transition: var(--transition);
        }
        
        .health-stat:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }
        
        .health-stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.8rem;
          color: var(--white);
        }
        
        .health-stat-number {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        
        .health-stat-label {
          font-size: 1rem;
          color: var(--gray);
          font-weight: 500;
        }
        
        /* Main Content Grid */
        .health-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        /* Health Records */
        .health-records {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        
        .health-header {
          background: var(--gradient-primary);
          color: var(--white);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .health-header h3 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .health-body {
          padding: 1.5rem;
        }
        
        .health-record {
          display: flex;
          align-items: flex-start;
          gap: 1.2rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 12px;
          transition: var(--transition);
          border: 1px solid var(--border);
        }
        
        .health-record:hover {
          background: var(--light-gray);
          transform: translateX(4px);
        }
        
        .health-record:last-child {
          margin-bottom: 0;
        }
        
        .health-record-icon {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        
        .health-record-content h6 {
          margin: 0 0 0.3rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary);
        }
        
        .health-record-content p {
          margin: 0 0 0.3rem 0;
          color: var(--gray);
          font-size: 0.95rem;
        }
        
        .health-record-content small {
          color: var(--gray);
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        /* Alerts Section */
        .health-alerts {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        
        .alerts-header {
          background: var(--gradient-accent);
          color: var(--white);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .alerts-header h3 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .alerts-body {
          padding: 1.5rem;
        }
        
        .alert-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid;
        }
        
        .alert-item:last-child {
          margin-bottom: 0;
        }
        
        .alert-item.urgent {
          background: rgba(244, 67, 54, 0.1);
          border-left-color: var(--danger);
        }
        
        .alert-item.warning {
          background: rgba(255, 152, 0, 0.1);
          border-left-color: var(--warning);
        }
        
        .alert-item.info {
          background: rgba(33, 150, 243, 0.1);
          border-left-color: var(--info);
        }
        
        .alert-icon {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1rem;
          flex-shrink: 0;
        }
        
        .alert-icon.urgent { background: var(--danger); }
        .alert-icon.warning { background: var(--warning); }
        .alert-icon.info { background: var(--info); }
        
        .alert-content h6 {
          margin: 0 0 0.2rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--dark-gray);
        }
        
        .alert-content p {
          margin: 0;
          color: var(--gray);
          font-size: 0.9rem;
        }
        
        /* Schedule Section */
        .schedule-section {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
          margin-top: 2rem;
        }
        
        .schedule-header {
          background: var(--gradient-info);
          color: var(--white);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .schedule-header h3 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .schedule-body {
          padding: 1.5rem;
        }
        
        .schedule-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          transition: var(--transition);
        }
        
        .schedule-item:hover {
          background: var(--light-gray);
        }
        
        .schedule-item:last-child {
          border-bottom: none;
        }
        
        .schedule-info h6 {
          margin: 0 0 0.2rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--primary);
        }
        
        .schedule-info p {
          margin: 0;
          color: var(--gray);
          font-size: 0.9rem;
        }
        
        .schedule-date {
          font-size: 0.9rem;
          color: var(--accent);
          font-weight: 600;
        }
        
        /* Responsive */
        @media (max-width: 1200px) {
          .health-stats { grid-template-columns: repeat(2, 1fr); }
          .health-grid { grid-template-columns: 1fr; }
        }
        
        @media (max-width: 768px) {
          :host { padding: 1rem; }
          .health-stats { grid-template-columns: 1fr; gap: 1rem; }
          .section-header h2 { font-size: 2rem; }
        }
      </style>
      
      <div class="health-container">
        <div class="section-header">
          <h2>Health Management</h2>
          <p>Monitor cattle health, veterinary records & interactive agenda</p>
          <button class="btn-schedule-main" id="btnOpenAgendaModal">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/></svg>
            Schedule Veterinary Visit
          </button>
        </div>
        
        <!-- Health Stats -->
        <div class="health-stats">
          <div class="health-stat">
            <div class="health-stat-icon" style="background: var(--gradient-success);">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>
            </div>
            <div class="health-stat-number" id="statHealthRate">100%</div>
            <div class="health-stat-label">Health Rate</div>
          </div>
          
          <div class="health-stat">
            <div class="health-stat-icon" style="background: var(--gradient-primary);">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/></svg>
            </div>
            <div class="health-stat-number" id="statPregnant">0</div>
            <div class="health-stat-label">Pregnant Cows</div>
          </div>
          
          <div class="health-stat">
            <div class="health-stat-icon" style="background: var(--gradient-warning);">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div class="health-stat-number" id="statSick">0</div>
            <div class="health-stat-label">Sick / In Treatment</div>
          </div>
          
          <div class="health-stat">
            <div class="health-stat-icon" style="background: var(--gradient-info);">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <div class="health-stat-number" id="statScheduled">0</div>
            <div class="health-stat-label">Agenda Visits</div>
          </div>
        </div>
        
        <!-- Main Content Grid -->
        <div class="health-grid">
          <!-- Health Records -->
          <div class="health-records">
            <div class="health-header">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>
              <h3>Recent Health Records</h3>
            </div>
            <div class="health-body" id="healthRecordsBody">
              <!-- Dynamic records -->
            </div>
          </div>
          
          <!-- Health Alerts -->
          <div class="health-alerts">
            <div class="alerts-header">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <h3>Health Alerts</h3>
            </div>
            <div class="alerts-body" id="healthAlertsBody">
              <!-- Dynamic alerts -->
            </div>
          </div>
        </div>
        
        <!-- Schedule Section -->
        <div class="schedule-section">
          <div class="schedule-header">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            <h3>Upcoming Health Schedule</h3>
          </div>
          <div class="schedule-body" id="scheduleListBody">
            <!-- Dynamic schedule -->
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.setupEventListeners();
    this.loadHealthData();

    this._onHealthUpdated = () => this.loadHealthData();
    window.addEventListener('genostock-health-updated', this._onHealthUpdated);
  }

  disconnectedCallback() {
    if (this._onHealthUpdated) {
      window.removeEventListener('genostock-health-updated', this._onHealthUpdated);
    }
  }

  setupEventListeners() {
    const btn = this.shadowRoot.querySelector('#btnOpenAgendaModal');
    if (btn) {
      btn.addEventListener('click', () => {
        // Dispatch open agenda modal event or trigger overview
        const overview = document.querySelector('rancher-overview');
        if (overview && typeof overview.openAgendaModal === 'function') {
          overview.openAgendaModal();
        } else {
          window.dispatchEvent(new CustomEvent('genostock-navigate-section', { detail: 'overview' }));
          setTimeout(() => {
            const ov = document.querySelector('rancher-overview');
            if (ov && typeof ov.openAgendaModal === 'function') ov.openAgendaModal();
          }, 200);
        }
      });
    }
  }

  loadHealthData() {
    let cattle = [];
    try {
      cattle = JSON.parse(localStorage.getItem('genostock_cattle_list') || '[]');
    } catch(e) {}

    let schedule = [];
    try {
      schedule = JSON.parse(localStorage.getItem('genostock_health_schedule') || '[]');
    } catch(e) {}

    this.scheduleList = schedule;

    const shadow = this.shadowRoot;

    // Calculate Stats
    const total = cattle.length || (localStorage.getItem('cattleCount') ? Number(localStorage.getItem('cattleCount')) : 0);
    const pregnant = cattle.filter(c => (c.status || '').toLowerCase() === 'pregnant' || (c.description || '').toLowerCase().includes('pregnant')).length;
    const sick = cattle.filter(c => (c.status || '').toLowerCase() === 'sick').length;
    const scheduled = schedule.filter(s => s.status !== 'canceled').length;

    let rate = '100%';
    if (total > 0) {
      rate = `${Math.round(((total - sick) / total) * 100)}%`;
    }

    const rateEl = shadow.querySelector('#statHealthRate');
    const pregEl = shadow.querySelector('#statPregnant');
    const sickEl = shadow.querySelector('#statSick');
    const schedEl = shadow.querySelector('#statScheduled');

    if (rateEl) rateEl.textContent = rate;
    if (pregEl) pregEl.textContent = pregnant;
    if (sickEl) sickEl.textContent = sick;
    if (schedEl) schedEl.textContent = scheduled;

    // Render Records
    const recordsBody = shadow.querySelector('#healthRecordsBody');
    if (recordsBody) {
      if (schedule.length === 0) {
        recordsBody.innerHTML = `
          <div style="text-align:center; padding:2rem 1rem; color:var(--gray);">
            <p style="margin:0; font-weight:600;">No veterinary health records yet.</p>
            <small>Use the "Schedule Veterinary Visit" button above to add visits.</small>
          </div>
        `;
      } else {
        recordsBody.innerHTML = schedule.slice(0, 4).map(s => `
          <div class="health-record">
            <div class="health-record-icon" style="background: var(--gradient-primary);">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg>
            </div>
            <div class="health-record-content">
              <h6>${s.visitType}</h6>
              <p>Target: ${s.cattleTag} | Doctor: ${s.vetName}</p>
              <small>${new Date(s.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</small>
            </div>
          </div>
        `).join('');
      }
    }

    // Render Alerts
    const alertsBody = shadow.querySelector('#healthAlertsBody');
    if (alertsBody) {
      if (sick === 0 && pregnant === 0 && scheduled === 0) {
        alertsBody.innerHTML = `
          <div class="alert-item info">
            <div class="alert-icon info">ℹ</div>
            <div class="alert-content">
              <h6>All Systems Normal</h6>
              <p>No active health alerts or emergency notifications at this time.</p>
            </div>
          </div>
        `;
      } else {
        let alertsHtml = '';
        if (sick > 0) {
          alertsHtml += `
            <div class="alert-item urgent">
              <div class="alert-icon urgent">!</div>
              <div class="alert-content">
                <h6>Urgent Attention Required</h6>
                <p>${sick} cattle reported sick or showing symptoms.</p>
              </div>
            </div>
          `;
        }
        if (pregnant > 0) {
          alertsHtml += `
            <div class="alert-item warning">
              <div class="alert-icon warning">⚡</div>
              <div class="alert-content">
                <h6>Pregnancy Monitoring</h6>
                <p>${pregnant} pregnant cows due for health monitoring.</p>
              </div>
            </div>
          `;
        }
        if (scheduled > 0) {
          alertsHtml += `
            <div class="alert-item info">
              <div class="alert-icon info">📅</div>
              <div class="alert-content">
                <h6>Upcoming Agenda Visits</h6>
                <p>${scheduled} visits currently scheduled on your agenda.</p>
              </div>
            </div>
          `;
        }
        alertsBody.innerHTML = alertsHtml;
      }
    }

    // Render Schedule Section
    const scheduleBody = shadow.querySelector('#scheduleListBody');
    if (scheduleBody) {
      if (schedule.length === 0) {
        scheduleBody.innerHTML = `
          <div style="text-align:center; padding:2rem 1rem; color:var(--gray);">
            <p style="margin:0;">No upcoming scheduled health visits.</p>
          </div>
        `;
      } else {
        scheduleBody.innerHTML = schedule.map(s => `
          <div class="schedule-item">
            <div class="schedule-info">
              <h6>${s.visitType} (${s.cattleTag})</h6>
              <p>Specialist: ${s.vetName} ${s.notes ? `• ${s.notes}` : ''}</p>
            </div>
            <div class="schedule-date">${new Date(s.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
          </div>
        `).join('');
      }
    }
  }
}
customElements.define('rancher-health', RancherHealth);