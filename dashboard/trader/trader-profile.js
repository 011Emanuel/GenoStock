class TraderProfile extends HTMLElement {
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
          --danger: #f44336;
          --warning: #ff9800;
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

        .profile-container {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-sidebar {
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(44, 85, 48, 0.1);
          max-width: 280px;
          margin: 0 auto;
        }

        .profile-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
        }

        .profile-sidebar:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .profile-avatar {
          width: 90px;
          height: 90px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border: 4px solid var(--white);
          overflow: hidden;
          background: var(--white);
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
          cursor: pointer;
          border-radius: 50%;
        }

        .avatar-overlay svg {
          width: 24px;
          height: 24px;
          color: var(--white);
        }

        .profile-avatar:hover .avatar-overlay {
          opacity: 1;
        }

        .profile-avatar::after {
          content: '';
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 24px;
          height: 24px;
          background: var(--accent);
          border-radius: 50%;
          border: 3px solid var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .profile-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.25rem;
        }

        .profile-role {
          color: var(--text-gray);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          padding: 0.4rem 0.8rem;
          background: #f8f9fa;
          border-radius: 12px;
          display: inline-block;
          font-weight: 500;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin: 1rem 0;
        }

        .stat-item {
          text-align: center;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 8px;
          transition: all 0.2s ease;
          border: 1px solid #e9ecef;
        }

        .stat-item:hover {
          background: var(--white);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .stat-number {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.2rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-gray);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn {
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-size: 0.95rem;
        }

        .btn-primary {
          background: var(--gradient-primary);
          color: var(--white);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(44, 85, 48, 0.3);
        }

        .btn-outline-primary {
          background: transparent;
          color: var(--primary);
          border: 2px solid var(--primary);
        }

        .btn-outline-primary:hover {
          background: var(--primary);
          color: var(--white);
          transform: translateY(-2px);
        }

        .btn-outline-danger {
          background: transparent;
          color: var(--danger);
          border: 2px solid var(--danger);
        }

        .btn-outline-danger:hover {
          background: var(--danger);
          color: var(--white);
          transform: translateY(-2px);
        }

        .change-photo-btn {
          font-size: 0.85rem;
          padding: 0.6rem 1rem;
          margin-top: 0.5rem;
          border-radius: 20px;
          border-width: 1.5px;
        }

        .change-photo-btn:hover {
          background: var(--primary);
          color: var(--white);
          transform: translateY(-1px);
        }

        /* Indicador de estado online mejorado */
        .profile-avatar::before {
          content: '';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid var(--white);
          z-index: 2;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .profile-form {
          background: var(--white);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 1.5rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(44, 85, 48, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }

        .profile-form:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .form-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--light-gray);
          text-align: center;
        }

        .form-header h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .form-header h4::before {
          content: '';
          width: 3px;
          height: 20px;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          border-radius: 2px;
        }

        .form-header p {
          color: var(--text-gray);
          font-size: 0.9rem;
          margin: 0;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          font-weight: 600;
          color: var(--dark-gray);
          margin-bottom: 0.4rem;
          display: block;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-control {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #e1e5e9;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          background: var(--white);
          color: var(--dark-gray);
        }

        .form-control:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.08);
          transform: translateY(-1px);
        }

        .form-control:hover {
          border-color: var(--primary-light);
        }

        textarea.form-control {
          resize: vertical;
          min-height: 80px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .form-actions {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--light-gray);
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .btn-save {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--white);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          min-width: 120px;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(44, 85, 48, 0.3);
        }

        .btn-cancel {
          background: transparent;
          color: var(--text-gray);
          border: 1.5px solid #e1e5e9;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          min-width: 120px;
        }

        .btn-cancel:hover {
          background: #f8f9fa;
          border-color: var(--primary-light);
          transform: translateY(-1px);
        }
          gap: 1rem;
          justify-content: flex-end;
        }

        .btn-save {
          background: var(--gradient-primary);
          color: var(--white);
          padding: 1rem 2rem;
          font-size: 1rem;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(44, 85, 48, 0.3);
        }

        .btn-cancel {
          background: var(--light-gray);
          color: var(--gray);
          border: 2px solid var(--border);
        }

        .btn-cancel:hover {
          background: var(--gray);
          color: var(--white);
        }

        @media (max-width: 768px) {
          .profile-container {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .section-header h2 {
            font-size: 2rem;
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

        .profile-sidebar,
        .profile-form {
          animation: fadeInUp 0.6s ease-out;
        }

        .profile-form {
          animation-delay: 0.2s;
        }
      </style>
      
      <section>
        <div class="section-header">
          <h2>My Profile</h2>
          <p>Manage your personal information and settings</p>
        </div>
        
        <div class="profile-container">
          <!-- Sidebar con información del perfil -->
          <div class="profile-sidebar">
            <div class="profile-avatar">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" alt="Profile">
              <div class="avatar-overlay">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <h3 class="profile-name">John Smith</h3>
            <p class="profile-role">Livestock Trader</p>
            
            <div class="profile-stats">
              <div class="stat-item">
                <div class="stat-number">156</div>
                <div class="stat-label">Total Livestock</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">$45,230</div>
                <div class="stat-label">Total Sales</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">98%</div>
                <div class="stat-label">Success Rate</div>
              </div>
            </div>
            
            <button class="btn btn-outline-primary change-photo-btn">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" stroke-width="2"/>
              </svg>
              Change Photo
            </button>
            
            <button class="btn btn-outline-danger" id="logoutBtnProfile" style="margin-top: 1rem; width: 100%;">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2"/>
              </svg>
              Sign Out
            </button>
          </div>
          
          <!-- Formulario principal -->
          <div class="profile-form">
            <div class="form-header">
              <h4>Personal Information</h4>
              <p>Update your profile information and preferences</p>
            </div>
            
            <form>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-control" value="John">
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-control" value="Smith">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-control" value="john.smith@example.com">
                </div>
                <div class="form-group">
                  <label class="form-label">Phone Number</label>
                  <input type="tel" class="form-control" value="+1 (555) 123-4567">
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Company Name</label>
                <input type="text" class="form-control" value="Smith Livestock Co.">
              </div>
              
              <div class="form-group">
                <label class="form-label">Address</label>
                <textarea class="form-control" rows="3">123 Cattle Drive, Farmville, TX 12345</textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">City</label>
                  <input type="text" class="form-control" value="Farmville">
                </div>
                <div class="form-group">
                  <label class="form-label">State</label>
                  <input type="text" class="form-control" value="Texas">
                </div>
                <div class="form-group">
                  <label class="form-label">ZIP Code</label>
                  <input type="text" class="form-control" value="12345">
                </div>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn btn-save">Save Changes</button>
                <button type="button" class="btn btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('trader-profile', TraderProfile); 