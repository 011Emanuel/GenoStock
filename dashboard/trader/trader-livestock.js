class TraderLivestock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        :host {
          --primary: #2c5530;
          --primary-light: #4a7c59;
          --accent: #ffa726;
          --accent-light: #ffb74d;
          --success: #4caf50;
          --success-light: #81c784;
          --danger: #f44336;
          --warning: #ff9800;
          --warning-light: #ffb74d;
          --info: #2196f3;
          --info-light: #64b5f6;
          --white: #ffffff;
          --light-gray: #f8f9fa;
          --gray: #6c757d;
          --dark-gray: #495057;
          --border: #e9ecef;
          --shadow: 0 4px 20px rgba(44, 85, 48, 0.1);
          --shadow-hover: 0 8px 30px rgba(44, 85, 48, 0.15);
          --gradient-primary: linear-gradient(135deg, #2c5530 0%, #4a7c59 100%);
          --gradient-accent: linear-gradient(135deg, #ffa726 0%, #ffb74d 100%);
          --gradient-success: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
          --gradient-warning: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
          --gradient-info: linear-gradient(135deg, #2196f3 0%, #64b5f6 100%);
          --border-radius: 16px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .section-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .section-header p {
          color: var(--gray);
          font-size: 1.1rem;
          margin: 0;
        }

        .livestock-stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          background: var(--white);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          box-shadow: var(--shadow);
          text-align: center;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .stat-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
        }

        .stat-item:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-hover);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: var(--gray);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .livestock-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .livestock-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: var(--transition);
          position: relative;
          cursor: pointer;
        }

        .livestock-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
          z-index: 2;
        }

        .livestock-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: var(--shadow-hover);
        }

        .livestock-image-container {
          position: relative;
          overflow: hidden;
          height: 200px;
        }

        .livestock-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }

        .livestock-card:hover .livestock-image {
          transform: scale(1.1);
        }

        .livestock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(44, 85, 48, 0.8) 0%, rgba(74, 124, 89, 0.6) 100%);
          opacity: 0;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .livestock-card:hover .livestock-overlay {
          opacity: 1;
        }

        .overlay-content {
          color: var(--white);
          text-align: center;
          transform: translateY(20px);
          transition: var(--transition);
        }

        .livestock-card:hover .overlay-content {
          transform: translateY(0);
        }

        .overlay-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .overlay-subtitle {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .livestock-info {
          padding: 1.5rem;
          position: relative;
        }

        .livestock-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .livestock-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0 0 0.25rem 0;
        }

        .livestock-breed {
          color: var(--gray);
          font-size: 0.95rem;
          margin: 0;
        }

        .livestock-id {
          background: var(--gradient-primary);
          color: var(--white);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .livestock-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-success {
          background: var(--gradient-success);
          color: var(--white);
        }

        .badge-warning {
          background: var(--gradient-warning);
          color: var(--white);
        }

        .badge-info {
          background: var(--gradient-info);
          color: var(--white);
        }

        .livestock-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .detail-item {
          text-align: center;
          padding: 0.75rem;
          background: var(--light-gray);
          border-radius: 8px;
        }

        .detail-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.25rem;
        }

        .detail-label {
          font-size: 0.8rem;
          color: var(--gray);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .livestock-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn {
          flex: 1;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .btn-primary {
          background: var(--gradient-primary);
          color: var(--white);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(44, 85, 48, 0.3);
        }

        .btn-outline-warning {
          background: transparent;
          color: var(--warning);
          border: 2px solid var(--warning);
        }

        .btn-outline-warning:hover {
          background: var(--warning);
          color: var(--white);
          transform: translateY(-2px);
        }

        .btn-outline-danger {
          background: transparent;
          color: var(--danger);
          border: 2px solid var(--danger);
        }

        .btn-outline-danger:hover {
          background: var(--danger);
          color: var(--white);
          transform: translateY(-2px);
        }

        .add-livestock-card {
          background: var(--light-gray);
          border: 2px dashed var(--border);
          border-radius: var(--border-radius);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          cursor: pointer;
          transition: var(--transition);
          min-height: 300px;
        }

        .add-livestock-card:hover {
          border-color: var(--primary);
          background: var(--white);
          transform: translateY(-5px);
          box-shadow: var(--shadow-hover);
        }

        .add-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 2rem;
          margin-bottom: 1rem;
          transition: var(--transition);
        }

        .add-livestock-card:hover .add-icon {
          transform: scale(1.1);
        }

        .add-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .add-description {
          color: var(--gray);
          text-align: center;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .livestock-grid {
            grid-template-columns: 1fr;
          }

          .livestock-stats-overview {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-header h2 {
            font-size: 2rem;
          }
        }

        /* Animaciones */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .livestock-card,
        .stat-item,
        .add-livestock-card {
          animation: fadeInUp 0.6s ease-out;
        }

        .livestock-card:nth-child(1) { animation-delay: 0.1s; }
        .livestock-card:nth-child(2) { animation-delay: 0.2s; }
        .livestock-card:nth-child(3) { animation-delay: 0.3s; }
        .livestock-card:nth-child(4) { animation-delay: 0.4s; }
      </style>
      
      <section>
        <div class="section-header">
          <h2>My Livestock</h2>
          <p>Manage your cattle inventory efficiently</p>
        </div>

        <!-- Livestock statistics -->
        <div class="livestock-stats-overview">
          <div class="stat-item">
            <div class="stat-number">156</div>
            <div class="stat-label">Total Heads</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">142</div>
            <div class="stat-label">Healthy</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">14</div>
            <div class="stat-label">Need Review</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">4</div>
            <div class="stat-label">Different Breeds</div>
          </div>
        </div>

        <!-- Livestock Grid -->
        <div class="livestock-grid">
          <!-- Brahman Card -->
          <div class="livestock-card">
            <div class="livestock-image-container">
              <img src="https://static.vecteezy.com/system/resources/previews/024/940/349/non_2x/beef-cattle-breeder-american-brahman-red-on-the-ground-in-the-fram-big-male-brahman-cow-photo.jpg" class="livestock-image" alt="Brahman">
              <div class="livestock-overlay">
                <div class="overlay-content">
                  <div class="overlay-title">Brahman #001</div>
                  <div class="overlay-subtitle">Pure Breed</div>
                </div>
              </div>
            </div>
            <div class="livestock-info">
              <div class="livestock-header">
                <div>
                  <h5 class="livestock-title">Brahman #001</h5>
                  <p class="livestock-breed">Pure Breed</p>
                </div>
                <span class="livestock-id">#001</span>
              </div>
              
              <div class="livestock-stats">
                <span class="badge badge-success">Healthy</span>
                <span class="badge badge-info">250kg</span>
              </div>
              
              <div class="livestock-details">
                <div class="detail-item">
                  <div class="detail-value">3 years</div>
                  <div class="detail-label">Age</div>
                </div>
                <div class="detail-item">
                  <div class="detail-value">Male</div>
                  <div class="detail-label">Gender</div>
                </div>
              </div>
              
              <div class="livestock-actions">
                <button class="btn btn-primary">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  View
                </button>
                <button class="btn btn-outline-warning">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          </div>

          <!-- Gyr Card -->
          <div class="livestock-card">
            <div class="livestock-image-container">
              <img src="https://revistageneticabovina.com/wp-content/uploads/2020/08/gyr.png" class="livestock-image" alt="Gyr">
              <div class="livestock-overlay">
                <div class="overlay-content">
                  <div class="overlay-title">Gyr #002</div>
                  <div class="overlay-subtitle">Cross Breed</div>
                </div>
              </div>
            </div>
            <div class="livestock-info">
              <div class="livestock-header">
                <div>
                  <h5 class="livestock-title">Gyr #002</h5>
                  <p class="livestock-breed">Cross Breed</p>
                </div>
                <span class="livestock-id">#002</span>
              </div>
              
              <div class="livestock-stats">
                <span class="badge badge-success">Healthy</span>
                <span class="badge badge-info">220kg</span>
              </div>
              
              <div class="livestock-details">
                <div class="detail-item">
                  <div class="detail-value">2 years</div>
                  <div class="detail-label">Age</div>
                </div>
                <div class="detail-item">
                  <div class="detail-value">Female</div>
                  <div class="detail-label">Gender</div>
                </div>
              </div>
              
              <div class="livestock-actions">
                <button class="btn btn-primary">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  View
                </button>
                <button class="btn btn-outline-warning">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          </div>

          <!-- Nelore Card -->
          <div class="livestock-card">
            <div class="livestock-image-container">
              <img src="https://agrosinergia.com.bo/wp-content/uploads/2025/05/VACA-NELORE.jpg" class="livestock-image" alt="Nelore">
              <div class="livestock-overlay">
                <div class="overlay-content">
                  <div class="overlay-title">Nelore #003</div>
                  <div class="overlay-subtitle">Pure Breed</div>
                </div>
              </div>
            </div>
            <div class="livestock-info">
              <div class="livestock-header">
                <div>
                  <h5 class="livestock-title">Nelore #003</h5>
                  <p class="livestock-breed">Pure Breed</p>
                </div>
                <span class="livestock-id">#003</span>
              </div>
              
              <div class="livestock-stats">
                <span class="badge badge-warning">Check Required</span>
                <span class="badge badge-info">280kg</span>
              </div>
              
              <div class="livestock-details">
                <div class="detail-item">
                  <div class="detail-value">4 years</div>
                  <div class="detail-label">Age</div>
                </div>
                <div class="detail-item">
                  <div class="detail-value">Female</div>
                  <div class="detail-label">Gender</div>
                </div>
              </div>
              
              <div class="livestock-actions">
                <button class="btn btn-primary">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  View
                </button>
                <button class="btn btn-outline-warning">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          </div>

          <!-- Card to add new livestock -->
          <div class="add-livestock-card">
            <div class="add-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <div class="add-title">Add New Livestock</div>
            <div class="add-description">Register a new head of cattle in your inventory</div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('trader-livestock', TraderLivestock); 