class DashboardTrader extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          --sidebar-width: 240px;
          --sidebar-collapsed-width: 64px;
          --header-height: 70px;
          --footer-height: 44px;
          --primary: #2c5530;
          --primary-dark: #1b3a1d;
          --accent: #ffa726;
          --white: #fff;
          --sidebar-bg: #232e23;
          --sidebar-text: #e0e0e0;
          --sidebar-active: #ffa726;
          --sidebar-hover: #2c5530;
          --transition: 0.28s cubic-bezier(.4,2,.6,1);
          --card-radius: 16px;
          --card-shadow: 0 4px 24px rgba(44,85,48,0.10);
          --border: #e0e0e0;
          display: block;
          min-height: 100vh;
          background: #f5f7fa;
        }
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
        }
        .header {
          height: var(--header-height);
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--white);
          box-shadow: 0 2px 12px rgba(44,85,48,0.07);
        }
        .main-content {
          display: flex;
          flex: 1 1 auto;
          min-height: 0;
        }
        .sidebar {
          width: var(--sidebar-width);
          background: linear-gradient(180deg, var(--sidebar-bg) 80%, #1b3a1d 100%);
          color: var(--sidebar-text);
          transition: width var(--transition);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          min-width: 0;
          position: relative;
          z-index: 10;
          box-shadow: 2px 0 12px rgba(44,85,48,0.07);
        }
        .sidebar.collapsed {
          width: var(--sidebar-collapsed-width);
        }
        .sidebar-toggle {
          background: none;
          border: none;
          color: var(--sidebar-text);
          padding: 1.1rem 0.5rem 1.1rem 0.5rem;
          cursor: pointer;
          outline: none;
          align-self: flex-end;
          font-size: 1.4rem;
          transition: color 0.2s;
        }
        .sidebar-toggle:hover {
          color: var(--accent);
        }
        .sidebar-nav {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-top: 1.2rem;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          padding: 0.95rem 1.3rem;
          color: var(--sidebar-text);
          text-decoration: none;
          font-size: 1.13rem;
          border-radius: 12px;
          transition: background var(--transition), color var(--transition), box-shadow 0.2s;
          cursor: pointer;
          white-space: nowrap;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .sidebar-link.active, .sidebar-link:hover {
          background: var(--sidebar-hover);
          color: var(--accent);
          box-shadow: 0 2px 12px rgba(255,167,38,0.08);
        }
        .sidebar.collapsed .sidebar-label {
          display: none;
        }
        .sidebar-icon {
          width: 26px;
          height: 26px;
          display: inline-block;
        }
        .content-area {
          flex: 1 1 auto;
          padding: 2.5rem 2.8rem 2.2rem 2.8rem;
          min-width: 0;
          background: #f5f7fa;
          transition: margin-left var(--transition);
          display: flex;
          flex-direction: column;
        }
        ::slotted(section),
        ::slotted(trader-overview),
        ::slotted(trader-profile),
        ::slotted(trader-sales),
        ::slotted(trader-livestock),
        ::slotted(trader-settings) {
          background: var(--white);
          border-radius: var(--card-radius);
          box-shadow: var(--card-shadow);
          padding: 2.2rem 2.2rem 1.5rem 2.2rem;
          margin-bottom: 1.5rem;
          border: 1px solid var(--border);
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 0.35s var(--transition), transform 0.35s var(--transition);
          display: none;
        }
        ::slotted(.active) {
          display: block !important;
          opacity: 1;
          transform: translateX(0);
        }
        .footer {
          height: var(--footer-height);
          background: #232e23;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          letter-spacing: 0.01em;
          padding: 0 1.5rem;
          border-top: 1px solid #e0e0e0;
        }
        .footer a {
          color: var(--accent);
          margin-left: 8px;
          text-decoration: underline;
        }
        @media (max-width: 991px) {
          .dashboard-layout {
            flex-direction: column;
          }
          .main-content {
            flex-direction: column;
          }
          .sidebar {
            width: 100vw;
            min-width: 0;
            flex-direction: row;
            overflow-x: auto;
            height: 60px;
            position: sticky;
            top: var(--header-height);
            z-index: 99;
          }
          .sidebar.collapsed {
            width: 60px;
          }
          .sidebar-nav {
            flex-direction: row;
            gap: 0.2rem;
            margin-top: 0;
          }
          .sidebar-link {
            padding: 0.7rem 0.7rem;
            font-size: 1rem;
            border-radius: 8px;
          }
          .content-area {
            padding: 1.2rem 0.5rem 1rem 0.5rem;
          }
          ::slotted(section),
          ::slotted(trader-overview),
          ::slotted(trader-profile),
          ::slotted(trader-sales),
          ::slotted(trader-livestock),
          ::slotted(trader-settings) {
            padding: 1.2rem 0.7rem 1rem 0.7rem;
          }
        }
      </style>
      <div class="dashboard-layout">
        <div class="header" id="header-auth"></div>
        <div class="main-content">
          <nav class="sidebar" id="sidebar">
            <button class="sidebar-toggle" id="sidebarToggle" title="Expand/collapse sidebar">
              <svg class="sidebar-icon" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor"/></svg>
            </button>
            <div class="sidebar-nav">
              <a class="sidebar-link active" data-section="overview">
                <span class="sidebar-icon"> <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2"/></svg> </span>
                <span class="sidebar-label">Overview</span>
              </a>
              <a class="sidebar-link" data-section="profile">
                <span class="sidebar-icon"> <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4" stroke="currentColor" stroke-width="2" fill="none"/></svg> </span>
                <span class="sidebar-label">Profile</span>
              </a>
              <a class="sidebar-link" data-section="sales">
                <span class="sidebar-icon"> <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="7" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 11V7a4 4 0 0 0-8 0v4" stroke="currentColor" stroke-width="2" fill="none"/></svg> </span>
                <span class="sidebar-label">Sales</span>
              </a>
              <a class="sidebar-link" data-section="livestock">
                <span class="sidebar-icon"> <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="7" cy="12" r="2" fill="currentColor"/><circle cx="17" cy="12" r="2" fill="currentColor"/></svg> </span>
                <span class="sidebar-label">My Livestock</span>
              </a>
              <a class="sidebar-link" data-section="settings">
                <span class="sidebar-icon"> <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15.4 9a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z" stroke="currentColor" stroke-width="2" fill="none"/></svg> </span>
                <span class="sidebar-label">Settings</span>
              </a>
            </div>
          </nav>
          <div class="content-area">
            <slot></slot>
          </div>
        </div>
        <footer class="footer">
          &copy; 2024 GenoStock. <a href="#">Políticas</a>
        </footer>
      </div>
    `;
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    // Insertar header-auth
    const headerContainer = this.shadowRoot.getElementById('header-auth');
    if (headerContainer) {
      headerContainer.innerHTML = '';
      // Cargar header-auth.js si no está cargado
      if (!window.createAuthHeader) {
        const script = document.createElement('script');
        script.src = '../../components/header-auth.js';
        document.head.appendChild(script);
        script.onload = () => {
          if (window.createAuthHeader) {
            headerContainer.appendChild(window.createAuthHeader());
          }
        };
      } else {
        headerContainer.appendChild(window.createAuthHeader());
      }
    }
    // Sidebar toggle
    const sidebar = this.shadowRoot.getElementById('sidebar');
    const toggle = this.shadowRoot.getElementById('sidebarToggle');
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
    // Navegación de secciones
    const links = this.shadowRoot.querySelectorAll('.sidebar-link');
    const slot = this.shadowRoot.querySelector('slot');
    let assignedSections = [];
    const updateSections = (sectionName) => {
      assignedSections.forEach(sec => {
        if (sec.id === sectionName) {
          sec.classList.add('active');
          sec.style.display = '';
          // Forzar reflow para animación
          void sec.offsetWidth;
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
          sec.style.display = 'none';
        }
      });
    };
    // Cuando el slot cambia, actualiza las referencias
    slot.addEventListener('slotchange', () => {
      assignedSections = slot.assignedElements();
      assignedSections.forEach(sec => {
        if (!sec.classList.contains('active')) sec.style.display = 'none';
        else sec.style.display = '';
      });
    });
    // Sidebar navigation click
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const sectionName = link.getAttribute('data-section');
        updateSections(sectionName);
      });
    });
  }
}
customElements.define('dashboard-trader', DashboardTrader); 