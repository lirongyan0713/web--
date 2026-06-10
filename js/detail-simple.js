// ========== 商品详情页（简洁版）==========

// 从URL获取商品ID
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// 渲染商品详情
function renderProductDetail() {
    const productId = getProductIdFromUrl();
    const container = document.getElementById('productDetail');
    
    if (!productId) {
        container.innerHTML = '<div style="padding:40px;text-align:center;">❌ 商品不存在</div>';
        return;
    }
    
    const product = productsData.find(p => p.id === productId);
    
    if (!product) {
        container.innerHTML = '<div style="padding:40px;text-align:center;">❌ 商品不存在</div>';
        return;
    }
    
    // 更新页面标题和面包屑
    document.title = `${product.name} · 二手盲盒平台`;
    document.getElementById('productName').innerText = product.name;
    
    // 分类映射
    const categoryMap = {
        '盲盒': '潮玩盲盒',
        '手办': '手办雕像',
        '一番赏': '一番赏'
    };
    
    let quantity = 1;
    
    container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 30px; background: white; border-radius: 16px; padding: 24px;">
            <!-- 左侧图片 -->
            <div style="background: #f5f5f5; border-radius: 16px; height: 260px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
        <img src="${product.imgUrl}" style="width:100%; height:100%; object-fit:cover;">
    </div>
            </div>
            
            <!-- 右侧信息 -->
            <div style="flex: 1; min-width: 260px;">
                <h2 style="margin-bottom: 12px;">${product.name}</h2>
                <div style="background: #fff0f3; padding: 12px; border-radius: 12px; margin-bottom: 16px;">
                    <span style="font-size: 28px; font-weight: bold; color: #ff5e6e;">¥${product.price}</span>
                    <span style="text-decoration: line-through; color: #aaa; margin-left: 10px;">¥${product.originalPrice}</span>
                </div>
                <div style="margin-bottom: 12px;"><span style="color: #666;">商品状态：</span>${product.status}</div>
                <div style="margin-bottom: 12px;"><span style="color: #666;">商品分类：</span>${categoryMap[product.category] || product.category}</div>
                <div style="margin-bottom: 20px; padding: 12px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
    <span style="color: #666;">商品简介：</span>${product.description || '二手盲盒正品保证，拆封不退换'}
</div>
                
                <!-- 数量选择 -->
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                    <span>数量：</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button id="minusBtn" style="width: 32px; height: 32px; border: 1px solid #ddd; background: white; border-radius: 50%; cursor: pointer;">−</button>
                        <span id="quantityNum" style="min-width: 40px; text-align: center; font-size: 18px;">1</span>
                        <button id="plusBtn" style="width: 32px; height: 32px; border: 1px solid #ddd; background: white; border-radius: 50%; cursor: pointer;">+</button>
                    </div>
                    <span style="color: #27ae60;">库存充足</span>
                </div>
                
                <!-- 按钮 -->
                <div style="display: flex; gap: 16px;">
                    <button id="addToCartBtn" style="flex: 1; background: white; border: 2px solid #ff7b89; color: #ff7b89; padding: 12px; border-radius: 40px; font-weight: bold; cursor: pointer;">🛒 加入购物车</button>
                    <button id="buyNowBtn" style="flex: 1; background: #ff7b89; border: none; color: white; padding: 12px; border-radius: 40px; font-weight: bold; cursor: pointer;">⚡ 立即购买</button>
                </div>
            </div>
        </div>
    `;
    
    // 数量加减
    const minusBtn = document.getElementById('minusBtn');
    const plusBtn = document.getElementById('plusBtn');
    const quantityNum = document.getElementById('quantityNum');
    
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
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (typeof addToCart === 'function') {
                addToCart(product.id, quantity);
                updateCartBadge();
                alert(`✅ 已添加 ${quantity} 件商品到购物车`);
            } else {
                alert('请刷新页面重试');
            }
        });
    }
    
    // 立即购买
    const buyBtn = document.getElementById('buyNowBtn');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                alert('请先登录再购买');
                window.location.href = 'login.html';
                return;
            }
            
            if (typeof addToCart === 'function') {
                addToCart(product.id, quantity);
                updateCartBadge();
                alert('已添加购物车，跳转到结算页面');
                window.location.href = 'order.html';
            }
        });
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    renderProductDetail();
    updateCartBadge();
    updateLoginButton();
});