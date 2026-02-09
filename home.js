// Home Page JavaScript for Aura by A
// JavaScript Feature 1: Dynamic Product Loading and Display

// Sample jewelry products data
const products = [
    {
        id: 1,
        name: "Diamond Eternity Ring",
        price: 125000,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
        category: "Rings",
        rating: 5,
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Pearl Drop Earrings",
        price: 45000,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500",
        category: "Earrings",
        rating: 4.5,
        badge: "New"
    },
    {
        id: 3,
        name: "Gold Chain Necklace",
        price: 89000,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500",
        category: "Necklaces",
        rating: 5,
        badge: ""
    },
    {
        id: 4,
        name: "Sapphire Tennis Bracelet",
        price: 156000,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500",
        category: "Bracelets",
        rating: 4.5,
        badge: "Limited"
    }
];

// Store products in localStorage
localStorage.setItem('products', JSON.stringify(products));

// JavaScript Feature 2: Cart Management System
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification('Product added to cart!');
}

// JavaScript Feature 3: Dynamic Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        ${message}
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 250px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Load featured products
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    container.innerHTML = products.map(product => `
        <div class="col-md-6 col-lg-3 fade-in-up">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-rating mb-2">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        <span class="text-muted">(${product.rating})</span>
                    </div>
                    <p class="product-price">₦${product.price.toLocaleString()}</p>
                    <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
                        <i class="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// JavaScript Feature 4: Newsletter Subscription with Validation
document.addEventListener('DOMContentLoaded', function() {
    // Load featured products
    loadFeaturedProducts();
    
    // Update cart count
    updateCartCount();
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletterEmail').value;
            const messageDiv = document.getElementById('newsletterMessage');
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                messageDiv.innerHTML = '<div class="alert alert-danger">Please enter a valid email address</div>';
                return;
            }
            
            // Store subscription
            let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('subscribers', JSON.stringify(subscribers));
                messageDiv.innerHTML = '<div class="alert alert-success">Thank you for subscribing!</div>';
                showNotification('Successfully subscribed to newsletter!');
                newsletterForm.reset();
            } else {
                messageDiv.innerHTML = '<div class="alert alert-warning">You are already subscribed!</div>';
            }
            
            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, 5000);
        });
    }
    
    // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add scroll animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.product-card, .category-card').forEach(el => {
        observer.observe(el);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);