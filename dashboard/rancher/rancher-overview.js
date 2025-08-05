class RancherOverview extends HTMLElement {
  constructor() {
    super();
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
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
          font-size: 1rem; 
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
        }
        
        .activity-item { 
          display: flex; 
          align-items: flex-start; 
          gap: 1.2rem; 
          margin-bottom: 1.5rem; 
          padding: 1rem;
          border-radius: 12px;
          transition: var(--transition);
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
          font-size: 1.1rem; 
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
          font-size: 1.5rem;
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

        .quick-action-icon.primary {
          background: var(--gradient-primary);
        }

        .quick-action-icon.success {
          background: var(--gradient-success);
        }

        .quick-action-icon.info {
          background: var(--gradient-info);
        }

        .quick-action-icon.warning {
          background: var(--gradient-warning);
        }

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

        /* Responsive Design */
        @media (max-width: 1400px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }
        
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .main-content-grid {
            grid-template-columns: 1fr;
          }
          
          .section-header h2 {
            font-size: 2.2rem;
          }
        }
        
        @media (max-width: 992px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.2rem;
          }
          
          .stat-card {
            padding: 1.3rem;
          }
          
          .stat-icon {
            width: 55px;
            height: 55px;
            font-size: 1.6rem;
          }
          
          .stat-content h3 {
            font-size: 2rem;
          }
        }
        
        @media (max-width: 768px) {
          :host {
            padding: 1rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .section-header h2 {
            font-size: 2rem;
          }
          
          .section-header p {
            font-size: 1rem;
          }
          
          .stat-card {
            padding: 1.2rem;
          }
          
          .stat-icon {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }
          
          .stat-content h3 {
            font-size: 1.8rem;
          }
          
          .main-content-grid {
            gap: 1.5rem;
          }
          
          .activity-card,
          .quick-actions-card {
            margin-bottom: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          :host {
            padding: 0.75rem;
          }
          
          .section-header h2 {
            font-size: 1.8rem;
          }
          
          .section-header p {
            font-size: 0.95rem;
          }
          
          .stat-card {
            padding: 1rem;
            gap: 1rem;
          }
          
          .stat-icon {
            width: 45px;
            height: 45px;
            font-size: 1.3rem;
          }
          
          .stat-content h3 {
            font-size: 1.6rem;
          }
          
          .stat-content p {
            font-size: 0.9rem;
          }
          
          .activity-header,
          .quick-actions-header {
            padding: 1.2rem;
          }
          
          .activity-body,
          .quick-actions-body {
            padding: 1.2rem;
          }
          
          .activity-item {
            padding: 0.8rem;
            gap: 1rem;
          }
          
          .activity-icon {
            width: 40px;
            height: 40px;
            font-size: 1.1rem;
          }
          
          .quick-action-btn {
            padding: 1rem;
            gap: 0.8rem;
          }
          
          .quick-action-icon {
            width: 45px;
            height: 45px;
            font-size: 1.2rem;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            gap: 0.8rem;
          }
          
          .stat-card {
            padding: 0.8rem;
            gap: 0.8rem;
          }
          
          .stat-icon {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
          }
          
          .stat-content h3 {
            font-size: 1.4rem;
          }
          
          .stat-content p {
            font-size: 0.85rem;
          }
        }

        /* Animaciones */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-card {
          animation: fadeInUp 0.6s ease-out;
        }

        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
      </style>
      
      <div class="overview-container">
        <div class="section-header">
          <h2>Rancher Overview</h2>
          <p>Your livestock management at a glance</p>
        </div>
        
        <!-- Stats Grid - 4 cards in a row -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon bg-primary">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 21c4.97-4.97 8-8.13 8-11.5A5.5 5.5 0 0 0 12 4.5 5.5 5.5 0 0 0 4 9.5C4 12.87 7.03 16.03 12 21Z" stroke="#fff" stroke-width="2"/></svg>
            </div>
            <div class="stat-content">
              <h3>234</h3>
              <p>Total Cattle</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon bg-success">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="#fff" stroke-width="2"/></svg>
            </div>
            <div class="stat-content">
              <h3>98%</h3>
              <p>Health Rate</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon bg-warning">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#fff" stroke-width="2"/></svg>
            </div>
            <div class="stat-content">
              <h3>15</h3>
              <p>Pregnant Cows</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon bg-info">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2"/><path d="M12 8v4l3 3" stroke="#fff" stroke-width="2"/></svg>
            </div>
            <div class="stat-content">
              <h3>45</h3>
              <p>Calves This Year</p>
            </div>
          </div>
        </div>
        
        <!-- Main Content Grid - 2 columns -->
        <div class="main-content-grid">
          <!-- Activity Section -->
          <div class="activity-card">
            <div class="activity-header">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h5>Recent Activities</h5>
            </div>
            <div class="activity-body">
              <div class="activity-item">
                <div class="activity-icon bg-success">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="#fff" stroke-width="2"/></svg>
                </div>
                <div class="activity-content">
                  <h6>Health check completed</h6>
                  <p>Vaccination completed for Brahman cattle group</p>
                  <small>2 hours ago</small>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon bg-primary">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 21c4.97-4.97 8-8.13 8-11.5A5.5 5.5 0 0 0 12 4.5 5.5 5.5 0 0 0 4 9.5C4 12.87 7.03 16.03 12 21Z" stroke="#fff" stroke-width="2"/></svg>
                </div>
                <div class="activity-content">
                  <h6>New calf born</h6>
                  <p>Healthy Brahman calf born to cow #B-156</p>
                  <small>1 day ago</small>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon bg-warning">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#fff" stroke-width="2"/></svg>
                </div>
                <div class="activity-content">
                  <h6>Breeding scheduled</h6>
                  <p>Artificial insemination scheduled for Nelore group</p>
                  <small>3 days ago</small>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick Actions Section -->
          <div class="quick-actions-card">
            <div class="quick-actions-header">
              <div class="quick-actions-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h5 class="quick-actions-title">Quick Actions</h5>
            </div>
            
            <div class="quick-actions-body">
              <div class="quick-actions-grid">
                <button class="quick-action-btn">
                  <div class="quick-action-icon primary">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </div>
                  <div class="quick-action-content">
                    <div class="quick-action-text">Add Cattle</div>
                    <div class="quick-action-description">Register new livestock</div>
                  </div>
                </button>
                
                <button class="quick-action-btn">
                  <div class="quick-action-icon success">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/>
                    </svg>
                  </div>
                  <div class="quick-action-content">
                    <div class="quick-action-text">Health Check</div>
                    <div class="quick-action-description">Schedule checkup</div>
                  </div>
                </button>
                
                <button class="quick-action-btn">
                  <div class="quick-action-icon info">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div class="quick-action-content">
                    <div class="quick-action-text">Breeding</div>
                    <div class="quick-action-description">Manage breeding</div>
                  </div>
                </button>
                
                <button class="quick-action-btn">
                  <div class="quick-action-icon warning">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                    </svg>
                  </div>
                  <div class="quick-action-content">
                    <div class="quick-action-text">Settings</div>
                    <div class="quick-action-description">System settings</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('rancher-overview', RancherOverview); 