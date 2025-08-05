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
        
        /* Main Content */
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
        
        /* Header */
        .main-header {
          height: var(--header-height);
          background: var(--white);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          padding: 0 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        /* Content Area */
        .content-area {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }
        
        /* Footer */
        .main-footer {
          height: var(--footer-height);
          background: var(--white);
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2rem;
          font-size: 0.9rem;
          color: var(--gray);
        }
        
        /* Mobile Overlay */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: all var(--transition);
        }
        
        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform var(--transition);
          }
          
          .sidebar.active {
            transform: translateX(0);
          }
          
          .main-content {
            margin-left: 0;
          }
          
          .content-area {
            padding: 1rem;
          }
        }
      </style>
      
      <div class="dashboard-layout">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <button class="sidebar-toggle" id="sidebarToggle">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
          </div>
          
          <nav class="sidebar-nav">
            <a href="#overview" class="sidebar-link active" data-section="overview">
              <div class="sidebar-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <span class="sidebar-label">Overview</span>
            </a>
            
            <a href="#profile" class="sidebar-link" data-section="profile">
              <div class="sidebar-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span class="sidebar-label">Profile</span>
            </a>
            
            <a href="#livestock" class="sidebar-link" data-section="livestock">
              <div class="sidebar-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21c4.97-4.97 8-8.13 8-11.5A5.5 5.5 0 0 0 12 4.5 5.5 5.5 0 0 0 4 9.5C4 12.87 7.03 16.03 12 21Z"/>
                </svg>
              </div>
              <span class="sidebar-label">Livestock</span>
            </a>
            
            <a href="#health" class="sidebar-link" data-section="health">
              <div class="sidebar-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/>
                </svg>
              </div>
              <span class="sidebar-label">Health</span>
            </a>
            
            <a href="#settings" class="sidebar-link" data-section="settings">
              <div class="sidebar-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
              </div>
              <span class="sidebar-label">Settings</span>
            </a>
          </nav>
        </aside>
        
        <!-- Mobile Overlay -->
        <div class="sidebar-overlay" id="sidebarOverlay"></div>
        
        <!-- Main Content -->
        <main class="main-content">
          <!-- Header -->
          <header class="main-header" id="mainHeader">
            <!-- Header content will be loaded here -->
          </header>
          
          <!-- Content Area -->
          <div class="content-area">
            <slot></slot>
          </div>
          
          <!-- Footer -->
          <footer class="main-footer" id="mainFooter">
            <!-- Footer content will be loaded here -->
          </footer>
        </main>
      </div>
    `;
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
  
  connectedCallback() {
    this.loadComponents();
  }
  
  async loadComponents() {
    await this.loadHeaderAuth();
    await this.loadMainHeader();
    await this.loadMainFooter();
    this.setupSidebarToggle();
    this.setupNavigation();
    this.setupMobileOverlay();
  }
  
  async loadHeaderAuth() {
    const headerContainer = this.shadowRoot.getElementById('mainHeader');
    if (!headerContainer) return;
    
    try {
      if (!window.createAuthHeader) {
        await this.loadScript('../../components/header-auth.js');
      }
      
      if (window.createAuthHeader) {
        const header = window.createAuthHeader();
        headerContainer.appendChild(header);
      }
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
            font-size: 0.9rem !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            text-decoration: none !important;
            box-shadow: 0 2px 8px rgba(44,85,48,0.2) !important;
            margin: 0 !important;
            outline: none !important;
          }
          .marketplace-btn:hover {
            background: var(--primary-dark) !important;
            transform: translateY(-2px) !important;
            color: var(--white) !important;
            box-shadow: 0 4px 12px rgba(44,85,48,0.3) !important;
            text-decoration: none !important;
          }
          .marketplace-btn svg {
            width: 18px !important;
            height: 18px !important;
            fill: currentColor !important;
          }
          .header-logout {
            display: flex !important;
            align-items: center !important;
            gap: 0.7rem !important;
            padding: 0.7rem 1.3rem !important;
            background: rgba(220,53,69,0.08) !important;
            color: #dc3545 !important;
            border: 1px solid rgba(220,53,69,0.2) !important;
            border-radius: 8px !important;
            font-size: 0.9rem !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            text-decoration: none !important;
            margin: 0 !important;
            outline: none !important;
          }
          .header-logout:hover {
            background: rgba(220,53,69,0.15) !important;
            color: #dc3545 !important;
            transform: translateY(-2px) !important;
            border-color: rgba(220,53,69,0.4) !important;
            text-decoration: none !important;
          }
          .header-logout svg {
            width: 18px !important;
            height: 18px !important;
            fill: currentColor !important;
          }
          @media (max-width: 768px) {
            .dashboard-header-new {
              padding: 0 1.5rem !important;
            }
            .header-logo span {
              font-size: 1.4rem !important;
            }
            .header-logo img {
              height: 38px !important;
            }
            .header-right {
              gap: 1rem !important;
            }
            .marketplace-btn span,
            .header-logout span {
              display: none !important;
            }
            .marketplace-btn,
            .header-logout {
              padding: 0.6rem !important;
              border-radius: 50% !important;
              width: 42px !important;
              height: 42px !important;
              justify-content: center !important;
            }
          }
          @media (max-width: 480px) {
            .dashboard-header-new {
              padding: 0 1rem !important;
            }
            .header-logo span {
              font-size: 1.2rem !important;
            }
            .header-logo img {
              height: 32px !important;
            }
          }
        </style>
        <div class="header-logo">
          <img src="../../logo_small.png" alt="GenoStock">
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
    });
    
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
  
  setupNavigation() {
    const links = this.shadowRoot.querySelectorAll('.sidebar-link');
    const sections = this.querySelectorAll('[id]');
    
    const updateSections = (sectionName) => {
      // Hide all sections
      sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
      });
      
      // Show selected section
      const selectedSection = this.querySelector(`#${sectionName}`);
      if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('active');
      }
      
      // Update active link
      links.forEach(link => {
        link.classList.remove('active');
      });
      
      const activeLink = this.shadowRoot.querySelector(`[data-section="${sectionName}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    };
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        updateSections(section);
        
        // Close mobile sidebar
        const sidebar = this.shadowRoot.getElementById('sidebar');
        const overlay = this.shadowRoot.getElementById('sidebarOverlay');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
      });
    });
  }
  
  setupMobileOverlay() {
    const sidebar = this.shadowRoot.getElementById('sidebar');
    const overlay = this.shadowRoot.getElementById('sidebarOverlay');
    
    const showMobileMenu = () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    };
    
    // Add mobile menu button if needed
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.innerHTML = `
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
    `;
    mobileMenuBtn.style.cssText = `
      position: fixed;
      top: 1rem;
      left: 1rem;
      z-index: 1001;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.5rem;
      cursor: pointer;
      display: none;
    `;
    
    if (window.innerWidth <= 768) {
      document.body.appendChild(mobileMenuBtn);
      mobileMenuBtn.addEventListener('click', showMobileMenu);
    }
    
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        if (!document.body.contains(mobileMenuBtn)) {
          document.body.appendChild(mobileMenuBtn);
        }
      } else {
        if (document.body.contains(mobileMenuBtn)) {
          document.body.removeChild(mobileMenuBtn);
        }
      }
    });
  }
}

customElements.define('dashboard-rancher', DashboardRancher); 