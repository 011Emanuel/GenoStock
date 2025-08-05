class RancherLivestock extends HTMLElement {
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
          display: block;
          padding: 2rem;
        }

        .livestock-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-header { 
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        
        .section-header p {
          font-size: 1.1rem;
          color: var(--gray);
          margin: 0;
        }
        
        /* Controls */
        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .search-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          flex: 1;
          max-width: 300px;
        }
        
        .search-box input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 0.9rem;
        }
        
        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .filter-btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border);
          background: var(--white);
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .filter-btn.active {
          background: var(--primary);
          color: var(--white);
          border-color: var(--primary);
        }
        
        .add-btn {
          background: var(--gradient-primary);
          color: var(--white);
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: var(--transition);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
        
        /* Cattle Grid */
        .cattle-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .cattle-card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
          transition: var(--transition);
        }
        
        .cattle-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
        }
        
        .cattle-header {
          background: var(--gradient-primary);
          color: var(--white);
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .cattle-id {
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        .cattle-status {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-healthy {
          background: var(--success);
          color: var(--white);
        }
        
        .status-pregnant {
          background: var(--warning);
          color: var(--white);
        }
        
        .status-sick {
          background: var(--danger);
          color: var(--white);
        }
        
        .cattle-body {
          padding: 1.5rem;
        }
        
        .cattle-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        
        .info-label {
          font-size: 0.8rem;
          color: var(--gray);
          font-weight: 500;
          text-transform: uppercase;
        }
        
        .info-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--dark-gray);
        }
        
        .cattle-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .action-btn {
          flex: 1;
          padding: 0.6rem;
          border: 1px solid var(--border);
          background: var(--white);
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.8rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
        }
        
        .action-btn:hover {
          background: var(--primary);
          color: var(--white);
          border-color: var(--primary);
        }
        
        .action-btn.primary {
          background: var(--gradient-primary);
          color: var(--white);
          border-color: var(--primary);
        }
        
        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
        
        /* Stats Summary */
        .stats-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .stat-item {
          background: var(--white);
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          text-align: center;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: var(--gray);
          font-weight: 500;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          :host {
            padding: 1rem;
          }
          
          .controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-box {
            max-width: none;
          }
          
          .cattle-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-summary {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .section-header h2 {
            font-size: 2rem;
          }
        }
      </style>
      
      <div class="livestock-container">
        <div class="section-header">
          <h2>Livestock Management</h2>
          <p>Manage your cattle inventory and health records</p>
        </div>
        
        <!-- Stats Summary -->
        <div class="stats-summary">
          <div class="stat-item">
            <div class="stat-number">234</div>
            <div class="stat-label">Total Cattle</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">156</div>
            <div class="stat-label">Brahman</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">78</div>
            <div class="stat-label">Nelore</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">15</div>
            <div class="stat-label">Pregnant</div>
          </div>
        </div>
        
        <!-- Controls -->
        <div class="controls">
          <div class="search-box">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input type="text" placeholder="Search cattle...">
          </div>
          
          <div class="filter-buttons">
            <button class="filter-btn active">All</button>
            <button class="filter-btn">Brahman</button>
            <button class="filter-btn">Nelore</button>
            <button class="filter-btn">Pregnant</button>
          </div>
          
          <button class="add-btn">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Cattle
          </button>
        </div>
        
        <!-- Cattle Grid -->
        <div class="cattle-grid">
          <!-- Cattle Card 1 -->
          <div class="cattle-card">
            <div class="cattle-header">
              <div class="cattle-id">B-156</div>
              <div class="cattle-status status-healthy">Healthy</div>
            </div>
            <div class="cattle-body">
              <div class="cattle-info">
                <div class="info-item">
                  <div class="info-label">Breed</div>
                  <div class="info-value">Brahman</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Age</div>
                  <div class="info-value">4 years</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Weight</div>
                  <div class="info-value">1,200 kg</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Last Check</div>
                  <div class="info-value">2 days ago</div>
                </div>
              </div>
              <div class="cattle-actions">
                <button class="action-btn">View Details</button>
                <button class="action-btn">Health Check</button>
                <button class="action-btn primary">Edit</button>
              </div>
            </div>
          </div>
          
          <!-- Cattle Card 2 -->
          <div class="cattle-card">
            <div class="cattle-header">
              <div class="cattle-id">N-078</div>
              <div class="cattle-status status-pregnant">Pregnant</div>
            </div>
            <div class="cattle-body">
              <div class="cattle-info">
                <div class="info-item">
                  <div class="info-label">Breed</div>
                  <div class="info-value">Nelore</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Age</div>
                  <div class="info-value">6 years</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Weight</div>
                  <div class="info-value">1,350 kg</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Due Date</div>
                  <div class="info-value">Next month</div>
                </div>
              </div>
              <div class="cattle-actions">
                <button class="action-btn">View Details</button>
                <button class="action-btn">Health Check</button>
                <button class="action-btn primary">Edit</button>
              </div>
            </div>
          </div>
          
          <!-- Cattle Card 3 -->
          <div class="cattle-card">
            <div class="cattle-header">
              <div class="cattle-id">B-203</div>
              <div class="cattle-status status-healthy">Healthy</div>
            </div>
            <div class="cattle-body">
              <div class="cattle-info">
                <div class="info-item">
                  <div class="info-label">Breed</div>
                  <div class="info-value">Brahman</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Age</div>
                  <div class="info-value">3 years</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Weight</div>
                  <div class="info-value">1,100 kg</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Last Check</div>
                  <div class="info-value">1 week ago</div>
                </div>
              </div>
              <div class="cattle-actions">
                <button class="action-btn">View Details</button>
                <button class="action-btn">Health Check</button>
                <button class="action-btn primary">Edit</button>
              </div>
            </div>
          </div>
          
          <!-- Cattle Card 4 -->
          <div class="cattle-card">
            <div class="cattle-header">
              <div class="cattle-id">N-045</div>
              <div class="cattle-status status-sick">Sick</div>
            </div>
            <div class="cattle-body">
              <div class="cattle-info">
                <div class="info-item">
                  <div class="info-label">Breed</div>
                  <div class="info-value">Nelore</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Age</div>
                  <div class="info-value">5 years</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Weight</div>
                  <div class="info-value">1,280 kg</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Issue</div>
                  <div class="info-value">Respiratory</div>
                </div>
              </div>
              <div class="cattle-actions">
                <button class="action-btn">View Details</button>
                <button class="action-btn">Health Check</button>
                <button class="action-btn primary">Edit</button>
              </div>
            </div>
          </div>
          
          <!-- Cattle Card 5 -->
          <div class="cattle-card">
            <div class="cattle-header">
              <div class="cattle-id">B-189</div>
              <div class="cattle-status status-pregnant">Pregnant</div>
            </div>
            <div class="cattle-body">
              <div class="cattle-info">
                <div class="info-item">
                  <div class="info-label">Breed</div>
                  <div class="info-value">Brahman</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Age</div>
                  <div class="info-value">7 years</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Weight</div>
                  <div class="info-value">1,400 kg</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Due Date</div>
                  <div class="info-value">2 weeks</div>
                </div>
              </div>
              <div class="cattle-actions">
                <button class="action-btn">View Details</button>
                <button class="action-btn">Health Check</button>
                <button class="action-btn primary">Edit</button>
              </div>
            </div>
          </div>
          
          <!-- Cattle Card 6 -->
          <div class="cattle-card">
            <div class="cattle-header">
              <div class="cattle-id">N-112</div>
              <div class="cattle-status status-healthy">Healthy</div>
            </div>
            <div class="cattle-body">
              <div class="cattle-info">
                <div class="info-item">
                  <div class="info-label">Breed</div>
                  <div class="info-value">Nelore</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Age</div>
                  <div class="info-value">4 years</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Weight</div>
                  <div class="info-value">1,250 kg</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Last Check</div>
                  <div class="info-value">3 days ago</div>
                </div>
              </div>
              <div class="cattle-actions">
                <button class="action-btn">View Details</button>
                <button class="action-btn">Health Check</button>
                <button class="action-btn primary">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('rancher-livestock', RancherLivestock); 