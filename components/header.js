class GenoHeader extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          --header-height: 84px;
        }
        .header-bar {
          display: grid;
          grid-template-columns: 180px 1fr 320px;
          align-items: center;
          background: var(--primary);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
          height: var(--header-height);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          padding: 0 2.2rem;
        }
        .header-col.logo {
          display: flex;
          align-items: center;
          min-width: 0;
          justify-content: flex-start;
        }
        .navbar-brand {
          font-size: 1.7rem;
          font-weight: bold;
          color: var(--white) !important;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          white-space: nowrap;
        }
        .navbar-brand img {
          height: 48px;
        }
        .header-col.menu {
          display: flex;
          justify-content: center;
          min-width: 0;
          position: relative;
        }
        .nav-menu {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
          position: relative;
        }
        .nav-link {
          color: var(--white) !important;
          font-weight: 500;
          font-size: 1.1rem;
          text-decoration: none;
          position: relative;
          padding: 0.4rem 0.6rem 0.7rem 0.6rem;
          border-radius: 0;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 20%;
          right: 20%;
          bottom: 0.2rem;
          height: 3px;
          background: var(--accent);
          border-radius: 2px;
          opacity: 0;
          transform: scaleX(0.3);
          transition: opacity 0.25s, transform 0.25s;
        }
        .nav-link:hover::after,
        .nav-link:focus::after,
        .nav-link.active::after {
          opacity: 1;
          transform: scaleX(1);
        }
        .nav-link.active {
          color: var(--accent) !important;
        }
        .header-col.auth {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.7rem;
          min-width: 0;
          padding-right: 0;
        }
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          margin-right: 0.5rem;
        }
        .search-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 50%;
          transition: background 0.2s;
          padding: 0;
        }
        .search-icon:focus,
        .search-icon:hover {
          background: rgba(255,255,255,0.12);
        }
        .search-svg {
          width: 24px;
          height: 24px;
          fill: var(--white);
          display: block;
        }
        .auth-buttons {
          display: flex;
          gap: 0.4rem;
        }
        .auth-btn {
          padding: 0.45rem 1.3rem;
          border-radius: 22px;
          border: none;
          font-weight: 500;
          font-size: 1.08rem;
          transition: all 0.3s;
          text-decoration: none;
          white-space: nowrap;
        }
        .login-btn {
          background: var(--white);
          color: var(--primary);
        }
        .login-btn:hover {
          background: var(--primary-dark);
          color: var(--white);
        }
        .register-btn {
          background: var(--accent);
          color: var(--white);
        }
        .register-btn:hover {
          background: var(--primary-dark);
        }
        /* Hamburger styles */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 44px;
          height: 44px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1100;
        }
        .hamburger span {
          display: block;
          width: 28px;
          height: 3px;
          margin: 4px 0;
          background: var(--white);
          border-radius: 2px;
          transition: all 0.3s;
        }
        /* Floating search bar */
        .floating-search {
          display: none;
          position: fixed;
          left: 0;
          right: 0;
          top: var(--header-height);
          z-index: 2000;
          width: 100vw;
          background: #fff;
          box-shadow: 0 8px 32px rgba(44,85,48,0.10);
          padding: 2.2rem 0 1.2rem 0;
          animation: fadeInSearch 0.2s;
        }
        .floating-search.active {
          display: flex;
          justify-content: center;
        }
        .floating-search-input {
          width: 92vw;
          max-width: 520px;
          padding: 1rem 2.2rem;
          border-radius: 32px;
          border: 2px solid var(--accent);
          font-size: 1.15rem;
          color: var(--primary);
          background: #fff;
          box-shadow: 0 2px 12px rgba(44,85,48,0.07);
          outline: none;
          transition: border 0.2s;
        }
        .floating-search-input:focus {
          border-color: var(--primary);
        }
        @keyframes fadeInSearch {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Floating search overlay */
        .floating-search-overlay {
          display: none;
          position: fixed;
          left: 0;
          top: var(--header-height);
          width: 100vw;
          height: calc(100vh - var(--header-height));
          z-index: 2000;
          background: rgba(44,85,48,0.18);
          backdrop-filter: blur(7px) saturate(1.2);
          -webkit-backdrop-filter: blur(7px) saturate(1.2);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s cubic-bezier(.4,2,.6,1);
        }
        .floating-search-overlay.active {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
          pointer-events: auto;
        }
        .floating-search-form {
          position: relative;
          width: 96vw;
          max-width: 540px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .floating-search-animate {
          opacity: 0;
          transform: scale(0.95) translateY(20px);
          transition: opacity 0.35s cubic-bezier(.4,2,.6,1), transform 0.35s cubic-bezier(.4,2,.6,1);
        }
        .floating-search-overlay.active .floating-search-animate {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .floating-search-input {
          width: 100%;
          padding: 1.3rem 3.2rem 1.3rem 2.5rem;
          border-radius: 36px;
          border: 2.5px solid var(--accent);
          font-size: 1.35rem;
          color: var(--primary);
          background: #fff;
          box-shadow: 0 4px 32px rgba(44,85,48,0.13);
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .floating-search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 6px 32px rgba(44,85,48,0.18);
        }
        .floating-search-send {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: var(--accent);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          box-shadow: 0 2px 8px rgba(44,85,48,0.07);
          padding: 0;
        }
        .floating-search-send:hover {
          background: var(--primary-dark);
        }
        .floating-search-send svg {
          width: 20px;
          height: 20px;
          fill: #fff;
        }
        @keyframes fadeInMenu {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Mobile menu slide-down */
        .mobile-menu {
          display: none;
          position: absolute;
          top: var(--header-height);
          left: 50%;
          transform: translateX(-50%) translateY(-20px);
          width: 100vw;
          max-width: 340px;
          background: var(--primary);
          box-shadow: 0 8px 32px rgba(44,85,48,0.13);
          padding: 2.2rem 1.2rem 1.2rem 1.2rem;
          z-index: 1200;
          flex-direction: column;
          gap: 0.7rem;
          border-radius: 0 0 18px 18px;
          align-items: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s cubic-bezier(.4,2,.6,1), transform 0.35s cubic-bezier(.4,2,.6,1);
        }
        .mobile-menu.open {
          display: flex;
          opacity: 1;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .mobile-menu .nav-link,
        .mobile-menu .auth-btn {
          font-size: 1.15rem;
          width: 100%;
          text-align: center;
          margin: 0.2rem 0;
          padding: 0.8rem 0;
          border-radius: 12px;
          background: none;
          color: var(--white) !important;
          font-weight: 600;
          box-shadow: none;
          position: relative;
        }
        .mobile-menu .nav-link::after {
          content: '';
          position: absolute;
          left: 20%;
          right: 20%;
          bottom: 0.2rem;
          height: 3px;
          background: var(--accent);
          border-radius: 2px;
          opacity: 0;
          transform: scaleX(0.3);
          transition: opacity 0.25s, transform 0.25s;
        }
        .mobile-menu .nav-link:hover::after,
        .mobile-menu .nav-link:focus::after,
        .mobile-menu .nav-link.active::after {
          opacity: 1;
          transform: scaleX(1);
        }
        .mobile-menu .nav-link.active {
          color: var(--accent) !important;
        }
        .mobile-menu .auth-btn.login-btn {
          background: var(--white);
          color: var(--primary) !important;
          margin-top: 1.2rem;
        }
        .mobile-menu .auth-btn.register-btn {
          background: var(--accent);
          color: var(--white) !important;
          margin-bottom: 0.2rem;
        }
        @media (max-width: 991px) {
          .header-bar {
            grid-template-columns: 1fr 44px 1fr;
            padding: 0 0.5rem;
            height: var(--header-height);
          }
          .header-col.menu {
            display: none;
          }
          .header-col.auth {
            display: none;
          }
          .hamburger {
            display: flex;
            grid-column: 3;
            justify-self: end;
          }
          .mobile-menu {
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            max-width: 95vw;
            border-radius: 0 0 18px 18px;
            padding: 2.2rem 1.2rem 1.2rem 1.2rem;
          }
        }
        @media (max-width: 600px) {
          .header-bar {
            grid-template-columns: 1fr 44px 1fr;
            padding: 0 0.2rem;
          }
          .navbar-brand img {
            height: 32px;
          }
          .floating-search-form {
            max-width: 99vw;
          }
          .floating-search-input {
            font-size: 1.05rem;
            padding: 1rem 2.2rem 1rem 1.2rem;
          }
          .floating-search-send {
            right: 1rem;
            width: 36px;
            height: 36px;
          }
          .mobile-menu {
            max-width: 99vw;
            padding: 1.2rem 0.5rem 1rem 0.5rem;
          }
        }
      </style>
      <header class="header-bar">
        <div class="header-col logo">
          <a class="navbar-brand" href="index.html">
            <img src="logo_small.png" alt="Genostock logo">
            <span>Genostock</span>
          </a>
        </div>
        <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav class="header-col menu">
          <div class="nav-menu">
            <a class="nav-link" href="index.html">Home</a>
            <a class="nav-link" href="marketplace.html">Marketplace</a>
            <a class="nav-link" href="about us.html">About Us</a>
            <a class="nav-link" href="Contactos.html">Contact Us</a>
          </div>
        </nav>
        <div class="header-col auth">
          <div class="search-wrapper">
            <button class="search-icon" id="search-toggle" aria-label="Search">
              <svg class="search-svg" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="auth-buttons">
            <a href="login.html" class="auth-btn login-btn">Login</a>
            <a href="register.html" class="auth-btn register-btn">Register</a>
          </div>
        </div>
      </header>
      <div class="floating-search-overlay" id="floating-search">
        <form class="floating-search-form floating-search-animate" id="floating-search-form" autocomplete="off">
          <input type="search" class="floating-search-input" id="floating-search-input" placeholder="Search cattle, breeds, or health info...">
          <button type="submit" class="floating-search-send" aria-label="Send search">
            <svg viewBox="0 0 24 24"><path d="M3 12l18-8-8 18-2-7-7-3z"/></svg>
          </button>
        </form>
      </div>
      <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile menu">
        <a class="nav-link" href="index.html">Home</a>
        <a class="nav-link" href="marketplace.html">Marketplace</a>
        <a class="nav-link" href="about us.html">About Us</a>
        <a class="nav-link" href="Contactos.html">Contact Us</a>
        <a href="login.html" class="auth-btn login-btn">Login</a>
        <a href="register.html" class="auth-btn register-btn">Register</a>
      </nav>
    `;
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    const shadow = this.shadowRoot;
    // Floating search
    const searchToggle = shadow.getElementById('search-toggle');
    const floatingSearch = shadow.getElementById('floating-search');
    const floatingInput = shadow.getElementById('floating-search-input');
    const floatingForm = shadow.getElementById('floating-search-form');
    let searchActive = false;
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      searchActive = !searchActive;
      floatingSearch.classList.toggle('active', searchActive);
      if (searchActive) {
        setTimeout(() => {
          floatingInput.focus();
        }, 200);
      } else {
        floatingInput.value = '';
      }
    });
    // Close search when clicking outside
    document.addEventListener('mousedown', (e) => {
      if (!this.contains(e.target) && !shadow.contains(e.target)) {
        searchActive = false;
        floatingSearch.classList.remove('active');
      }
    });
    floatingSearch.addEventListener('mousedown', (e) => {
      if (e.target === floatingSearch) {
        searchActive = false;
        floatingSearch.classList.remove('active');
      }
    });
    floatingInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchActive = false;
        floatingSearch.classList.remove('active');
      }
    });
    floatingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Here you can handle the search
      floatingInput.blur();
      searchActive = false;
      floatingSearch.classList.remove('active');
    });
    // Hamburger menu
    const hamburger = shadow.getElementById('hamburger');
    const mobileMenu = shadow.getElementById('mobile-menu');
    let menuOpen = false;
    hamburger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      hamburger.setAttribute('aria-expanded', menuOpen);
      mobileMenu.classList.toggle('open', menuOpen);
      if (menuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && menuOpen) {
        menuOpen = false;
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Mark active nav-link according to URL
    const links = shadow.querySelectorAll('.nav-link');
    const current = window.location.pathname.split('/').pop();
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (current === href || (href === 'index.html' && (current === '' || current === '/'))) {
        link.classList.add('active');
      }
      link.addEventListener('click', function() {
        links.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
}
customElements.define('geno-header', GenoHeader); 