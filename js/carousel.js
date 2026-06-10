// ========== 轮播图模块（从右往左滑动效果）==========

function initCarousel() {
    const slidesContainer = document.getElementById('carouselSlides');
    const dotsContainer = document.getElementById('dotsContainer');
    
    // 轮播图图片地址
    const images = [
    "images/banner1.jpg",   // 你的图片1
    "images/banner2.jpg",   // 你的图片2
    "images/banner3.jpg"    // 你的图片3
    ];  
    // 动态生成轮播图结构（支持滑动动画）
    slidesContainer.innerHTML = `
        <div class="carousel-track" style="display: flex; transition: transform 0.5s ease-in-out; height: 100%;">
            ${images.map(img => `
                <div class="carousel-slide" style="min-width: 100%; height: 100%;">
                    <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            `).join('')}
        </div>
    `;
    
    // 生成小圆点
    images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if(i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    let currentIdx = 0;
    let interval;
    const totalSlides = slides.length;
    
    // 切换到指定索引的幻灯片
    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        
        currentIdx = index;
        const offset = -currentIdx * 100;
        track.style.transform = `translateX(${offset}%)`;
        
        // 更新小圆点
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIdx);
        });
    }
    
    // 下一张（从右往左滑动效果）
    function nextSlide() {
        if (currentIdx >= totalSlides - 1) {
            // 如果是最后一张，快速跳回第一张（无动画）
            track.style.transition = 'none';
            goToSlide(0);
            // 强制重绘后恢复动画
            track.offsetHeight;
            track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            goToSlide(currentIdx + 1);
        }
    }
    
    // 上一张
    function prevSlide() {
        if (currentIdx <= 0) {
            // 如果是第一张，快速跳到最后一张（无动画）
            track.style.transition = 'none';
            goToSlide(totalSlides - 1);
            track.offsetHeight;
            track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            goToSlide(currentIdx - 1);
        }
    }
    
    // 绑定按钮事件
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(interval);
            prevSlide();
            startAuto();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(interval);
            nextSlide();
            startAuto();
        });
    }
    
    // 自动播放
    function startAuto() {
        interval = setInterval(nextSlide, 4000);
    }
    
    startAuto();
    goToSlide(0);
}