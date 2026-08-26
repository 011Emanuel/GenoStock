/**
 * GenoStock - Login Script with Supabase Auth Support
 */
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const googleBtn = document.querySelector('.social-btn i.fa-google')?.closest('a');
    const facebookBtn = document.querySelector('.social-btn i.fa-facebook-f')?.closest('a');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            const email = emailInput?.value.trim();
            const password = passwordInput?.value;

            if (!email || !password) {
                showNotification('Por favor, completa todos los campos.', 'warning');
                return;
            }

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Login';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Iniciando sesión...';
            }

            const supabase = window.getSupabase ? window.getSupabase() : null;

            if (supabase && window.isSupabaseConfigured && window.isSupabaseConfigured()) {
                // Real Supabase Authentication
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                    if (error) {
                        showNotification(`Error de inicio de sesión: ${error.message}`, 'danger');
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnText;
                        }
                        return;
                    }

                    const user = data.user;
                    const meta = user?.user_metadata || {};
                    const role = meta.role || 'rancher';

                    if (window.syncLocalSessionWithSupabase) {
                        window.syncLocalSessionWithSupabase(data.session);
                    }

                    showNotification('¡Inicio de sesión exitoso! Redirigiendo...', 'success');

                    setTimeout(() => {
                        redirectUserByRole(role);
                    }, 1200);

                } catch (err) {
                    console.error('Supabase Sign-In Exception:', err);
                    showNotification('Ocurrió un error inesperado al conectar con el servidor.', 'danger');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                    }
                }
            } else {
                // Fallback Mock Authentication
                const username = email.split('@')[0];
                const storedRole = localStorage.getItem('role') || 'rancher';

                localStorage.setItem('username', username);
                localStorage.setItem('email', email);
                localStorage.setItem('role', storedRole);

                showNotification('Inicio de sesión (modo demostración) exitoso! Redirigiendo...', 'info');

                setTimeout(() => {
                    redirectUserByRole(storedRole);
                }, 1200);
            }
        });
    }

    // Google OAuth Handler
    if (googleBtn) {
        googleBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const supabase = window.getSupabase ? window.getSupabase() : null;
            if (supabase && window.isSupabaseConfigured && window.isSupabaseConfigured()) {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin + '/dashboard/rancher/rancher.html'
                    }
                });
                if (error) showNotification(`Error OAuth: ${error.message}`, 'danger');
            } else {
                showNotification('Autenticación con Google requiere configurar Supabase.', 'warning');
            }
        });
    }

    // Facebook OAuth Handler
    if (facebookBtn) {
        facebookBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const supabase = window.getSupabase ? window.getSupabase() : null;
            if (supabase && window.isSupabaseConfigured && window.isSupabaseConfigured()) {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'facebook',
                    options: {
                        redirectTo: window.location.origin + '/dashboard/rancher/rancher.html'
                    }
                });
                if (error) showNotification(`Error OAuth: ${error.message}`, 'danger');
            } else {
                showNotification('Autenticación con Facebook requiere configurar Supabase.', 'warning');
            }
        });
    }
});

function redirectUserByRole(role) {
    if (role === 'rancher' || role === 'buyer') {
        window.location.href = 'dashboard-rancher.html';
    } else if (role === 'trader') {
        window.location.href = 'dashboard-trader.html';
    } else {
        window.location.href = 'marketplace.html';
    }
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.login-alert-toast');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed login-alert-toast`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}
