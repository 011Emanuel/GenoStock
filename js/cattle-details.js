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

// Mock data - In a real application, this would come from an API
const cattleData = {
    1: {
        breed: "Angus",
        price: "$2,500",
        weight: "800 kg",
        age: "2 years",
        location: "Texas",
        description: "High-quality Angus cattle with excellent genetics. Perfect for breeding or meat production. Well-maintained health records and regular veterinary check-ups.",
        images: [
            "https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg",
            "https://4368135.fs1.hubspotusercontent-na1.net/hubfs/4368135/raza-angus.jpg",
            "https://ganado.mx/wp-content/uploads/2021/12/Razas-de-Ganado-Bovino-Angus-opt.jpg"
        ],
        seller: {
            name: "John Smith",
            age: "45 years",
            contact: "+1 (555) 123-4567",
            location: "Dallas, Texas",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg"
        }
    },
    2: {
        breed: "Hereford",
        price: "$2,800",
        weight: "850 kg",
        age: "3 years",
        location: "Kansas",
        description: "Premium Hereford cattle from a renowned breeding line. Known for their docile temperament and excellent meat quality.",
        images: [
            "https://images.pexels.com/photos/2883050/pexels-photo-2883050.jpeg",
            "https://www.shutterstock.com/image-photo/hereford-cattle-grazing-green-pasture-600nw-1517400941.jpg",
            "https://www.lancasterfarming.com/wp-content/uploads/2021/04/5ea9cc0d91ac8.image_.jpg"
        ],
        seller: {
            name: "Mary Johnson",
            age: "38 years",
            contact: "+1 (555) 234-5678",
            location: "Wichita, Kansas",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg"
        }
    }
    // Add more cattle data as needed
};

document.addEventListener('DOMContentLoaded', function() {
    // Get cattle ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const cattleId = urlParams.get('id');

    if (cattleId && cattleData[cattleId]) {
        const cattle = cattleData[cattleId];
        
        // Update cattle information
        document.getElementById('cattleBreed').textContent = cattle.breed;
        document.getElementById('cattlePrice').textContent = cattle.price;
        document.getElementById('cattleWeight').textContent = cattle.weight;
        document.getElementById('cattleAge').textContent = cattle.age;
        document.getElementById('cattleLocation').textContent = cattle.location;
        document.getElementById('cattleDescription').textContent = cattle.description;

        // Update carousel images
        const carouselItems = document.querySelectorAll('.carousel-item img');
        cattle.images.forEach((imageUrl, index) => {
            if (carouselItems[index]) {
                carouselItems[index].src = imageUrl;
            }
        });

        // Update seller information
        document.getElementById('sellerName').textContent = cattle.seller.name;
        document.getElementById('sellerAge').textContent = cattle.seller.age;
        document.getElementById('sellerContact').textContent = cattle.seller.contact;
        document.getElementById('sellerLocation').textContent = cattle.seller.location;
        document.getElementById('sellerAvatar').src = cattle.seller.avatar;
    } else {
        // Handle invalid cattle ID
        document.body.innerHTML = '<div class="container mt-5"><div class="alert alert-danger">Cattle not found</div></div>';
    }
}); 