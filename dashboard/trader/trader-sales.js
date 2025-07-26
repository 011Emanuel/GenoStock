class TraderSales extends HTMLElement {
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

        .sales-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--white);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          box-shadow: var(--shadow);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-hover);
        }

        .stat-card.success::before {
          background: var(--gradient-success);
        }

        .stat-card.warning::before {
          background: var(--gradient-warning);
        }

        .stat-card.accent::before {
          background: var(--gradient-accent);
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1.5rem;
        }

        .stat-icon.success {
          background: var(--gradient-success);
        }

        .stat-icon.warning {
          background: var(--gradient-warning);
        }

        .stat-icon.accent {
          background: var(--gradient-accent);
        }

        .stat-icon.primary {
          background: var(--gradient-primary);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: var(--gray);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .stat-change {
          font-size: 0.85rem;
          color: var(--success);
          font-weight: 600;
        }

        .sales-container {
          background: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          transition: var(--transition);
        }

        .sales-container:hover {
          box-shadow: var(--shadow-hover);
        }

        .sales-header {
          padding: 1.5rem 2rem;
          border-bottom: 2px solid var(--light-gray);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--light-gray);
        }

        .sales-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sales-title::before {
          content: '';
          width: 4px;
          height: 24px;
          background: var(--gradient-accent);
          border-radius: 2px;
        }

        .sales-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn {
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-size: 0.95rem;
        }

        .btn-primary {
          background: var(--gradient-primary);
          color: var(--white);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(44, 85, 48, 0.3);
        }

        .btn-outline-primary {
          background: transparent;
          color: var(--primary);
          border: 2px solid var(--primary);
        }

        .btn-outline-primary:hover {
          background: var(--primary);
          color: var(--white);
          transform: translateY(-2px);
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        .sales-table {
          width: 100%;
          border-collapse: collapse;
        }

        .sales-table thead {
          background: var(--light-gray);
        }

        .sales-table th {
          padding: 1rem 1.5rem;
          text-align: left;
          font-weight: 600;
          color: var(--dark-gray);
          border-bottom: 2px solid var(--border);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sales-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          color: var(--dark-gray);
          transition: var(--transition);
        }

        .sales-table tbody tr {
          transition: var(--transition);
        }

        .sales-table tbody tr:hover {
          background: var(--light-gray);
          transform: scale(1.01);
        }

        .sales-table tbody tr:last-child td {
          border-bottom: none;
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

        .badge-pending {
          background: var(--light-gray);
          color: var(--gray);
        }

        .price {
          font-weight: 700;
          color: var(--success);
          font-size: 1.1rem;
        }

        .quantity {
          font-weight: 600;
          color: var(--primary);
          background: var(--light-gray);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          display: inline-block;
        }

        .date {
          color: var(--gray);
          font-size: 0.9rem;
        }

        .breed {
          font-weight: 600;
          color: var(--primary);
        }

        .livestock-name {
          font-weight: 600;
          color: var(--dark-gray);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          background: var(--light-gray);
          color: var(--gray);
        }

        .btn-icon:hover {
          background: var(--primary);
          color: var(--white);
          transform: scale(1.1);
        }

        .btn-icon.success {
          background: var(--success-light);
          color: var(--white);
        }

        .btn-icon.warning {
          background: var(--warning-light);
          color: var(--white);
        }

        @media (max-width: 768px) {
          .sales-stats {
            grid-template-columns: 1fr;
          }

          .sales-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .sales-actions {
            justify-content: center;
          }

          .sales-table {
            font-size: 0.9rem;
          }

          .sales-table th,
          .sales-table td {
            padding: 0.75rem 0.5rem;
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

        .sales-stats,
        .sales-container {
          animation: fadeInUp 0.6s ease-out;
        }

        .sales-container {
          animation-delay: 0.2s;
        }
      </style>
      
      <section>
        <div class="section-header">
          <h2>Ventas</h2>
          <p>Gestiona y rastrea tus transacciones comerciales</p>
        </div>

        <!-- Estadísticas de ventas -->
        <div class="sales-stats">
          <div class="stat-card success">
            <div class="stat-header">
              <div>
                <div class="stat-number">$5,150</div>
                <div class="stat-label">Ventas Totales</div>
                <div class="stat-change">+12.5% vs mes anterior</div>
              </div>
              <div class="stat-icon success">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="stat-card warning">
            <div class="stat-header">
              <div>
                <div class="stat-number">6</div>
                <div class="stat-label">Transacciones</div>
                <div class="stat-change">+2 este mes</div>
              </div>
              <div class="stat-icon warning">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="stat-card accent">
            <div class="stat-header">
              <div>
                <div class="stat-number">85%</div>
                <div class="stat-label">Tasa de Éxito</div>
                <div class="stat-change">+5% vs mes anterior</div>
              </div>
              <div class="stat-icon accent">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <div>
                <div class="stat-number">$858</div>
                <div class="stat-label">Promedio por Venta</div>
                <div class="stat-change">+8.3% vs mes anterior</div>
              </div>
              <div class="stat-icon primary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de ventas -->
        <div class="sales-container">
          <div class="sales-header">
            <h5 class="sales-title">Ventas Recientes</h5>
            <div class="sales-actions">
              <button class="btn btn-outline-primary btn-sm">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" stroke-width="2"/>
                </svg>
                Filtrar
              </button>
              <button class="btn btn-primary btn-sm">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
                </svg>
                Nueva Venta
              </button>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table class="sales-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Ganado</th>
                  <th>Raza</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="date">15 Ene 2024</td>
                  <td class="livestock-name">Brahman</td>
                  <td class="breed">Pura</td>
                  <td><span class="quantity">3</span></td>
                  <td class="price">$2,400</td>
                  <td><span class="badge badge-success">Completada</span></td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-icon success" title="Ver detalles">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      </button>
                      <button class="btn-icon" title="Editar">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="date">10 Ene 2024</td>
                  <td class="livestock-name">Gyr</td>
                  <td class="breed">Cruzada</td>
                  <td><span class="quantity">2</span></td>
                  <td class="price">$1,800</td>
                  <td><span class="badge badge-warning">Pendiente</span></td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-icon warning" title="Ver detalles">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      </button>
                      <button class="btn-icon" title="Editar">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="date">05 Ene 2024</td>
                  <td class="livestock-name">Nelore</td>
                  <td class="breed">Pura</td>
                  <td><span class="quantity">1</span></td>
                  <td class="price">$950</td>
                  <td><span class="badge badge-success">Completada</span></td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-icon success" title="Ver detalles">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      </button>
                      <button class="btn-icon" title="Editar">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }
}
customElements.define('trader-sales', TraderSales); 