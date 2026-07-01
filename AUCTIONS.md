# Módulo de Subastas de Ganado (Livestock Auctions)

Módulo independiente del Marketplace. No modifica archivos ni lógica de `marketplace.html` / `js/marketplace.js`.

## Estructura

```
backend/
  server.js                    # Servidor Express + Socket.io
  package.json
  migrations/
    001_create_auctions.sql    # Tablas auctions y auction_bids
  db/
    database.js                # SQLite + migraciones
    migrate.js
  middleware/
    auth.js                    # Autenticación compartida (headers)
  modules/auctions/
    auction.service.js         # Lógica de negocio
    auction.routes.js          # Endpoints REST

auctions.html                  # Listado de subastas
auction-details.html           # Detalle, pujas e historial
auction-create.html            # Crear subasta (vendedores)
css/auctions.css
js/auctions/
  auction-api.js               # Cliente API + WebSocket
  auction-utils.js             # Utilidades UI
  auctions-list.js
  auction-details.js
  auction-create.js
```

## Base de datos

| Tabla | Campos principales |
|-------|-------------------|
| `auctions` | title, description, images (JSON), starting_price, current_price, seller, ends_at, status, winner |
| `auction_bids` | auction_id, bidder, amount, created_at |

## API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/auctions` | No | Listar subastas (`?status=active\|ended`) |
| GET | `/api/auctions/:id` | No | Detalle + historial de ofertas |
| GET | `/api/auctions/:id/bids` | No | Solo historial |
| POST | `/api/auctions` | Sí (rancher/buyer) | Crear subasta |
| POST | `/api/auctions/:id/bids` | Sí | Registrar oferta |

Headers de autenticación (desde localStorage del login existente):
- `X-Username`, `X-Role`, `X-Name`

## Tiempo real (Socket.io)

Eventos emitidos:
- `auction:bid` — nueva oferta
- `auction:ended` — subasta finalizada
- `auction:created` — nueva subasta publicada

## Reglas de negocio

- Oferta debe ser **mayor** que la actual (mínimo: current_price + 1)
- No se permiten ofertas en subastas finalizadas
- Vendedores no pueden pujar en sus propias subastas
- Al finalizar: se bloquean ofertas, se selecciona ganador automáticamente
- Historial completo en `auction_bids`

## Instalación y uso

```bash
cd backend
npm install
npm start
```

Abrir: **http://localhost:3001/auctions.html**

Usuarios de prueba (login existente):
- Vendedor: `rancher1@email.com` / `1234`
- Comprador: `trader1@email.com` / `1234`

## Marketplace

El Marketplace permanece intacto en `marketplace.html`. Solo se añadió el enlace "Subastas" en el header compartido.
