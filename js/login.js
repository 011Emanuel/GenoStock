// Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Show loading state
            const submitButton = this.querySelector('.login-btn');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitButton.disabled = true;
            
            // Simulate login process (you can replace this with actual authentication)
            setTimeout(() => {
                // Store user info in localStorage if remember is checked
                if (remember) {
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userLoggedIn', 'true');
                } else {
                    sessionStorage.setItem('userEmail', email);
                    sessionStorage.setItem('userLoggedIn', 'true');
                }
                
                // Show success message
                showNotification('Login successful! Redirecting to dashboard...', 'success');
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            }, 1000); // Simulate 1 second loading time
        });
    }
    
    // Check if user is already logged in
    checkLoginStatus();
});

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') || sessionStorage.getItem('userLoggedIn');
    
    if (isLoggedIn) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Social login handlers (placeholder)
function initSocialLogin() {
    const googleBtn = document.querySelector('.social-btn[href="#"]');
    const facebookBtn = document.querySelectorAll('.social-btn[href="#"]')[1];
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Google login coming soon!', 'info');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Facebook login coming soon!', 'info');
        });
    }
}

// Initialize social login
document.addEventListener('DOMContentLoaded', function() {
    initSocialLogin();
});

// Export functions for potential external use
window.Login = {
    showNotification,
    checkLoginStatus
}; 