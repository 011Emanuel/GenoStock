// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
});

function initDashboard() {
    // Check authentication first
    checkAuth();
    
    // Sidebar navigation functionality
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const contentSections = document.querySelectorAll('.content-section');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = this.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            if (section) {
                section.classList.add('active');
                
                // Add animation
                section.style.animation = 'none';
                setTimeout(() => {
                    section.style.animation = 'fadeIn 0.3s ease';
                }, 10);
            }
        });
    });

    // Mobile sidebar toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });

    // Initialize tooltips
    initTooltips();
    
    // Initialize charts (if needed)
    initCharts();
    
    // Initialize form handlers
    initFormHandlers();
    
    // Update user info in top bar
    updateUserInfo();
    
    // Initialize logout functionality
    initLogout();
}

function initTooltips() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function initCharts() {
    // Placeholder for chart initialization
    // You can add Chart.js or other chart libraries here
    console.log('Charts initialized');
}

function initFormHandlers() {
    // Profile form handler
    const profileForm = document.querySelector('#profile form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Profile updated successfully!', 'success');
        });
    }

    // Settings form handler
    const settingsForm = document.querySelector('#settings form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Settings saved successfully!', 'success');
        });
    }

    // Password change handler
    const passwordForm = document.querySelector('#settings .card:nth-child(2) form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Password changed successfully!', 'success');
            this.reset();
        });
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

// Quick action handlers
function initQuickActions() {
    const quickActionButtons = document.querySelectorAll('.card-body .btn');
    
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const action = this.textContent.trim();
            
            switch(action) {
                case 'Add Livestock':
                    // Navigate to livestock section
                    document.querySelector('[data-section="livestock"]').click();
                    break;
                case 'View Reports':
                    showNotification('Reports feature coming soon!', 'info');
                    break;
                case 'Schedule Check':
                    showNotification('Scheduling feature coming soon!', 'info');
                    break;
                case 'Settings':
                    document.querySelector('[data-section="settings"]').click();
                    break;
            }
        });
    });
}

// Livestock card handlers
function initLivestockCards() {
    const viewButtons = document.querySelectorAll('.livestock-actions .btn-outline-primary');
    const editButtons = document.querySelectorAll('.livestock-actions .btn-outline-warning');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const livestockName = this.closest('.livestock-card').querySelector('h5').textContent;
            showNotification(`Viewing details for ${livestockName}`, 'info');
        });
    });
    
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const livestockName = this.closest('.livestock-card').querySelector('h5').textContent;
            showNotification(`Editing ${livestockName}`, 'info');
        });
    });
}

// Sales table handlers
function initSalesTable() {
    const viewButtons = document.querySelectorAll('#sales .btn-outline-primary');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const date = row.cells[0].textContent;
            const livestock = row.cells[1].textContent;
            showNotification(`Viewing sale details for ${livestock} on ${date}`, 'info');
        });
    });
}

// Activity item handlers
function initActivityItems() {
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h6').textContent;
            showNotification(`Viewing activity: ${title}`, 'info');
        });
    });
}

// Initialize all interactive elements
document.addEventListener('DOMContentLoaded', function() {
    initQuickActions();
    initLivestockCards();
    initSalesTable();
    initActivityItems();
});

// Update user info in top bar
function updateUserInfo() {
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    const userNameElement = document.querySelector('.user-name');
    
    if (userNameElement && userEmail) {
        // Extract name from email or use email as fallback
        const name = userEmail.split('@')[0];
        userNameElement.textContent = `Welcome, ${name.charAt(0).toUpperCase() + name.slice(1)}`;
    }
}

// Check if user is logged in
function checkAuth() {
    const username = localStorage.getItem('username');
    if (!username) {
        // Usuario no logueado, redirige a login
        window.location.href = 'login.html';
    }
}

// Initialize logout functionality
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnProfile = document.getElementById('logoutBtnProfile');
    function doLogout() {
        // Limpiar datos de sesión
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
        // Redirigir a login
        window.location.href = 'login.html';
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', doLogout);
    }
    if (logoutBtnProfile) {
        logoutBtnProfile.addEventListener('click', doLogout);
    }
}

// Export functions for potential external use
window.Dashboard = {
    showNotification,
    initDashboard,
    updateUserInfo,
    checkAuth
}; 