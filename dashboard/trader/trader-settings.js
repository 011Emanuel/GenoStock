class TraderSettings extends HTMLElement {
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
          --gradient-danger: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
          --border-radius: 16px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .section-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .section-header p {
          color: var(--gray);
          font-size: 1.1rem;
          margin: 0;
        }

        .settings-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .settings-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: var(--transition);
          position: relative;
        }

        .settings-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
        }

        .settings-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-hover);
        }

        .settings-card.security::before {
          background: var(--gradient-warning);
        }

        .settings-card.notifications::before {
          background: var(--gradient-success);
        }

        .settings-header {
          padding: 1.5rem 2rem;
          border-bottom: 2px solid var(--light-gray);
          background: var(--light-gray);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .settings-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1.2rem;
        }

        .settings-icon.primary {
          background: var(--gradient-primary);
        }

        .settings-icon.warning {
          background: var(--gradient-warning);
        }

        .settings-icon.success {
          background: var(--gradient-success);
        }

        .settings-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0;
        }

        .settings-body {
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          font-weight: 600;
          color: var(--dark-gray);
          margin-bottom: 0.75rem;
          display: block;
          font-size: 1rem;
        }

        .form-control, .form-select {
          width: 100%;
          padding: 1rem;
          border: 2px solid var(--border);
          border-radius: 12px;
          font-size: 1rem;
          transition: var(--transition);
          background: var(--white);
        }

        .form-control:focus, .form-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
          transform: translateY(-1px);
        }

        .form-control:hover, .form-select:hover {
          border-color: var(--primary-light);
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid var(--border);
          border-radius: 12px;
          transition: var(--transition);
          cursor: pointer;
        }

        .checkbox-item:hover {
          border-color: var(--primary);
          background: var(--light-gray);
          transform: translateX(5px);
        }

        .checkbox-item input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: var(--primary);
          cursor: pointer;
        }

        .checkbox-content {
          flex: 1;
        }

        .checkbox-label {
          font-weight: 600;
          color: var(--dark-gray);
          margin-bottom: 0.25rem;
          display: block;
        }

        .checkbox-description {
          font-size: 0.9rem;
          color: var(--gray);
          margin: 0;
        }

        .checkbox-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1.1rem;
        }

        .checkbox-icon.success {
          background: var(--gradient-success);
        }

        .checkbox-icon.warning {
          background: var(--gradient-warning);
        }

        .checkbox-icon.info {
          background: var(--gradient-primary);
        }

        .btn {
          border-radius: 12px;
          padding: 1rem 2rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-size: 1rem;
          width: 100%;
          justify-content: center;
        }

        .btn-primary {
          background: var(--gradient-primary);
          color: var(--white);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(44, 85, 48, 0.3);
        }

        .btn-warning {
          background: var(--gradient-warning);
          color: var(--white);
        }

        .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 152, 0, 0.3);
        }

        .password-strength {
          margin-top: 0.5rem;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .password-strength.weak {
          background: rgba(244, 67, 54, 0.1);
          color: var(--danger);
          border: 1px solid rgba(244, 67, 54, 0.2);
        }

        .password-strength.medium {
          background: rgba(255, 152, 0, 0.1);
          color: var(--warning);
          border: 1px solid rgba(255, 152, 0, 0.2);
        }

        .password-strength.strong {
          background: rgba(76, 175, 80, 0.1);
          color: var(--success);
          border: 1px solid rgba(76, 175, 80, 0.2);
        }

        .security-tips {
          margin-top: 1.5rem;
          padding: 1rem;
          background: var(--light-gray);
          border-radius: 12px;
          border-left: 4px solid var(--warning);
        }

        .security-tips h6 {
          color: var(--warning);
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .security-tips ul {
          margin: 0;
          padding-left: 1.2rem;
          font-size: 0.85rem;
          color: var(--gray);
        }

        .security-tips li {
          margin-bottom: 0.25rem;
        }

        @media (max-width: 768px) {
          .settings-container {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .settings-body {
            padding: 1.5rem;
          }
        }

        /* Animaciones */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .settings-card {
          animation: fadeInUp 0.6s ease-out;
        }

        .settings-card:nth-child(2) {
          animation-delay: 0.2s;
        }
      </style>
      
      <section>
        <div class="section-header">
          <h2>Settings</h2>
          <p>Customize your experience and manage your account security</p>
        </div>

        <div class="settings-container">
          <!-- Account Settings -->
          <div class="settings-card">
            <div class="settings-header">
              <div class="settings-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h4 class="settings-title">Account Settings</h4>
            </div>
            <div class="settings-body">
              <div class="form-group">
                <label class="form-label">Display Name</label>
                <input type="text" class="form-control" value="John Smith">
              </div>
              
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-control" value="john.smith@example.com">
              </div>
              
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-control" value="+1 (555) 123-4567">
              </div>
              
              <div class="form-group">
                <label class="form-label">Language</label>
                <select class="form-select">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Time Zone</label>
                <select class="form-select">
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC-6 (Central Time)</option>
                  <option>UTC-7 (Mountain Time)</option>
                  <option>UTC-8 (Pacific Time)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="settings-card">
            <div class="settings-header">
              <div class="settings-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
              <h4 class="settings-title">Security Settings</h4>
            </div>
            <div class="settings-body">
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <input type="password" class="form-control" placeholder="Enter current password">
              </div>
              
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input type="password" class="form-control" placeholder="Enter new password">
                <div class="password-strength strong">
                  <div class="strength-bar"></div>
                  <span>Strong password</span>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Confirm New Password</label>
                <input type="password" class="form-control" placeholder="Confirm new password">
              </div>
              
              <div class="security-tips">
                <h6>Password Requirements:</h6>
                <ul>
                  <li>At least 8 characters long</li>
                  <li>Include uppercase and lowercase letters</li>
                  <li>Include numbers and special characters</li>
                  <li>Not used in previous passwords</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="settings-card">
            <div class="settings-header">
              <div class="settings-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
              </div>
              <h4 class="settings-title">Notification Settings</h4>
            </div>
            <div class="settings-body">
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <div class="checkbox-content">
                    <div class="checkbox-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="checkbox-label">Email Notifications</div>
                      <div class="checkbox-description">Receive notifications about sales and livestock updates</div>
                    </div>
                  </div>
                  <input type="checkbox" checked>
                </div>
                
                <div class="checkbox-item">
                  <div class="checkbox-content">
                    <div class="checkbox-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="checkbox-label">SMS Notifications</div>
                      <div class="checkbox-description">Get important alerts via text message</div>
                    </div>
                  </div>
                  <input type="checkbox">
                </div>
                
                <div class="checkbox-item">
                  <div class="checkbox-content">
                    <div class="checkbox-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="checkbox-label">Health Check Reminders</div>
                      <div class="checkbox-description">Reminders for livestock health checks and vaccinations</div>
                    </div>
                  </div>
                  <input type="checkbox" checked>
                </div>
                
                <div class="checkbox-item">
                  <div class="checkbox-content">
                    <div class="checkbox-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="checkbox-label">Market Updates</div>
                      <div class="checkbox-description">Receive market price updates and trends</div>
                    </div>
                  </div>
                  <input type="checkbox" checked>
                </div>
                
                <div class="checkbox-item">
                  <div class="checkbox-content">
                    <div class="checkbox-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="checkbox-label">Weekly Reports</div>
                      <div class="checkbox-description">Get weekly summary reports of your livestock business</div>
                    </div>
                  </div>
                  <input type="checkbox">
                </div>
              </div>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div class="settings-card">
            <div class="settings-header">
              <div class="settings-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h4 class="settings-title">Privacy Settings</h4>
            </div>
            <div class="settings-body">
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <div class="checkbox-content">
                    <div class="checkbox-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="checkbox-label">Profile Visibility</div>
                      <div class="checkbox-description">Allow other users to see your profile information</div>
                    </div>
                  </div>
                  <input type="checkbox" checked>
                </div>
                
                <div class="checkbox-item">
                  <div class="checkbox-content">
                    <div class="checkbox-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="checkbox-label">Livestock Catalog</div>
                      <div class="checkbox-description">Show your livestock in the public marketplace</div>
                    </div>
                  </div>
                  <input type="checkbox" checked>
                </div>
                
                <div class="checkbox-item">
                  <div class="checkbox-content">
                    <div class="checkbox-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="checkbox-label">Analytics Sharing</div>
                      <div class="checkbox-description">Share anonymous data to improve the platform</div>
                    </div>
                  </div>
                  <input type="checkbox">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('trader-settings', TraderSettings); 