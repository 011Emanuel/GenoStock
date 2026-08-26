document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const roleButtons = document.querySelectorAll('.role-btn');
    const sellerInfo = document.querySelector('.seller-info');
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Function to toggle rancher fields
    function toggleRancherFields(show) {
        const sellerFields = document.getElementById('sellerFields');
        const inputs = sellerFields ? sellerFields.querySelectorAll('input') : [];
        
        if (sellerFields) {
            sellerFields.style.display = show ? 'block' : 'none';
            
            // Make fields required/not required
            inputs.forEach(input => {
                input.required = show;
            });
        }
    }
    
    // Handle role selection change
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Show/hide rancher fields based on selection
            if (this.value === 'buyer') {
                toggleRancherFields(true);
            } else if (this.value === 'trader') {
                toggleRancherFields(false);
            }
        });
    });
    
    // Initialize fields based on default selection (Rancher is selected by default)
    toggleRancherFields(true);
    
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
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar campos requeridos
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms');
        const role = document.querySelector('input[name="role"]:checked');

        if (!email || !username || !password || !confirmPassword) {
            showNotification('Por favor, completa todos los campos.', 'warning');
            return;
        }
        if (!role) {
            showNotification('Por favor, selecciona un rol.', 'warning');
            return;
        }
        if (password !== confirmPassword) {
            showNotification('Las contraseñas no coinciden.', 'warning');
            return;
        }
        if (!terms || !terms.checked) {
            showNotification('Debes aceptar los términos y condiciones para continuar.', 'warning');
            return;
        }

        const selectedRole = role.value; // 'buyer' (rancher) or 'trader'
        const normalizedRole = selectedRole === 'buyer' ? 'rancher' : selectedRole;

        let ranchName = '';
        let location = '';
        let cattleCount = 0;

        // Validar campos específicos del rancher si es necesario
        if (selectedRole === 'buyer') {
            ranchName = document.getElementById('ranchName')?.value.trim() || '';
            location = document.getElementById('location')?.value.trim() || '';
            cattleCount = parseInt(document.getElementById('cattleCount')?.value || '0', 10);

            if (!ranchName || !location) {
                showNotification('Por favor, completa los campos específicos del rancho.', 'warning');
                return;
            }
        }

        const phone = document.getElementById('phone')?.value.trim() || '';
        const rfc = document.getElementById('rfc')?.value.trim() || '';

        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Register';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Registrando...';
        }

        const supabase = window.getSupabase ? window.getSupabase() : null;

        if (supabase && window.isSupabaseConfigured && window.isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            username: username,
                            full_name: username,
                            role: normalizedRole,
                            ranch_name: ranchName,
                            location: location,
                            cattle_count: cattleCount,
                            phone: phone,
                            rfc: rfc
                        }
                    }
                });

                if (error) {
                    showNotification(`Error en el registro: ${error.message}`, 'danger');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                    return;
                }

                if (window.syncLocalSessionWithSupabase && data.session) {
                    window.syncLocalSessionWithSupabase(data.session);
                }

                showNotification('¡Registro exitoso! Redirigiendo a tu panel de control...', 'success');

                setTimeout(() => {
                    if (normalizedRole === 'rancher') {
                        window.location.href = 'dashboard-rancher.html';
                    } else {
                        window.location.href = 'dashboard-trader.html';
                    }
                }, 1500);

            } catch (err) {
                console.error('Supabase Sign-Up Exception:', err);
                showNotification('Ocurrió un error inesperado al registrar el usuario.', 'danger');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        } else {
            // Fallback Mode
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
            localStorage.setItem('role', normalizedRole);
            if (ranchName) localStorage.setItem('ranchName', ranchName);
            if (location) localStorage.setItem('location', location);
            if (cattleCount) localStorage.setItem('cattleCount', cattleCount.toString());

            showNotification('¡Registro (modo demostración) exitoso! Redirigiendo...', 'success');

            setTimeout(() => {
                if (normalizedRole === 'rancher') {
                    window.location.href = 'dashboard-rancher.html';
                } else {
                    window.location.href = 'dashboard-trader.html';
                }
            }, 1500);
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