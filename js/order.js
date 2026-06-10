// ========== 提交订单模块 ==========

// 地址存储key
const ADDRESS_KEY = 'user_address';

// 获取保存的地址
function getSavedAddress() {
    const addressStr = localStorage.getItem(ADDRESS_KEY);
    return addressStr ? JSON.parse(addressStr) : null;
}

// 保存地址
function saveAddress(address) {
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
}

// 渲染地址信息
function renderAddress() {
    const addressInfo = document.getElementById('addressInfo');
    const savedAddress = getSavedAddress();
    
    if (savedAddress && savedAddress.name && savedAddress.address) {
        addressInfo.innerHTML = `
            <div class="address-detail">
                <span class="name">${savedAddress.name}</span>
                <span class="phone">${savedAddress.phone}</span>
                <div class="address">📍 ${savedAddress.address}</div>
            </div>
        `;
    } else {
        addressInfo.innerHTML = '<p class="address-default-text">请填写收货地址</p>';
    }
}

// 显示地址编辑弹窗
function showAddressModal() {
    const savedAddress = getSavedAddress();
    
    const modal = document.createElement('div');
    modal.className = 'address-modal';
    modal.innerHTML = `
        <div class="address-modal-content">
            <h4>编辑收货地址</h4>
            <input type="text" id="modalName" placeholder="收货人姓名" value="${savedAddress?.name || ''}">
            <input type="tel" id="modalPhone" placeholder="手机号码" value="${savedAddress?.phone || ''}">
            <input type="text" id="modalAddress" placeholder="详细地址" value="${savedAddress?.address || ''}">
            <div class="address-modal-buttons">
                <button class="cancel-address">取消</button>
                <button class="save-address">保存</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.cancel-address').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.save-address').addEventListener('click', () => {
        const name = modal.querySelector('#modalName').value.trim();
        const phone = modal.querySelector('#modalPhone').value.trim();
        const address = modal.querySelector('#modalAddress').value.trim();
        
        if (!name || !phone || !address) {
            alert('请填写完整的收货信息');
            return;
        }
        
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            alert('请输入正确的手机号码');
            return;
        }
        
        saveAddress({ name, phone, address });
        renderAddress();
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// 渲染订单商品列表
function renderOrderProducts() {
    const container = document.getElementById('orderProductsList');
    const cart = getCart();
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-order-cart">
                <h3>🛒 购物车是空的</h3>
                <a href="index.html" class="go-shop-btn">去逛逛</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cart.map(item => `
    <div class="order-product-item">
        <div class="order-product-img">
            <img src="${item.imgUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" onerror="this.src='https://picsum.photos/60/60'">
        </div>
        <div class="order-product-info">
            <div class="order-product-name">${item.name}</div>
            <div class="order-product-price">¥${item.price}</div>
        </div>
        <div class="order-product-quantity">数量：${item.quantity}</div>
        <div class="order-product-subtotal">¥${(item.price * item.quantity).toFixed(2)}</div>
    </div>
`).join('');
    
    // 计算金额
    const productTotal = getCartTotalPrice();
    const freight = productTotal > 100 ? 0 : 10;
    const finalTotal = productTotal + freight;
    
    document.getElementById('productTotal').textContent = productTotal.toFixed(2);
    document.getElementById('freight').textContent = freight;
    document.getElementById('finalTotal').textContent = finalTotal.toFixed(2);
}

// 提交订单
// 提交订单
function submitOrder() {
    // 1. 检查购物车
    const cart = getCart();
    if (cart.length === 0) {
        alert('购物车是空的，无法提交订单');
        window.location.href = 'index.html';
        return;
    }
    
    // 2. 检查登录状态
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('请先登录再提交订单');
        window.location.href = 'login.html';
        return;
    }
    
    // 3. 检查收货地址
    const savedAddress = getSavedAddress();
    if (!savedAddress || !savedAddress.name || !savedAddress.address) {
        alert('请先填写收货地址');
        showAddressModal();
        return;
    }
    
    // 4. 获取支付方式
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = selectedPayment ? selectedPayment.nextElementSibling.textContent : '微信支付';
    
    // 5. 生成订单号
    const orderNo = 'ORDER' + Date.now() + Math.floor(Math.random() * 1000);
    
    // 6. 保存订单
    const order = {
        orderNo: orderNo,
        userId: currentUser.username,
        createTime: new Date().toLocaleString(),
        products: [...cart],
        address: savedAddress,
        paymentMethod: paymentMethod,
        productTotal: getCartTotalPrice(),
        freight: getCartTotalPrice() > 100 ? 0 : 10,
        finalTotal: getCartTotalPrice() + (getCartTotalPrice() > 100 ? 0 : 10),
        status: '待付款'
    };
    
    // 保存订单到订单列表
    const ordersKey = 'user_orders';
    const existingOrders = localStorage.getItem(ordersKey);
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.unshift(order);
    localStorage.setItem(ordersKey, JSON.stringify(orders));
    
    // 7. 清空购物车
    clearCart();
    updateCartBadge();
    
    // 8. 跳转到结算支付页面（关键修改！）
    alert(`订单已创建！\n订单号：${orderNo}\n实付金额：¥${order.finalTotal.toFixed(2)}\n\n请完成支付`);
    window.location.href = 'checkout.html';  // 改为跳转到支付页
}

// 绑定事件
function bindOrderEvents() {
    const editBtn = document.getElementById('editAddressBtn');
    if (editBtn) {
        editBtn.addEventListener('click', showAddressModal);
    }
    
    const backBtn = document.getElementById('backCartBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
    
    const submitBtn = document.getElementById('submitOrderBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitOrder);
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    renderAddress();
    renderOrderProducts();
    bindOrderEvents();
    updateCartBadge();
    updateLoginButton();
});