/**
 * Catálogo de lotes 01–10 para la sección de subastas.
 */
const AuctionLots = (function () {
  const LOTS = [
    {
      lot: '01',
      breed: 'Brahman',
      birth: 'Marzo 2022',
      father: 'Toropalma F-220',
      mother: 'Reina R-118',
      weight: '920 kg',
      startingPrice: 1200,
      image: 'https://static.vecteezy.com/system/resources/previews/024/940/349/non_2x/beef-cattle-breeder-american-brahman-red-on-the-ground-in-the-fram-big-male-brahman-cow-photo.jpg'
    },
    {
      lot: '02',
      breed: 'Nelore',
      birth: 'Enero 2021',
      father: 'Imperador N-450',
      mother: 'Estrella N-302',
      weight: '780 kg',
      startingPrice: 950,
      image: 'https://img.freepik.com/fotos-premium/ganado-vacuno-criador-brahman-americano-rojo-suelo-fram-vaca-brahman-macho-grande_532332-2481.jpg'
    },
    {
      lot: '03',
      breed: 'Holstein',
      birth: 'Junio 2023',
      father: 'Lácteo H-880',
      mother: 'Blanca H-441',
      weight: '540 kg',
      startingPrice: 1100,
      image: 'https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg'
    },
    {
      lot: '04',
      breed: 'Gyr',
      birth: 'Agosto 2020',
      father: 'Monarca G-190',
      mother: 'Dulce G-275',
      weight: '850 kg',
      startingPrice: 1050,
      image: 'https://revistageneticabovina.com/wp-content/uploads/2020/08/gyr.png'
    },
    {
      lot: '05',
      breed: 'Simmental',
      birth: 'Noviembre 2022',
      father: 'Campeón S-330',
      mother: 'Fortuna S-201',
      weight: '890 kg',
      startingPrice: 1150,
      image: 'https://images.pexels.com/photos/51101/cow-milk-cow-milk-cow-51101.jpeg'
    },
    {
      lot: '06',
      breed: 'Guzerá',
      birth: 'Febrero 2021',
      father: 'Bravo GZ-112',
      mother: 'Perla GZ-089',
      weight: '810 kg',
      startingPrice: 980,
      image: 'https://images.pexels.com/photos/162240/cow-milk-cow-milk-cow-162240.jpeg'
    },
    {
      lot: '07',
      breed: 'Santa Gertrudis',
      birth: 'Abril 2022',
      father: 'Rey SG-505',
      mother: 'Rubí SG-318',
      weight: '870 kg',
      startingPrice: 1080,
      image: 'https://images.pexels.com/photos/735352/pexels-photo-735352.jpeg'
    },
    {
      lot: '08',
      breed: 'Indubrasil',
      birth: 'Septiembre 2020',
      father: 'Titan IB-770',
      mother: 'Luna IB-422',
      weight: '940 kg',
      startingPrice: 1250,
      image: 'https://images.pexels.com/photos/207943/pexels-photo-207943.jpeg'
    },
    {
      lot: '09',
      breed: 'Brahman',
      birth: 'Julio 2023',
      father: 'Atlas B-660',
      mother: 'Coral B-155',
      weight: '620 kg',
      startingPrice: 880,
      image: 'https://images.pexels.com/photos/539432/pexels-photo-539432.jpeg'
    },
    {
      lot: '10',
      breed: 'Nelore',
      birth: 'Diciembre 2021',
      father: 'Noble N-990',
      mother: 'Alba N-640',
      weight: '760 kg',
      startingPrice: 920,
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'
    }
  ];

  function findAuctionForLot(lotNum, auctions) {
    const padded = lotNum.padStart(2, '0');
    return auctions.find(a => {
      const title = (a.title || '').toLowerCase();
      return title.includes(`lote ${padded}`) || title.includes(`lot #${padded}`) || title.includes(`lot ${padded}`);
    });
  }

  function renderLotCard(lot, auctions = []) {
    const auction = findAuctionForLot(lot.lot, auctions);
    const detailLink = auction
      ? `auction-details.html?id=${auction.id}`
      : '#seccion-live';

    return `
      <article class="lot-card" data-aos="fade-up">
        <div class="lot-card-image-wrap">
          <span class="lot-badge">Lote ${lot.lot}</span>
          <img src="${lot.image}" class="lot-card-image" alt="Lote ${lot.lot} — ${lot.breed}" loading="lazy">
        </div>
        <div class="lot-card-body">
          <h4 class="lot-breed">${lot.breed}</h4>
          <ul class="lot-specs">
            <li><span class="lot-spec-label"><i class="fas fa-dna"></i> Raza</span><span class="lot-spec-value">${lot.breed}</span></li>
            <li><span class="lot-spec-label"><i class="fas fa-calendar-day"></i> Nacimiento</span><span class="lot-spec-value">${lot.birth}</span></li>
            <li><span class="lot-spec-label"><i class="fas fa-mars"></i> Padre</span><span class="lot-spec-value">${lot.father}</span></li>
            <li><span class="lot-spec-label"><i class="fas fa-venus"></i> Madre</span><span class="lot-spec-value">${lot.mother}</span></li>
            <li><span class="lot-spec-label"><i class="fas fa-weight-hanging"></i> Peso</span><span class="lot-spec-value">${lot.weight}</span></li>
          </ul>
          <div class="lot-price-box">
            <span class="lot-price-label">Precio inicial</span>
            <span class="lot-price-value">${AuctionUtils.formatCurrency(lot.startingPrice)}</span>
          </div>
          <a href="${detailLink}" class="btn btn-dark-green w-100 lot-card-btn">
            <i class="fas fa-gavel"></i> ${auction ? 'Pujar ahora' : 'Ver subasta'}
          </a>
        </div>
      </article>
    `;
  }

  function render(auctions = []) {
    const grid = document.getElementById('lotsGrid');
    if (!grid) return;
    grid.innerHTML = LOTS.map(lot => renderLotCard(lot, auctions)).join('');
    if (typeof AOS !== 'undefined') AOS.refreshHard();
  }

  return { render, LOTS };
})();

window.AuctionLots = AuctionLots;
