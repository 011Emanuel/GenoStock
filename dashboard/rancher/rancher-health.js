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
        
        /* Modals Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(5px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .modal-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }

        .agenda-modal {
          background: var(--white);
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          background: var(--gradient-primary);
          color: var(--white);
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .close-modal-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: var(--white);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .close-modal-btn:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: rotate(90deg);
        }

        .modal-body {
          padding: 2rem;
          overflow-y: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .agenda-section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--dark-gray);
          margin-bottom: 0.4rem;
        }

        .form-control {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 1rem;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-size: 0.95rem;
          font-family: inherit;
          transition: var(--transition);
        }

        .form-control:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.15);
        }

        .toast-check-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #ffa726;
          color: #1b3a1d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: bold;
          flex-shrink: 0;
          animation: popCheck 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popCheck {
          0% { transform: scale(0) rotate(-45deg); }
          70% { transform: scale(1.25) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        .agenda-toast {
          background: linear-gradient(135deg, #1b3a1d 0%, #2c5530 100%);
          color: #ffffff;
          padding: 0.9rem 1.2rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 8px 25px rgba(44, 85, 48, 0.3);
          border: 1px solid #4a7c59;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: none;
          max-height: 0;
          overflow: hidden;
          margin-bottom: 0;
          grid-column: 1 / -1;
        }

        .agenda-toast.show {
          opacity: 1;
          transform: translateY(0);
          max-height: 120px;
          margin-bottom: 1rem;
          pointer-events: auto;
        }

        .toast-content-title {
          font-weight: 700;
          font-size: 1rem;
          color: #ffffff;
          margin: 0 0 0.2rem 0;
        }

        .toast-content-desc {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        .btn-submit-agenda {
          width: 100%;
          padding: 0.9rem;
          background: var(--gradient-primary);
          color: var(--white);
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          margin-top: 1rem;
        }

        .btn-submit-agenda:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(44, 85, 48, 0.25);
        }

        .agenda-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .agenda-card-item {
          background: var(--light-gray);
          border-radius: 12px;
          padding: 1rem;
          border-left: 5px solid var(--primary);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          position: relative;
        }

        .agenda-card-item.completed { border-left-color: var(--success); }
        .agenda-card-item.canceled { border-left-color: var(--danger); }

        .agenda-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .agenda-item-title {
          font-weight: 700;
          color: var(--primary);
          font-size: 1rem;
        }

        .agenda-item-tag {
          font-size: 0.75rem;
          background: rgba(44, 85, 48, 0.1);
          color: var(--primary);
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .agenda-item-meta {
          font-size: 0.85rem;
          color: var(--gray);
        }

        .agenda-item-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .btn-mini {
          padding: 0.3rem 0.6rem;
          font-size: 0.75rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-mini-success { background: #e8f5e9; color: #2e7d32; }
        .btn-mini-danger { background: #ffebee; color: #c62828; }

        /* Responsive */
        @media (max-width: 1200px) {
          .health-stats { grid-template-columns: repeat(2, 1fr); }
          .health-grid { grid-template-columns: 1fr; }
        }
        
        @media (max-width: 992px) {
          .modal-body { grid-template-columns: 1fr; gap: 1.5rem; }
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

      <!-- Interactive Health Agenda Modal -->
      <div class="modal-overlay" id="agendaModal">
        <div class="agenda-modal">
          <div class="modal-header">
            <h3>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/></svg>
              Health Check & Veterinary Agenda
            </h3>
            <button class="close-modal-btn" id="closeAgendaModal">&times;</button>
          </div>
          <div class="modal-body">
            <!-- Animated Success Toast -->
            <div class="agenda-toast" id="agendaToast">
              <div class="toast-check-icon">✓</div>
              <div>
                <div class="toast-content-title" id="toastTitle">¡Cita Agendada con Éxito!</div>
                <div class="toast-content-desc" id="toastDesc">La visita ha sido registrada en la agenda veterinaria.</div>
              </div>
            </div>

            <!-- Form Side -->
            <div>
              <div class="agenda-section-title">
                📅 Schedule New Health Visit
              </div>
              <form id="agendaForm">
                <div class="form-group">
                  <label for="agendaCattleTag">Select Cattle / Tag ID</label>
                  <select id="agendaCattleTag" class="form-control" required>
                    <option value="">-- Choose Cattle --</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="agendaVisitType">Visit / Check Type</label>
                  <select id="agendaVisitType" class="form-control" required>
                    <option value="Routine Health Checkup">Routine Health Checkup</option>
                    <option value="Vaccination Program">Vaccination Program</option>
                    <option value="Pregnancy Ultrasound">Pregnancy Ultrasound</option>
                    <option value="Breeding & AI Check">Breeding & Artificial Insemination</option>
                    <option value="Emergency Treatment">Emergency Veterinary Treatment</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="agendaDate">Appointment Date & Time</label>
                  <input type="datetime-local" id="agendaDate" class="form-control" required>
                </div>
                <div class="form-group">
                  <label for="agendaVetName">Veterinarian / Specialist</label>
                  <input type="text" id="agendaVetName" class="form-control" placeholder="Dr. Carlos Mendoza" required>
                </div>
                <div class="form-group">
                  <label for="agendaNotes">Special Notes</label>
                  <textarea id="agendaNotes" class="form-control" rows="2" placeholder="Specific symptoms, dosage or observation..."></textarea>
                </div>
                <button type="submit" class="btn-submit-agenda">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  Confirm & Schedule Visit
                </button>
              </form>
            </div>

            <!-- Schedule List Side -->
            <div>
              <div class="agenda-section-title">
                📋 Scheduled Appointments
              </div>
              <div class="agenda-list" id="agendaList">
                <!-- Dynamically populated -->
              </div>
            </div>
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
    const shadow = this.shadowRoot;
    const btn = shadow.querySelector('#btnOpenAgendaModal');
    if (btn) {
      btn.addEventListener('click', () => {
        this.openAgendaModal();
      });
    }

    const agendaModal = shadow.querySelector('#agendaModal');
    const closeBtn = shadow.querySelector('#closeAgendaModal');
    if (closeBtn && agendaModal) {
      closeBtn.addEventListener('click', () => agendaModal.classList.remove('active'));
      agendaModal.addEventListener('click', (e) => {
        if (e.target === agendaModal) agendaModal.classList.remove('active');
      });
    }

    const agendaForm = shadow.querySelector('#agendaForm');
    if (agendaForm) {
      agendaForm.addEventListener('submit', (e) => this.handleAgendaSubmit(e));
    }
  }

  openAgendaModal() {
    const shadow = this.shadowRoot;
    const modal = shadow.querySelector('#agendaModal');
    if (!modal) return;

    const dateInput = shadow.querySelector('#agendaDate');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      dateInput.value = tomorrow.toISOString().slice(0, 16);
    }

    let cattle = [];
    try {
      cattle = JSON.parse(localStorage.getItem('genostock_cattle_list') || '[]');
    } catch(e) {}

    const tagSelect = shadow.querySelector('#agendaCattleTag');
    if (tagSelect) {
      if (cattle.length === 0) {
        tagSelect.innerHTML = `<option value="All Cattle Herd">All Cattle Herd / Entire Farm</option>`;
      } else {
        tagSelect.innerHTML = `<option value="All Cattle Herd">All Cattle Herd / Entire Farm</option>` +
          cattle.map(c => `<option value="${c.tagId || c.title}">${c.tagId || c.title} (${c.breed || 'Cattle'})</option>`).join('');
      }
    }

    this.renderAgendaModalList();
    modal.classList.add('active');
  }

  handleAgendaSubmit(e) {
    e.preventDefault();
    const shadow = this.shadowRoot;

    const cattleTag = shadow.querySelector('#agendaCattleTag').value;
    const visitType = shadow.querySelector('#agendaVisitType').value;
    const date = shadow.querySelector('#agendaDate').value;
    const vetName = shadow.querySelector('#agendaVetName').value.trim();
    const notes = shadow.querySelector('#agendaNotes').value.trim();

    if (!cattleTag || !visitType || !date || !vetName) return;

    const newItem = {
      id: 'sched_' + Date.now(),
      cattleTag,
      visitType,
      date,
      vetName,
      notes,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    this.scheduleList.unshift(newItem);
    localStorage.setItem('genostock_health_schedule', JSON.stringify(this.scheduleList));

    let activityLog = [];
    try {
      activityLog = JSON.parse(localStorage.getItem('genostock_activity_log') || '[]');
    } catch(e) {}
    activityLog.unshift({
      title: `${visitType} Scheduled`,
      description: `${visitType} for ${cattleTag} with ${vetName}`,
      time: 'Just now',
      bgClass: 'bg-success',
      iconPath: 'M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z'
    });
    localStorage.setItem('genostock_activity_log', JSON.stringify(activityLog));

    window.dispatchEvent(new CustomEvent('genostock-health-updated'));

    shadow.querySelector('#agendaNotes').value = '';
    this.loadHealthData();
    this.renderAgendaModalList();

    const toast = shadow.querySelector('#agendaToast');
    const toastTitle = shadow.querySelector('#toastTitle');
    const toastDesc = shadow.querySelector('#toastDesc');

    if (toast && toastTitle && toastDesc) {
      toastTitle.textContent = `¡Cita Agendada: ${visitType}!`;
      toastDesc.textContent = `Para ${cattleTag} el ${new Date(date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} con ${vetName}`;
      
      toast.classList.add('show');
      if (this._toastTimeout) clearTimeout(this._toastTimeout);
      this._toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 3200);
    }
  }

  renderAgendaModalList() {
    const shadow = this.shadowRoot;
    const container = shadow.querySelector('#agendaList');
    if (!container) return;

    if (this.scheduleList.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--gray);">
          <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24" style="margin-bottom:0.5rem; opacity:0.5;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/></svg>
          <div style="font-weight:600;">No Health Visits Scheduled</div>
          <small>Fill out the form on the left to schedule your first veterinary appointment.</small>
        </div>
      `;
      return;
    }

    container.innerHTML = this.scheduleList.map((item, index) => {
      const dateFormatted = new Date(item.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
      return `
        <div class="agenda-card-item ${item.status}">
          <div class="agenda-item-header">
            <div class="agenda-item-title">${item.visitType}</div>
            <div class="agenda-item-tag">${item.cattleTag}</div>
          </div>
          <div class="agenda-item-meta">
            <strong>📅 ${dateFormatted}</strong> &nbsp;|&nbsp; 👨‍⚕️ ${item.vetName}
          </div>
          ${item.notes ? `<div class="agenda-item-meta" style="font-style:italic;">"${item.notes}"</div>` : ''}
          <div class="agenda-item-actions">
            ${item.status !== 'completed' ? `<button class="btn-mini btn-mini-success" data-index="${index}" data-action="complete">Mark Done</button>` : `<span style="font-size:0.75rem; color:var(--success); font-weight:700;">✓ Completed</span>`}
            ${item.status !== 'canceled' ? `<button class="btn-mini btn-mini-danger" data-index="${index}" data-action="cancel">Cancel</button>` : `<span style="font-size:0.75rem; color:var(--danger); font-weight:700;">✕ Canceled</span>`}
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.btn-mini').forEach(b => {
      b.addEventListener('click', () => {
        const index = parseInt(b.getAttribute('data-index'), 10);
        const action = b.getAttribute('data-action');
        if (action === 'complete') {
          this.scheduleList[index].status = 'completed';
        } else if (action === 'cancel') {
          this.scheduleList[index].status = 'canceled';
        }
        localStorage.setItem('genostock_health_schedule', JSON.stringify(this.scheduleList));
        window.dispatchEvent(new CustomEvent('genostock-health-updated'));
        this.renderAgendaModalList();
        this.loadHealthData();
      });
    });
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