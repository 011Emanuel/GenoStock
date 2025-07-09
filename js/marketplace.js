// Category filter functionality
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to clicked button
        this.classList.add('active');
        
        const category = this.dataset.category;
        filterCattle(category);
    });
});

// Filter cattle based on category
function filterCattle(category) {
    const cards = document.querySelectorAll('.cattle-card');
    cards.forEach(card => {
        const breed = card.querySelector('.cattle-breed').textContent.toLowerCase();
        if (category === 'all' || breed.includes(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Cart functionality
function addToCart(id) {
    // Prevent event from bubbling up to the parent link
    event.preventDefault();
    event.stopPropagation();
    
    // Here you would typically send this data to your backend
    const card = document.querySelector(`.cattle-card:nth-child(${id})`);
    const breed = card.querySelector('.cattle-breed').textContent;
    const price = card.querySelector('.cattle-price').textContent;
    const image = card.querySelector('.cattle-image').src;
    
    const cartItem = {
        id: id,
        breed: breed,
        price: price,
        image: image
    };

    // Show success message
    showNotification('Added to cart successfully!', 'success');
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

// Price range filter
const priceRange = document.querySelector('.price-range');
if (priceRange) {
    priceRange.addEventListener('input', function() {
        const maxPrice = this.value;
        filterByPrice(maxPrice);
    });
}

function filterByPrice(maxPrice) {
    const cards = document.querySelectorAll('.cattle-card');
    cards.forEach(card => {
        const priceText = card.querySelector('.cattle-price').textContent;
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        if (price <= maxPrice) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Checkbox filters
document.querySelectorAll('.filter-option input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        applyFilters();
    });
});

function applyFilters() {
    const selectedAges = Array.from(document.querySelectorAll('#age1, #age2, #age3, #age4'))
        .filter(cb => cb.checked)
        .map(cb => cb.id);
    
    const selectedHealth = Array.from(document.querySelectorAll('#health1, #health2, #health3'))
        .filter(cb => cb.checked)
        .map(cb => cb.id);

    const cards = document.querySelectorAll('.cattle-card');
    cards.forEach(card => {
        const age = card.querySelector('.spec-item:nth-child(1)').textContent;
        const health = card.querySelector('.spec-item:nth-child(5)').textContent;
        
        const ageMatch = selectedAges.length === 0 || selectedAges.some(ageId => {
            const ageRange = getAgeRange(ageId);
            return isAgeInRange(age, ageRange);
        });
        
        const healthMatch = selectedHealth.length === 0 || selectedHealth.some(healthId => {
            return health.toLowerCase().includes(getHealthStatus(healthId));
        });
        
        card.style.display = ageMatch && healthMatch ? 'block' : 'none';
    });
}

function getAgeRange(ageId) {
    switch(ageId) {
        case 'age1': return { min: 0, max: 1 };
        case 'age2': return { min: 1, max: 2 };
        case 'age3': return { min: 2, max: 3 };
        case 'age4': return { min: 3, max: Infinity };
        default: return { min: 0, max: Infinity };
    }
}

function isAgeInRange(ageText, range) {
    const age = parseInt(ageText.match(/\d+/)[0]);
    return age >= range.min && age <= range.max;
}

function getHealthStatus(healthId) {
    switch(healthId) {
        case 'health1': return 'vaccinated';
        case 'health2': return 'dewormed';
        case 'health3': return 'certificate';
        default: return '';
    }
}

document.querySelectorAll('.cattle-actions .btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'cattle-details.html';
    });
}); 