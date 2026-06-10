// ========== 结算支付模块 ==========

// 订单存储key
const ORDERS_KEY = 'user_orders';

// 获取当前用户
function getCurrentUser() {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
}

// 获取地址
function getSavedAddress() {
    const addressStr = localStorage.getItem('user_address');
    return addressStr ? JSON.parse(addressStr) : null;
}

// 获取最新未支付订单（从订单列表中找状态为"待付款"的订单）
function getPendingOrder() {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    const ordersStr = localStorage.getItem(ORDERS_KEY);
    const orders = ordersStr ? JSON.parse(ordersStr) : [];
    
    // 找当前用户的待付款订单，取最新的
    const userOrders = orders.filter(o => o.userId === currentUser.username && o.status === '待付款');
    if (userOrders.length === 0) return null;
    
    return userOrders[0];
}

// 渲染订单信息
function renderOrderInfo() {
    const container = document.getElementById('orderInfo');
    const order = getPendingOrder();
    const address = getSavedAddress();
    
    if (!order) {
        container.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <p>暂无待支付订单</p>
                <button onclick="window.location.href='index.html'" style="margin-top:15px; background:#ff7b89; color:white; border:none; padding:8px 24px; border-radius:30px; cursor:pointer;">去购物</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="order-summary">
            <h3>订单信息</h3>
            <div style="margin-bottom:10px; font-size:14px; color:#666;">
                订单号：${order.orderNo}
            </div>
            <div class="order-products-simple">
                ${order.products.map(p => `
                    <div class="order-product-simple">
                        <span class="product-name">${p.name}</span>
                        <span class="product-price">¥${p.price}</span>
                        <span class="product-quantity">x${p.quantity}</span>
                        <span class="product-subtotal">¥${(p.price * p.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total-simple">
                共${order.products.reduce((sum, p) => sum + p.quantity, 0)}件商品，实付：<span>¥${order.finalTotal.toFixed(2)}</span>
            </div>
        </div>
        <div class="address-info-simple">
            <div><span class="label">收货人：</span>${address ? address.name : '未填写'}</div>
            <div><span class="label">联系电话：</span>${address ? address.phone : '未填写'}</div>
            <div><span class="label">收货地址：</span>${address ? address.address : '未填写'}</div>
        </div>
    `;
}

// 支付成功
function paySuccess(order) {
    // 更新订单状态为"已支付"
    const ordersStr = localStorage.getItem(ORDERS_KEY);
    const orders = ordersStr ? JSON.parse(ordersStr) : [];
    
    const updatedOrders = orders.map(o => {
        if (o.orderNo === order.orderNo) {
            return { ...o, status: '已支付' };
        }
        return o;
    });
    
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    
    // 显示支付成功弹窗并跳转
    alert(`✅ 支付成功！\n订单号：${order.orderNo}\n支付金额：¥${order.finalTotal.toFixed(2)}\n\n可在个人中心查看订单详情`);
    window.location.href = 'profile.html';
}

// 执行支付
function processPayment() {
    const order = getPendingOrder();
    
    if (!order) {
        alert('没有待支付的订单');
        window.location.href = 'index.html';
        return;
    }
    
    // 获取选中的支付方式
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = selectedPayment ? selectedPayment.nextElementSibling.textContent.trim() : '微信支付';
    
    // 模拟支付请求
    paySuccess(order);
}

// 绑定事件
function bindCheckoutEvents() {
    const backBtn = document.getElementById('backOrderBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'order.html';
        });
    }
    
    const payBtn = document.getElementById('payBtn');
    if (payBtn) {
        payBtn.addEventListener('click', processPayment);
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    renderOrderInfo();
    bindCheckoutEvents();
    updateCartBadge();
    updateLoginButton();
});