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
        
        // Validar contraseñas antes de enviar
        validatePasswords();
        
        if (!registerForm.checkValidity()) {
            e.stopPropagation();
            registerForm.classList.add('was-validated');
            return;
        }
        
        // Obtener el rol seleccionado
        const selectedRole = document.querySelector('.role-btn.active').dataset.role;
        
        // Crear objeto con los datos del formulario
        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: passwordInput.value,
            role: selectedRole
        };
        
        // Si es vendedor, agregar información adicional
        if (selectedRole === 'seller') {
            formData.businessName = document.getElementById('businessName').value;
            formData.rfc = document.getElementById('rfc').value;
            formData.address = document.getElementById('address').value;
            formData.phone = document.getElementById('phone').value;
        }
        
        // Aquí iría la lógica para enviar los datos al servidor
        console.log('Datos del formulario:', formData);
        
        // Simular envío exitoso
        showNotification('¡Registro exitoso! Redirigiendo a tu perfil...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
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