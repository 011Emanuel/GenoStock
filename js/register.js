document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const roleButtons = document.querySelectorAll('.role-btn');
    const sellerInfo = document.querySelector('.seller-info');
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Manejar la selección de rol
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            roleButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón seleccionado
            this.classList.add('active');
            
            // Mostrar/ocultar campos de vendedor
            if (this.dataset.role === 'seller') {
                sellerInfo.classList.add('active');
                // Hacer requeridos los campos de vendedor
                sellerInfo.querySelectorAll('input').forEach(input => {
                    input.required = true;
                });
            } else {
                sellerInfo.classList.remove('active');
                // Remover required de los campos de vendedor
                sellerInfo.querySelectorAll('input').forEach(input => {
                    input.required = false;
                });
            }
        });
    });
    
    // Validación de contraseñas
    function validatePasswords() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Las contraseñas no coinciden');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }
    
    passwordInput.addEventListener('change', validatePasswords);
    confirmPasswordInput.addEventListener('keyup', validatePasswords);
    
    // Manejar el envío del formulario
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar campos requeridos
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms');
        const role = document.querySelector('input[name="role"]:checked');

        if (!email || !username || !password || !confirmPassword) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        if (!role) {
            alert('Por favor, selecciona un rol.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }
        if (!terms || !terms.checked) {
            alert('Debes aceptar los términos y condiciones para continuar.');
            return;
        }

        // Validar campos específicos del rancher si es necesario
        if (role.value === 'seller') {
            const ranchName = document.getElementById('ranchName')?.value.trim();
            const location = document.getElementById('location')?.value.trim();
            const cattleCount = document.getElementById('cattleCount')?.value;
            
            if (!ranchName || !location || !cattleCount) {
                alert('Por favor, completa todos los campos específicos del rancho.');
                return;
            }
        }

        // Obtener el rol seleccionado
        const selectedRole = role.value;
        
        // Redirigir basado en el rol seleccionado
        if (selectedRole === 'seller') {
            window.location.href = 'dashboard-rancher.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    });
    
    // Validación de RFC para vendedores
    const rfcInput = document.getElementById('rfc');
    if (rfcInput) {
        rfcInput.addEventListener('input', function() {
            const rfcPattern = /^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/;
            if (!rfcPattern.test(this.value)) {
                this.setCustomValidity('RFC inválido. Debe tener el formato correcto (ej: ABCD123456XYZ)');
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    // Validación de teléfono
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(this.value)) {
                this.setCustomValidity('Teléfono inválido. Debe tener 10 dígitos');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}); 

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
} 