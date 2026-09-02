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
                showNotification('Please fill in all required fields.', 'warning');
                return;
            }

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Login';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Signing in...';
            }

            const supabase = window.getSupabase ? window.getSupabase() : null;
            const supabaseReady = supabase && window.isSupabaseConfigured && window.isSupabaseConfigured();

            if (!supabaseReady) {
                showNotification('Supabase is not connected. Paste the project URL and anon key in the orange box (or in js/env.js). Local login does not use the database.', 'danger');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
                return;
            }

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    showNotification(`Sign-in error: ${error.message}`, 'danger');
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
                if (window.ensureUserProfile && user) {
                    await window.ensureUserProfile(user);
                }

                showNotification('Signed in successfully. Redirecting...', 'success');

                setTimeout(() => {
                    redirectUserByRole(role);
                }, 1200);

            } catch (err) {
                console.error('Supabase Sign-In Exception:', err);
                showNotification('An unexpected error occurred while connecting to the database.', 'danger');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
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
                if (error) showNotification(`OAuth error: ${error.message}`, 'danger');
            } else {
                showNotification('Google sign-in requires Supabase to be configured.', 'warning');
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
                if (error) showNotification(`OAuth error: ${error.message}`, 'danger');
            } else {
                showNotification('Facebook sign-in requires Supabase to be configured.', 'warning');
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
