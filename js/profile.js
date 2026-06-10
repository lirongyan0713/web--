// ========== 个人中心模块 ==========

// 订单存储key
const ORDERS_KEY = 'user_orders';

// 获取所有订单
function getUserOrders() {
    const ordersStr = localStorage.getItem(ORDERS_KEY);
    return ordersStr ? JSON.parse(ordersStr) : [];
}

// 获取当前登录用户
function getCurrentUser() {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
}

// 获取当前用户的订单
function getCurrentUserOrders() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    const allOrders = getUserOrders();
    return allOrders.filter(order => order.userId === currentUser.username);
}

// 渲染用户信息
// 渲染用户信息
function renderUserInfo() {
    const container = document.getElementById('userInfoCard');
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        container.innerHTML = `
            <div class="not-logged-in">
                <h3>👋 您还未登录</h3>
                <button class="login-now-btn" onclick="window.location.href='login.html'">去登录</button>
            </div>
        `;
        return false;
    }
    
    // 格式化注册时间（只显示日期，不显示时间）
    const loginDate = currentUser.loginTime ? currentUser.loginTime.split('T')[0] : '未知';
    
    container.innerHTML = `
        <div class="user-info">
            <div class="user-avatar">👤</div>
            <div class="user-details">
                <p><span class="label">用户名：</span><span class="value">${currentUser.username}</span></p>
                <p><span class="label">邮 箱：</span><span class="value">${currentUser.email || '未绑定'}</span></p>
                <p><span class="label">注册时间：</span><span class="value">${loginDate}</span></p>
            </div>
        </div>
    `;
    return true;
}

// 渲染订单列表
function renderOrders() {
    const container = document.getElementById('ordersList');
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        container.innerHTML = '<div class="empty-orders">请先登录查看订单</div>';
        return;
    }
    
    const orders = getCurrentUserOrders();
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="empty-orders">暂无订单，快去选购喜欢的盲盒吧~</div>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-no">订单号：${order.orderNo}</span>
                <span class="order-status">${order.status}</span>
                <span class="order-time">${order.createTime}</span>
            </div>
            <div class="order-products">
                ${order.products.map(product => `
                    <div class="order-product-item">
                        <span class="order-product-name">${product.name}</span>
                        <span class="order-product-price">¥${product.price}</span>
                        <span class="order-product-quantity">x${product.quantity}</span>
                        <span class="order-product-subtotal">¥${(product.price * product.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <span>共 ${order.products.reduce((sum, p) => sum + p.quantity, 0)} 件商品</span>
                <span class="order-total">实付：<span>¥${order.finalTotal.toFixed(2)}</span></span>
            </div>
        </div>
    `).join('');
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('current_user');
        alert('已退出登录');
        window.location.href = 'index.html';
    }
}

// 绑定退出按钮事件
function bindLogoutEvent() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// 检查登录状态并更新UI
function checkLoginStatus() {
    const currentUser = getCurrentUser();
    const loginLink = document.getElementById('loginOrProfileLink');
    
    if (loginLink) {
        if (currentUser) {
            loginLink.innerHTML = `👤 ${currentUser.username}`;
            loginLink.href = 'profile.html';
            loginLink.style.background = '#27ae60';
        } else {
            loginLink.innerHTML = '🔐 登录/注册';
            loginLink.href = 'login.html';
            loginLink.style.background = '#ff7b89';
        }
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    renderUserInfo();
    renderOrders();
    bindLogoutEvent();
    updateCartBadge();
    checkLoginStatus();
});