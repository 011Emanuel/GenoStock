class TraderLivestock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        .section-header { margin-bottom: 1.5rem; }
        .livestock-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); margin-bottom: 1.2rem; overflow: hidden; }
        .livestock-image { width: 100%; height: 180px; object-fit: cover; border-radius: 12px 12px 0 0; }
        .livestock-info { padding: 1.2rem; }
        .livestock-info h5 { margin: 0 0 0.2rem 0; font-size: 1.15rem; font-weight: 600; }
        .livestock-info p { margin: 0 0 0.5rem 0; color: #888; font-size: 1rem; }
        .livestock-stats { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
        .badge { font-size: 0.95em; }
        .livestock-actions { display: flex; gap: 0.5rem; }
      </style>
      <section>
        <div class="section-header">
          <h2>My Livestock</h2>
          <p>Manage your cattle inventory</p>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-4">
            <div class="livestock-card">
              <img src="https://static.vecteezy.com/system/resources/previews/024/940/349/non_2x/beef-cattle-breeder-american-brahman-red-on-the-ground-in-the-fram-big-male-brahman-cow-photo.jpg" class="livestock-image" alt="Brahman">
              <div class="livestock-info">
                <h5>Brahman #001</h5>
                <p class="text-muted">Pure Breed</p>
                <div class="livestock-stats">
                  <span class="badge bg-success">Healthy</span>
                  <span class="badge bg-info">250kg</span>
                </div>
                <div class="livestock-actions mt-3">
                  <button class="btn btn-sm btn-outline-primary">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#1976d2" stroke-width="2" fill="none"/><path d="M12 8v4l3 3" stroke="#1976d2" stroke-width="2"/></svg> View
                  </button>
                  <button class="btn btn-sm btn-outline-warning">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="2" rx="1" fill="#ffa726"/></svg> Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="livestock-card">
              <img src="https://revistageneticabovina.com/wp-content/uploads/2020/08/gyr.png" class="livestock-image" alt="Gyr">
              <div class="livestock-info">
                <h5>Gyr #002</h5>
                <p class="text-muted">Cross Breed</p>
                <div class="livestock-stats">
                  <span class="badge bg-success">Healthy</span>
                  <span class="badge bg-info">220kg</span>
                </div>
                <div class="livestock-actions mt-3">
                  <button class="btn btn-sm btn-outline-primary">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#1976d2" stroke-width="2" fill="none"/><path d="M12 8v4l3 3" stroke="#1976d2" stroke-width="2"/></svg> View
                  </button>
                  <button class="btn btn-sm btn-outline-warning">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="2" rx="1" fill="#ffa726"/></svg> Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="livestock-card">
              <img src="https://agrosinergia.com.bo/wp-content/uploads/2025/05/VACA-NELORE.jpg" class="livestock-image" alt="Nelore">
              <div class="livestock-info">
                <h5>Nelore #003</h5>
                <p class="text-muted">Pure Breed</p>
                <div class="livestock-stats">
                  <span class="badge bg-warning">Check Required</span>
                  <span class="badge bg-info">280kg</span>
                </div>
                <div class="livestock-actions mt-3">
                  <button class="btn btn-sm btn-outline-primary">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#1976d2" stroke-width="2" fill="none"/><path d="M12 8v4l3 3" stroke="#1976d2" stroke-width="2"/></svg> View
                  </button>
                  <button class="btn btn-sm btn-outline-warning">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="2" rx="1" fill="#ffa726"/></svg> Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('trader-livestock', TraderLivestock); 