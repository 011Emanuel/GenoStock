class DashboardTrader extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          --sidebar-width: 280px;
          --sidebar-collapsed-width: 70px;
          --header-height: 70px;
          --footer-height: 60px;
          --primary: #2c5530;
          --primary-dark: #1b3a1d;
          --accent: #ffa726;
          --white: #fff;
          --sidebar-bg: #232e23;
          --sidebar-text: #e0e0e0;
          --sidebar-active: #ffa726;
          --sidebar-hover: #2c5530;
          --transition: 0.3s cubic-bezier(.4,0,.2,1);
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
          position: relative;
        }
        
        /* Sidebar */
        .sidebar {
          width: var(--sidebar-width);
          background: linear-gradient(180deg, var(--sidebar-bg) 0%, #1b3a1d 100%);
          color: var(--sidebar-text);
          transition: width var(--transition);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
          box-shadow: 2px 0 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .sidebar.collapsed {
          width: var(--sidebar-collapsed-width);
        }
        
        /* Header dentro del sidebar */
        .sidebar-header {
          padding: 1.5rem 1.5rem 1rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          transition: padding var(--transition);
        }
        
        .sidebar.collapsed .sidebar-header {
          padding: 1rem 0.5rem 0.5rem 0.5rem;
        }
        
        .sidebar-toggle {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          color: var(--sidebar-text);
          padding: 0.8rem;
          cursor: pointer;
          outline: none;
          border-radius: 8px;
          transition: all 0.2s ease;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        .sidebar-toggle:hover {
          color: var(--accent);
          background: rgba(255,255,255,0.3);
          transform: scale(1.05);
        }
        
        .sidebar.collapsed .sidebar-toggle {
          width: 32px;
          height: 32px;
          margin-bottom: 0.5rem;
        }
        
        /* Navegación del sidebar */
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem 1rem 0 1rem;
          overflow-y: auto;
        }
        
        .sidebar.collapsed .sidebar-nav {
          padding: 0.5rem 0.5rem 0 0.5rem;
          align-items: center;
        }
        
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.2rem;
          color: var(--sidebar-text);
          text-decoration: none;
          font-size: 1rem;
          border-radius: 12px;
          transition: all var(--transition);
          cursor: pointer;
          white-space: nowrap;
          font-weight: 500;
          position: relative;
        }
        
        .sidebar.collapsed .sidebar-link {
          justify-content: center;
          padding: 0.8rem 0.5rem;
          border-radius: 8px;
        }
        
        .sidebar-link.active, .sidebar-link:hover {
          background: var(--sidebar-hover);
          color: var(--accent);
          box-shadow: 0 2px 12px rgba(255,167,38,0.15);
        }
        
        .sidebar.collapsed .sidebar-label {
          display: none;
        }
        
        .sidebar-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition);
        }
        
        .sidebar.collapsed .sidebar-icon {
          width: 20px;
          height: 20px;
        }
        
        /* Contenido principal */
        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          transition: margin-left var(--transition);
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: calc(100vw - var(--sidebar-width));
          box-sizing: border-box;
        }
        
        .main-content.sidebar-collapsed {
          margin-left: var(--sidebar-collapsed-width);
          width: calc(100vw - var(--sidebar-collapsed-width));
        }
        
        /* Header principal */
        .main-header {
          height: var(--header-height);
          background: var(--white);
          box-shadow: 0 2px 12px rgba(44,85,48,0.07);
          position: relative;
          z-index: 100;
          transition: all var(--transition);
          border-bottom: 1px solid var(--border);
          width: 100%;
          margin-left: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          box-sizing: border-box;
        }
        
        .main-header .header-bar {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          margin-left: 0 !important;
          left: 0 !important;
          right: 0 !important;
          transition: all var(--transition) !important;
          overflow: hidden;
          display: grid !important;
          grid-template-columns: 1fr 300px !important;
          gap: 1.5rem !important;
          padding: 0 2rem !important;
          box-sizing: border-box !important;
        }
        
        /* Área de contenido */
        .content-area {
          flex: 1;
          padding: 2rem 2.5rem;
          background: #f5f7fa;
          min-height: calc(100vh - var(--header-height) - var(--footer-height));
          transition: all var(--transition);
        }
        
        /* Footer principal */
        .main-footer {
          height: var(--footer-height);
          background: var(--white);
          border-top: 1px solid var(--border);
          transition: all var(--transition);
        }
        
        /* Slots para componentes */
        ::slotted(section),
        ::slotted(trader-overview),
        ::slotted(trader-profile),
        ::slotted(trader-sales),
        ::slotted(trader-livestock),
        ::slotted(trader-settings) {
          background: var(--white);
          border-radius: var(--card-radius);
          box-shadow: var(--card-shadow);
          padding: 2rem;
          margin-bottom: 1.5rem;
          border: 1px solid var(--border);
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 0.4s var(--transition), transform 0.4s var(--transition);
          display: none;
        }
        
        ::slotted(.active) {
          display: block !important;
          opacity: 1;
          transform: translateX(0);
        }
        
        /* Responsive */
        @media (max-width: 991px) {
          .sidebar {
            transform: translateX(-100%);
            width: 280px;
          }
          
          .sidebar.mobile-open {
            transform: translateX(0);
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .main-content.sidebar-collapsed {
            margin-left: 0;
          }
          
          .content-area {
            padding: 1.5rem 1rem;
          }
        }
        
        /* Overlay para móvil */
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
        }
        
        @media (max-width: 991px) {
          .sidebar-overlay.active {
            display: block;
          }
        }
      </style>
      
      <div class="dashboard-layout">
        <!-- Overlay para móvil -->
        <div class="sidebar-overlay" id="sidebarOverlay"></div>
        
        <!-- Sidebar -->
          <nav class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <button class="sidebar-toggle" id="sidebarToggle" title="Expand/collapse sidebar">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="sidebar-header-content" id="sidebarHeader"></div>
          </div>
          
            <div class="sidebar-nav">
              <a class="sidebar-link active" data-section="overview">
              <span class="sidebar-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
                </svg>
              </span>
                <span class="sidebar-label">Overview</span>
              </a>
              <a class="sidebar-link" data-section="profile">
              <span class="sidebar-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                </svg>
              </span>
                <span class="sidebar-label">Profile</span>
              </a>
              <a class="sidebar-link" data-section="sales">
              <span class="sidebar-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
                </svg>
              </span>
                <span class="sidebar-label">Sales</span>
              </a>
              <a class="sidebar-link" data-section="livestock">
              <span class="sidebar-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </span>
                <span class="sidebar-label">My Livestock</span>
              </a>
              <a class="sidebar-link" data-section="settings">
              <span class="sidebar-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" fill="currentColor"/>
                </svg>
              </span>
                <span class="sidebar-label">Settings</span>
              </a>
            </div>
          </nav>
        
        <!-- Contenido principal -->
        <div class="main-content" id="mainContent">
          <div class="main-header" id="mainHeader"></div>
          <div class="content-area">
            <slot></slot>
          </div>
          <div class="main-footer" id="mainFooter"></div>
        </div>
      </div>
    `;
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
  
  connectedCallback() {
    this.loadComponents();
    this.setupSidebarToggle();
    this.setupNavigation();
    this.setupMobileOverlay();
  }
  
  async loadComponents() {
    // Cargar header-auth en el sidebar
    await this.loadHeaderAuth();
    
    // Cargar header-auth en el contenido principal
    await this.loadMainHeader();
    
    // Cargar footer-auth en el contenido principal
    await this.loadMainFooter();
  }
  
  async loadHeaderAuth() {
    const headerContainer = this.shadowRoot.getElementById('sidebarHeader');
    if (!headerContainer) return;
    
    try {
      // Crear un header simple para el sidebar con avatar, nombre y rol
      const header = document.createElement('div');
      header.className = 'sidebar-header-simple';
      header.innerHTML = `
        <style>
          .sidebar-header-simple {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.8rem;
            padding: 1rem 0;
          }
          .sidebar-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .sidebar-avatar img {
            border-radius: 50%;
            width: 50px;
            height: 50px;
            object-fit: cover;
            border: 2px solid var(--accent);
          }
          .sidebar-user-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.3rem;
            text-align: center;
          }
          .sidebar-username {
            color: var(--sidebar-text);
            font-weight: 600;
            font-size: 1rem;
            line-height: 1.2;
          }
          .sidebar-user-role {
            font-size: 0.8em;
            color: var(--accent);
            background: rgba(255,255,255,0.08);
            border-radius: 4px;
            padding: 2px 8px;
            font-weight: 500;
            line-height: 1.2;
          }
          .sidebar.collapsed .sidebar-user-info {
            display: none;
          }
          .sidebar.collapsed .sidebar-avatar img {
            width: 40px;
            height: 40px;
          }
        </style>
        <div class="sidebar-avatar">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(localStorage.getItem('name') || localStorage.getItem('username') || 'U')}" alt="Avatar">
        </div>
        <div class="sidebar-user-info">
          <div class="sidebar-username">${localStorage.getItem('name') || localStorage.getItem('username') || 'Usuario'}</div>
          <div class="sidebar-user-role">${localStorage.getItem('role') ? (localStorage.getItem('role').charAt(0).toUpperCase() + localStorage.getItem('role').slice(1)) : ''}</div>
        </div>
      `;
      
      headerContainer.appendChild(header);
    } catch (error) {
      console.error('Error loading sidebar header:', error);
    }
  }
  
  async loadMainHeader() {
    const headerContainer = this.shadowRoot.getElementById('mainHeader');
    if (!headerContainer) return;
    
    try {
      // Crear header con logo a la izquierda y marketplace/store + logout a la derecha
      const header = document.createElement('div');
      header.className = 'dashboard-header-new';
      header.innerHTML = `
        <style>
          .dashboard-header-new {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--white);
            padding: 0 2rem;
            height: 100%;
            border-bottom: 1px solid var(--border);
          }
          .header-logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .header-logo img {
            height: 42px;
          }
          .header-logo span {
            font-size: 1.6rem;
            font-weight: bold;
            color: var(--primary);
          }
          .header-right {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .marketplace-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: var(--primary);
            color: var(--white);
            border: none;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
          }
          .marketplace-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-1px);
            color: var(--white);
          }
          .marketplace-btn svg {
            width: 16px;
            height: 16px;
          }
          .header-logout {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(220,53,69,0.1);
            color: #dc3545;
            border: 1px solid rgba(220,53,69,0.3);
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
          }
          .header-logout:hover {
            background: rgba(220,53,69,0.2);
            color: #dc3545;
            transform: translateY(-1px);
          }
          .header-logout svg {
            width: 16px;
            height: 16px;
          }
          @media (max-width: 768px) {
            .dashboard-header-new {
              padding: 0 1rem;
            }
            .header-logo span {
              font-size: 1.2rem;
            }
            .header-logo img {
              height: 32px;
            }
            .marketplace-btn span,
            .header-logout span {
              display: none;
            }
            .marketplace-btn,
            .header-logout {
              padding: 0.5rem;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              justify-content: center;
            }
          }
        </style>
        <div class="header-logo">
          <img src="logo_small.png" alt="GenoStock">
          <span>GenoStock</span>
        </div>
        <div class="header-right">
          <button class="marketplace-btn" id="marketplaceBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Marketplace</span>
          </button>
          <button class="header-logout" id="dashboardLogout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      `;
      
      // Agregar funcionalidad de logout
      setTimeout(() => {
        const logoutBtn = header.querySelector('#dashboardLogout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Dashboard logout clicked');
            localStorage.removeItem('username');
            localStorage.removeItem('name');
            localStorage.removeItem('role');
            location.reload();
          });
        }
        
        // Agregar funcionalidad de marketplace
        const marketplaceBtn = header.querySelector('#marketplaceBtn');
        if (marketplaceBtn) {
          marketplaceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Marketplace clicked');
            window.location.href = '../../marketplace.html';
          });
        }
      }, 0);
      
      headerContainer.appendChild(header);
    } catch (error) {
      console.error('Error loading dashboard header:', error);
    }
  }
  
  async loadMainFooter() {
    const footerContainer = this.shadowRoot.getElementById('mainFooter');
    if (!footerContainer) return;
    
    try {
      if (!window.createAuthFooter) {
        await this.loadScript('../../components/footer-auth.js');
      }
      
          if (window.createAuthFooter) {
        const footer = window.createAuthFooter();
        footerContainer.appendChild(footer);
      }
    } catch (error) {
      console.error('Error loading main footer:', error);
    }
  }
  
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  setupSidebarToggle() {
    const sidebar = this.shadowRoot.getElementById('sidebar');
    const mainContent = this.shadowRoot.getElementById('mainContent');
    const toggle = this.shadowRoot.getElementById('sidebarToggle');
    const overlay = this.shadowRoot.getElementById('sidebarOverlay');
    
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('sidebar-collapsed');
      
      // Cambiar el icono del botón
      const icon = toggle.querySelector('svg');
      if (sidebar.classList.contains('collapsed')) {
        icon.innerHTML = '<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      } else {
        icon.innerHTML = '<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      }
    });
    
    // Cerrar sidebar en móvil al hacer clic en overlay
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
      });
    }
  }
  
  setupNavigation() {
    const links = this.shadowRoot.querySelectorAll('.sidebar-link');
    const slot = this.shadowRoot.querySelector('slot');
    let assignedSections = [];
    
    const updateSections = (sectionName) => {
      assignedSections.forEach(sec => {
        if (sec.id === sectionName) {
          sec.classList.add('active');
          sec.style.display = '';
          void sec.offsetWidth; // Forzar reflow
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
          sec.style.display = 'none';
        }
      });
    };
    
    slot.addEventListener('slotchange', () => {
      assignedSections = slot.assignedElements();
      assignedSections.forEach(sec => {
        if (!sec.classList.contains('active')) sec.style.display = 'none';
        else sec.style.display = '';
      });
    });
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const sectionName = link.getAttribute('data-section');
        updateSections(sectionName);
        
        // En móvil, cerrar el sidebar después de la navegación
        const sidebar = this.shadowRoot.getElementById('sidebar');
        const overlay = this.shadowRoot.getElementById('sidebarOverlay');
        if (window.innerWidth <= 991) {
          sidebar.classList.remove('mobile-open');
          if (overlay) overlay.classList.remove('active');
        }
      });
    });
  }
  
  setupMobileOverlay() {
    // Agregar botón de menú para móvil
    const mainHeader = this.shadowRoot.getElementById('mainHeader');
    if (mainHeader) {
      const mobileMenuBtn = document.createElement('button');
      mobileMenuBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/>
        </svg>
      `;
      mobileMenuBtn.style.cssText = `
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--primary);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        display: none;
      `;
      
      mobileMenuBtn.addEventListener('click', () => {
        const sidebar = this.shadowRoot.getElementById('sidebar');
        const overlay = this.shadowRoot.getElementById('sidebarOverlay');
        sidebar.classList.add('mobile-open');
        if (overlay) overlay.classList.add('active');
      });
      
      mainHeader.appendChild(mobileMenuBtn);
      
      // Mostrar botón en móvil
      const showMobileMenu = () => {
        if (window.innerWidth <= 991) {
          mobileMenuBtn.style.display = 'block';
        } else {
          mobileMenuBtn.style.display = 'none';
        }
      };
      
      window.addEventListener('resize', showMobileMenu);
      showMobileMenu();
    }
  }
}

customElements.define('dashboard-trader', DashboardTrader); 