// ========== 购物车模块 ==========

// 购物车存储key
const CART_KEY = 'shopping_cart';

// 获取购物车数据
function getCart() {
    const cartStr = localStorage.getItem(CART_KEY);
    return cartStr ? JSON.parse(cartStr) : [];
}

// 保存购物车数据
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // 触发购物车数量更新
    updateCartBadge();
}

// 添加商品到购物车
function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // 从商品数据中查找商品信息
        const product = productsData.find(p => p.id === productId);
        if (product) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                status: product.status,
                imgUrl: product.imgUrl, 
                imgEmoji: product.imgEmoji,
                category: product.category,
                quantity: quantity
            });
        }
    }
    
    saveCart(cart);
    return cart;
}

// 更新商品数量
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
    }
    return cart;
}

// 删除商品
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

// 清空购物车
function clearCart() {
    saveCart([]);
}

// 获取购物车总数量
function getCartTotalCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// 获取购物车总金额
function getCartTotalPrice() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// 更新顶部购物车数量角标
function updateCartBadge() {
    const cartLink = document.querySelector('.cart-icon-link');
    if (cartLink) {
        const count = getCartTotalCount();
        if (count > 0) {
            cartLink.innerHTML = `🛒 购物车 (${count})`;
        } else {
            cartLink.innerHTML = `🛒 购物车`;
        }
    }
}

// 渲染购物车页面
function renderCart() {
    const container = document.getElementById('cartContainer');
    const summary = document.getElementById('cartSummary');
    const cart = getCart();
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h3>🛒 购物车还是空的</h3>
                <p>快去挑选喜欢的二手盲盒吧~</p>
                <a href="index.html" class="go-shop-btn">去逛逛</a>
            </div>
        `;
        summary.style.display = 'none';
        return;
    }
    
    // 渲染购物车列表
    container.innerHTML = `
        <div class="cart-list">
            ${cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-img">
    <img src="${item.imgUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:16px;" onerror="this.src='https://picsum.photos/80/80'">
</div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">
                            ¥${item.price}
                            <span class="cart-item-original">¥${item.originalPrice}</span>
                        </div>
                        <div class="cart-item-status">📌 ${item.status}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">−</button>
                        <span class="quantity-num">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-subtotal">
                        <div class="subtotal-price">¥${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <button class="delete-item" data-id="${item.id}">🗑️</button>
                </div>
            `).join('')}
        </div>
    `;
    
    summary.style.display = 'flex';
    
    // 更新总计
    const totalCount = getCartTotalCount();
    const totalPrice = getCartTotalPrice();
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
    
    // 绑定数量按钮事件
    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item && item.quantity > 1) {
                updateQuantity(id, item.quantity - 1);
                renderCart();
            } else if (item && item.quantity === 1) {
                if (confirm('确定要删除这件商品吗？')) {
                    removeFromCart(id);
                    renderCart();
                }
            }
        });
    });
    
    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === id);
            if (item) {
                updateQuantity(id, item.quantity + 1);
                renderCart();
            }
        });
    });
    
    document.querySelectorAll('.delete-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            if (confirm('确定要删除这件商品吗？')) {
                removeFromCart(id);
                renderCart();
            }
        });
    });
}

// 清空购物车按钮事件
function bindClearCartEvent() {
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('确定要清空购物车吗？')) {
                clearCart();
                renderCart();
                updateCartBadge();
            }
        });
    }
}

// 结算按钮事件
function bindCheckoutEvent() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) {
                alert('购物车是空的，先去添加商品吧~');
                return;
            }
            // 检查登录状态
            const currentUser = getCurrentUser();
            if (!currentUser) {
                alert('请先登录再结算~');
                window.location.href = 'login.html';
                return;
            }
            // 跳转到订单提交页
            window.location.href = 'order.html';
        });
    }
}
// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    bindClearCartEvent();
    bindCheckoutEvent();
    updateCartBadge();
});