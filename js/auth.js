// ========== 登录注册模块 ==========

const STORAGE_KEY = 'blindbox_users';

// 初始化用户数据
function initUsers() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const defaultUsers = [
            { username: 'test', password: '123456', email: 'test@example.com' }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    }
}

// 注册新用户
function register(username, email, password, confirmPwd) {
    if (!username || !email || !password || !confirmPwd) {
        return { success: false, msg: '❌ 请填写所有字段' };
    }
    
    const usernameRegex = /^[a-zA-Z0-9]{3,12}$/;
    if (!usernameRegex.test(username)) {
        return { success: false, msg: '❌ 用户名需为3~12位字母或数字' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { success: false, msg: '❌ 邮箱格式不正确' };
    }
    
    if (password.length < 6) {
        return { success: false, msg: '❌ 密码长度至少6位' };
    }
    
    if (password !== confirmPwd) {
        return { success: false, msg: '❌ 两次输入的密码不一致' };
    }
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (users.find(u => u.username === username)) {
        return { success: false, msg: '❌ 用户名已存在，请更换' };
    }
    
    users.push({ username, email, password });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    return { success: true, msg: '✅ 注册成功！请登录' };
}

// 登录验证
function login(username, password) {
    if (!username || !password) {
        return { success: false, msg: '❌ 请填写用户名和密码' };
    }
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('current_user', JSON.stringify({
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString()
        }));
        return { success: true, msg: '✅ 登录成功！跳转中...' };
    } else {
        return { success: false, msg: '❌ 用户名或密码错误' };
    }
}

// 退出登录
function logout() {
    localStorage.removeItem('current_user');
}

// 获取当前用户
function getCurrentUser() {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
}

// ========== 页面交互逻辑 ==========
document.addEventListener('DOMContentLoaded', () => {
    initUsers();
    
    // 注意：这里已经删除了自动跳转的代码！
    // 已登录用户仍然可以访问登录页，但我们会显示不同界面
    
    // 选项卡切换
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (tabs.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabType = tab.getAttribute('data-tab');
                if (tabType === 'login') {
                    loginForm.classList.add('active');
                    registerForm.classList.remove('active');
                    clearTip('loginTip');
                } else {
                    registerForm.classList.add('active');
                    loginForm.classList.remove('active');
                    clearTip('registerTip');
                }
            });
        });
    }
    
    // 登录按钮
    const loginBtn = document.getElementById('doLoginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            const result = login(username, password);
            const tipDiv = document.getElementById('loginTip');
            
            if (result.success) {
                tipDiv.className = 'auth-tip success';
                tipDiv.innerHTML = result.msg;
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                tipDiv.className = 'auth-tip error';
                tipDiv.innerHTML = result.msg;
            }
        });
    }
    
    // 注册按钮
    const regBtn = document.getElementById('doRegisterBtn');
    if (regBtn) {
        regBtn.addEventListener('click', () => {
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPwd = document.getElementById('regConfirmPwd').value;
            
            const result = register(username, email, password, confirmPwd);
            const tipDiv = document.getElementById('registerTip');
            
            if (result.success) {
                tipDiv.className = 'auth-tip success';
                tipDiv.innerHTML = result.msg;
                document.getElementById('regUsername').value = '';
                document.getElementById('regEmail').value = '';
                document.getElementById('regPassword').value = '';
                document.getElementById('regConfirmPwd').value = '';
                setTimeout(() => {
                    document.querySelector('.auth-tab[data-tab="login"]').click();
                    tipDiv.className = 'auth-tip';
                    tipDiv.innerHTML = '';
                }, 2000);
            } else {
                tipDiv.className = 'auth-tip error';
                tipDiv.innerHTML = result.msg;
            }
        });
    }
    
    // 回车快捷操作
    const loginPwd = document.getElementById('loginPassword');
    loginPwd?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('doLoginBtn')?.click();
    });
    
    const regConfirm = document.getElementById('regConfirmPwd');
    regConfirm?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('doRegisterBtn')?.click();
    });
});

function clearTip(id) {
    const tip = document.getElementById(id);
    if (tip) {
        tip.className = 'auth-tip';
        tip.innerHTML = '';
    }
}