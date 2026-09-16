class RancherOverview extends HTMLElement {
  constructor() {
    super();
    this.cattleList = [];
    this.scheduleList = [];
    this.activityLog = [];
    this.breedingLog = [];
    
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

        .overview-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-header { 
          margin-bottom: 2rem;
          text-align: center;
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
          margin: 0;
        }
        
        /* Stats Grid - Responsive cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        
        .stat-card { 
          background: var(--white); 
          border-radius: var(--border-radius); 
          box-shadow: var(--shadow); 
          padding: 1.5rem; 
          display: flex; 
          align-items: center; 
          gap: 1.2rem; 
          transition: var(--transition);
          border: 1px solid var(--border);
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }
        
        .stat-icon { 
          width: 60px; 
          height: 60px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: var(--white); 
          font-size: 1.8rem; 
          flex-shrink: 0;
        }
        
        .bg-primary { background: var(--gradient-primary); }
        .bg-success { background: var(--gradient-success); }
        .bg-warning { background: var(--gradient-warning); }
        .bg-info { background: var(--gradient-info); }
        
        .stat-content h3 { 
          margin: 0; 
          font-size: 2.2rem; 
          font-weight: 700; 
          color: var(--primary);
        }
        
        .stat-content p { 
          margin: 0; 
          color: var(--gray); 
          font-size: 0.95rem; 
          font-weight: 500;
        }
        
        /* Main Content Grid - 2 columns */
        .main-content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        /* Activity Section */
        .activity-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        
        .activity-header {
          background: var(--gradient-primary);
          color: var(--white);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .activity-header h5 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .activity-body {
          padding: 1.5rem;
          min-height: 250px;
        }
        
        .activity-item { 
          display: flex; 
          align-items: flex-start; 
          gap: 1.2rem; 
          margin-bottom: 1.5rem; 
          padding: 1rem;
          border-radius: 12px;
          transition: var(--transition);
          background: var(--white);
          border: 1px solid var(--border);
        }
        
        .activity-item:hover {
          background: var(--light-gray);
        }
        
        .activity-item:last-child {
          margin-bottom: 0;
        }
        
        .activity-icon { 
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
        
        .activity-content h6 { 
          margin: 0 0 0.3rem 0; 
          font-size: 1.05rem; 
          font-weight: 600; 
          color: var(--primary);
        }
        
        .activity-content p { 
          margin: 0 0 0.3rem 0; 
          color: var(--gray); 
          font-size: 0.95rem;
        }
        
        .activity-content small { 
          color: var(--gray); 
          font-size: 0.85rem;
          font-weight: 500;
        }

        .empty-activity {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--gray);
        }

        .empty-activity svg {
          width: 50px;
          height: 50px;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        /* Quick Actions Section */
        .quick-actions-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        
        .quick-actions-header {
          background: var(--gradient-accent);
          color: var(--white);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .quick-actions-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .quick-actions-title {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .quick-actions-body {
          padding: 1.5rem;
        }
        
        .quick-actions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .quick-action-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem;
          background: var(--white);
          border: 2px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: var(--transition);
          text-decoration: none;
          color: var(--dark-gray);
          font-weight: 600;
          font-size: 1rem;
          overflow: hidden;
          width: 100%;
          text-align: left;
        }

        .quick-action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--gradient-primary);
          opacity: 0;
          transition: var(--transition);
          z-index: 1;
        }

        .quick-action-btn:hover::before {
          opacity: 1;
        }

        .quick-action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(44, 85, 48, 0.15);
          border-color: var(--primary);
          color: var(--white);
        }

        .quick-action-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1.4rem;
          position: relative;
          z-index: 2;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .quick-action-btn:hover .quick-action-icon {
          transform: scale(1.1);
        }

        .quick-action-icon.primary { background: var(--gradient-primary); }
        .quick-action-icon.success { background: var(--gradient-success); }
        .quick-action-icon.info { background: var(--gradient-info); }
        .quick-action-icon.warning { background: var(--gradient-warning); }

        .quick-action-content {
          position: relative;
          z-index: 2;
          transition: var(--transition);
          flex: 1;
        }

        .quick-action-text {
          font-weight: 600;
          margin-bottom: 0.2rem;
        }

        .quick-action-description {
          font-size: 0.85rem;
          color: var(--gray);
          font-weight: 400;
        }

        .quick-action-btn:hover .quick-action-text,
        .quick-action-btn:hover .quick-action-description {
          color: var(--white);
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
        .agenda-card-item.pregnant { border-left-color: var(--warning); }
        .agenda-card-item.birth { border-left-color: var(--info); }

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

        @media (max-width: 992px) {
          .main-content-grid { grid-template-columns: 1fr; }
          .modal-body { grid-template-columns: 1fr; gap: 1.5rem; }
        }
      </style>
      
      <div class="overview-container">
        <div class="section-header">
          <h2>Rancher Overview</h2>
          <p>Your livestock management & real-time operational status</p>
        </div>
        
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon bg-primary">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M19 8c-1.1 0-2-.9-2-2 0-.55.22-1.05.59-1.41C16.7 3.61 14.5 3 12 3S7.3 3.61 6.41 4.59C6.78 4.95 7 5.45 7 6c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.8 1.1-3.3 2.7-3.8C7.1 1.2 9.4 0 12 0s4.9 1.2 6.3 2.2C19.9 2.7 21 4.2 21 6c0 1.1-.9 2-2 2zm-7 13c-4.4 0-8-2.7-8-6 0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4 0 3.3-3.6 6-8 6zm-2-4c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm4 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>
            </div>
            <div class="stat-content">
              <h3 id="statTotalCattle">0</h3>
              <p>Total Cattle</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon bg-success">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="#fff" stroke-width="2"/></svg>
            </div>
            <div class="stat-content">
              <h3 id="statHealthRate">100%</h3>
              <p>Health Rate</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon bg-warning">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <div class="stat-content">
              <h3 id="statPregnantCows">0</h3>
              <p>Pregnant Cows</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon bg-info">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M19 8c-1.1 0-2-.9-2-2 0-.55.22-1.05.59-1.41C16.7 3.61 14.5 3 12 3S7.3 3.61 6.41 4.59C6.78 4.95 7 5.45 7 6c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.8 1.1-3.3 2.7-3.8C7.1 1.2 9.4 0 12 0s4.9 1.2 6.3 2.2C19.9 2.7 21 4.2 21 6c0 1.1-.9 2-2 2zm-7 13c-4.4 0-8-2.7-8-6 0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4 0 3.3-3.6 6-8 6zm-2-4c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm4 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>
            </div>
            <div class="stat-content">
              <h3 id="statCalves">0</h3>
              <p>Calves Registered</p>
            </div>
          </div>
        </div>
        
        <!-- Main Content Grid -->
        <div class="main-content-grid">
          <!-- Recent Activities Section -->
          <div class="activity-card">
            <div class="activity-header">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h5>Recent Activities</h5>
            </div>
            <div class="activity-body" id="activityList">
              <!-- Dynamically populated -->
            </div>
          </div>
          
          <!-- Quick Actions Section -->
          <div class="quick-actions-card">
            <div class="quick-actions-header">
              <div class="quick-actions-icon" style="color: #ffa726;">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M19 8c-1.1 0-2-.9-2-2 0-.55.22-1.05.59-1.41C16.7 3.61 14.5 3 12 3S7.3 3.61 6.41 4.59C6.78 4.95 7 5.45 7 6c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.8 1.1-3.3 2.7-3.8C7.1 1.2 9.4 0 12 0s4.9 1.2 6.3 2.2C19.9 2.7 21 4.2 21 6c0 1.1-.9 2-2 2zm-7 13c-4.4 0-8-2.7-8-6 0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4 0 3.3-3.6 6-8 6zm-2-4c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm4 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>
              </div>
              <h5 class="quick-actions-title">Quick Actions</h5>
            </div>
            
            <div class="quick-actions-body">
              <div class="quick-actions-grid">
                <button class="quick-action-btn" id="quickAddCattle">
                  <div class="quick-action-icon primary">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 8c-1.1 0-2-.9-2-2 0-.55.22-1.05.59-1.41C16.7 3.61 14.5 3 12 3S7.3 3.61 6.41 4.59C6.78 4.95 7 5.45 7 6c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.8 1.1-3.3 2.7-3.8C7.1 1.2 9.4 0 12 0s4.9 1.2 6.3 2.2C19.9 2.7 21 4.2 21 6c0 1.1-.9 2-2 2zm-7 13c-4.4 0-8-2.7-8-6 0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4 0 3.3-3.6 6-8 6zm-2-4c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm4 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>
                  </div>
                  <div class="quick-action-content">
                    <div class="quick-action-text">Add Cattle</div>
                    <div class="quick-action-description">Register new livestock</div>
                  </div>
                </button>
                
                <button class="quick-action-btn" id="quickHealthCheck">
                  <div class="quick-action-icon success">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/></svg>
                  </div>
                  <div class="quick-action-content">
                    <div class="quick-action-text">Health Check</div>
                    <div class="quick-action-description">Schedule agenda visit</div>
                  </div>
                </button>
                
                <button class="quick-action-btn" id="quickBreeding">
                  <div class="quick-action-icon info">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 8c-1.1 0-2-.9-2-2 0-.55.22-1.05.59-1.41C16.7 3.61 14.5 3 12 3S7.3 3.61 6.41 4.59C6.78 4.95 7 5.45 7 6c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.8 1.1-3.3 2.7-3.8C7.1 1.2 9.4 0 12 0s4.9 1.2 6.3 2.2C19.9 2.7 21 4.2 21 6c0 1.1-.9 2-2 2zm-7 13c-4.4 0-8-2.7-8-6 0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4 0 3.3-3.6 6-8 6zm-2-4c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm4 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>
                  </div>
                  <div class="quick-action-content">
                    <div class="quick-action-text">Breeding & Births</div>
                    <div class="quick-action-description">Register pregnancy & new calves</div>
                  </div>
                </button>
                
                <button class="quick-action-btn" id="quickSettings">
                  <div class="quick-action-icon warning">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                  </div>
                  <div class="quick-action-content">
                    <div class="quick-action-text">Settings</div>
                    <div class="quick-action-description">System preferences</div>
                  </div>
                </button>
              </div>
            </div>
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
            <!-- Animated Success Toast inside modal -->
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

            <!-- Agenda Schedule List Side -->
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

      <!-- Interactive Pregnancy & Birth Register Modal -->
      <div class="modal-overlay" id="breedingModal">
        <div class="agenda-modal">
          <div class="modal-header" style="background: linear-gradient(135deg, #1b3a1d 0%, #2c5530 100%);">
            <h3>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" style="color:#ffa726;"><path d="M19 8c-1.1 0-2-.9-2-2 0-.55.22-1.05.59-1.41C16.7 3.61 14.5 3 12 3S7.3 3.61 6.41 4.59C6.78 4.95 7 5.45 7 6c0 1.1-.9 2-2 2s-2-.9-2-2c0-1.8 1.1-3.3 2.7-3.8C7.1 1.2 9.4 0 12 0s4.9 1.2 6.3 2.2C19.9 2.7 21 4.2 21 6c0 1.1-.9 2-2 2zm-7 13c-4.4 0-8-2.7-8-6 0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4 0 3.3-3.6 6-8 6zm-2-4c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm4 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/></svg>
              Breeding, Pregnancy & Birth Register
            </h3>
            <button class="close-modal-btn" id="closeBreedingModal">&times;</button>
          </div>
          <div class="modal-body">
            <!-- Animated Success Toast inside breeding modal -->
            <div class="agenda-toast" id="breedingToast">
              <div class="toast-check-icon">✓</div>
              <div>
                <div class="toast-content-title" id="breedingToastTitle">¡Registro Exitoso!</div>
                <div class="toast-content-desc" id="breedingToastDesc">La información de gestación/nacimiento ha sido guardada.</div>
              </div>
            </div>

            <!-- Form Side -->
            <div>
              <div class="agenda-section-title">
                🤰 Register Pregnancy or New Birth
              </div>
              <form id="breedingForm">
                <div class="form-group">
                  <label for="breedingType">Entry Type</label>
                  <select id="breedingType" class="form-control" required>
                    <option value="pregnancy">Pregnancy Confirmation (Vaca Embarazada)</option>
                    <option value="birth">New Calf Born (Nuevo Nacimiento)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="breedingCowTag">Mother Cow / Tag ID</label>
                  <select id="breedingCowTag" class="form-control" required>
                    <option value="">-- Select Cow --</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="breedingDate">Date of Event / Expected Due Date</label>
                  <input type="date" id="breedingDate" class="form-control" required>
                </div>
                <div class="form-group">
                  <label for="breedingSireTag">Sire / Bull ID (Father)</label>
                  <input type="text" id="breedingSireTag" class="form-control" placeholder="e.g. Bull #B-09 (Optional)">
                </div>
                <div class="form-group" id="calfNameGroup" style="display:none;">
                  <label for="calfTagId">New Calf Tag / Name</label>
                  <input type="text" id="calfTagId" class="form-control" placeholder="e.g. Calf #C-204">
                </div>
                <div class="form-group">
                  <label for="breedingNotes">Notes & Health Observations</label>
                  <textarea id="breedingNotes" class="form-control" rows="2" placeholder="Healthy calf, ultrasound confirmed, artificial insemination, etc."></textarea>
                </div>
                <button type="submit" class="btn-submit-agenda">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  Save Breeding Record
                </button>
              </form>
            </div>

            <!-- Log Side -->
            <div>
              <div class="agenda-section-title">
                🍼 Recent Births & Pregnant Cows Log
              </div>
              <div class="agenda-list" id="breedingLogList">
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
    this.loadOverviewData();
  }

  setupEventListeners() {
    const shadow = this.shadowRoot;

    // Quick Actions
    const btnAdd = shadow.querySelector('#quickAddCattle');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        window.location.href = 'add-cattle.html';
      });
    }

    const btnHealth = shadow.querySelector('#quickHealthCheck');
    if (btnHealth) {
      btnHealth.addEventListener('click', () => {
        this.openAgendaModal();
      });
    }

    const btnBreeding = shadow.querySelector('#quickBreeding');
    if (btnBreeding) {
      btnBreeding.addEventListener('click', () => {
        this.openBreedingModal();
      });
    }

    const btnSettings = shadow.querySelector('#quickSettings');
    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('genostock-navigate-section', { detail: 'settings' }));
      });
    }

    // Modal Agenda Close
    const agendaModal = shadow.querySelector('#agendaModal');
    const closeAgendaBtn = shadow.querySelector('#closeAgendaModal');
    if (closeAgendaBtn) {
      closeAgendaBtn.addEventListener('click', () => agendaModal.classList.remove('active'));
    }
    if (agendaModal) {
      agendaModal.addEventListener('click', (e) => {
        if (e.target === agendaModal) agendaModal.classList.remove('active');
      });
    }

    // Modal Breeding Close
    const breedingModal = shadow.querySelector('#breedingModal');
    const closeBreedingBtn = shadow.querySelector('#closeBreedingModal');
    if (closeBreedingBtn) {
      closeBreedingBtn.addEventListener('click', () => breedingModal.classList.remove('active'));
    }
    if (breedingModal) {
      breedingModal.addEventListener('click', (e) => {
        if (e.target === breedingModal) breedingModal.classList.remove('active');
      });
    }

    // Toggle Calf Tag Input when entry type is Birth
    const breedingType = shadow.querySelector('#breedingType');
    const calfNameGroup = shadow.querySelector('#calfNameGroup');
    if (breedingType && calfNameGroup) {
      breedingType.addEventListener('change', () => {
        if (breedingType.value === 'birth') {
          calfNameGroup.style.display = 'block';
        } else {
          calfNameGroup.style.display = 'none';
        }
      });
    }

    // Agenda Form Submit
    const agendaForm = shadow.querySelector('#agendaForm');
    if (agendaForm) {
      agendaForm.addEventListener('submit', (e) => this.handleAgendaSubmit(e));
    }

    // Breeding Form Submit
    const breedingForm = shadow.querySelector('#breedingForm');
    if (breedingForm) {
      breedingForm.addEventListener('submit', (e) => this.handleBreedingSubmit(e));
    }
  }

  openAgendaModal(defaultType = '') {
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

    if (defaultType) {
      const typeSelect = shadow.querySelector('#agendaVisitType');
      if (typeSelect) typeSelect.value = defaultType;
    }

    const tagSelect = shadow.querySelector('#agendaCattleTag');
    if (tagSelect) {
      if (this.cattleList.length === 0) {
        tagSelect.innerHTML = `<option value="All Cattle Herd">All Cattle Herd / Entire Farm</option>`;
      } else {
        tagSelect.innerHTML = `<option value="All Cattle Herd">All Cattle Herd / Entire Farm</option>` +
          this.cattleList.map(c => `<option value="${c.tagId || c.title}">${c.tagId || c.title} (${c.breed || 'Cattle'})</option>`).join('');
      }
    }

    this.renderAgendaList();
    modal.classList.add('active');
  }

  openBreedingModal() {
    const shadow = this.shadowRoot;
    const modal = shadow.querySelector('#breedingModal');
    if (!modal) return;

    const dateInput = shadow.querySelector('#breedingDate');
    if (dateInput) {
      dateInput.value = new Date().toISOString().slice(0, 10);
    }

    const tagSelect = shadow.querySelector('#breedingCowTag');
    if (tagSelect) {
      if (this.cattleList.length === 0) {
        tagSelect.innerHTML = `<option value="Cow #C-101">Cow #C-101 (Brahman)</option>`;
      } else {
        tagSelect.innerHTML = this.cattleList.map(c => `<option value="${c.tagId || c.title}">${c.tagId || c.title} (${c.breed || 'Cow'})</option>`).join('');
      }
    }

    this.renderBreedingLog();
    modal.classList.add('active');
  }

  async loadOverviewData() {
    let cattle = [];
    try {
      const local = JSON.parse(localStorage.getItem('genostock_cattle_list') || '[]');
      cattle = [...local];
    } catch (e) {}

    try {
      if (window.supabase && window.supabase.from) {
        const { data } = await window.supabase.from('cattle').select('*');
        if (data && data.length > 0) {
          data.forEach(dbItem => {
            if (!cattle.some(c => c.id === dbItem.id)) {
              cattle.push({
                id: dbItem.id,
                tagId: dbItem.title,
                title: dbItem.title,
                breed: dbItem.breed,
                category: dbItem.category,
                weight: dbItem.weight,
                age: dbItem.age,
                status: dbItem.status || 'Active'
              });
            }
          });
        }
      }
    } catch(e) {}

    this.cattleList = cattle;

    try {
      this.scheduleList = JSON.parse(localStorage.getItem('genostock_health_schedule') || '[]');
    } catch(e) {
      this.scheduleList = [];
    }

    try {
      this.breedingLog = JSON.parse(localStorage.getItem('genostock_breeding_log') || '[]');
    } catch(e) {
      this.breedingLog = [];
    }

    try {
      this.activityLog = JSON.parse(localStorage.getItem('genostock_activity_log') || '[]');
    } catch(e) {
      this.activityLog = [];
    }

    const shadow = this.shadowRoot;
    
    let totalCattleCount = cattle.length;
    if (totalCattleCount === 0 && localStorage.getItem('cattleCount')) {
      totalCattleCount = Number(localStorage.getItem('cattleCount'));
    }

    // Pregnant Cows count (cattle tagged pregnant + breeding log active pregnancies)
    const pregnantInCattle = cattle.filter(c => 
      (c.status || '').toLowerCase() === 'pregnant' || 
      (c.description || '').toLowerCase().includes('pregnant') || 
      (c.category || '').toLowerCase().includes('pregnant')
    ).length;
    const pregnantInLog = this.breedingLog.filter(b => b.type === 'pregnancy').length;
    const pregnantCount = Math.max(pregnantInCattle, pregnantInLog);

    // Calves count (age <= 12 months or type birth in breeding log)
    const calvesInCattle = cattle.filter(c => 
      (c.category || '').toLowerCase().includes('calf') || 
      (c.age && Number(c.age) <= 12)
    ).length;
    const calvesInLog = this.breedingLog.filter(b => b.type === 'birth').length;
    const calvesCount = Math.max(calvesInCattle, calvesInLog);

    // Health Rate
    const sickCount = cattle.filter(c => (c.status || '').toLowerCase() === 'sick').length;
    let healthRate = '100%';
    if (totalCattleCount > 0) {
      const healthyRatio = Math.round(((totalCattleCount - sickCount) / totalCattleCount) * 100);
      healthRate = `${healthyRatio}%`;
    }

    const statTotal = shadow.querySelector('#statTotalCattle');
    const statHealth = shadow.querySelector('#statHealthRate');
    const statPregnant = shadow.querySelector('#statPregnantCows');
    const statCalves = shadow.querySelector('#statCalves');

    if (statTotal) statTotal.textContent = totalCattleCount;
    if (statHealth) statHealth.textContent = healthRate;
    if (statPregnant) statPregnant.textContent = pregnantCount;
    if (statCalves) statCalves.textContent = calvesCount;

    this.renderActivityList();
  }

  renderActivityList() {
    const shadow = this.shadowRoot;
    const container = shadow.querySelector('#activityList');
    if (!container) return;

    if (this.activityLog.length === 0) {
      container.innerHTML = `
        <div class="empty-activity">
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/></svg>
          <h5 style="margin: 0 0 0.5rem 0; font-weight:700; color:var(--primary);">No Recent Activities Yet</h5>
          <p style="margin:0; font-size:0.9rem;">Registered cattle, health visits and breeding births will appear here in real-time.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.activityLog.slice(0, 5).map(act => `
      <div class="activity-item">
        <div class="activity-icon ${act.bgClass || 'bg-primary'}">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="${act.iconPath || 'M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z'}"/></svg>
        </div>
        <div class="activity-content">
          <h6>${act.title}</h6>
          <p>${act.description}</p>
          <small>${act.time}</small>
        </div>
      </div>
    `).join('');
  }

  renderAgendaList() {
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
        this.renderAgendaList();
      });
    });
  }

  renderBreedingLog() {
    const shadow = this.shadowRoot;
    const container = shadow.querySelector('#breedingLogList');
    if (!container) return;

    if (this.breedingLog.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--gray);">
          <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24" style="margin-bottom:0.5rem; opacity:0.5;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <div style="font-weight:600;">No Births or Pregnancies Logged</div>
          <small>Register female cow pregnancies or new calves born using the form on the left.</small>
        </div>
      `;
      return;
    }

    container.innerHTML = this.breedingLog.map(b => {
      const isBirth = b.type === 'birth';
      return `
        <div class="agenda-card-item ${isBirth ? 'birth' : 'pregnant'}">
          <div class="agenda-item-header">
            <div class="agenda-item-title">${isBirth ? '🐮 New Calf Born' : '🤰 Pregnancy Confirmed'}</div>
            <div class="agenda-item-tag">${b.cowTag}</div>
          </div>
          <div class="agenda-item-meta">
            <strong>📅 ${b.date}</strong> ${b.sireTag ? ` &nbsp;|&nbsp; 🐂 Sire: ${b.sireTag}` : ''}
          </div>
          ${isBirth && b.calfTag ? `<div class="agenda-item-meta" style="color:var(--primary); font-weight:700;">Calf Tag / Name: ${b.calfTag}</div>` : ''}
          ${b.notes ? `<div class="agenda-item-meta" style="font-style:italic;">"${b.notes}"</div>` : ''}
        </div>
      `;
    }).join('');
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

    this.activityLog.unshift({
      title: `${visitType} Scheduled`,
      description: `${visitType} for ${cattleTag} with ${vetName}`,
      time: 'Just now',
      bgClass: 'bg-success',
      iconPath: 'M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z'
    });
    localStorage.setItem('genostock_activity_log', JSON.stringify(this.activityLog));

    window.dispatchEvent(new CustomEvent('genostock-health-updated'));

    shadow.querySelector('#agendaNotes').value = '';
    this.renderAgendaList();
    this.renderActivityList();

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

  handleBreedingSubmit(e) {
    e.preventDefault();
    const shadow = this.shadowRoot;

    const type = shadow.querySelector('#breedingType').value;
    const cowTag = shadow.querySelector('#breedingCowTag').value;
    const date = shadow.querySelector('#breedingDate').value;
    const sireTag = shadow.querySelector('#breedingSireTag').value.trim();
    const calfTag = shadow.querySelector('#calfTagId') ? shadow.querySelector('#calfTagId').value.trim() : '';
    const notes = shadow.querySelector('#breedingNotes').value.trim();

    if (!cowTag || !date) return;

    const newBreedingItem = {
      id: 'breed_' + Date.now(),
      type,
      cowTag,
      date,
      sireTag,
      calfTag,
      notes,
      createdAt: new Date().toISOString()
    };

    this.breedingLog.unshift(newBreedingItem);
    localStorage.setItem('genostock_breeding_log', JSON.stringify(this.breedingLog));

    // If New Calf Born, automatically add a calf record to local cattle list
    if (type === 'birth') {
      const calfName = calfTag || `Calf of ${cowTag}`;
      const localRecords = JSON.parse(localStorage.getItem('genostock_cattle_list') || '[]');
      localRecords.unshift({
        id: 'cattle_' + Date.now(),
        tagId: calfName,
        title: calfName,
        breed: 'Brahman Calf',
        category: 'Calf',
        gender: 'Calf',
        weight: 35,
        age: 0,
        price: 0,
        location: 'Main Ranch',
        imageUrl: 'https://images.pexels.com/photos/2600277/pexels-photo-2600277.jpeg',
        description: `Born to mother cow ${cowTag} on ${date}. ${notes}`,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('genostock_cattle_list', JSON.stringify(localRecords));
    }

    // Add activity log
    this.activityLog.unshift({
      title: type === 'birth' ? `New Calf Born (${calfTag || cowTag})` : `Pregnancy Confirmed (${cowTag})`,
      description: type === 'birth' ? `Healthy calf born to mother cow ${cowTag}` : `Cow ${cowTag} confirmed pregnant, due: ${date}`,
      time: 'Just now',
      bgClass: type === 'birth' ? 'bg-info' : 'bg-warning',
      iconPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
    });
    localStorage.setItem('genostock_activity_log', JSON.stringify(this.activityLog));

    // Refresh Overview Data & Lists
    shadow.querySelector('#breedingNotes').value = '';
    if (shadow.querySelector('#calfTagId')) shadow.querySelector('#calfTagId').value = '';
    this.loadOverviewData();
    this.renderBreedingLog();

    // Trigger Toast
    const toast = shadow.querySelector('#breedingToast');
    const toastTitle = shadow.querySelector('#breedingToastTitle');
    const toastDesc = shadow.querySelector('#breedingToastDesc');

    if (toast && toastTitle && toastDesc) {
      toastTitle.textContent = type === 'birth' ? '¡Nuevo Nacimiento Registrado!' : '¡Gestación Registrada!';
      toastDesc.textContent = type === 'birth' ? `Cría ${calfTag || cowTag} registrada exitosamente.` : `Vaca ${cowTag} registrada como embarazada.`;
      
      toast.classList.add('show');
      if (this._breedingToastTimeout) clearTimeout(this._breedingToastTimeout);
      this._breedingToastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 3200);
    }
  }
}
customElements.define('rancher-overview', RancherOverview);