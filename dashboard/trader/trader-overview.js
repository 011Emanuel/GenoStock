class TraderOverview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        .section-header { margin-bottom: 1.5rem; }
        .stat-card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 1.2rem; display: flex; align-items: center; gap: 1.2rem; margin-bottom: 1.2rem; }
        .stat-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem; }
        .bg-primary { background: #2c5530; }
        .bg-success { background: #43a047; }
        .bg-warning { background: #ffa726; }
        .bg-info { background: #29b6f6; }
        .stat-content h3 { margin: 0; font-size: 2rem; font-weight: 700; }
        .stat-content p { margin: 0; color: #888; font-size: 1.1rem; }
        .activity-item { display: flex; align-items: flex-start; gap: 1.1rem; margin-bottom: 1.1rem; }
        .activity-icon { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem; }
        .activity-content h6 { margin: 0 0 0.2rem 0; font-size: 1.08rem; font-weight: 600; }
        .activity-content p { margin: 0 0 0.1rem 0; color: #666; font-size: 0.98rem; }
        .activity-content small { color: #aaa; }
        .card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); margin-bottom: 1.2rem; }
        .card-header { padding: 1rem 1.2rem 0.5rem 1.2rem; border-bottom: 1px solid #eee; background: none; }
        .card-body { padding: 1.2rem; }
      </style>
      <section>
        <div class="section-header">
          <h2>Overview</h2>
          <p>Your livestock business at a glance</p>
        </div>
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-primary">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 21c4.97-4.97 8-8.13 8-11.5A5.5 5.5 0 0 0 12 4.5 5.5 5.5 0 0 0 4 9.5C4 12.87 7.03 16.03 12 21Z" stroke="#fff" stroke-width="2"/></svg>
              </div>
              <div class="stat-content">
                <h3>156</h3>
                <p>Total Livestock</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-success">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 21V3M6 8l6-5 6 5" stroke="#fff" stroke-width="2"/></svg>
              </div>
              <div class="stat-content">
                <h3>$45,230</h3>
                <p>Total Sales</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-warning">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 12h18M12 3v18" stroke="#fff" stroke-width="2"/></svg>
              </div>
              <div class="stat-content">
                <h3>23</h3>
                <p>This Month</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card">
              <div class="stat-icon bg-info">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2"/><path d="M12 8v4l3 3" stroke="#fff" stroke-width="2"/></svg>
              </div>
              <div class="stat-content">
                <h3>98%</h3>
                <p>Health Rate</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h5>Recent Activity</h5>
              </div>
              <div class="card-body">
                <div class="activity-item">
                  <div class="activity-icon bg-success">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2"/></svg>
                  </div>
                  <div class="activity-content">
                    <h6>New livestock added</h6>
                    <p>Added 5 Brahman cattle to your inventory</p>
                    <small>2 hours ago</small>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="activity-icon bg-primary">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 21V3M6 8l6-5 6 5" stroke="#fff" stroke-width="2"/></svg>
                  </div>
                  <div class="activity-content">
                    <h6>Sale completed</h6>
                    <p>Sold 3 Gyr cattle for $2,400</p>
                    <small>1 day ago</small>
                  </div>
                </div>
                <div class="activity-item">
                  <div class="activity-icon bg-warning">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" stroke="#fff" stroke-width="2"/></svg>
                  </div>
                  <div class="activity-content">
                    <h6>Health check required</h6>
                    <p>Schedule vaccination for Nelore cattle</p>
                    <small>3 days ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card">
              <div class="card-header">
                <h5>Quick Actions</h5>
              </div>
              <div class="card-body">
                <button class="btn btn-primary w-100 mb-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2"/></svg> Add Livestock
                </button>
                <button class="btn btn-success w-100 mb-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M3 12h18M12 3v18" stroke="#fff" stroke-width="2"/></svg> View Reports
                </button>
                <button class="btn btn-info w-100 mb-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" stroke-width="2"/><path d="M12 8v4l3 3" stroke="#fff" stroke-width="2"/></svg> Schedule Check
                </button>
                <button class="btn btn-warning w-100">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" stroke="#fff" stroke-width="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15.4 9a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z" stroke="#fff" stroke-width="2"/></svg> Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('trader-overview', TraderOverview); 