// Data: Products with Categories (Men, Women, Lens)
const products = [
    // MEN
    { id: 1, name: "The Architect", category: "men", price: 4500, img: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Aviator Gold", category: "men", price: 5200, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Matte Black Wayfarer", category: "men", price: 4900, img: "https://images.unsplash.com/photo-1533681018184-68bd1d883b97?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Titanium Air", category: "men", price: 7500, img: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=500&q=80" },

    // WOMEN
    { id: 5, name: "Cat Eye Luxe", category: "women", price: 6000, img: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Rose Gold Rim", category: "women", price: 5500, img: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=500&q=80" },
    { id: 7, name: "Vintage Square", category: "women", price: 3200, img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=500&q=80" },
    { id: 8, name: "Crystal Clear", category: "women", price: 3500, img: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=500&q=80" },

    // LENSES
    { id: 9, name: "Aqua Daily (30 Pack)", category: "lens", price: 1500, img: "https://images.unsplash.com/photo-1596460658390-59a8c0e25d45?auto=format&fit=crop&w=500&q=80" },
    { id: 10, name: "Blue Light Blockers", category: "lens", price: 2800, img: "https://images.unsplash.com/photo-1563903530908-afdd155d057a?auto=format&fit=crop&w=500&q=80" },
    { id: 11, name: "HydroSoft Monthly", category: "lens", price: 1200, img: "https://plus.unsplash.com/premium_photo-1675806653242-7067824987bd?auto=format&fit=crop&w=500&q=80" },
    { id: 12, name: "Color Tint (Hazel)", category: "lens", price: 1800, img: "https://images.unsplash.com/photo-1596460658421-2a13cc7f394c?auto=format&fit=crop&w=500&q=80" }
];

let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');

// Initialize
function init() {
    renderProducts('all');
}

// Render Products with Filter
function renderProducts(filter, btn) {
    let filteredProducts = products;

    if (filter !== 'all') {
        filteredProducts = products.filter(p => p.category === filter);
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="img-container">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-info">
                <span class="category-tag">${product.category}</span>
                <h3>${product.name}</h3>
                <span class="price">₹${product.price.toLocaleString()}</span>
                <button class="btn-add" onclick="addToCart(${product.id})">Add to Bag</button>
            </div>
        </div>
    `).join('');

    // Handle Active Button styling
    if (btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
}

// Special function for the visual category cards
function filterByClick(category) {
    // Scroll to shop
    document.getElementById('shop').scrollIntoView();
    // Find the button associated with this category and trigger click
    const btns = document.querySelectorAll('.filter-btn');
    let targetBtn;
    btns.forEach(b => {
        if(b.textContent.toLowerCase().includes(category)) targetBtn = b;
    });
    renderProducts(category, targetBtn);
}


// Add to Cart Logic
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        alert("Item is already in your bag!");
    } else {
        cart.push(product);
        updateCart();
        openCart(); 
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    cartCountEl.textContent = cart.length;
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg" style="text-align:center; margin-top:2rem;">Your bag is empty.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toLocaleString()}</p>
                    <span class="cart-item-remove" style="color:red; cursor:pointer; font-size:0.8rem;" onclick="removeFromCart(${item.id})">Remove</span>
                </div>
            </div>
        `).join('');
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalEl.textContent = '₹' + total.toLocaleString();
}

function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('active');
}
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
}

function checkout() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Proceeding to secure checkout...");
        cart = [];
        updateCart();
        toggleCart();
    }
}

document.getElementById('feedback-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Review submitted successfully!");
    this.reset();
});

init();