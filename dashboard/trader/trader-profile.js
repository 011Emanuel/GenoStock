class TraderProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        .section-header { margin-bottom: 1.5rem; }
        .card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); margin-bottom: 1.2rem; }
        .card-header { padding: 1rem 1.2rem 0.5rem 1.2rem; border-bottom: 1px solid #eee; background: none; }
        .card-body { padding: 1.2rem; }
        .profile-avatar { margin-bottom: 1.2rem; }
        .profile-avatar svg { display: block; margin: 0 auto; }
        .btn { margin-top: 0.5rem; }
      </style>
      <section>
        <div class="section-header">
          <h2>Profile</h2>
          <p>Manage your personal information</p>
        </div>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card">
              <div class="card-body text-center">
                <div class="profile-avatar mb-3">
                  <svg width="64" height="64" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#1976d2" stroke-width="2" fill="#e3f2fd"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4" stroke="#1976d2" stroke-width="2" fill="#e3f2fd"/></svg>
                </div>
                <h5>John Doe</h5>
                <p class="text-muted">Livestock Farmer</p>
                <button class="btn btn-outline-primary btn-sm">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 19v-6M12 5v2m0 0a7 7 0 1 1 0 14a7 7 0 0 1 0-14z" stroke="#1976d2" stroke-width="2"/></svg> Change Photo
                </button>
              </div>
            </div>
            <button class="btn btn-outline-danger w-100 mt-4" id="logoutBtnProfile">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M16 17l5-5-5-5M21 12H9" stroke="#d32f2f" stroke-width="2"/></svg> Logout
            </button>
          </div>
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h5>Personal Information</h5>
              </div>
              <div class="card-body">
                <form>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">First Name</label>
                      <input type="text" class="form-control" value="John">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Last Name</label>
                      <input type="text" class="form-control" value="Doe">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" value="john.doe@example.com">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Phone</label>
                      <input type="tel" class="form-control" value="+507 6123-4567">
                    </div>
                    <div class="col-12">
                      <label class="form-label">Address</label>
                      <textarea class="form-control" rows="3">Chiriquí, Panama</textarea>
                    </div>
                    <div class="col-12">
                      <button type="submit" class="btn btn-primary">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="2"/></svg> Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('trader-profile', TraderProfile); 