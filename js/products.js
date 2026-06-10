// ========== 商品模块 ==========

let currentCategory = "all";
let currentSearchKeyword = "";

// 模拟 Ajax 获取数据
function fetchProducts() {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...productsData]), 80);
    });
}

// 过滤商品
function filterProducts(products) {
    let filtered = products;
    if (currentCategory !== "all") {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    if (currentSearchKeyword.trim() !== "") {
        const kw = currentSearchKeyword.trim().toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(kw));
    }
    return filtered;
}

// 渲染商品列表
async function renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading">⏳ 刷新二手好物...</div>';
    
    const allProducts = await fetchProducts();
    const filtered = filterProducts(allProducts);
    
    if(filtered.length === 0) {
        grid.innerHTML = '<div class="loading">😢 没有找到二手盲盒，换关键词试试~</div>';
        return;
    }
    
    grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-product-id="${p.id}" onclick="goToDetail(${p.id})">
        <div class="product-img">
            <img src="${p.imgUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:16px;" onerror="this.src='https://picsum.photos/200/200'">
        </div>
        <div class="product-info">
            <div class="product-title">${p.name}</div>
            <div class="product-price">💰 ¥${p.price} <span style="font-size:12px; color:#aaa;text-decoration:line-through;">¥${p.originalPrice}</span></div>
        </div>
    </div>
`).join('');
}

// 商品详情跳转（跳转到详情页）
window.goToDetail = (id) => {
    window.location.href = `product-detail.html?id=${id}`;
};

// 绑定分类和搜索事件
// 绑定分类和搜索事件
function bindProductEvents() {
    const btns = document.querySelectorAll(".category-btn");
    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            btns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.getAttribute("data-cat");
            
            // ========== 修复关键：点击分类时清空搜索框和搜索关键词 ==========
            const searchInput = document.getElementById("searchInput");
            if (searchInput) {
                searchInput.value = "";      // 清空搜索框内容
            }
            currentSearchKeyword = "";       // 清空搜索关键词
            
            renderProducts();                // 重新渲染
        });
    });
    
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    
    if (searchBtn && searchInput) {
        const doSearch = () => {
            currentSearchKeyword = searchInput.value;
            // ========== 修复关键：搜索时把分类重置为"全部" ==========
            currentCategory = "all";
            // 更新分类按钮的高亮样式
            const allBtn = document.querySelector('.category-btn[data-cat="all"]');
            if (allBtn) {
                document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
                allBtn.classList.add("active");
            }
            renderProducts();
        };
        
        searchBtn.addEventListener("click", doSearch);
        searchInput.addEventListener("keypress", (e) => {
            if(e.key === "Enter") doSearch();
        });
    }
}