// --- LOGIC SIÊU SLIDESHOW QUẢNG CÁO ---
const mainSliderImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470&auto=format&fit=crop", // Màn hình PC / Laptop
    "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?q=80&w=1470&auto=format&fit=crop", // Góc gaming đỏ
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1470&auto=format&fit=crop", // Điện thoại
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1470&auto=format&fit=crop"  // PC setup đèn rực
];
const mainSliderCats = ['pc', 'laptop', 'phone', 'pc'];

const sideSlider1Images = [
    "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=500&auto=format&fit=crop", // iPhone Promax
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop", // Mobile Gaming
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop"  // Góc cạnh điện thoại
];
const sideSlider1Cats = ['phone', 'phone', 'phone'];

const sideSlider2Images = [
    "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=500&auto=format&fit=crop", // Phím cơ RGB
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop", // Tai nghe gaming
    "https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=500&auto=format&fit=crop"  // Chuột gaming
];
const sideSlider2Cats = ['gear', 'headphone', 'gear'];

let mainIdx = 0, side1Idx = 0, side2Idx = 0;
let slideInterval;

function runAllSliders() {
    const mainImg = document.getElementById('slider-img');
    const side1Img = document.getElementById('side-img-1');
    const side2Img = document.getElementById('side-img-2');
    if (mainImg) { mainIdx = (mainIdx + 1) % mainSliderImages.length; applyFadeEffect(mainImg, mainSliderImages[mainIdx]); mainImg.onclick = () => filterAndScroll(mainSliderCats[mainIdx]); }
    if (side1Img) { side1Idx = (side1Idx + 1) % sideSlider1Images.length; applyFadeEffect(side1Img, sideSlider1Images[side1Idx]); side1Img.onclick = () => filterAndScroll(sideSlider1Cats[side1Idx]); }
    if (side2Img) { side2Idx = (side2Idx + 1) % sideSlider2Images.length; applyFadeEffect(side2Img, sideSlider2Images[side2Idx]); side2Img.onclick = () => filterAndScroll(sideSlider2Cats[side2Idx]); }
    
    // Đồng bộ: Mỗi khi ảnh quảng cáo phía trên chuyển, thì Flash Sale cũng nhảy sang trang tiếp theo
    flashSalePage++;
    if (typeof renderFlashSale === 'function') renderFlashSale(false);
}

function applyFadeEffect(element, newSrc) {
    element.style.transform = 'scale(1.08)'; // Hiệu ứng phóng to đẩy ảnh ra xa
    element.style.opacity = '0.3';
    setTimeout(() => { 
        element.src = newSrc; 
        element.style.transform = 'scale(1)'; // Kéo ảnh về vị trí cũ
        element.style.opacity = '1'; 
    }, 400); // Tăng thời gian chờ lên để hiệu ứng mượt hơn
}

// Khởi chạy vòng lặp tự động ban đầu
slideInterval = setInterval(runAllSliders, 4000);

// --- Nút bấm mũi tên điều khiển tay ---
function nextSlide() {
    mainIdx = (mainIdx + 1) % mainSliderImages.length;
    const mainImg = document.getElementById('slider-img');
    if(mainImg) { applyFadeEffect(mainImg, mainSliderImages[mainIdx]); mainImg.onclick = () => filterAndScroll(mainSliderCats[mainIdx]); }
    resetSliderInterval(); // Reset lại bộ đếm giờ để không bị nhảy ảnh quá nhanh
}
function prevSlide() {
    mainIdx = (mainIdx - 1 + mainSliderImages.length) % mainSliderImages.length;
    const mainImg = document.getElementById('slider-img');
    if(mainImg) { applyFadeEffect(mainImg, mainSliderImages[mainIdx]); mainImg.onclick = () => filterAndScroll(mainSliderCats[mainIdx]); }
    resetSliderInterval();
}
function resetSliderInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(runAllSliders, 4000);
}

// --- HÀM TẠO THÔNG BÁO TOAST ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = '<i class="fas fa-check-circle" style="color: #10b981; font-size: 24px; filter: drop-shadow(0 0 5px rgba(16,185,129,0.5));"></i>';
    if (type === 'error') icon = '<i class="fas fa-exclamation-triangle" style="color: #ef4444; font-size: 24px; filter: drop-shadow(0 0 5px rgba(239,68,68,0.5));"></i>';
    if (type === 'info') icon = '<i class="fas fa-info-circle" style="color: #3b82f6; font-size: 24px; filter: drop-shadow(0 0 5px rgba(59,130,246,0.5));"></i>';
    toast.innerHTML = `${icon} <span style="margin-left: 12px; color: #f8fafc !important; font-weight: 600; font-size: 14px; letter-spacing: 0.5px;">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => { toast.remove(); }, 500); }, 3000);
}

function toggleModal(id) { const m = document.getElementById(id); if (m) m.style.display = (m.style.display === 'block') ? 'none' : 'block'; }

function filterAndScroll(category) {
    if (typeof filterProduct === 'function') {
        filterProduct(category);
    }
    const productList = document.getElementById('product-list');
    if (productList) {
        // Đợi một chút để sản phẩm render ra rồi mới cuộn, tránh cuộn sai vị trí
        setTimeout(() => {
            productList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-reg');
    
    if (tab === 'login') {
        if (loginForm) loginForm.style.display = 'block'; if (regForm) regForm.style.display = 'none';
        if (tabLogin) { tabLogin.classList.add('active'); tabLogin.style.color = 'var(--primary)'; }
        if (tabReg) { tabReg.classList.remove('active'); tabReg.style.color = '#94a3b8'; }
    } else {
        if (loginForm) loginForm.style.display = 'none'; if (regForm) regForm.style.display = 'block';
        if (tabReg) { tabReg.classList.add('active'); tabReg.style.color = 'var(--primary)'; }
        if (tabLogin) { tabLogin.classList.remove('active'); tabLogin.style.color = '#94a3b8'; }
    }
}

function createSnowflakes() {
    const snowContent = ['❄', '❅', '❆'];
    for (let i = 0; i < 40; i++) { // Số lượng bông tuyết (có thể tăng/giảm tùy ý)
        const snow = document.createElement('div');
        snow.className = 'snowflake';
        snow.innerHTML = snowContent[Math.floor(Math.random() * snowContent.length)];
        
        snow.style.left = Math.random() * 100 + 'vw'; // Vị trí rơi ngẫu nhiên
        snow.style.animationDuration = Math.random() * 5 + 5 + 's'; // Tốc độ rơi ngẫu nhiên (5-10 giây)
        snow.style.animationDelay = Math.random() * 5 + 's'; // Thời gian bắt đầu rơi ngẫu nhiên
        snow.style.fontSize = Math.random() * 10 + 10 + 'px'; // Kích thước to nhỏ khác nhau (10-20px)
        snow.style.opacity = Math.random() * 0.5 + 0.5; // Độ mờ ngẫu nhiên
        
        document.body.appendChild(snow);
    }
}

// --- HÀM WIDGET CHAT TRỰC TUYẾN ---
function toggleChat() {
    const chatWindow = document.getElementById('chat-widget-window');
    if (chatWindow.style.display === 'flex') {
        chatWindow.style.display = 'none';
    } else {
        chatWindow.style.display = 'flex';
        document.getElementById('chat-input').focus();
    }
}

function handleChatEnter(e) {
    if (e.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    const messagesContainer = document.getElementById('chat-messages');
    
    messagesContainer.innerHTML += `<div class="chat-msg user">${msg}</div>`;
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const typingId = 'typing-' + Date.now();
    messagesContainer.innerHTML += `<div class="chat-msg bot" id="${typingId}"><i class="fas fa-ellipsis-h" style="animation: textBlink 1s infinite;"></i></div>`;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setTimeout(() => {
        const typingElem = document.getElementById(typingId);
        if(typingElem) typingElem.remove();
        messagesContainer.innerHTML += `<div class="chat-msg bot">Cảm ơn bạn đã liên hệ TechStore! Hiện tại tư vấn viên đang bận, chúng tôi sẽ phản hồi sớm nhất hoặc vui lòng gọi Hotline 1800 1234.</div>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1500);
}

function renderSystemNotice() {
    const bar = document.getElementById('system-notice-bar');
    const textObj = document.getElementById('system-notice-text');
    if (bar && textObj) {
        if (systemNotice && systemNotice.trim() !== '') {
            textObj.innerText = systemNotice;
            bar.style.display = 'block';
        } else {
            bar.style.display = 'none';
        }
    }
}

// --- CHẾ ĐỘ TỐI (DARK MODE) ---
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('theme', 'light');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeBtn = document.getElementById('theme-toggle');
    if (savedTheme === 'dark') { document.body.classList.add('dark-theme'); if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>'; }
}

// --- LOGIC MENU HAMBURGER (MOBILE) ---
function setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const subNav = document.querySelector('.sub-nav');
    const overlay = document.querySelector('.nav-overlay');
    const navButtons = document.querySelectorAll('.sub-nav button');

    if (!hamburgerBtn || !subNav || !overlay) {
        // Elements might not exist on all pages, so this is not an error
        return;
    }

    const toggleMenu = () => {
        subNav.classList.toggle('mobile-nav-open');
        overlay.classList.toggle('active');
        // Prevent body from scrolling when menu is open
        document.body.style.overflow = subNav.classList.contains('mobile-nav-open') ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Đóng menu khi một danh mục được chọn (để người dùng thấy kết quả lọc)
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (subNav.classList.contains('mobile-nav-open')) {
                toggleMenu();
            }
        });
    });
}

// --- TRUNG TÂM QUẢN LÝ TRẠNG THÁI ĐĂNG NHẬP ---
function setupAuthListener() {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // --- KHI NGƯỜI DÙNG ĐĂNG NHẬP ---
            isLoggedIn = true;
            currentUser = user; // Lưu object user của Firebase

            // Tự động kiểm tra xem người dùng đăng nhập có phải là admin đã được ghi nhớ không
            const storedAdminUID = localStorage.getItem('techstore_admin_uid');
            if (storedAdminUID && storedAdminUID === user.uid) {
                isAdmin = true;
                showToast("🚀 Đăng nhập với quyền Admin!", "info");
                await loadAdminData(); // Tải dữ liệu dành riêng cho Admin
            } else {
                isAdmin = false;
                const welcomeName = user.displayName || user.email;
                showToast(`Chào mừng trở lại, ${welcomeName}!`, "success");
            }
            
            await loadData(); // Tải dữ liệu (ví, giỏ hàng...)
            
            // Cập nhật toàn bộ giao diện
            updateAuthUI();
            updateCartUI();
            handleFilterAndSort();
            renderPromotions();

        } else {
            // --- KHI NGƯỜI DÙNG ĐĂNG XUẤT ---
            // Chỉ được kích hoạt khi firebase.auth().signOut() được gọi.
            // Admin đăng xuất sẽ không kích hoạt khối lệnh này.
            isLoggedIn = false; 
            currentUser = null;
            isAdmin = false;
            cart = []; userBalance = 0; balanceHistory = []; purchaseHistory = []; // Reset dữ liệu

            // Cập nhật giao diện về trạng thái đã đăng xuất
            updateAuthUI();
            updateCartUI();
            handleFilterAndSort();
            renderPromotions();
        }
    });
}

// --- LẮNG NGHE SẢN PHẨM & ĐÁNH GIÁ TỪ FIREBASE ---
function setupProductListener() {
    db.collection('settings').doc('products').onSnapshot(doc => {
        if (doc.exists && doc.data().list) {
            // Nếu có dữ liệu trên Firebase, tải về và đè lên dữ liệu cũ
            products = doc.data().list;
            handleFilterAndSort(); // Làm mới màn hình chính
            renderPromotions();
        } else {
            // Nếu Firebase chưa có dữ liệu (lần đầu tiên), tự động đẩy dữ liệu gốc từ máy tính lên
            console.log("Đang khởi tạo dữ liệu sản phẩm lên Firebase...");
            syncProducts();
        }
    });
}

/**
 * Dọn dẹp các key cũ trong localStorage từ các phiên bản trước của ứng dụng
 * để đảm bảo không có dữ liệu cũ nào gây xung đột với hệ thống Firestore mới.
 * Chỉ chạy một lần khi tải trang.
 */
function cleanupOldLocalStorage() {
    console.warn("--- [MAINTENANCE] Dọn dẹp dữ liệu cũ trong localStorage ---");
    const keysToRemove = [
        'all_orders',   // Dữ liệu đơn hàng cũ
        'users',        // Danh sách người dùng cũ
        'system_notice' // Thông báo hệ thống cũ
    ];

    // Tìm và xóa tất cả các key dữ liệu người dùng cũ (VD: data_user_tuannguyen)
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('data_user_')) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => {
        if (localStorage.getItem(key) !== null) { localStorage.removeItem(key); console.log(`Đã xóa key cũ: ${key}`); }
    });
}

// --- KHỞI CHẠY ---
window.onload = async function() {
    // Các hàm khởi tạo giao diện không phụ thuộc vào đăng nhập
    initTheme(); startCountdown(); createSnowflakes();
    await loadSystemNotice(); // Tải thông báo hệ thống từ Firestore
    renderSystemNotice(); // Hiển thị thông báo

    // Dọn dẹp dữ liệu cũ từ localStorage để tránh xung đột
    cleanupOldLocalStorage();

    // Kích hoạt các trình lắng nghe
    setupAuthListener(); // Kích hoạt trình lắng nghe trạng thái đăng nhập
    setupHamburgerMenu(); // Kích hoạt menu hamburger
    setupProductListener(); // Bật Lắng nghe sản phẩm từ Firebase theo thời gian thực
};