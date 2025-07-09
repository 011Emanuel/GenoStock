// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        return Promise.resolve();
    } catch (error) {
        console.error('Error loading component:', error);
        return Promise.reject(error);
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    if (document.getElementById('header-component')) {
        loadComponent('header-component', 'components/header.html').then(() => {
            // After header loads, setup theme toggle
            setTimeout(() => {
                if (typeof setupThemeToggle === 'function') {
                    setupThemeToggle();
                }
            }, 100);
        });
    }
    
    // Load footer
    if (document.getElementById('footer-component')) {
        loadComponent('footer-component', 'components/footer.html');
    }
}); 