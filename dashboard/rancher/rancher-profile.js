class RancherProfile extends HTMLElement {
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

        .profile-container {
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
        
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        /* Profile Card */
        .profile-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        
        .profile-header {
          background: var(--gradient-primary);
          color: var(--white);
          padding: 2rem;
          text-align: center;
        }
        
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--white);
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: var(--primary);
          border: 4px solid var(--white);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .profile-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .profile-role {
          font-size: 1rem;
          opacity: 0.9;
        }
        
        .profile-body {
          padding: 2rem;
        }
        
        .profile-info {
          margin-bottom: 1.5rem;
        }
        
        .profile-info h4 {
          color: var(--primary);
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .profile-info p {
          color: var(--gray);
          margin: 0;
          font-size: 0.95rem;
        }
        
        /* Ranch Details */
        .ranch-details {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        
        .ranch-header {
          background: var(--gradient-accent);
          color: var(--white);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .ranch-header h3 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .ranch-body {
          padding: 2rem;
        }
        
        .ranch-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }
        
        .ranch-section {
          background: var(--light-gray);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        
        .ranch-section h4 {
          color: var(--primary);
          font-size: 1.1rem;
          margin-bottom: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .ranch-section h4 svg {
          width: 20px;
          height: 20px;
          color: var(--accent);
        }
        
        .ranch-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
          border-bottom: 1px solid var(--border);
        }
        
        .ranch-item:last-child {
          border-bottom: none;
        }
        
        .ranch-item-label {
          font-weight: 500;
          color: var(--dark-gray);
        }
        
        .ranch-item-value {
          font-weight: 600;
          color: var(--primary);
        }
        
        /* Edit Button */
        .edit-btn {
          background: var(--gradient-primary);
          color: var(--white);
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        
        .edit-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          :host {
            padding: 1rem;
          }
          
          .profile-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .ranch-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .section-header h2 {
            font-size: 2rem;
          }
          
          .profile-avatar {
            width: 100px;
            height: 100px;
            font-size: 2.5rem;
          }
        }
      </style>
      
      <div class="profile-container">
        <div class="section-header">
          <h2>Rancher Profile</h2>
          <p>Manage your personal information and ranch details</p>
        </div>
        
        <div class="profile-grid">
          <!-- Profile Card -->
          <div class="profile-card">
            <div class="profile-header">
              <div class="profile-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div class="profile-name">Carlos Mendoza</div>
              <div class="profile-role">Professional Rancher</div>
            </div>
            <div class="profile-body">
              <div class="profile-info">
                <h4>Contact Information</h4>
                <p><strong>Email:</strong> carlos.mendoza@ranch.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Location:</strong> Texas, USA</p>
              </div>
              
              <div class="profile-info">
                <h4>Experience</h4>
                <p><strong>Years:</strong> 15+ years</p>
                <p><strong>Specialty:</strong> Brahman & Nelore Cattle</p>
                <p><strong>Certifications:</strong> Certified Rancher</p>
              </div>
              
              <button class="edit-btn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
          
          <!-- Ranch Details -->
          <div class="ranch-details">
            <div class="ranch-header">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21c4.97-4.97 8-8.13 8-11.5A5.5 5.5 0 0 0 12 4.5 5.5 5.5 0 0 0 4 9.5C4 12.87 7.03 16.03 12 21Z"/>
              </svg>
              <h3>Ranch Information</h3>
            </div>
            <div class="ranch-body">
              <div class="ranch-grid">
                <div class="ranch-section">
                  <h4>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    Ranch Location
                  </h4>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Ranch Name:</span>
                    <span class="ranch-item-value">Mendoza Ranch</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Address:</span>
                    <span class="ranch-item-value">123 Cattle Drive, Texas</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Acres:</span>
                    <span class="ranch-item-value">2,500 acres</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Established:</span>
                    <span class="ranch-item-value">1995</span>
                  </div>
                </div>
                
                <div class="ranch-section">
                  <h4>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21c4.97-4.97 8-8.13 8-11.5A5.5 5.5 0 0 0 12 4.5 5.5 5.5 0 0 0 4 9.5C4 12.87 7.03 16.03 12 21Z"/>
                    </svg>
                    Cattle Information
                  </h4>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Total Cattle:</span>
                    <span class="ranch-item-value">234</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Brahman:</span>
                    <span class="ranch-item-value">156</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Nelore:</span>
                    <span class="ranch-item-value">78</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Pregnant:</span>
                    <span class="ranch-item-value">15</span>
                  </div>
                </div>
                
                <div class="ranch-section">
                  <h4>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                    </svg>
                    Health Status
                  </h4>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Health Rate:</span>
                    <span class="ranch-item-value">98%</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Vaccinated:</span>
                    <span class="ranch-item-value">100%</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Last Check:</span>
                    <span class="ranch-item-value">2 days ago</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Next Check:</span>
                    <span class="ranch-item-value">Next week</span>
                  </div>
                </div>
                
                <div class="ranch-section">
                  <h4>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2v20M2 12h20"/>
                    </svg>
                    Breeding Info
                  </h4>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Breeding Season:</span>
                    <span class="ranch-item-value">Spring 2024</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Expected Calves:</span>
                    <span class="ranch-item-value">45</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">AI Scheduled:</span>
                    <span class="ranch-item-value">Next month</span>
                  </div>
                  <div class="ranch-item">
                    <span class="ranch-item-label">Success Rate:</span>
                    <span class="ranch-item-value">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('rancher-profile', RancherProfile); 