class TraderOverview extends HTMLElement {
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
        }

        .section-header { 
          margin-bottom: 1.5rem; 
        }
        
        .stat-card { 
          background: #fff; 
          border-radius: 12px; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.07); 
          padding: 1.2rem; 
          display: flex; 
          align-items: center; 
          gap: 1.2rem; 
          margin-bottom: 1.2rem; 
        }
        
        .stat-icon { 
          width: 48px; 
          height: 48px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #fff; 
          font-size: 1.5rem; 
        }
        
        .bg-primary { background: #2c5530; }
        .bg-success { background: #43a047; }
        .bg-warning { background: #ffa726; }
        .bg-info { background: #29b6f6; }
        
        .stat-content h3 { 
          margin: 0; 
          font-size: 2rem; 
          font-weight: 700; 
        }
        
        .stat-content p { 
          margin: 0; 
          color: #888; 
          font-size: 1.1rem; 
        }
        
        .activity-item { 
          display: flex; 
          align-items: flex-start; 
          gap: 1.1rem; 
          margin-bottom: 1.1rem; 
        }
        
        .activity-icon { 
          width: 38px; 
          height: 38px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #fff; 
          font-size: 1.1rem; 
        }
        
        .activity-content h6 { 
          margin: 0 0 0.2rem 0; 
          font-size: 1.08rem; 
          font-weight: 600; 
        }
        
        .activity-content p { 
          margin: 0 0 0.1rem 0; 
          color: #666; 
          font-size: 0.98rem; 
        }
        
        .activity-content small { 
          color: #aaa; 
        }
        
        .card { 
          background: #fff; 
          border-radius: 12px; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.07); 
          margin-bottom: 1.2rem; 
        }
        
        .card-header { 
          padding: 1rem 1.2rem 0.5rem 1.2rem; 
          border-bottom: 1px solid #eee; 
          background: none; 
        }
        
        .card-body { 
          padding: 1.2rem; 
        }

        /* Quick Actions Styles */
        .quick-actions-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: var(--transition);
          position: relative;
        }

        .quick-actions-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-accent);
        }

        .quick-actions-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-hover);
        }

        .quick-actions-header {
          padding: 1.5rem 1.5rem 1rem 1.5rem;
          border-bottom: 2px solid var(--light-gray);
          background: var(--light-gray);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .quick-actions-icon {
          width: 35px;
          height: 35px;
          border-radius: 10px;
          background: var(--gradient-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1.1rem;
        }

        .quick-actions-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0;
        }

        .quick-actions-body {
          padding: 1.5rem;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .quick-action-btn {
          position: relative;
          background: var(--white);
          border: 2px solid var(--border);
          border-radius: 12px;
          padding: 1.2rem 1rem;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--dark-gray);
          font-weight: 600;
          font-size: 0.9rem;
          text-align: center;
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
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1.3rem;
          position: relative;
          z-index: 2;
          transition: var(--transition);
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

        .quick-action-text {
          position: relative;
          z-index: 2;
          transition: var(--transition);
        }

        .quick-action-btn:hover .quick-action-text {
          color: var(--white);
        }

        .quick-action-description {
          font-size: 0.75rem;
          color: var(--gray);
          margin-top: 0.25rem;
          position: relative;
          z-index: 2;
          transition: var(--transition);
        }

        .quick-action-btn:hover .quick-action-description {
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
          .quick-actions-grid {
            grid-template-columns: 1fr;
          }
          
          .quick-action-btn {
            padding: 1rem 0.75rem;
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

        .quick-action-btn {
          animation: fadeInUp 0.6s ease-out;
        }

        .quick-action-btn:nth-child(1) { animation-delay: 0.1s; }
        .quick-action-btn:nth-child(2) { animation-delay: 0.2s; }
        .quick-action-btn:nth-child(3) { animation-delay: 0.3s; }
        .quick-action-btn:nth-child(4) { animation-delay: 0.4s; }
      </style>
      
      <section>
        <div class="section-header">
          <h2>Overview</h2>
          <p>Your livestock business at a glance</p>
        </div>
        
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-primary">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 21c4.97-4.97 8-8.13 8-11.5A5.5 5.5 0 0 0 12 4.5 5.5 5.5 0 0 0 4 9.5C4 12.87 7.03 16.03 12 21Z" stroke="#fff" stroke-width="2"/></svg>
              </div>
              <div class="stat-content">
                <h3>156</h3>
                <p>Total Livestock</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-success">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 21V3M6 8l6-5 6 5" stroke="#fff" stroke-width="2"/></svg>
              </div>
              <div class="stat-content">
                <h3>$45,230</h3>
                <p>Total Sales</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-warning">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 12h18M12 3v18" stroke="#fff" stroke-width="2"/></svg>
              </div>
              <div class="stat-content">
                <h3>23</h3>
                <p>This Month</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-info">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2"/><path d="M12 8v4l3 3" stroke="#fff" stroke-width="2"/></svg>
              </div>
              <div class="stat-content">
                <h3>98%</h3>
                <p>Health Rate</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row g-4">
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h5>Recent Activity</h5>
              </div>
              <div class="card-body">
                <div class="activity-item">
                  <div class="activity-icon bg-success">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2"/></svg>
                  </div>
                  <div class="activity-content">
                    <h6>New livestock added</h6>
                    <p>Added 5 Brahman cattle to your inventory</p>
                    <small>2 hours ago</small>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="activity-icon bg-primary">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 21V3M6 8l6-5 6 5" stroke="#fff" stroke-width="2"/></svg>
                  </div>
                  <div class="activity-content">
                    <h6>Sale completed</h6>
                    <p>Sold 3 Gyr cattle for $2,400</p>
                    <small>1 day ago</small>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="activity-icon bg-warning">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#fff" stroke-width="2"/></svg>
                  </div>
                  <div class="activity-content">
                    <h6>Health check required</h6>
                    <p>Schedule vaccination for Nelore cattle</p>
                    <small>3 days ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-4">
            <div class="quick-actions-card">
              <div class="quick-actions-header">
                <div class="quick-actions-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h5 class="quick-actions-title">Acciones Rápidas</h5>
              </div>
              
              <div class="quick-actions-body">
                <div class="quick-actions-grid">
                  <button class="quick-action-btn">
                    <div class="quick-action-icon primary">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                    </div>
                    <div class="quick-action-text">Agregar Ganado</div>
                    <div class="quick-action-description">Nuevo registro</div>
                  </button>
                  
                  <button class="quick-action-btn">
                    <div class="quick-action-icon success">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/>
                      </svg>
                    </div>
                    <div class="quick-action-text">Ver Reportes</div>
                    <div class="quick-action-description">Análisis detallado</div>
                  </button>
                  
                  <button class="quick-action-btn">
                    <div class="quick-action-icon info">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div class="quick-action-text">Programar Revisión</div>
                    <div class="quick-action-description">Chequeo de salud</div>
                  </button>
                  
                  <button class="quick-action-btn">
                    <div class="quick-action-icon warning">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                      </svg>
                    </div>
                    <div class="quick-action-text">Configuración</div>
                    <div class="quick-action-description">Ajustes del sistema</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('trader-overview', TraderOverview); 