// Basic theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
    
    // Setup theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const body = document.body;
            const icon = this.querySelector('i');
            
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                if (icon) icon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                if (icon) icon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            }
        });
    }
}); 

// Parallax effect for 'What Makes Us Different?' section
window.addEventListener('scroll', function() {
  const parallaxSection = document.querySelector('.diferentes-section-parallax .parallax-bg');
  if (parallaxSection) {
    const scrolled = window.scrollY;
    // Ajusta el factor para más o menos movimiento
    parallaxSection.style.backgroundPosition = `center ${-scrolled * 0.25}px`;
  }
}); 