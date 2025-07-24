// Header para usuarios autenticados
// Muestra avatar, nombre de usuario y dropdown con opciones
(function() {
  if (window.createAuthHeader) return; // Evita redefinir
  function createAuthHeader() {
    // Crear elementos principales
    const header = document.createElement('header');
    header.className = 'header-bar';
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
          grid-template-columns: 180px 1fr 320px;
          align-items: center;
          background: var(--primary);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: var(--header-z);
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
          justify-content: flex-end;
          gap: 0.7rem;
          min-width: 0;
          padding-right: 0;
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .avatar img {
          border-radius: 50%;
          width: 38px;
          height: 38px;
          object-fit: cover;
          border: 2px solid var(--accent);
        }
        .username {
          color: var(--white);
          font-weight: 600;
          font-size: 1.13rem;
          margin-left: 0.2rem;
        }
        .user-role {
          margin-left: 8px;
          font-size: 0.98em;
          color: #ffe0a3;
          background: rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 2px 10px;
          font-weight: 500;
        }
        .dropdown {
          position: relative;
        }
        .dropdown-toggle {
          background: none;
          border: none;
          color: var(--white);
          font-size: 1.2rem;
          cursor: pointer;
          margin-left: 0.2rem;
        }
        .dropdown-menu {
          display: none;
          position: absolute;
          right: 0;
          top: 120%;
          background: #fff;
          border: 1px solid #ccc;
          min-width: 140px;
          z-index: 1000;
          border-radius: 10px;
          box-shadow: 0 4px 18px rgba(44,85,48,0.13);
          overflow: hidden;
        }
        .dropdown-menu .dropdown-item {
          display: block;
          padding: 0.7rem 1.1rem;
          color: #333;
          text-decoration: none;
          font-size: 1.05rem;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          transition: background 0.18s;
          cursor: pointer;
        }
        .dropdown-menu .dropdown-item:hover {
          background: #f7f7f7;
        }
      </style>
      <div class="header-col logo">
        <a class="navbar-brand" href="/index.html">
          <img src="/logo_small.png" alt="GenoStock" height="40">
          <span>GenoStock</span>
        </a>
      </div>
      <div class="header-col menu">
        <nav class="nav-menu">
          <a class="nav-link" href="/index.html">Home</a>
          <a class="nav-link" href="/marketplace.html">Marketplace</a>
          <a class="nav-link" href="/about us.html">About Us</a>
          <a class="nav-link" href="/Contactos.html">Contact Us</a>
        </nav>
      </div>
      <div class="header-col auth">
        <div class="user-section">
          <div class="avatar">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(localStorage.getItem('name') || localStorage.getItem('username') || 'U')}" alt="Avatar">
          </div>
          <span class="username">${localStorage.getItem('name') || localStorage.getItem('username') || 'Usuario'}</span>
          <span class="user-role">${localStorage.getItem('role') ? (localStorage.getItem('role').charAt(0).toUpperCase() + localStorage.getItem('role').slice(1)) : ''}</span>
          <div class="dropdown">
            <button class="dropdown-toggle">▼</button>
            <div class="dropdown-menu">
              <a href="#" class="dropdown-item">Profile</a>
              <a href="#" class="dropdown-item">Settings</a>
              <a href="#" class="dropdown-item logout-btn">Logout</a>
            </div>
          </div>
        </div>
      </div>
    `;
    // Dropdown logic
    setTimeout(() => {
      const dropdown = header.querySelector('.dropdown');
      if (!dropdown) return;
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
      toggle.onclick = function(e) {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      };
      document.addEventListener('click', function() {
        menu.style.display = 'none';
      });
      dropdown.querySelector('.logout-btn').onclick = function(e) {
        e.preventDefault();
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
        location.reload();
      };
    }, 0);
    return header;
  }
  window.createAuthHeader = createAuthHeader;
})();

// Función para renderizar el header auth si el usuario está logueado
function renderAuthHeaderIfLoggedIn() {
  const username = localStorage.getItem('username');
  if (username) {
    // Eliminar header anterior si existe
    const oldHeader = document.querySelector('header');
    if (oldHeader) oldHeader.remove();
    // Insertar el nuevo header
    document.body.insertBefore(createAuthHeader(), document.body.firstChild);
  }
}

// Llamar a la función al cargar la página
window.addEventListener('DOMContentLoaded', renderAuthHeaderIfLoggedIn);

// Puedes exportar las funciones si usas módulos
// export { createAuthHeader, renderAuthHeaderIfLoggedIn }; 