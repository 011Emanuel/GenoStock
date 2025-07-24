class TraderSales extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        .section-header { margin-bottom: 1.5rem; }
        .card { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); margin-bottom: 1.2rem; }
        .card-header { padding: 1rem 1.2rem 0.5rem 1.2rem; border-bottom: 1px solid #eee; background: none; }
        .card-body { padding: 1.2rem; }
        .table-responsive { margin-top: 1rem; }
        .badge { font-size: 0.95em; }
      </style>
      <section>
        <div class="section-header">
          <h2>Sales</h2>
          <p>Track your sales and transactions</p>
        </div>
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5>Recent Sales</h5>
            <button class="btn btn-primary btn-sm">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2"/></svg> New Sale
            </button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Livestock</th>
                    <th>Breed</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2024-01-15</td>
                    <td>Brahman</td>
                    <td>Pure</td>
                    <td>3</td>
                    <td>$2,400</td>
                    <td><span class="badge bg-success">Completed</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#1976d2" stroke-width="2" fill="none"/><path d="M12 8v4l3 3" stroke="#1976d2" stroke-width="2"/></svg>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>2024-01-10</td>
                    <td>Gyr</td>
                    <td>Cross</td>
                    <td>2</td>
                    <td>$1,800</td>
                    <td><span class="badge bg-warning">Pending</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#1976d2" stroke-width="2" fill="none"/><path d="M12 8v4l3 3" stroke="#1976d2" stroke-width="2"/></svg>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>2024-01-05</td>
                    <td>Nelore</td>
                    <td>Pure</td>
                    <td>1</td>
                    <td>$950</td>
                    <td><span class="badge bg-success">Completed</span></td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#1976d2" stroke-width="2" fill="none"/><path d="M12 8v4l3 3" stroke="#1976d2" stroke-width="2"/></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('trader-sales', TraderSales); 