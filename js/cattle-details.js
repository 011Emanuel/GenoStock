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