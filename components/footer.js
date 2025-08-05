class GenoFooter extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .footer-main {
          background: linear-gradient(135deg, #2c5530, #1a3a1f);
          color: #fff;
          padding: 4rem 0 0 0;
          width: 100%;
          margin: 0;
          box-sizing: border-box;
          position: relative;
          display: block;
        }
        
        .footer-container {
          width: 100%;
          padding: 0 4rem;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3rem;
          box-sizing: border-box;
        }
        
        .footer-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
          box-sizing: border-box;
        }
        
        .footer-logo-desc {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 1.5rem;
        }
        
        .footer-logo-desc img {
          height: 70px;
          display: block;
        }
        
        .footer-logo-desc span {
          font-size: 2.2rem;
          font-weight: bold;
          color: #fff;
          letter-spacing: 0.01em;
        }
        
        .footer-desc {
          color: #e0e0e0;
          font-size: 1.08rem;
          margin: 0 0 1.5rem 0;
          line-height: 1.6;
        }
        
        .footer-col h5 {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 1.2rem;
          color: #ffa726;
          letter-spacing: 0.01em;
          position: relative;
        }
        
        .footer-col h5::after {
          content: '';
          display: block;
          width: 25px;
          height: 2px;
          background: #ffa726;
          border-radius: 1px;
          margin-top: 0.4rem;
        }
        
        /* Alinear el título Quick Links con los menús */
        .footer-col:nth-child(2) h5 {
          padding-left: 20px;
        }
        
        .footer-col:nth-child(2) h5::after {
          margin-left: 20px;
        }
        
        .footer-links {
          width: 100% !important;
        }
        
        .footer-links ul {
          display: flex !important;
          flex-direction: column !important;
          gap: 0.8rem !important;
          padding: 0 !important;
          margin: 0 !important;
          list-style: none !important;
          width: 100% !important;
          text-indent: 0 !important;
        }
        
        .footer-links li {
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
          text-indent: 0 !important;
          width: 100% !important;
        }
        
        .footer-links a {
          color: #fff !important;
          text-decoration: none !important;
          font-size: 1.12rem !important;
          font-weight: 500 !important;
          letter-spacing: 0.01em !important;
          transition: color 0.2s, border-bottom 0.2s !important;
          border-bottom: 2px solid transparent !important;
          padding-bottom: 2px !important;
          display: block !important;
          padding-left: 0 !important;
          margin-left: 0 !important;
          text-indent: 0 !important;
          box-sizing: border-box !important;
          position: relative !important;
          left: 0 !important;
        }
        
        .footer-links a:hover {
          color: #ffa726;
          border-bottom: 2px solid #ffa726;
        }
        
        .footer-contact p {
          margin: 0 0 0.8rem 0;
          color: #e0e0e0;
          line-height: 1.5;
          font-size: 1.08rem;
        }
        
        .footer-contact-social {
          display: flex;
          gap: 1.2rem;
          margin-top: 1rem;
        }
        
        .footer-contact-social a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          transition: background 0.2s;
          text-decoration: none;
        }
        
        .footer-contact-social a:hover {
          background: #ffa726;
        }
        
        .footer-contact-social svg {
          width: 22px;
          height: 22px;
          fill: #fff;
        }
        
        .footer-newsletter p {
          color: #e0e0e0;
          font-size: 1.08rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        
        .footer-newsletter .input-group {
          display: flex;
          gap: 0.5rem;
          width: 100%;
        }
        
        .footer-newsletter input[type="email"] {
          border-radius: 25px;
          border: none;
          padding: 0.8rem 1.2rem;
          font-size: 1rem;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        
        .footer-newsletter input[type="email"]::placeholder {
          color: #ccc;
        }
        
        .footer-newsletter button {
          border-radius: 25px;
          border: none;
          background: #ffa726;
          color: #fff;
          font-weight: 600;
          padding: 0.8rem 1.5rem;
          font-size: 1rem;
          transition: background 0.2s;
          cursor: pointer;
          white-space: nowrap;
        }
        
        .footer-newsletter button:hover {
          background: #1a3a1f;
        }
        
        .footer-bottom {
          width: 100%;
          background: rgba(0,0,0,0.2);
          color: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 2rem;
          font-size: 1rem;
          margin-top: 3rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          box-sizing: border-box;
        }
        
        .footer-bottom-left {
          display: flex;
          align-items: center;
        }
        
        .footer-bottom-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .footer-bottom-link {
          color: #ffa726;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
          font-size: 0.95rem;
        }
        
        .footer-bottom-link:hover {
          color: #fff;
        }
        
        .footer-bottom-separator {
          color: #666;
          font-size: 0.8rem;
        }
        
        @media (max-width: 1200px) {
          .footer-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .footer-main {
            padding: 3rem 0 0 0;
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
            padding: 1rem 2rem;
          }
          
          .footer-bottom-right {
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
          }
        }
      </style>
      <footer class="footer-main">
        <div class="footer-container">
          <div class="footer-col">
            <div class="footer-logo-desc">
              <img src="logo_small.png" alt="GenoStock Logo">
              <span>Genostock</span>
            </div>
            <p class="footer-desc">GenoStock is a comprehensive platform for managing cattle health, sales, and productivity. We help ranchers and traders optimize their operations with advanced tools and insights.</p>
          </div>
          <div class="footer-col">
            <h5>Quick Links</h5>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="marketplace.html">Marketplace</a></li>
              <li><a href="about us.html">About Us</a></li>
              <li><a href="Contactos.html">Contact Us</a></li>
              <li><a href="dashboard-rancher.html">Dashboard</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5>Contact Info</h5>
            <p>Email: info@genostock.com</p>
            <p>Phone: (507) 5123-4567</p>
            <p><svg style="vertical-align:middle; margin-right:6px; width:20px; height:20px; fill:#25d366;" viewBox="0 0 32 32"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.653.867 5.1 2.34 7.09L4 29l7.09-2.34A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.89 0-3.68-.52-5.19-1.43l-.37-.22-4.22 1.39 1.39-4.22-.22-.37A9.96 9.96 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.12 2.83c.14.18 1.93 2.95 4.68 4.02.65.28 1.16.45 1.56.58.65.21 1.24.18 1.7.11.52-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z"/></svg>WhatsApp (507) 5123-4567</p>
            <div class="footer-contact-social">
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></a>
              <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184C18.691 2.69 17.437 2 16.042 2c-2.675 0-4.515 2.18-3.946 4.737C7.728 6.617 4.1 4.884 1.671 1.965c-.364.623-.57 1.342-.57 2.112 0 1.455.74 2.741 1.858 3.495a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.627 1.956 2.444 3.377 4.6 3.417C4.29 19.29 2.62 20.13 0 20.13c-.29 0-.575-.017-.857-.05C2.179 21.29 4.768 22 7.548 22c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0 0 24 4.557z"/></svg></a>
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.808 2.256 6.088 2.243 6.497 2.243 12c0 5.503.013 5.912.072 7.192.059 1.276.353 2.449 1.32 3.416.967.967 2.14 1.261 3.416 1.32 1.28.059 1.689.072 7.192.072s5.912-.013 7.192-.072c1.276-.059 2.449-.353 3.416-1.32.967-.967 1.261-2.14 1.32-3.416.059-1.28.072-1.689.072-7.192s-.013-5.912-.072-7.192c-.059-1.276-.353-2.449-1.32-3.416C21.049.425 19.876.131 18.6.072 17.32.013 16.911 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a>
            </div>
          </div>
          <div class="footer-col">
            <h5>Newsletter</h5>
            <p>Stay updated with the latest cattle market trends and health tips.</p>
            <div class="footer-newsletter">
              <div class="input-group">
                <input type="email" placeholder="Enter your email">
                <button>Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-bottom-left">
            <span>&copy; <script>document.write(new Date().getFullYear())</script> GenoStock. All rights reserved.</span>
          </div>
          <div class="footer-bottom-right">
            <a href="#" class="footer-bottom-link">Privacy Policy</a>
            <span class="footer-bottom-separator">|</span>
            <a href="#" class="footer-bottom-link">Terms of Service</a>
            <span class="footer-bottom-separator">|</span>
            <a href="#" class="footer-bottom-link">Data Protection</a>
          </div>
        </div>
      </footer>
    `;
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
}
customElements.define('geno-footer', GenoFooter); 