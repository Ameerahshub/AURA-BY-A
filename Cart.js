// Cart Page JavaScript for Aura by A

const SHIPPING_COST = 5000;
const TAX_RATE = 0.05;

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in navigation
function updateCartCount() {
    const cart = getCart();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'} me-2"></i>
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

// Calculate totals
function calculateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? SHIPPING_COST : 0;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
}

// Update summary display
function updateSummary() {
    const cart = getCart();
    const totals = calculateTotals();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('subtotal').textContent = '₦' + totals.subtotal.toLocaleString();
    document.getElementById('shipping').textContent = '₦' + totals.shipping.toLocaleString();
    document.getElementById('tax').textContent = '₦' + Math.round(totals.tax).toLocaleString();
    document.getElementById('total').textContent = '₦' + Math.round(totals.total).toLocaleString();
    
    // Update modal total
    const modalTotal = document.getElementById('modalTotal');
    if (modalTotal) {
        modalTotal.textContent = '₦' + Math.round(totals.total).toLocaleString();
    }
}

// Display cart items
function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.style.display = 'block';
        updateSummary();
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h5 class="cart-item-title">${item.name}</h5>
                <p class="cart-item-category">${item.category}</p>
                <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="bi bi-dash"></i>
                    </button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
            </div>
            <div class="d-flex flex-column align-items-end">
                <button class="remove-btn" onclick="removeItem(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
                <div class="item-total">₦${(item.price * item.quantity).toLocaleString()}</div>
            </div>
        </div>
    `).join('');
    
    updateSummary();
}

// Update item quantity
function updateQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeItem(productId);
            return;
        }
        
        saveCart(cart);
        displayCart();
        showNotification('Quantity updated');
    }
}

// Remove item from cart
function removeItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    displayCart();
    showNotification('Item removed from cart', 'warning');
}

// Handle checkout
function handleCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }
    
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
    updateSummary();
}

// Place order
function placeOrder() {
    const cart = getCart();
    const totals = calculateTotals();
    
    // Create order object
    const order = {
        id: 'ORD-' + Date.now(),
        items: cart,
        totals: totals,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // Store order
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Create WhatsApp message
    let message = `*New Order - ${order.id}*%0A%0A`;
    message += `*Items:*%0A`;
    cart.forEach(item => {
        message += `- ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}%0A`;
    });
    message += `%0A*Subtotal:* ₦${totals.subtotal.toLocaleString()}%0A`;
    message += `*Shipping:* ₦${totals.shipping.toLocaleString()}%0A`;
    message += `*Tax:* ₦${Math.round(totals.tax).toLocaleString()}%0A`;
    message += `*Total:* ₦${Math.round(totals.total).toLocaleString()}`;
    
    const whatsappUrl = `https://wa.me/2348001234567?text=${message}`;
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Close modal
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    checkoutModal.hide();
    
    // Show success message
    setTimeout(() => {
        showNotification('Order placed successfully! Redirecting to WhatsApp...', 'success');
        
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            window.location.href = 'index.html';
        }, 2000);
    }, 500);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayCart();
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // Place order button
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }
});

// Add CSS animations
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