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
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: var(--transition);
        }

        .profile-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-accent);
        }

        .profile-sidebar:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-hover);
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 8px 25px rgba(44, 85, 48, 0.2);
        }

        .profile-avatar svg {
          width: 60px;
          height: 60px;
          color: var(--white);
        }

        .profile-avatar::after {
          content: '';
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 30px;
          height: 30px;
          background: var(--accent);
          border-radius: 50%;
          border: 3px solid var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .profile-role {
          color: var(--gray);
          font-size: 1rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem 1rem;
          background: var(--light-gray);
          border-radius: 20px;
          display: inline-block;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: var(--light-gray);
          border-radius: 12px;
          transition: var(--transition);
        }

        .stat-item:hover {
          background: var(--gradient-primary);
          color: var(--white);
          transform: scale(1.05);
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--gray);
          margin-top: 0.25rem;
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

        .profile-form {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 2rem;
          transition: var(--transition);
        }

        .profile-form:hover {
          box-shadow: var(--shadow-hover);
        }

        .form-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--light-gray);
        }

        .form-header h5 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .form-header h5::before {
          content: '';
          width: 4px;
          height: 24px;
          background: var(--gradient-accent);
          border-radius: 2px;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          font-weight: 600;
          color: var(--dark-gray);
          margin-bottom: 0.5rem;
          display: block;
          font-size: 0.95rem;
        }

        .form-control {
          width: 100%;
          padding: 1rem;
          border: 2px solid var(--border);
          border-radius: 12px;
          font-size: 1rem;
          transition: var(--transition);
          background: var(--white);
        }

        .form-control:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
          transform: translateY(-1px);
        }

        .form-control:hover {
          border-color: var(--primary-light);
        }

        textarea.form-control {
          resize: vertical;
          min-height: 100px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-actions {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid var(--light-gray);
          display: flex;
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
          <h2>Mi Perfil</h2>
          <p>Gestiona tu información personal y configuración</p>
        </div>
        
        <div class="profile-container">
          <!-- Sidebar con información del perfil -->
          <div class="profile-sidebar">
            <div class="profile-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            
            <div class="profile-name">John Doe</div>
            <div class="profile-role">Ganadero Profesional</div>
            
            <div class="profile-stats">
              <div class="stat-item">
                <div class="stat-number">156</div>
                <div class="stat-label">Cabezas</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">23</div>
                <div class="stat-label">Ventas</div>
              </div>
            </div>
            
            <button class="btn btn-outline-primary">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M12 19v-6M12 5v2m0 0a7 7 0 1 1 0 14a7 7 0 0 1 0-14z" stroke="currentColor" stroke-width="2"/>
              </svg>
              Cambiar Foto
            </button>
            
            <button class="btn btn-outline-danger" id="logoutBtnProfile" style="margin-top: 1rem; width: 100%;">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2"/>
              </svg>
              Cerrar Sesión
            </button>
          </div>
          
          <!-- Formulario principal -->
          <div class="profile-form">
            <div class="form-header">
              <h5>Información Personal</h5>
            </div>
            
            <form>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" value="John" placeholder="Tu nombre">
                </div>
                <div class="form-group">
                  <label class="form-label">Apellido</label>
                  <input type="text" class="form-control" value="Doe" placeholder="Tu apellido">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Correo Electrónico</label>
                  <input type="email" class="form-control" value="john.doe@example.com" placeholder="tu@email.com">
                </div>
                <div class="form-group">
                  <label class="form-label">Teléfono</label>
                  <input type="tel" class="form-control" value="+507 6123-4567" placeholder="+507 0000-0000">
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Dirección</label>
                <textarea class="form-control" rows="3" placeholder="Tu dirección completa">Chiriquí, Panama</textarea>
              </div>
              
              <div class="form-actions">
                <button type="button" class="btn btn-cancel">Cancelar</button>
                <button type="submit" class="btn btn-save">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('trader-profile', TraderProfile); 