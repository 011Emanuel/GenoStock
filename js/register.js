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
            confirmPasswordInput.setCustomValidity('Passwords do not match');
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
            showNotification('Please fill in all required fields.', 'warning');
            return;
        }
        if (!role) {
            showNotification('Please select a role.', 'warning');
            return;
        }
        if (password !== confirmPassword) {
            showNotification('Passwords do not match.', 'warning');
            return;
        }
        if (!terms || !terms.checked) {
            showNotification('You must accept the terms and conditions to continue.', 'warning');
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
                showNotification('Please complete the ranch details.', 'warning');
                return;
            }
        }

        const phone = document.getElementById('phone')?.value.trim() || '';
        const rfc = document.getElementById('rfc')?.value.trim() || '';

        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Register';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating account...';
        }

        const supabase = window.getSupabase ? window.getSupabase() : null;
        const supabaseReady = supabase && window.isSupabaseConfigured && window.isSupabaseConfigured();

        if (!supabaseReady) {
            showNotification('Supabase is not connected. Paste the project URL and anon key in the orange box (or in js/env.js). The account was not saved to the database.', 'danger');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
            return;
        }

        try {
            const metadata = {
                username: username,
                full_name: username,
                role: normalizedRole,
                ranch_name: ranchName,
                location: location,
                cattle_count: cattleCount,
                phone: phone,
                rfc: rfc
            };

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: metadata,
                    emailRedirectTo: window.location.origin + '/login.html'
                }
            });

            if (error) {
                showNotification(`Registration error: ${error.message}`, 'danger');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
                return;
            }

            if (!data.user) {
                showNotification('Could not create the user in Supabase. Check Authentication in the project dashboard.', 'danger');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
                return;
            }

            if (window.ensureUserProfile) {
                await window.ensureUserProfile(data.user, metadata);
            }

            if (window.syncLocalSessionWithSupabase && data.session) {
                window.syncLocalSessionWithSupabase(data.session);
            } else {
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('username', username);
                localStorage.setItem('email', email);
                localStorage.setItem('role', normalizedRole);
                localStorage.setItem('name', username);
                if (ranchName) localStorage.setItem('ranchName', ranchName);
                if (location) localStorage.setItem('location', location);
            }

            if (!data.session) {
                showNotification('Account created in the database. Confirm your email (or turn off Confirm email in Supabase Auth) and then log in.', 'success');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2200);
                return;
            }

            showNotification('Registration successful. Your account was saved to the database. Redirecting...', 'success');

            setTimeout(() => {
                if (normalizedRole === 'rancher') {
                    window.location.href = 'dashboard-rancher.html';
                } else {
                    window.location.href = 'dashboard-trader.html';
                }
            }, 1500);

        } catch (err) {
            console.error('Supabase Sign-Up Exception:', err);
            showNotification('An unexpected error occurred while registering the account.', 'danger');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        }
    });
    
    // Validación de RFC para vendedores
    const rfcInput = document.getElementById('rfc');
    if (rfcInput) {
        rfcInput.addEventListener('input', function() {
            const rfcPattern = /^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/;
            if (!rfcPattern.test(this.value)) {
                this.setCustomValidity('Invalid RFC. Use the correct format (e.g. ABCD123456XYZ)');
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
                this.setCustomValidity('Invalid phone number. It must have 10 digits.');
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