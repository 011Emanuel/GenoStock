// Price and quantity handling
let basePrice = 2500; // Base price for the cattle

function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = basePrice * quantity;
    document.getElementById('total-price').textContent = `$${totalPrice.toLocaleString()}`;
}

function incrementQuantity() {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value) + 1;
    updateTotalPrice();
}

function decrementQuantity() {
    const input = document.getElementById('quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateTotalPrice();
    }
}

// Image gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail-gallery img');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            mainImage.src = this.src;
        });
    });

    // Initialize total price
    updateTotalPrice();
});

// Cart functionality
function addToCart() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = basePrice * quantity;
    
    // Here you would typically send this data to your backend
    const cartItem = {
        breed: 'Angus Cattle',
        quantity: quantity,
        price: totalPrice,
        image: document.querySelector('.main-image img').src
    };

    // Show success message
    showNotification('Added to cart successfully!', 'success');
}

function buyNow() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = basePrice * quantity;
    
    // Here you would typically redirect to checkout or show payment modal
    showNotification('Proceeding to checkout...', 'info');
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add styles dynamically
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1000';
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Contact seller functionality
document.querySelector('.contact-seller').addEventListener('click', function(e) {
    if (e.target.closest('button')) {
        const action = e.target.closest('button').textContent.trim();
        if (action.includes('Message')) {
            // Here you would typically show a messaging modal
            showNotification('Messaging system coming soon!', 'info');
        } else if (action.includes('Call')) {
            // Here you would typically initiate a call
            showNotification('Calling system coming soon!', 'info');
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Cattle breeds data
const cattleData = {
    1: {
        breed: 'Angus',
        price: '$2,500',
        weight: '800 kg',
        age: '2 years',
        location: 'Texas',
        description: 'High-quality Angus cattle with excellent genetics. Perfect for breeding or meat production. Well-maintained health records and regular veterinary check-ups.',
        images: [
            'images/breeds/angus/angus1.jpg',
            'images/breeds/angus/angus2.jpg',
            'images/breeds/angus/angus3.jpg'
        ],
        seller: {
            name: 'John Smith',
            age: '45 years',
            nationality: 'American',
            experience: '20 years in cattle farming',
            phone: '+1 (555) 123-4567',
            email: 'john.smith@ranchmail.com',
            location: 'Dallas, Texas'
        }
    },
    2: {
        breed: 'Hereford',
        price: '$2,800',
        weight: '850 kg',
        age: '3 years',
        location: 'Kansas',
        description: 'Premium Hereford cattle from a renowned breeding line. Known for their docile temperament and excellent meat quality.',
        images: [
            'images/breeds/hereford/hereford1.jpg',
            'images/breeds/hereford/hereford2.jpg',
            'images/breeds/hereford/hereford3.jpg'
        ],
        seller: {
            name: 'Robert Johnson',
            age: '52 years',
            nationality: 'Canadian',
            experience: '25 years in cattle farming',
            phone: '+1 (555) 234-5678',
            email: 'robert.j@ranchmail.com',
            location: 'Wichita, Kansas'
        }
    },
    3: {
        breed: 'Holstein',
        price: '$3,000',
        weight: '700 kg',
        age: '1.5 years',
        location: 'California',
        description: 'High-production Holstein dairy cow. Excellent milk production genetics and healthy lineage.',
        images: [
            'images/breeds/holstein/holstein1.jpg',
            'images/breeds/holstein/holstein2.jpg',
            'images/breeds/holstein/holstein3.jpg'
        ],
        seller: {
            name: 'Maria Gonzalez',
            age: '38 years',
            nationality: 'Mexican',
            experience: '15 years in dairy farming',
            phone: '+1 (555) 345-6789',
            email: 'maria.g@dairyfarm.com',
            location: 'Sacramento, California'
        }
    },
    4: {
        breed: 'Brahman',
        price: '$3,200',
        weight: '900 kg',
        age: '2.5 years',
        location: 'Florida',
        description: 'Premium Brahman breed, perfect for tropical climates. Excellent heat tolerance and disease resistance.',
        images: [
            'images/breeds/brahman/brahman1.jpg',
            'images/breeds/brahman/brahman2.jpg',
            'images/breeds/brahman/brahman3.jpg'
        ],
        seller: {
            name: 'Carlos Rodriguez',
            age: '41 years',
            nationality: 'Brazilian',
            experience: '18 years in tropical cattle farming',
            phone: '+1 (555) 456-7890',
            email: 'carlos.r@ranchmail.com',
            location: 'Miami, Florida'
        }
    }
};

// Load cattle details when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get cattle ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const cattleId = urlParams.get('id');

    if (cattleId && cattleData[cattleId]) {
        loadCattleDetails(cattleId);
    } else {
        showError('Cattle not found');
    }

    // Add click handlers for navigation buttons
    document.querySelectorAll('[data-cattle-id]').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-cattle-id');
            window.location.href = `cattle-details.html?id=${id}`;
        });
    });
});

function loadCattleDetails(id) {
    const cattle = cattleData[id];
    
    // Update page title
    document.title = `${cattle.breed} Details - GenoStock`;
    
    // Update cattle information
    document.getElementById('cattle-breed').textContent = cattle.breed;
    document.getElementById('cattle-price').textContent = cattle.price;
    document.getElementById('cattle-weight').textContent = cattle.weight;
    document.getElementById('cattle-age').textContent = cattle.age;
    document.getElementById('cattle-location').textContent = cattle.location;
    document.getElementById('cattle-description').textContent = cattle.description;

    // Update carousel images
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = cattle.images.map((img, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${img}" class="d-block w-100" alt="${cattle.breed} Image ${index + 1}">
        </div>
    `).join('');

    // Update seller information
    document.getElementById('seller-name').textContent = cattle.seller.name;
    document.getElementById('seller-age').textContent = cattle.seller.age;
    document.getElementById('seller-nationality').textContent = cattle.seller.nationality;
    document.getElementById('seller-experience').textContent = cattle.seller.experience;
    document.getElementById('seller-phone').textContent = cattle.seller.phone;
    document.getElementById('seller-email').textContent = cattle.seller.email;
    document.getElementById('seller-location').textContent = cattle.seller.location;
}

function showError(message) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="alert alert-danger mt-4" role="alert">
            ${message}
            <br>
            <a href="marketplace.html" class="alert-link">Return to Marketplace</a>
        </div>
    `;
}

// Definición de las razas de ganado y sus imágenes
const cattleBreeds = {
    'angus': {
        name: 'Angus',
        images: [
            'images/breeds/angus1.jpg',
            'images/breeds/angus2.jpg',
            'images/breeds/angus3.jpg'
        ],
        description: 'La raza Angus es conocida por su carne de alta calidad y marmoleo. Originaria de Escocia, esta raza se caracteriza por su pelaje negro y su naturaleza sin cuernos.'
    },
    'brahman': {
        name: 'Brahman',
        images: [
            'images/breeds/brahman1.jpg',
            'images/breeds/brahman2.jpg',
            'images/breeds/brahman3.jpg'
        ],
        description: 'La raza Brahman es conocida por su resistencia al calor y los parásitos. Originaria de India, se caracteriza por su joroba distintiva y sus orejas caídas.'
    },
    'hereford': {
        name: 'Hereford',
        images: [
            'images/breeds/hereford1.jpg',
            'images/breeds/hereford2.jpg',
            'images/breeds/hereford3.jpg'
        ],
        description: 'La raza Hereford es conocida por su eficiencia en la conversión de pasto a carne. Se caracteriza por su pelaje rojo con cara blanca.'
    }
};

// Función para cargar los detalles de una raza específica
function loadBreedDetails(breedId) {
    const breed = cattleBreeds[breedId];
    if (!breed) return;

    // Actualizar el título
    document.getElementById('cattleBreed').textContent = breed.name;

    // Actualizar la descripción
    document.getElementById('cattleDescription').textContent = breed.description;

    // Actualizar las imágenes del carrusel
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = breed.images.map((img, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${img}" alt="${breed.name} Image ${index + 1}" class="d-block w-100 cattle-detail-image">
        </div>
    `).join('');

    // Actualizar los indicadores del carrusel
    const indicators = document.querySelector('.carousel-indicators');
    indicators.innerHTML = breed.images.map((_, index) => `
        <button type="button" 
                data-bs-target="#cattleCarousel" 
                data-bs-slide-to="${index}" 
                ${index === 0 ? 'class="active"' : ''}
                aria-label="Slide ${index + 1}">
        </button>
    `).join('');
}

// Cargar los detalles de la raza desde la URL
function loadBreedFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const breedId = params.get('breed') || 'angus'; // Por defecto muestra Angus
    loadBreedDetails(breedId);
}

// Cargar los detalles cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadBreedFromUrl); 