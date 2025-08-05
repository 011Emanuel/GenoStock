class RancherHealth extends HTMLElement {
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

        .health-container {
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
        
        .alert-icon.urgent {
          background: var(--danger);
        }
        
        .alert-icon.warning {
          background: var(--warning);
        }
        
        .alert-icon.info {
          background: var(--info);
        }
        
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
          .health-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .health-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          :host {
            padding: 1rem;
          }
          
          .health-stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .section-header h2 {
            font-size: 2rem;
          }
          
          .health-stat {
            padding: 1.2rem;
          }
          
          .health-stat-icon {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }
          
          .health-stat-number {
            font-size: 1.8rem;
          }
        }
      </style>
      
      <div class="health-container">
        <div class="section-header">
          <h2>Health Management</h2>
          <p>Monitor cattle health and veterinary records</p>
        </div>
        
        <!-- Health Stats -->
        <div class="health-stats">
          <div class="health-stat">
            <div class="health-stat-icon" style="background: var(--gradient-success);">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
              </svg>
            </div>
            <div class="health-stat-number">98%</div>
            <div class="health-stat-label">Health Rate</div>
          </div>
          
          <div class="health-stat">
            <div class="health-stat-icon" style="background: var(--gradient-primary);">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2v20M2 12h20"/>
              </svg>
            </div>
            <div class="health-stat-number">15</div>
            <div class="health-stat-label">Pregnant Cows</div>
          </div>
          
          <div class="health-stat">
            <div class="health-stat-icon" style="background: var(--gradient-warning);">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="health-stat-number">3</div>
            <div class="health-stat-label">Sick Cattle</div>
          </div>
          
          <div class="health-stat">
            <div class="health-stat-icon" style="background: var(--gradient-info);">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <div class="health-stat-number">12</div>
            <div class="health-stat-label">Due for Check</div>
          </div>
        </div>
        
        <!-- Main Content Grid -->
        <div class="health-grid">
          <!-- Health Records -->
          <div class="health-records">
            <div class="health-header">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/>
              </svg>
              <h3>Recent Health Records</h3>
            </div>
            <div class="health-body">
              <div class="health-record">
                <div class="health-record-icon" style="background: var(--gradient-success);">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                  </svg>
                </div>
                <div class="health-record-content">
                  <h6>Vaccination Completed</h6>
                  <p>Brahman cattle group vaccinated against common diseases</p>
                  <small>2 hours ago</small>
                </div>
              </div>
              
              <div class="health-record">
                <div class="health-record-icon" style="background: var(--gradient-primary);">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21c4.97-4.97 8-8.13 8-11.5A5.5 5.5 0 0 0 12 4.5 5.5 5.5 0 0 0 4 9.5C4 12.87 7.03 16.03 12 21Z"/>
                  </svg>
                </div>
                <div class="health-record-content">
                  <h6>Pregnancy Confirmed</h6>
                  <p>Nelore cow N-078 confirmed pregnant, due next month</p>
                  <small>1 day ago</small>
                </div>
              </div>
              
              <div class="health-record">
                <div class="health-record-icon" style="background: var(--gradient-warning);">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2v20M2 12h20"/>
                  </svg>
                </div>
                <div class="health-record-content">
                  <h6>Respiratory Issue Detected</h6>
                  <p>Nelore cow N-045 showing respiratory symptoms</p>
                  <small>3 days ago</small>
                </div>
              </div>
              
              <div class="health-record">
                <div class="health-record-icon" style="background: var(--gradient-info);">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                </div>
                <div class="health-record-content">
                  <h6>Routine Health Check</h6>
                  <p>Brahman cattle group scheduled for routine examination</p>
                  <small>1 week ago</small>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Health Alerts -->
          <div class="health-alerts">
            <div class="alerts-header">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <h3>Health Alerts</h3>
            </div>
            <div class="alerts-body">
              <div class="alert-item urgent">
                <div class="alert-icon urgent">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div class="alert-content">
                  <h6>Urgent: Respiratory Treatment</h6>
                  <p>Nelore cow N-045 needs immediate veterinary attention</p>
                </div>
              </div>
              
              <div class="alert-item warning">
                <div class="alert-icon warning">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2v20M2 12h20"/>
                  </svg>
                </div>
                <div class="alert-content">
                  <h6>Pregnancy Monitoring</h6>
                  <p>15 pregnant cows due for ultrasound examination</p>
                </div>
              </div>
              
              <div class="alert-item info">
                <div class="alert-icon info">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                </div>
                <div class="alert-content">
                  <h6>Vaccination Due</h6>
                  <p>12 cattle due for annual vaccination next week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Schedule Section -->
        <div class="schedule-section">
          <div class="schedule-header">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
            <h3>Upcoming Health Schedule</h3>
          </div>
          <div class="schedule-body">
            <div class="schedule-item">
              <div class="schedule-info">
                <h6>Veterinary Visit</h6>
                <p>Routine health check for Brahman group</p>
              </div>
              <div class="schedule-date">Tomorrow</div>
            </div>
            
            <div class="schedule-item">
              <div class="schedule-info">
                <h6>Pregnancy Ultrasound</h6>
                <p>Examination for pregnant Nelore cows</p>
              </div>
              <div class="schedule-date">Next Week</div>
            </div>
            
            <div class="schedule-item">
              <div class="schedule-info">
                <h6>Vaccination Program</h6>
                <p>Annual vaccination for all cattle</p>
              </div>
              <div class="schedule-date">2 Weeks</div>
            </div>
            
            <div class="schedule-item">
              <div class="schedule-info">
                <h6>Breeding Season Prep</h6>
                <p>Health assessment for breeding program</p>
              </div>
              <div class="schedule-date">1 Month</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('rancher-health', RancherHealth); 