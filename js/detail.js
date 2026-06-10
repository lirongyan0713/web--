// ========== 商品详情页模块 ==========

// 从URL获取商品ID
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// 获取推荐商品（同分类，排除当前商品）
function getRecommendProducts(currentProduct) {
    let filtered = productsData.filter(p => p.id !== currentProduct.id);
    
    if (currentProduct && currentProduct.category) {
        const sameCategory = filtered.filter(p => p.category === currentProduct.category);
        if (sameCategory.length >= 4) {
            return sameCategory.slice(0, 4);
        }
    }
    
    return filtered.slice(0, 4);
}

// 渲染商品详情
function renderProductDetail() {
    const productId = getProductIdFromUrl();
    const container = document.getElementById('productDetail');
    
    if (!productId) {
        container.innerHTML = '<div class="loading">❌ 商品不存在</div>';
        return;
    }
    
    const product = productsData.find(p => p.id === productId);
    
    if (!product) {
        container.innerHTML = '<div class="loading">❌ 商品不存在</div>';
        return;
    }
    
    // 更新页面标题和面包屑
    document.title = `${product.name} · 二手盲盒平台`;
    document.getElementById('productName').innerText = product.name;
    
    // 更新分类链接
    const categoryMap = {
        '盲盒': '潮玩盲盒',
        '手办': '手办雕像',
        '一番赏': '一番赏'
    };
    const categoryLink = document.getElementById('categoryLink');
    if (categoryLink) {
        categoryLink.innerText = categoryMap[product.category] || product.category;
    }
    
    // 商品图片Emoji映射
    const imgEmojiMap = {
        1: '✨', 2: '🐉', 3: '👓', 4: '🎃',
        5: '🎤', 6: '🔥', 7: '🐻', 8: '⚓'
    };
    const emoji = imgEmojiMap[product.id] || product.imgEmoji || '🎁';
    
    container.innerHTML = `
        <div class="detail-main">
            <div class="detail-images">
                <div class="detail-main-img">
                    ${emoji} ${product.category === '盲盒' ? '📦' : (product.category === '手办' ? '🏆' : '🎫')}
                </div>
                <div class="detail-thumbnails">
                    <div class="thumbnail active">${emoji}</div>
                    <div class="thumbnail">🎨</div>
                    <div class="thumbnail">✨</div>
                </div>
            </div>
            <div class="detail-info">
                <h1 class="detail-title">${product.name}</h1>
                <span class="detail-status">📌 ${product.status}</span>
                <div class="detail-price">
                    <span class="current-price">¥${product.price} <small>元</small></span>
                    <span class="original-price">¥${product.originalPrice}</span>
                </div>
                <div class="detail-category">
                    📂 分类：${categoryMap[product.category] || product.category}
                </div>
                <div class="detail-desc">
                    二手盲盒均为正品保证，拆封不退换。部分商品有轻微摆放痕迹，介意慎拍。
                </div>
                <div class="quantity-selector">
                    <span>数量：</span>
                    <div class="quantity-control">
                        <button class="quantity-minus">−</button>
                        <span class="quantity-num" id="detailQuantity">1</span>
                        <button class="quantity-plus">+</button>
                    </div>
                    <span style="color:#999;">库存充足</span>
                </div>
                <div class="detail-actions">
                    <button class="add-to-cart-detail" id="detailAddToCart">🛒 加入购物车</button>
                    <button class="buy-now" id="detailBuyNow">⚡ 立即购买</button>
                </div>
            </div>
        </div>
        <div class="detail-params">
            <div class="param-title">📋 商品参数</div>
            <div class="params-grid">
                <div class="param-item"><span class="param-label">商品名称</span><span class="param-value">${product.name}</span></div>
                <div class="param-item"><span class="param-label">商品分类</span><span class="param-value">${categoryMap[product.category] || product.category}</span></div>
                <div class="param-item"><span class="param-label">新旧程度</span><span class="param-value">${product.status}</span></div>
                <div class="param-item"><span class="param-label">发货地</span><span class="param-value">广东·佛山</span></div>
                <div class="param-item"><span class="param-label">快递</span><span class="param-value">满100包邮</span></div>
                <div class="param-item"><span class="param-label">售后保障</span><span class="param-value">7天无理由（仅未拆封）</span></div>
            </div>
        </div>
    `;
    
    // 绑定数量按钮事件
    let quantity = 1;
    const quantityNum = document.getElementById('detailQuantity');
    const minusBtn = container.querySelector('.quantity-minus');
    const plusBtn = container.querySelector('.quantity-plus');
    
    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantityNum.textContent = quantity;
            }
        });
    }
    
    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            quantity++;
            quantityNum.textContent = quantity;
        });
    }
    
    // 加入购物车
    const addToCartBtn = document.getElementById('detailAddToCart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (typeof addToCart === 'function') {
                addToCart(product.id, quantity);
                updateCartBadge();
                alert(`✅ 已添加 ${quantity} 件商品到购物车`);
            } else {
                alert('购物车功能加载中，请刷新页面重试');
            }
        });
    }
    
    // 立即购买
    const buyNowBtn = document.getElementById('detailBuyNow');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            // 检查登录状态
            const currentUser = getCurrentUser();
            if (!currentUser) {
                alert('请先登录再购买');
                window.location.href = 'login.html';
                return;
            }
            
            // 添加到购物车后跳转到订单页
            if (typeof addToCart === 'function') {
                addToCart(product.id, quantity);
                updateCartBadge();
                alert(`已添加 ${quantity} 件商品，即将跳转到结算页面`);
                window.location.href = 'order.html';
            } else {
                alert('功能加载中，请刷新页面重试');
            }
        });
    }
}

// 渲染推荐商品
function renderRecommendations() {
    const productId = getProductIdFromUrl();
    const currentProduct = productsData.find(p => p.id === productId);
    const container = document.getElementById('recommendGrid');
    
    if (!container) return;
    
    const recommendations = getRecommendProducts(currentProduct);
    
    if (recommendations.length === 0) {
        container.innerHTML = '<div class="loading">暂无推荐商品</div>';
        return;
    }
    
    container.innerHTML = recommendations.map(p => `
        <div class="product-card" data-product-id="${p.id}" onclick="goToDetail(${p.id})">
            <div class="product-img">${p.imgEmoji} ${p.category === '盲盒' ? '📦' : (p.category === '手办' ? '🏆' : '🎫')}</div>
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">💰 ¥${p.price} <span style="font-size:12px; color:#aaa;text-decoration:line-through;">¥${p.originalPrice}</span></div>
                <div class="product-status">📌 ${p.status}</div>
            </div>
        </div>
    `).join('');
}

// 商品详情跳转函数（覆盖全局）
window.goToDetail = (id) => {
    window.location.href = `product-detail.html?id=${id}`;
};

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    renderProductDetail();
    renderRecommendations();
    updateCartBadge();
    updateLoginButton();
});