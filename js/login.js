// Base de datos local de usuarios de ejemplo
const users = [
  { email: 'rancher1@email.com', username: 'rancher1', password: '1234', name: 'Juan Pérez', role: 'rancher' },
  { email: 'rancher2@email.com', username: 'rancher2', password: '1234', name: 'María López', role: 'rancher' },
  { email: 'trader1@email.com', username: 'trader1', password: '1234', name: 'Carlos Ruiz', role: 'trader' },
  { email: 'trader2@email.com', username: 'trader2', password: '1234', name: 'Ana Torres', role: 'trader' },
  { email: 'trader3@email.com', username: 'trader3', password: '1234', name: 'Luis Gómez', role: 'trader' }
];

// Función de login
function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // Guardar datos en localStorage
    localStorage.setItem('username', user.username);
    localStorage.setItem('name', user.name);
    localStorage.setItem('role', user.role);
    // Redirigir según el rol
    if (user.role === 'rancher') {
      window.location.href = 'dashboard/rancher/rancher.html';
    } else {
      window.location.href = 'dashboard/trader/trader.html';
    }
  } else {
    alert('Usuario o contraseña incorrectos');
  }
}

// Asignar evento al formulario de login
window.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', loginUser);
  }
}); 