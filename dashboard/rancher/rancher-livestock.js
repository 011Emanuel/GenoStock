class RancherLivestock extends HTMLElement {
  constructor() {
    super();
    this.items = [];
    this.currentFilter = 'all';
    this.searchQuery = '';
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
          flex-wrap: wrap;
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
        
        .filter-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
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
            <div class="stat-number" id="statTotal">0</div>
            <div class="stat-label">Total Cattle</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" id="statBrahman">0</div>
            <div class="stat-label">Brahman</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" id="statNelore">0</div>
            <div class="stat-label">Nelore</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" id="statGuzera">0</div>
            <div class="stat-label">Guzerá / Gyr</div>
          </div>
        </div>
        
        <!-- Controls -->
        <div class="controls">
          <div class="search-box">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input type="text" id="searchInput" placeholder="Search cattle by tag ID, breed...">
          </div>
          
          <div class="filter-buttons" id="filterContainer">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="Brahman">Brahman</button>
            <button class="filter-btn" data-filter="Nelore">Nelore</button>
            <button class="filter-btn" data-filter="Gyr">Gyr</button>
            <button class="filter-btn" data-filter="Guzerá">Guzerá</button>
          </div>
          
          <button class="add-btn" id="addCattleBtnTop">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Cattle
          </button>
        </div>
        
        <!-- Cattle Grid (Populated Dynamically) -->
        <div class="cattle-grid" id="cattleGrid"></div>
      </div>
    `;
  }

  connectedCallback() {
    this.setupEventListeners();
    this.loadCattle();
  }

  setupEventListeners() {
    const shadow = this.shadowRoot;
    
    // Add Cattle navigation
    const addTop = shadow.querySelector('#addCattleBtnTop');
    if (addTop) {
      addTop.addEventListener('click', () => {
        window.location.href = 'add-cattle.html';
      });
    }

    // Search Input Real-Time Listener
    const searchInput = shadow.querySelector('#searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderGrid();
      });
    }

    // Filter Buttons Click Listener
    const filterButtons = shadow.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter');
        this.renderGrid();
      });
    });
  }

  async loadCattle() {
    let items = [];

    // Read local storage records first
    try {
      const local = JSON.parse(localStorage.getItem('genostock_cattle_list') || '[]');
      items = [...local];
    } catch(e) {}

    // Fetch records from Supabase cattle table
    try {
      if (window.supabase && window.supabase.from) {
        const { data, error } = await window.supabase.from('cattle').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          data.forEach(dbItem => {
            if (!items.some(i => i.id === dbItem.id)) {
              items.push({
                id: dbItem.id,
                tagId: dbItem.title,
                title: dbItem.title,
                breed: dbItem.breed,
                category: dbItem.category,
                weight: dbItem.weight,
                age: dbItem.age,
                imageUrl: dbItem.image_url,
                description: dbItem.description,
                status: dbItem.status || 'Active'
              });
            }
          });
        }
      }
    } catch(e) {
      console.warn('Could not fetch Supabase cattle:', e);
    }

    this.items = items;

    // Update Stats Summary
    const shadow = this.shadowRoot;
    const totalEl = shadow.querySelector('#statTotal');
    const brahmanEl = shadow.querySelector('#statBrahman');
    const neloreEl = shadow.querySelector('#statNelore');
    const guzeraEl = shadow.querySelector('#statGuzera');

    if (totalEl) totalEl.textContent = items.length;
    if (brahmanEl) brahmanEl.textContent = items.filter(i => (i.breed || '').toLowerCase() === 'brahman').length;
    if (neloreEl) neloreEl.textContent = items.filter(i => (i.breed || '').toLowerCase() === 'nelore').length;
    if (guzeraEl) guzeraEl.textContent = items.filter(i => ['guzerá', 'guzera', 'gyr'].includes((i.breed || '').toLowerCase())).length;

    this.renderGrid();
  }

  renderGrid() {
    const shadow = this.shadowRoot;
    const grid = shadow.querySelector('#cattleGrid');
    if (!grid) return;

    let filtered = this.items;

    // Apply Filter Button Selection
    if (this.currentFilter && this.currentFilter.toLowerCase() !== 'all') {
      const targetFilter = this.currentFilter.toLowerCase();
      filtered = filtered.filter(item => {
        const breed = (item.breed || '').toLowerCase();
        if (targetFilter === 'guzerá' || targetFilter === 'guzera') {
          return breed === 'guzerá' || breed === 'guzera';
        }
        return breed === targetFilter;
      });
    }

    // Apply Search Query
    if (this.searchQuery) {
      const q = this.searchQuery;
      filtered = filtered.filter(item => {
        const tag = (item.tagId || '').toLowerCase();
        const title = (item.title || '').toLowerCase();
        const breed = (item.breed || '').toLowerCase();
        const category = (item.category || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        return tag.includes(q) || title.includes(q) || breed.includes(q) || category.includes(q) || desc.includes(q);
      });
    }

    // Render Cards or Empty State
    if (filtered.length === 0) {
      const isFilteredOut = this.items.length > 0;
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: #ffffff; border-radius: 16px; border: 2px dashed #cbd5e1;">
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" style="margin-bottom: 1rem;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <h4 style="color: #2c5530; font-weight: 700; margin-bottom: 0.5rem;">${isFilteredOut ? 'No Cattle Match Your Filter' : 'No Cattle Registered Yet'}</h4>
          <p style="color: #64748b; max-width: 440px; margin: 0 auto 1.5rem; font-size: 0.95rem;">${isFilteredOut ? 'Try clearing your search query or selecting a different breed filter.' : 'Your livestock inventory is currently empty. Register your first cattle record using the button below.'}</p>
          <button class="add-btn" style="margin: 0 auto;" id="emptyAddBtn">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            ${isFilteredOut ? 'Clear Filter & View All' : 'Add Your First Cattle'}
          </button>
        </div>
      `;

      const emptyAdd = grid.querySelector('#emptyAddBtn');
      if (emptyAdd) {
        emptyAdd.addEventListener('click', () => {
          if (isFilteredOut) {
            this.currentFilter = 'all';
            this.searchQuery = '';
            const searchInput = shadow.querySelector('#searchInput');
            if (searchInput) searchInput.value = '';
            const filterButtons = shadow.querySelectorAll('.filter-btn');
            filterButtons.forEach(b => {
              if (b.getAttribute('data-filter') === 'all') b.classList.add('active');
              else b.classList.remove('active');
            });
            this.renderGrid();
          } else {
            window.location.href = 'add-cattle.html';
          }
        });
      }
    } else {
      grid.innerHTML = filtered.map(c => `
        <div class="cattle-card">
          <div class="cattle-header">
            <div class="cattle-id">${c.tagId || c.title || 'Cattle Record'}</div>
            <div class="cattle-status status-healthy">${c.status || 'Active'}</div>
          </div>
          ${c.imageUrl ? `<div style="height:160px; overflow:hidden; border-radius:10px; margin-bottom:1rem;"><img src="${c.imageUrl}" style="width:100%; height:100%; object-fit:cover;" alt="${c.title || 'Cattle'}"></div>` : ''}
          <div class="cattle-body">
            <div class="cattle-info">
              <div class="info-item">
                <div class="info-label">Breed</div>
                <div class="info-value">${c.breed || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Age</div>
                <div class="info-value">${c.age ? c.age + ' mths' : 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Weight</div>
                <div class="info-value">${c.weight ? c.weight + ' kg' : 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Type</div>
                <div class="info-value">${c.category || 'Livestock'}</div>
              </div>
            </div>
            <div class="cattle-actions">
              <button class="action-btn view-detail-btn" data-tag="${c.tagId || c.title}" data-breed="${c.breed || 'N/A'}" data-weight="${c.weight || 'N/A'}" data-age="${c.age || 'N/A'}" data-desc="${c.description || 'No extra details'}">View Details</button>
              <button class="action-btn primary card-add-btn">Add Cattle</button>
            </div>
          </div>
        </div>
      `).join('');

      // Wire up card action buttons
      grid.querySelectorAll('.view-detail-btn').forEach(b => {
        b.addEventListener('click', () => {
          const tag = b.getAttribute('data-tag');
          const breed = b.getAttribute('data-breed');
          const weight = b.getAttribute('data-weight');
          const age = b.getAttribute('data-age');
          const desc = b.getAttribute('data-desc');
          alert(`🐮 CATTLE DETAILS\n-------------------\nTag / ID: ${tag}\nBreed: ${breed}\nWeight: ${weight} kg\nAge: ${age} months\nNotes: ${desc}`);
        });
      });

      grid.querySelectorAll('.card-add-btn').forEach(b => {
        b.addEventListener('click', () => {
          window.location.href = 'add-cattle.html';
        });
      });
    }
  }
}
customElements.define('rancher-livestock', RancherLivestock); 