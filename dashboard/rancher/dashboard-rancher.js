class DashboardRancher extends HTMLElement {
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
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          position: relative;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
        
        /* Sidebar navigation */
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1rem 0;
        }
        
        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 0.8rem 1.5rem;
          color: var(--sidebar-text);
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          gap: 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .sidebar-link:hover {
          background: var(--sidebar-hover);
          color: var(--white);
        }
        
        .sidebar-link.active {
          background: var(--sidebar-active);
          color: var(--white);
        }
        
        .sidebar-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--white);
        }
        
        .sidebar-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }
        
        .sidebar-label {
          font-weight: 500;
          font-size: 0.95rem;
          white-space: nowrap;
          transition: opacity var(--transition);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .sidebar.collapsed .sidebar-label {
          opacity: 0;
        }
        
        /* Contenido principal */
        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          transition: margin-left var(--transition);
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
        .sidebar.collapsed ~ .main-content {
          margin-left: var(--sidebar-collapsed-width);
        }
        
        /* Header principal */
        .main-header {
          height: var(--header-height);
          background: var(--white);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        /* Content area */
        .content-area {
          flex: 1;
          padding: 2rem 2.5rem;
          background: #f5f7fa;
          min-height: calc(100vh - var(--header-height) - var(--footer-height));
          transition: all var(--transition);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
        ::slotted(rancher-overview),
        ::slotted(rancher-profile),
        ::slotted(rancher-livestock),
        ::slotted(rancher-health),
        ::slotted(rancher-settings) {
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
        @media (max-width: 1200px) {
          .sidebar {
            width: 240px;
          }
          
          .main-content {
            margin-left: 240px;
          }
          
          .sidebar.collapsed {
            width: 60px;
          }
          
          .sidebar.collapsed ~ .main-content {
            margin-left: 60px;
          }
        }
        
        @media (max-width: 992px) {
          .sidebar {
            width: 220px;
          }
          
          .main-content {
            margin-left: 220px;
          }
          
          .sidebar.collapsed {
            width: 50px;
          }
          
          .sidebar.collapsed ~ .main-content {
            margin-left: 50px;
          }
          
          .content-area {
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform var(--transition);
            width: 280px;
          }
          
          .sidebar.mobile-open {
            transform: translateX(0);
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .content-area {
            padding: 1rem;
          }
          
          .main-header {
            padding: 0 1rem;
          }
        }
        
        /* Mobile overlay */
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
        <!-- Mobile overlay -->
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
            <a class="sidebar-link" data-section="livestock">
              <span class="sidebar-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                </svg>
              </span>
              <span class="sidebar-label">Livestock</span>
            </a>
            <a class="sidebar-link" data-section="health">
              <span class="sidebar-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z" fill="currentColor"/>
                </svg>
              </span>
              <span class="sidebar-label">Health</span>
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
    
    // Cargar footer-auth
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
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            background: var(--white) !important;
            padding: 0 3rem !important;
            height: 100% !important;
            border-bottom: 1px solid var(--border) !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
            width: 100% !important;
            position: relative !important;
            z-index: 1000 !important;
          }
          
          .mobile-menu-btn {
            display: none !important;
            align-items: center !important;
            justify-content: center !important;
            width: 40px !important;
            height: 40px !important;
            background: var(--primary) !important;
            color: var(--white) !important;
            border: none !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            margin-right: 1rem !important;
            transition: all 0.2s ease !important;
          }
          
          .mobile-menu-btn:hover {
            background: var(--primary-dark) !important;
            transform: scale(1.05) !important;
          }
          
          @media (max-width: 768px) {
            .dashboard-header-new {
              padding: 0 1rem !important;
            }
            
            .mobile-menu-btn {
              display: flex !important;
            }
            
            .header-logo span {
              display: none !important;
            }
          }
          
          @media (max-width: 576px) {
            .dashboard-header-new {
              padding: 0 0.75rem !important;
            }
          }
          .header-logo {
            display: flex !important;
            align-items: center !important;
            gap: 0.8rem !important;
            flex-shrink: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .header-logo img {
            height: 45px !important;
            width: auto !important;
            display: block !important;
          }
          .header-logo span {
            font-size: 1.8rem !important;
            font-weight: bold !important;
            color: var(--primary) !important;
            letter-spacing: 0.01em !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .header-right {
            display: flex !important;
            align-items: center !important;
            gap: 1.5rem !important;
            flex-shrink: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .marketplace-btn {
            display: flex !important;
            align-items: center !important;
            gap: 0.7rem !important;
            padding: 0.7rem 1.3rem !important;
            background: var(--primary) !important;
            color: var(--white) !important;
            border: none !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            font-size: 0.95rem !important;
            text-decoration: none !important;
            transition: all 0.2s ease !important;
            cursor: pointer !important;
          }
          
          .marketplace-btn:hover {
            background: var(--primary-dark) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(44,85,48,0.2) !important;
          }
          
          .logout-btn {
            display: flex !important;
            align-items: center !important;
            gap: 0.7rem !important;
            padding: 0.7rem 1.3rem !important;
            background: #dc3545 !important;
            color: var(--white) !important;
            border: none !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            font-size: 0.95rem !important;
            text-decoration: none !important;
            transition: all 0.2s ease !important;
            cursor: pointer !important;
          }
          
          .logout-btn:hover {
            background: #c82333 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(220,53,69,0.2) !important;
          }
          
          @media (max-width: 768px) {
            .header-right {
              gap: 1rem !important;
            }
            
            .marketplace-btn,
            .logout-btn {
              padding: 0.6rem 1rem !important;
              font-size: 0.9rem !important;
            }
          }
          
          @media (max-width: 576px) {
            .header-right {
              gap: 0.5rem !important;
            }
            
            .marketplace-btn,
            .logout-btn {
              padding: 0.5rem 0.8rem !important;
              font-size: 0.85rem !important;
            }
            
            .marketplace-btn span,
            .logout-btn span {
              display: none !important;
            }
          }
        </style>
        
        <div class="header-logo">
          <button class="mobile-menu-btn" id="mobileMenuBtn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <img src="../../logo_small.png" alt="GenoStock">
          <span>GenoStock</span>
        </div>
        
        <div class="header-right">
          <button class="marketplace-btn" id="marketplaceBtn">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span>Marketplace</span>
          </button>
          
          <button class="logout-btn" id="dashboardLogout">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.39L22.17 13H8v2h14.17l-6.58 6.61L17 21l9-9zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      `;
      
      // Add logout functionality (sign out and navigate to index.html)
      setTimeout(() => {
        const logoutBtn = header.querySelector('#dashboardLogout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Dashboard logout clicked - performing full logout');
            localStorage.removeItem('username');
            localStorage.removeItem('name');
            localStorage.removeItem('role');
            window.location.href = '../../index.html';
          });
        }
        
        // Agregar funcionalidad de marketplace (redirigir a marketplace.html con header auth)
        const marketplaceBtn = header.querySelector('#marketplaceBtn');
        if (marketplaceBtn) {
          marketplaceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Marketplace clicked - redirecting to marketplace.html');
            window.location.href = '../../marketplace.html';
          });
        }
        
        // Agregar funcionalidad al logo (redirigir a marketplace.html con header auth)
        const headerLogo = header.querySelector('.header-logo');
        if (headerLogo) {
          headerLogo.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logo clicked - redirecting to marketplace.html');
            window.location.href = '../../marketplace.html';
          });
          headerLogo.style.cursor = 'pointer';
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
      
      // Change button icon
      const icon = toggle.querySelector('svg');
      if (sidebar.classList.contains('collapsed')) {
        icon.innerHTML = '<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      } else {
        icon.innerHTML = '<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      }
    });
    
    // Close sidebar on mobile when clicking overlay
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
        
        // On mobile, close sidebar after navigation
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
    const sidebar = this.shadowRoot.getElementById('sidebar');
    const overlay = this.shadowRoot.getElementById('sidebarOverlay');
    
    const showMobileMenu = () => {
      sidebar.classList.add('mobile-open');
      overlay.classList.add('active');
    };
    
    const hideMobileMenu = () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    };
    
    // Add event listener to mobile menu button
    const mobileMenuBtn = this.shadowRoot.querySelector('#mobileMenuBtn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', showMobileMenu);
    }
    
    // Cerrar al hacer clic en overlay
    if (overlay) {
      overlay.addEventListener('click', hideMobileMenu);
    }
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideMobileMenu();
      }
    });
  }
}

customElements.define('dashboard-rancher', DashboardRancher); 