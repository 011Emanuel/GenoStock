// Footer Auth Component
function createAuthFooter() {
  const footer = document.createElement('footer');
  footer.className = 'auth-footer';
  
  const currentYear = new Date().getFullYear();
  
  footer.innerHTML = `
    <style>
      .auth-footer {
        background: linear-gradient(135deg, #232e23 0%, #1b3a1d 100%);
        color: #fff;
        padding: 1rem 4rem;
        border-top: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 -2px 8px rgba(44,85,48,0.1);
        font-size: 0.95rem;
        letter-spacing: 0.01em;
      }
      
      .footer-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .footer-copyright {
        color: #e0e0e0;
        font-weight: 400;
        font-size: 0.9rem;
      }
      
      .footer-links {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      
      .footer-link {
        color: #ffa726;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
        font-size: 0.9rem;
        padding-bottom: 2px;
        border-bottom: 1px solid transparent;
      }
      
      .footer-link:hover {
        color: #fff;
        border-bottom: 1px solid #ffa726;
      }
      
      .footer-separator {
        color: #666;
        font-size: 0.8rem;
      }
      
      @media (max-width: 768px) {
        .auth-footer {
          padding: 1rem 2rem;
        }
        
        .footer-content {
          flex-direction: column;
          gap: 0.8rem;
          text-align: center;
        }
        
        .footer-links {
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }
      }
    </style>
    
    <div class="footer-content">
      <div class="footer-copyright">
        &copy; ${currentYear} GenoStock. Todos los derechos reservados.
      </div>
      <div class="footer-links">
        <a href="#" class="footer-link">Privacy Policy</a>
        <span class="footer-separator">|</span>
        <a href="#" class="footer-link">Terms of Service</a>
        <span class="footer-separator">|</span>
        <a href="#" class="footer-link">Data Protection</a>
      </div>
    </div>
  `;
  
  return footer;
}

// Export function for global use
if (typeof window !== 'undefined') {
  window.createAuthFooter = createAuthFooter;
} 