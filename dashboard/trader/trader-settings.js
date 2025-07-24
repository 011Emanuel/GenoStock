class TraderSettings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        .section-header { margin-bottom: 1.5rem; }
        .card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); margin-bottom: 1.2rem; }
        .card-header { padding: 1rem 1.2rem 0.5rem 1.2rem; border-bottom: 1px solid #eee; background: none; }
        .card-body { padding: 1.2rem; }
        .badge { font-size: 0.95em; }
      </style>
      <section>
        <div class="section-header">
          <h2>Settings</h2>
          <p>Configure your account preferences</p>
        </div>
        <div class="row g-4">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5>Account Settings</h5>
              </div>
              <div class="card-body">
                <form>
                  <div class="mb-3">
                    <label class="form-label">Email Notifications</label>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" checked>
                      <label class="form-check-label">Sales notifications</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" checked>
                      <label class="form-check-label">Health alerts</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox">
                      <label class="form-check-label">Marketing emails</label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Language</label>
                    <select class="form-select">
                      <option>English</option>
                      <option>Español</option>
                    </select>
                  </div>
                  <button type="submit" class="btn btn-primary">Save Settings</button>
                </form>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5>Security</h5>
              </div>
              <div class="card-body">
                <form>
                  <div class="mb-3">
                    <label class="form-label">Current Password</label>
                    <input type="password" class="form-control">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">New Password</label>
                    <input type="password" class="form-control">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Confirm New Password</label>
                    <input type="password" class="form-control">
                  </div>
                  <button type="submit" class="btn btn-warning">Change Password</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('trader-settings', TraderSettings); 