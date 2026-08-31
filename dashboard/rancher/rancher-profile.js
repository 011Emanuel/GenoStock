class RancherProfile extends HTMLElement {
  constructor() {
    super();
    this.profile = null;
    this.email = localStorage.getItem('email') || '';
    this.editing = false;
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.loadProfile();
    this._onProfileUpdated = (event) => {
      if (this.editing || !event.detail) return;
      this.profile = event.detail;
      this.render();
    };
    window.addEventListener('genostock-profile-updated', this._onProfileUpdated);
  }

  disconnectedCallback() {
    if (this._onProfileUpdated) {
      window.removeEventListener('genostock-profile-updated', this._onProfileUpdated);
    }
  }

  emptyProfile() {
    return {
      username: localStorage.getItem('username') || localStorage.getItem('name') || '',
      full_name: localStorage.getItem('name') || localStorage.getItem('username') || '',
      ranch_name: localStorage.getItem('ranchName') || '',
      location: localStorage.getItem('location') || '',
      phone: localStorage.getItem('phone') || '',
      cattle_count: Number(localStorage.getItem('cattleCount') || 0),
      rfc: localStorage.getItem('rfc') || ''
    };
  }

  async loadProfile() {
    if (typeof window.loadUserProfile !== 'function') {
      this.profile = this.emptyProfile();
      this.render();
      return;
    }

    const { data, user, error } = await window.loadUserProfile();
    this.email = user?.email || localStorage.getItem('email') || '';
    if (error && !data) {
      this.profile = this.emptyProfile();
      this.render(error.message);
      return;
    }
    this.profile = data || this.emptyProfile();
    this.render();
  }

  displayName() {
    return this.profile?.full_name || this.profile?.username || 'Rancher';
  }

  valueOrDash(value) {
    if (value === 0) return '0';
    return value ? String(value) : 'Not set';
  }

  render(statusMessage = '', statusType = 'info') {
    const p = this.profile || this.emptyProfile();
    const name = this.displayName();
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2c5530&color=fff&size=128`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --primary: #2c5530;
          --primary-light: #4a7c59;
          --accent: #ffa726;
          --success: #4caf50;
          --danger: #f44336;
          --white: #ffffff;
          --light-gray: #f8f9fa;
          --gray: #6c757d;
          --dark-gray: #495057;
          --border: #e9ecef;
          --shadow: 0 4px 20px rgba(44, 85, 48, 0.1);
          --shadow-hover: 0 8px 30px rgba(44, 85, 48, 0.15);
          --gradient-primary: linear-gradient(135deg, #2c5530 0%, #4a7c59 100%);
          --gradient-accent: linear-gradient(135deg, #ffa726 0%, #ffb74d 100%);
          --border-radius: 16px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
          padding: 2rem;
        }
        .profile-container { max-width: 1100px; margin: 0 auto; }
        .section-header { margin-bottom: 2rem; text-align: center; }
        .section-header h2 { font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; }
        .section-header p { font-size: 1.1rem; color: var(--gray); margin: 0; }
        .profile-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 2rem; }
        .card {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .profile-header {
          background: var(--gradient-primary);
          color: var(--white);
          padding: 2rem;
          text-align: center;
        }
        .profile-avatar {
          width: 120px; height: 120px; border-radius: 50%;
          margin: 0 auto 1rem; border: 4px solid var(--white);
          object-fit: cover; display: block;
        }
        .profile-name { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
        .profile-role { font-size: 1rem; opacity: 0.9; }
        .card-body { padding: 1.5rem 2rem 2rem; }
        .info-row { display: flex; justify-content: space-between; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: var(--dark-gray); font-weight: 500; }
        .info-value { color: var(--primary); font-weight: 600; text-align: right; }
        .ranch-header {
          background: var(--gradient-accent);
          color: var(--white);
          padding: 1.5rem;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .ranch-header h3 { margin: 0; font-size: 1.3rem; }
        .btn {
          border: none; border-radius: 8px; padding: 0.8rem 1.4rem;
          font-weight: 600; cursor: pointer; transition: var(--transition);
        }
        .btn-primary { background: var(--gradient-primary); color: var(--white); }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: var(--shadow-hover); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .btn-secondary { background: var(--light-gray); color: var(--dark-gray); }
        .btn-row { display: flex; gap: 0.75rem; margin-top: 1.25rem; flex-wrap: wrap; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; font-weight: 600; color: var(--dark-gray); margin-bottom: 0.4rem; font-size: 0.9rem; }
        .form-group input {
          width: 100%; box-sizing: border-box; padding: 0.7rem 0.9rem;
          border: 1px solid var(--border); border-radius: 8px; font-size: 1rem;
        }
        .form-group input:focus { outline: none; border-color: var(--primary); }
        .form-group input[readonly] { background: var(--light-gray); color: var(--gray); }
        .status {
          margin-bottom: 1rem; padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.95rem;
        }
        .status.success { background: #e8f5e9; color: #2e7d32; }
        .status.error { background: #fdecea; color: #c62828; }
        .status.info { background: #fff8e1; color: #8d6e00; }
        .hint { color: var(--gray); font-size: 0.85rem; margin-top: 0.35rem; }
        @media (max-width: 768px) {
          :host { padding: 1rem; }
          .profile-grid { grid-template-columns: 1fr; }
          .section-header h2 { font-size: 2rem; }
        }
      </style>

      <div class="profile-container">
        <div class="section-header">
          <h2>Rancher Profile</h2>
          <p>Manage your personal information and ranch details</p>
        </div>
        ${statusMessage ? `<div class="status ${statusType}">${statusMessage}</div>` : ''}
        ${this.editing ? this.renderForm(p) : this.renderView(p, name, avatar)}
      </div>
    `;

    this.bindEvents();
  }

  renderView(p, name, avatar) {
    return `
      <div class="profile-grid">
        <div class="card">
          <div class="profile-header">
            <img class="profile-avatar" src="${avatar}" alt="${this.escape(name)}">
            <div class="profile-name">${this.escape(name)}</div>
            <div class="profile-role">Rancher</div>
          </div>
          <div class="card-body">
            <div class="info-row"><span class="info-label">Username</span><span class="info-value">${this.escape(this.valueOrDash(p.username))}</span></div>
            <div class="info-row"><span class="info-label">Email</span><span class="info-value">${this.escape(this.valueOrDash(this.email))}</span></div>
            <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${this.escape(this.valueOrDash(p.phone))}</span></div>
            <div class="btn-row">
              <button type="button" class="btn btn-primary" id="editBtn">Edit Profile</button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="ranch-header">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            <h3>Ranch Information</h3>
          </div>
          <div class="card-body">
            <div class="info-row"><span class="info-label">Ranch name</span><span class="info-value">${this.escape(this.valueOrDash(p.ranch_name))}</span></div>
            <div class="info-row"><span class="info-label">Location</span><span class="info-value">${this.escape(this.valueOrDash(p.location))}</span></div>
            <div class="info-row"><span class="info-label">Cattle count</span><span class="info-value">${this.escape(this.valueOrDash(p.cattle_count))}</span></div>
          </div>
        </div>
      </div>
    `;
  }

  renderForm(p) {
    return `
      <form class="card" id="profileForm">
        <div class="ranch-header">
          <h3>Edit Profile</h3>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label for="fullName">Full name</label>
            <input id="fullName" type="text" value="${this.escape(p.full_name || '')}" required>
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" type="text" value="${this.escape(p.username || '')}" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" value="${this.escape(this.email)}" readonly>
            <div class="hint">Email is managed by your login account and cannot be changed here.</div>
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input id="phone" type="tel" value="${this.escape(p.phone || '')}" placeholder="5071234567">
          </div>
          <div class="form-group">
            <label for="ranchName">Ranch name</label>
            <input id="ranchName" type="text" value="${this.escape(p.ranch_name || '')}">
          </div>
          <div class="form-group">
            <label for="location">Location</label>
            <input id="location" type="text" value="${this.escape(p.location || '')}" placeholder="Chiriquí, Panama">
          </div>
          <div class="form-group">
            <label for="cattleCount">Cattle count</label>
            <input id="cattleCount" type="number" min="0" value="${Number(p.cattle_count || 0)}">
          </div>
          <div class="btn-row">
            <button type="submit" class="btn btn-primary" id="saveBtn">Save to Database</button>
            <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
          </div>
        </div>
      </form>
    `;
  }

  escape(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  bindEvents() {
    const editBtn = this.shadowRoot.getElementById('editBtn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        this.editing = true;
        this.render();
      });
    }

    const cancelBtn = this.shadowRoot.getElementById('cancelBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.editing = false;
        this.render();
      });
    }

    const form = this.shadowRoot.getElementById('profileForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSave(e));
    }
  }

  async handleSave(event) {
    event.preventDefault();
    const saveBtn = this.shadowRoot.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }

    if (typeof window.saveUserProfile !== 'function') {
      this.render('Supabase is not connected. Add your project credentials first.', 'error');
      return;
    }

    const updates = {
      full_name: this.shadowRoot.getElementById('fullName').value.trim(),
      username: this.shadowRoot.getElementById('username').value.trim(),
      phone: this.shadowRoot.getElementById('phone').value.trim(),
      ranch_name: this.shadowRoot.getElementById('ranchName').value.trim(),
      location: this.shadowRoot.getElementById('location').value.trim(),
      cattle_count: this.shadowRoot.getElementById('cattleCount').value,
      role: 'rancher'
    };

    const { data, error } = await window.saveUserProfile(updates);
    if (error) {
      this.editing = true;
      this.render(error.message || 'Could not save the profile to the database.', 'error');
      const retryBtn = this.shadowRoot.getElementById('saveBtn');
      if (retryBtn) retryBtn.disabled = false;
      return;
    }

    this.profile = data;
    this.editing = false;
    this.render('Profile saved to the database.', 'success');
  }
}

customElements.define('rancher-profile', RancherProfile);
