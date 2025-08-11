// Unified header for authenticated users
// Works both outside and inside the dashboard
(function() {
  if (window.createAuthHeader) return; // Avoid redefinition
  
  function createAuthHeader(options = {}) {
    // Opciones por defecto
    const config = {
      showSearch: true,
      showLogo: true,
      isDashboard: false,
      ...options
    };
    
    // Create main elements
    const header = document.createElement('header');
    header.className = 'header-bar';
    
    // Determinar el grid template basado en las opciones
    let gridTemplate = '220px 1fr 300px';
    if (!config.showSearch) {
      gridTemplate = '1fr 300px';
    }
    if (!config.showLogo) {
      gridTemplate = '1fr 300px';
    }
    
    header.innerHTML = `
      <style>
        :host, .header-bar {
          --header-height: 84px;
          --primary: #2c5530;
          --primary-dark: #1b3a1d;
          --accent: #ffa726;
          --white: #fff;
          --header-z: 1000;
        }
        .header-bar {
          display: grid;
          grid-template-columns: ${gridTemplate};
          align-items: center;
          background: var(--primary);
          position: ${config.isDashboard ? 'relative' : 'fixed'};
          width: 100%;
          top: 0;
          z-index: var(--header-z);
          height: var(--header-height);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          padding: 0 2rem;
          gap: 1.5rem;
        }
        .header-col.logo {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .navbar-brand {
          font-size: 1.6rem;
          font-weight: bold;
          color: var(--white) !important;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          white-space: nowrap;
        }
        .navbar-brand img {
          height: 42px;
        }
        .header-col.search {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .search-container {
          position: relative;
          width: 100%;
          max-width: 500px;
        }
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: none;
          border-radius: 25px;
          background: rgba(255,255,255,0.95);
          color: #333;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }
        .search-input:focus {
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(255,167,38,0.3);
        }
        .search-input::placeholder {
          color: #666;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          font-size: 1.1rem;
        }
        .header-col.auth {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          position: relative;
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.2s;
          position: relative;
          z-index: 1001;
        }
        .user-section:hover {
          background: rgba(255,255,255,0.1);
        }
        .avatar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }
        .avatar img {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          object-fit: cover;
          border: 2px solid var(--accent);
        }
        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.1rem;
        }
        .username {
          color: var(--white);
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.2;
        }
        .user-role {
          font-size: 0.8em;
          color: #ffe0a3;
          background: rgba(255,255,255,0.08);
          border-radius: 4px;
          padding: 1px 6px;
          font-weight: 500;
          line-height: 1.2;
        }
        .dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 1000;
        }
        .dropdown-toggle {
          display: none;
        }
        .dropdown-menu {
          display: none;
          position: relative;
          background: #fff;
          border: 1px solid #e0e0e0;
          min-width: 180px;
          z-index: 1000;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          overflow: hidden;
          padding: 0.5rem 0;
          margin-top: 8px;
        }
        .dropdown-menu .dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.8rem 1.2rem;
          color: #333;
          text-decoration: none;
          font-size: 1rem;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          transition: background 0.2s;
          cursor: pointer;
          gap: 0.8rem;
        }
        .dropdown-menu .dropdown-item:hover {
          background: #f8f9fa;
        }
        .dropdown-menu .dropdown-item svg {
          width: 18px;
          height: 18px;
          color: #666;
        }
        .dropdown-menu .dropdown-item.logout-btn {
          color: #dc3545;
          border-top: 1px solid #e0e0e0;
          margin-top: 0.5rem;
        }
        .dropdown-menu .dropdown-item.logout-btn:hover {
          background: #fff5f5;
        }
        .dropdown-menu .dropdown-item.logout-btn svg {
          color: #dc3545;
        }
        @media (max-width: 991px) {
          .header-bar {
            grid-template-columns: ${config.showSearch ? '180px 1fr 250px' : '1fr 250px'};
            padding: 0 1.5rem;
            gap: 1rem;
          }
          .navbar-brand {
            font-size: 1.4rem;
          }
          .navbar-brand img {
            height: 38px;
          }
          .search-container {
            max-width: 350px;
          }
          .search-input {
            padding: 0.6rem 0.8rem 0.6rem 2.5rem;
            font-size: 0.9rem;
          }
          .username {
            font-size: 0.9rem;
          }
          .user-role {
            font-size: 0.75em;
            padding: 1px 4px;
          }
          .user-section {
            gap: 0.6rem;
          }
          .avatar img {
            width: 36px;
            height: 36px;
          }
        }
        @media (max-width: 768px) {
          .header-bar {
            grid-template-columns: ${config.showSearch ? '150px 1fr 180px' : '1fr 180px'};
            padding: 0 1rem;
            gap: 0.8rem;
          }
          .navbar-brand {
            font-size: 1.2rem;
          }
          .navbar-brand img {
            height: 32px;
          }
          .search-container {
            max-width: 200px;
          }
          .search-input {
            padding: 0.5rem 0.6rem 0.5rem 2.2rem;
            font-size: 0.85rem;
          }
          .username {
            font-size: 0.85rem;
          }
          .user-role {
            display: none;
          }
          .user-section {
            gap: 0.5rem;
          }
          .avatar img {
            width: 32px;
            height: 32px;
          }
        }
      </style>
      ${config.showLogo ? `
        <div class="header-col logo">
          <a class="navbar-brand" href="${localStorage.getItem('role') === 'rancher' ? 'dashboard/rancher/rancher.html' : localStorage.getItem('role') === 'trader' ? 'dashboard/trader/trader.html' : 'marketplace.html'}">
            <img src="logo_small.png" alt="GenoStock" height="40">
            <span>GenoStock</span>
          </a>
        </div>
      ` : ''}
      ${config.showSearch ? `
        <div class="header-col search">
          <div class="search-container">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
                                        <input type="text" class="search-input" placeholder="Search in GenoStock..." id="searchInput">
          </div>
        </div>
      ` : ''}
      <div class="header-col auth">
        <div class="user-section">
          <div class="avatar">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(localStorage.getItem('name') || localStorage.getItem('username') || 'U')}" alt="Avatar">
          </div>
          <div class="user-info">
                                        <span class="username">${localStorage.getItem('name') || localStorage.getItem('username') || 'User'}</span>
            <span class="user-role">${localStorage.getItem('role') ? (localStorage.getItem('role').charAt(0).toUpperCase() + localStorage.getItem('role').slice(1)) : ''}</span>
          </div>
        </div>
        <div class="dropdown">
          <button class="dropdown-toggle">▼</button>
          <div class="dropdown-menu">
            <a href="marketplace.html" class="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Marketplace
            </a>
            <a href="${localStorage.getItem('role') === 'rancher' ? 'dashboard/rancher/rancher.html' : 'dashboard/trader/trader.html'}" class="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Dashboard
            </a>
            <a href="#" class="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Profile
            </a>
            <a href="#" class="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 20h9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Settings
            </a>
            <a href="#" class="dropdown-item logout-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Logout
            </a>
          </div>
        </div>
      </div>
    `;
    
    // Dropdown logic
    setTimeout(() => {
      const dropdown = header.querySelector('.dropdown');
      const userSection = header.querySelector('.user-section');
      const menu = dropdown?.querySelector('.dropdown-menu');
      
      console.log('Dropdown elements:', { dropdown, userSection, menu });
      
      if (!dropdown || !userSection || !menu) {
        console.error('Missing dropdown elements');
        return;
      }
      
      // Toggle dropdown function
      const toggleDropdown = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Toggle dropdown clicked');
        
        const isVisible = menu.style.display === 'block';
        menu.style.display = isVisible ? 'none' : 'block';
        console.log('Dropdown visibility:', !isVisible);
      };
      
      // Add click event to user section
      userSection.addEventListener('click', toggleDropdown);
      
      // Close dropdown when clicking outside
      const closeDropdown = function(e) {
        if (!userSection.contains(e.target) && !dropdown.contains(e.target)) {
          menu.style.display = 'none';
          console.log('Dropdown closed by outside click');
        }
      };
      
      // Add event listener to document for closing dropdown
      document.addEventListener('click', closeDropdown);
      
      // Add event listener to window for escape key
      window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          menu.style.display = 'none';
          console.log('Dropdown closed by Escape key');
        }
      });
      
      // Logout functionality
      const logoutBtn = dropdown.querySelector('.logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Logout clicked');
          localStorage.removeItem('username');
          localStorage.removeItem('name');
          localStorage.removeItem('role');
          location.reload();
        });
      }
      
      // Prevent dropdown from closing when clicking inside it
      dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
      });
      
      console.log('Dropdown event listeners attached successfully');
    }, 200);
    
    // Search functionality
    if (config.showSearch) {
      setTimeout(() => {
        const searchInput = header.querySelector('#searchInput');
        if (searchInput) {
          searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
              const query = this.value.trim();
              if (query) {
                console.log('Buscando:', query);
              }
            }
          });
        }
      }, 0);
    }
    
    return header;
  }
  
  // Function to create dashboard header (without search, without logo)
  function createDashboardHeader() {
    return createAuthHeader({
      showSearch: false,
      showLogo: true,
      isDashboard: true
    });
  }
  
  // Function to create complete header (with search, with logo)
  function createFullHeader() {
    return createAuthHeader({
      showSearch: true,
      showLogo: true,
      isDashboard: false
    });
  }
  
  window.createAuthHeader = createAuthHeader;
  window.createDashboardHeader = createDashboardHeader;
  window.createFullHeader = createFullHeader;
})();

// Function to render auth header if user is logged in
function renderAuthHeaderIfLoggedIn() {
  const username = localStorage.getItem('username');
  if (username) {
    // Eliminar header anterior si existe
    const oldHeader = document.querySelector('header');
    if (oldHeader) oldHeader.remove();
    // Insertar el nuevo header completo
    document.body.insertBefore(createFullHeader(), document.body.firstChild);
    
    // Commented: Automatic redirect from marketplace.html to dashboard
// This logic was removed to allow users to navigate freely to marketplace.html
// from their dashboards without being automatically redirected
    /*
    if (window.location.pathname.includes('marketplace.html')) {
      const role = localStorage.getItem('role');
      if (role === 'rancher') {
        window.location.href = 'dashboard/rancher/rancher.html';
      } else if (role === 'trader') {
        window.location.href = 'dashboard/trader/trader.html';
      }
    }
    */
  }
}

// Call function when loading page
window.addEventListener('DOMContentLoaded', renderAuthHeaderIfLoggedIn); 