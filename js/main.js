// ========== 全局初始化入口 ==========

// 获取当前登录用户（从 auth.js 调用）
function getCurrentUser() {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
}

// 退出登录
function logout() {
    localStorage.removeItem('current_user');
    updateLoginButton();
    alert('已退出登录');
    location.reload();
}

// 更新顶部登录按钮（根据登录状态显示不同文字和链接）
function updateLoginButton() {
    const loginLink = document.getElementById('loginOrProfileLink');
    if (!loginLink) return;
    
    const currentUser = getCurrentUser();
    if (currentUser) {
        loginLink.innerHTML = `👤 ${currentUser.username}`;
        loginLink.href = 'profile.html';
        // 不要设置 style.background，让 CSS 控制
        // loginLink.style.background = '#27ae60';  ← 删除或注释掉这行
    } else {
        loginLink.innerHTML = '🔐 登录/注册';
        loginLink.href = 'login.html';
    }
}

// 更新购物车按钮数量角标
function updateCartBadge() {
    const cartLink = document.getElementById('cartLink');
    if (!cartLink) return;
    
    const cartStr = localStorage.getItem('shopping_cart');
    const cart = cartStr ? JSON.parse(cartStr) : [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalCount > 0) {
        cartLink.innerHTML = `🛒 购物车 (${totalCount})`;
    } else {
        cartLink.innerHTML = `🛒 购物车`;
    }
}

// 检查并显示欢迎信息
function showWelcomeMessage() {
    const currentUser = getCurrentUser();
    if (currentUser && window.location.pathname.includes('index.html')) {
        console.log(`欢迎回来，${currentUser.username}！`);
    }
}

// 为商品卡片添加加入购物车功能（扩展）
function addAddToCartButtons() {
    // 等待商品列表渲染完成后，为每个商品添加加入购物车按钮
    const observer = new MutationObserver(() => {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            if (!card.querySelector('.add-to-cart-btn')) {
                const addBtn = document.createElement('button');
                addBtn.className = 'add-to-cart-btn';
                addBtn.innerHTML = '➕ 加入购物车';
                addBtn.style.cssText = `
                    background: #ff7b89;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 30px;
                    cursor: pointer;
                    margin-top: 10px;
                    width: 100%;
                    font-size: 14px;
                    transition: 0.2s;
                `;
                addBtn.onmouseover = () => addBtn.style.background = '#ff5e6e';
                addBtn.onmouseout = () => addBtn.style.background = '#ff7b89';
                
                // 获取商品ID
                const onclickAttr = card.getAttribute('onclick');
                if (onclickAttr) {
                    const idMatch = onclickAttr.match(/goToDetail\((\d+)\)/);
                    if (idMatch) {
                        const productId = parseInt(idMatch[1]);
                        addBtn.onclick = (e) => {
                            e.stopPropagation();
                            if (typeof addToCart === 'function') {
                                addToCart(productId, 1);
                                updateCartBadge();
                                alert('已添加到购物车！');
                            } else {
                                alert('购物车功能加载中，请刷新页面重试');
                            }
                        };
                    }
                }
                
                const infoDiv = card.querySelector('.product-info');
                if (infoDiv && !infoDiv.querySelector('.add-to-cart-btn')) {
                    infoDiv.appendChild(addBtn);
                }
            }
        });
    });
    
    observer.observe(document.getElementById('productsGrid'), { childList: true, subtree: true });
}

// 页面启动入口
(async function init() {
    // 1. 渲染商品列表
    if (typeof renderProducts === 'function') {
        await renderProducts();
    } else {
        console.warn('renderProducts 未加载，请确保 products.js 已引入');
    }
    
    // 2. 绑定分类和搜索事件
    if (typeof bindProductEvents === 'function') {
        bindProductEvents();
    } else {
        console.warn('bindProductEvents 未加载，请确保 products.js 已引入');
    }
    
    // 3. 初始化轮播图
    if (typeof initCarousel === 'function') {
        initCarousel();
    } else {
        console.warn('initCarousel 未加载，请确保 carousel.js 已引入');
    }
    
    // 4. 更新登录按钮状态
    updateLoginButton();
    
    // 5. 更新购物车角标
    updateCartBadge();
    
    // 6. 为商品添加加入购物车按钮
    addAddToCartButtons();
    
    // 7. 显示欢迎信息
    showWelcomeMessage();
})();