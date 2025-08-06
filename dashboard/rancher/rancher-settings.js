class RancherSettings extends HTMLElement {
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

        .settings-container {
          max-width: 1200px;
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
        
        /* Settings Grid */
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        /* Settings Navigation */
        .settings-nav {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        
        .nav-header {
          background: var(--gradient-primary);
          color: var(--white);
          padding: 1.5rem;
          text-align: center;
        }
        
        .nav-header h3 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .nav-body {
          padding: 1rem;
        }
        
        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          color: var(--dark-gray);
          text-decoration: none;
          border-radius: 8px;
          transition: var(--transition);
          cursor: pointer;
          margin-bottom: 0.5rem;
        }
        
        .nav-item:hover,
        .nav-item.active {
          background: var(--primary);
          color: var(--white);
        }
        
        .nav-item:last-child {
          margin-bottom: 0;
        }
        
        .nav-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Settings Content */
        .settings-content {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        
        .content-header {
          background: var(--gradient-accent);
          color: var(--white);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .content-header h3 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .content-body {
          padding: 2rem;
        }
        
        /* Form Groups */
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group:last-child {
          margin-bottom: 0;
        }
        
        .form-label {
          display: block;
          font-weight: 600;
          color: var(--dark-gray);
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 1rem;
          transition: var(--transition);
          background: var(--white);
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
        }
        
        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        .form-select {
          cursor: pointer;
        }
        
        /* Toggle Switch */
        .toggle-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border);
        }
        
        .toggle-group:last-child {
          border-bottom: none;
        }
        
        .toggle-label {
          font-weight: 500;
          color: var(--dark-gray);
        }
        
        .toggle-description {
          font-size: 0.9rem;
          color: var(--gray);
          margin-top: 0.2rem;
        }
        
        .toggle-switch {
          position: relative;
          width: 50px;
          height: 24px;
          background: var(--gray);
          border-radius: 12px;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .toggle-switch.active {
          background: var(--primary);
        }
        
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: var(--white);
          border-radius: 50%;
          transition: var(--transition);
        }
        
        .toggle-switch.active::after {
          transform: translateX(26px);
        }
        
        /* Buttons */
        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }
        
        .btn {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          font-size: 1rem;
        }
        
        .btn-primary {
          background: var(--gradient-primary);
          color: var(--white);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
        
        .btn-secondary {
          background: var(--light-gray);
          color: var(--dark-gray);
          border: 1px solid var(--border);
        }
        
        .btn-secondary:hover {
          background: var(--gray);
          color: var(--white);
        }
        
        .btn-danger {
          background: var(--danger);
          color: var(--white);
        }
        
        .btn-danger:hover {
          background: #d32f2f;
          transform: translateY(-2px);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          :host {
            padding: 1rem;
          }
          
          .settings-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .section-header h2 {
            font-size: 2rem;
          }
          
          .button-group {
            flex-direction: column;
          }
        }
      </style>
      
      <div class="settings-container">
        <div class="section-header">
          <h2>Settings</h2>
          <p>Configure your ranch management system</p>
        </div>
        
        <div class="settings-grid">
          <!-- Settings Navigation -->
          <div class="settings-nav">
            <div class="nav-header">
              <h3>Settings Menu</h3>
            </div>
            <div class="nav-body">
              <div class="nav-item active">
                <div class="nav-icon">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                Profile Settings
              </div>
              <div class="nav-item">
                <div class="nav-icon">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21c4.97-4.97 8-8.13 8-11.5A5.5 5.5 0 0 0 12 4.5 5.5 5.5 0 0 0 4 9.5C4 12.87 7.03 16.03 12 21Z"/>
                  </svg>
                </div>
                Ranch Settings
              </div>
              <div class="nav-item">
                <div class="nav-icon">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                  </svg>
                </div>
                Health Alerts
              </div>
              <div class="nav-item">
                <div class="nav-icon">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2v20M2 12h20"/>
                  </svg>
                </div>
                Breeding Settings
              </div>
              <div class="nav-item">
                <div class="nav-icon">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                Notifications
              </div>
              <div class="nav-item">
                <div class="nav-icon">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
                Security
              </div>
            </div>
          </div>
          
          <!-- Settings Content -->
          <div class="settings-content">
            <div class="content-header">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <h3>Profile Settings</h3>
            </div>
            <div class="content-body">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" value="Carlos Mendoza">
              </div>
              
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" value="carlos.mendoza@ranch.com">
              </div>
              
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-input" value="+1 (555) 123-4567">
              </div>
              
              <div class="form-group">
                <label class="form-label">Location</label>
                <input type="text" class="form-input" value="Texas, USA">
              </div>
              
              <div class="form-group">
                <label class="form-label">Experience Level</label>
                <select class="form-input form-select">
                  <option>Professional Rancher</option>
                  <option>Experienced Rancher</option>
                  <option>Beginner Rancher</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Specialty</label>
                <textarea class="form-input form-textarea">Brahman & Nelore Cattle breeding and management. Specialized in genetic improvement and health monitoring.</textarea>
              </div>
              
              <div class="toggle-group">
                <div>
                  <div class="toggle-label">Email Notifications</div>
                  <div class="toggle-description">Receive updates about your cattle health and breeding schedules</div>
                </div>
                <div class="toggle-switch active"></div>
              </div>
              
              <div class="toggle-group">
                <div>
                  <div class="toggle-label">SMS Alerts</div>
                  <div class="toggle-description">Get urgent alerts via SMS for health emergencies</div>
                </div>
                <div class="toggle-switch active"></div>
              </div>
              
              <div class="toggle-group">
                <div>
                  <div class="toggle-label">Marketplace Updates</div>
                  <div class="toggle-description">Receive notifications about new livestock available</div>
                </div>
                <div class="toggle-switch"></div>
              </div>
              
              <div class="button-group">
                <button class="btn btn-primary">Save Changes</button>
                <button class="btn btn-secondary">Reset</button>
                <button class="btn btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('rancher-settings', RancherSettings); 