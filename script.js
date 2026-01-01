
const products = [
    // --- MEN'S COLLECTION ---
    { id: 1, name: "Maverick Aviator", category: "men", price: 4500, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80" },
    { id: 2, name: "Obsidian Square", category: "men", price: 5200, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80" },
    { id: 3, name: "Carbon Wayfarer", category: "men", price: 4900, img: "https://images.unsplash.com/photo-1483726234545-481d6e880fc6?w=600&q=80" },
    { id: 4, name: "Retro Round", category: "men", price: 3800, img: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80" },

    // --- WOMEN'S COLLECTION ---
    { id: 5, name: "Scarlet Cat Eye", category: "women", price: 6000, img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80" },
    { id: 6, name: "Rose Gold Rim", category: "women", price: 5500, img: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=600&q=80" },
    { id: 7, name: "Tortoise Shell", category: "women", price: 3200, img: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&q=80" },
    { id: 8, name: "Crystal Clear", category: "women", price: 3500, img: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80" },

    // --- LENSES (NEW: Pexels Images) ---
    { 
        id: 9, 
        name: "HydroSoft Daily (30p)", 
        category: "lens", 
        price: 1500, 
        // Image: Finger holding a contact lens
        img: "https://images.pexels.com/photos/5996661/pexels-photo-5996661.jpeg?auto=compress&cs=tinysrgb&w=600" 
    },
    { 
        id: 10, 
        name: "FreshLook Blue Tint", 
        category: "lens", 
        price: 1800, 
        // Image: Close up of a blue eye
        img: "https://images.pexels.com/photos/4009234/pexels-photo-4009234.jpeg?auto=compress&cs=tinysrgb&w=600" 
    },
    { 
        id: 11, 
        name: "Travel Lens Kit", 
        category: "lens", 
        price: 800, 
        // Image: Contact lens case
        img: "https://images.pexels.com/photos/5996669/pexels-photo-5996669.jpeg?auto=compress&cs=tinysrgb&w=600" 
    },
    { 
        id: 12, 
        name: "Monthly Clear Pack", 
        category: "lens", 
        price: 1200, 
        // Image: Lens solution bottles
        img: "https://images.pexels.com/photos/5996656/pexels-photo-5996656.jpeg?auto=compress&cs=tinysrgb&w=600" 
    },

];


let cart = [];
// ...

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
                <img src="${product.img}" alt="${product.name}" onerror="this.src='https://placehold.co/400x300?text=Image+Not+Found'">
            </div>
            <div class="product-info">
                <span class="category-tag">${product.category}</span>
                <h3>${product.name}</h3>
                <span class="price">₹${product.price.toLocaleString()}</span>
                <button class="btn-add" onclick="addToCart(${product.id})">Add to Bag</button>
            </div>
        </div>
    `).join('');

    if (btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
}

function filterByClick(category) {
    document.getElementById('shop').scrollIntoView();
    const btns = document.querySelectorAll('.filter-btn');
    let targetBtn;
    btns.forEach(b => {
        if(b.textContent.toLowerCase().includes(category)) targetBtn = b;
    });
    renderProducts(category, targetBtn);
}


// --- CART LOGIC ---

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    openCart(); 
}

function changeQty(id, change) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.quantity += change;
        if(item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalCount;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg" style="text-align:center; margin-top:2rem;">Your bag is empty.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://placehold.co/100x100?text=Icon'">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toLocaleString()}</p>
                    <div class="qty-controls">
                        <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
                        <span class="qty-text">${item.quantity}</span>
                        <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

// --- 7. FEEDBACK VALIDATION & DOWNLOAD LOGIC ---
document.getElementById('feedback-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 1. Get Values by ID
    const name = document.getElementById('fb-name').value;
    const email = document.getElementById('fb-email').value;
    const phone = document.getElementById('fb-phone').value;
    const message = document.getElementById('fb-msg').value;

    // 2. Validation Logic
    // Simple Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Phone Regex (Exactly 10 digits)
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address (e.g., user@example.com).");
        return; // Stop execution
    }

    if (!phoneRegex.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return; // Stop execution
    }

    // 3. Create File Content
    const date = new Date().toLocaleString();
    const fileContent = `LUMINA EYEWEAR FEEDBACK
-----------------------
Date: ${date}
Customer Name: ${name}
Email: ${email}
Phone: ${phone}

Feedback:
${message}
-----------------------`;

    // 4. Download Logic
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Feedback_${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("Thank you! Your feedback has been recorded and downloaded.");
    this.reset();
});
// --- NEW COUPON LOGIC ---

// Available coupons
const coupons = {
    "SAVE10": 0.10, // 10% off
    "LUMINA20": 0.20, // 20% off
    "WELCOME50": 0.50 // 50% off
};

let appliedDiscount = 0; // Stores the current discount percentage (e.g., 0.10)

function applyCoupon() {
    const input = document.getElementById('coupon-input');
    const msg = document.getElementById('coupon-msg');
    const code = input.value.toUpperCase().trim();

    if (coupons[code]) {
        appliedDiscount = coupons[code];
        msg.textContent = `Success! ${code} applied.`;
        msg.style.color = "green";
    } else {
        appliedDiscount = 0;
        msg.textContent = "Invalid coupon code.";
        msg.style.color = "red";
    }
    
    // Recalculate totals immediately
    updateCart();
}

// --- UPDATED CART LOGIC (With Math) ---

function updateCart() {
    // 1. Update Cart Count bubble
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalCount;

    // 2. Render Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg" style="text-align:center; margin-top:2rem;">Your bag is empty.</p>';
        // Reset discount if empty
        appliedDiscount = 0; 
        document.getElementById('coupon-msg').textContent = "";
        document.getElementById('coupon-input').value = "";
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://placehold.co/100x100?text=Icon'">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toLocaleString()}</p>
                    <div class="qty-controls">
                        <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
                        <span class="qty-text">${item.quantity}</span>
                        <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 3. Calculate Math
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * appliedDiscount;
    const finalTotal = subtotal - discountAmount;

    // 4. Update HTML Elements
    document.getElementById('cart-subtotal').textContent = '₹' + subtotal.toLocaleString();
    document.getElementById('cart-discount').textContent = '- ₹' + discountAmount.toLocaleString();
    cartTotalEl.textContent = '₹' + finalTotal.toLocaleString();
}
init();