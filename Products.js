// Products Page JavaScript for Aura by A

// Extended product catalog
const allProducts = [
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
    },
    {
        id: 5,
        name: "Rose Gold Engagement Ring",
        price: 245000,
        image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500",
        category: "Rings",
        rating: 5,
        badge: "Premium"
    },
    {
        id: 6,
        name: "Diamond Stud Earrings",
        price: 78000,
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500",
        category: "Earrings",
        rating: 4.5,
        badge: ""
    },
    {
        id: 7,
        name: "Emerald Pendant Necklace",
        price: 134000,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500",
        category: "Necklaces",
        rating: 5,
        badge: "New"
    },
    {
        id: 8,
        name: "Silver Charm Bracelet",
        price: 42000,
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500",
        category: "Bracelets",
        rating: 4,
        badge: ""
    },
    {
        id: 9,
        name: "White Gold Wedding Band",
        price: 98000,
        image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500",
        category: "Rings",
        rating: 5,
        badge: ""
    },
    {
        id: 10,
        name: "Ruby Hoop Earrings",
        price: 67000,
        image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500",
        category: "Earrings",
        rating: 4.5,
        badge: "Best Seller"
    },
    {
        id: 11,
        name: "Platinum Chain Necklace",
        price: 189000,
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=500",
        category: "Necklaces",
        rating: 5,
        badge: "Limited"
    },
    {
        id: 12,
        name: "Gold Bangle Set",
        price: 112000,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500",
        category: "Bracelets",
        rating: 4.5,
        badge: ""
    }
];

// Store products in localStorage
localStorage.setItem('products', JSON.stringify(allProducts));

let filteredProducts = [...allProducts];

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

// Add to cart function
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
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
    showNotification('Product added to cart!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success notification-toast';
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

// Display products
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    const productCount = document.getElementById('productCount');
    
    productCount.textContent = products.length;
    
    if (products.length === 0) {
        grid.innerHTML = '';
        noProducts.style.display = 'block';
        return;
    }
    
    noProducts.style.display = 'none';
    
    grid.innerHTML = products.map(product => `
        <div class="col-md-6 col-lg-4 fade-in">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-category">${product.category}</p>
                    <div class="product-rating">
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

// Filter products by category
function filterByCategory() {
    const categoryAll = document.getElementById('categoryAll');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const checkedCategories = Array.from(categoryFilters)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    if (categoryAll.checked || checkedCategories.length === 0) {
        return allProducts;
    }
    
    return allProducts.filter(product => 
        checkedCategories.includes(product.category)
    );
}

// Filter products by price
function filterByPrice(products) {
    const priceFilters = document.querySelectorAll('.price-filter');
    const checkedPrices = Array.from(priceFilters)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    if (checkedPrices.length === 0) {
        return products;
    }
    
    return products.filter(product => {
        return checkedPrices.some(range => {
            const [min, max] = range.split('-').map(Number);
            return product.price >= min && product.price <= max;
        });
    });
}

// Search products
function searchProducts(products, query) {
    if (!query) return products;
    
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
}

// Sort products
function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch(sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

// Apply all filters
function applyFilters() {
    let products = filterByCategory();
    products = filterByPrice(products);
    
    const searchQuery = document.getElementById('searchInput').value;
    products = searchProducts(products, searchQuery);
    
    const sortBy = document.getElementById('sortBy').value;
    products = sortProducts(products, sortBy);
    
    filteredProducts = products;
    displayProducts(products);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    displayProducts(allProducts);
    
    // Category filter listeners
    const categoryAll = document.getElementById('categoryAll');
    const categoryFilters = document.querySelectorAll('.category-filter');
    
    categoryAll.addEventListener('change', function() {
        if (this.checked) {
            categoryFilters.forEach(cb => cb.checked = false);
        }
        applyFilters();
    });
    
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            if (this.checked) {
                categoryAll.checked = false;
            }
            applyFilters();
        });
    });
    
    // Price filter listeners
    document.querySelectorAll('.price-filter').forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    // Search listener
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    
    // Sort listener
    document.getElementById('sortBy').addEventListener('change', applyFilters);
    
    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', function() {
        document.getElementById('categoryAll').checked = true;
        categoryFilters.forEach(cb => cb.checked = false);
        document.querySelectorAll('.price-filter').forEach(cb => cb.checked = false);
        document.getElementById('searchInput').value = '';
        document.getElementById('sortBy').value = 'default';
        applyFilters();
    });
    
    // Back to top button
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