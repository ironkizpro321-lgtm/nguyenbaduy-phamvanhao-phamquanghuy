// --- 0. KHỞI TẠO BIẾN HỆ THỐNG ---
// SỬA: Lấy danh sách sản phẩm từ localStorage nếu có để giữ giá Admin đã sửa
let storageProducts = JSON.parse(localStorage.getItem('all_products'));

let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
let currentUser = localStorage.getItem('currentUser') || null;
let cart = JSON.parse(localStorage.getItem('saved_cart')) || []; 
let isAdmin = false; // QUAN TRỌNG: Biến này không lưu vào localStorage theo ý thầy

let userBalance = 0;
let balanceHistory = [];
let purchaseHistory = [];

// Biến lưu trữ số tiền giảm giá tạm thời
let discountAmount = 0;

// THÊM: Biến toàn cục để theo dõi danh mục đang chọn cho bộ lọc tổng hợp
let currentCategory = 'all';

// --- HÀM LƯU DỮ LIỆU ---
function saveData() {
    if (!currentUser) return;
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    localStorage.setItem('currentUser', currentUser);
    localStorage.setItem('saved_cart', JSON.stringify(cart)); 

    const userData = {
        userBalance,
        balanceHistory,
        purchaseHistory
    };
    localStorage.setItem(`data_user_${currentUser}`, JSON.stringify(userData));
}

// THÊM: Hàm lưu danh sách sản phẩm vào Storage (để Admin sửa giá không bị mất)
function syncProducts() {
    localStorage.setItem('all_products', JSON.stringify(products));
}

// --- HÀM TẢI DỮ LIỆU ---
function loadData() {
    if (isLoggedIn && currentUser) {
        const savedData = localStorage.getItem(`data_user_${currentUser}`);
        if (savedData) {
            const data = JSON.parse(savedData);
            userBalance = data.userBalance || 0;
            balanceHistory = data.balanceHistory || [];
            purchaseHistory = data.purchaseHistory || [];
        }
    }
}

// --- 1. DANH MỤC SẢN PHẨM ---
const phones = [
    { id: 1, category: 'phone', name: "iPhone 17 Promax", price: 35000000, oldPrice: 38000000, isFlashSale: true, img: "./images/iPhone 17 Promax.jpg", desc: "Màn hình LTPO OLED 6.9 inch, Chip A19 Bionic mạnh mẽ, Camera Periscope zoom 10x." },
    { id: 2, category: 'phone', name: "iPhone 17", price: 28000000, img: "./images/iPhone 17.jpg", desc: "Thiết kế titan siêu nhẹ, màn hình 120Hz mượt mà, hỗ trợ Apple Intelligence toàn diện." },
    { id: 3, category: 'phone', name: "iPhone 16 Promax", price: 29000000, img: "./images/iPhone 16 Promax.jpg", desc: "Chip A18 Pro, nút điều khiển Camera Control chuyên nghiệp, pin dung lượng cực lớn." },
    { id: 4, category: 'phone', name: "iPhone 16", price: 22000000, img: "./images/iPhone 16.jpg", desc: "Nhiều màu sắc cá tính, chip A18, camera 48MP chất lượng điện ảnh." },
    { id: 5, category: 'phone', name: "Samsung S26 Ultra 5G", price: 32000000, oldPrice: 35000000, isFlashSale: true, img: "./images/Samsung S26 Ultra 5G.jpg", desc: "Bút S-Pen tích hợp, Camera 200MP zoom không gian 100x, khung viền Titan cao cấp." },
    { id: 6, category: 'phone', name: "Samsung Galaxy Z Fold7", price: 41000000, img: "./images/Samsung Galaxy Z Fold7.jpg", desc: "Màn hình gập thế hệ mới không nếp gấp, hỗ trợ đa nhiệm 4 cửa sổ cùng lúc." },
    { id: 7, category: 'phone', name: "Samsung Galaxy Z Flip 4", price: 15000000, img: "./images/Samsung Galaxy Z Flip 4.jpg", desc: "Thiết kế gập vỏ sò thời trang, màn hình phụ tiện lợi, kháng nước IPX8." },
    { id: 8, category: 'phone', name: "Nubia Red Magic 10S Pro", price: 18500000, img: "./images/Nubia Red Magic 10S.jpg", desc: "Smartphone gaming đỉnh cao, quạt tản nhiệt vật lý 22.000 vòng/phút, nút trigger cảm ứng." }
];

const laptops = [
    { id: 9, category: 'laptop', name: "Laptop MSI Raider GE78", price: 52000000, isBestSeller: true, img: "./images/Laptop MSI Raider .jpg", desc: "Core i9-14900HX, RTX 4090, Màn hình 4K 144Hz, dải LED RGB Mystic Light." },
    { id: 10, category: 'laptop', name: "Asus TUF Gaming A15", price: 24000000, img: "./images/Laptop Asus TUF Gaming A15.jpg", desc: "Ryzen 7, RTX 4060, Độ bền chuẩn quân đội Mỹ, hệ thống tản nhiệt chống bụi." },
    { id: 11, category: 'laptop', name: "Acer Gaming Nitro 5 Tiger", price: 19000000, img: "./images/Acer Gaming Nitro 5.jpg", desc: "Mẫu laptop gaming quốc dân, phím LED RGB 4 vùng, hỗ trợ 2 khe cắm SSD." },
    { id: 12, category: 'laptop', name: "Lenovo LOQ 15ARP9 Ryzen 7", price: 21500000, img: "./images/Lenovo LOQ 15ARP9 Ryzen 7.jpg", desc: "Thiết kế hầm hố từ dòng Legion, tản nhiệt buồng hơi, hiệu năng ổn định cho sinh viên." },
    { id: 30, category: 'laptop', name: "ASUS ROG Strix G16", price: 38500000, oldPrice: 42000000, isFlashSale: true, img: "./images/ASUS ROG Strix G16.jpg", desc: "Thiết kế đậm chất ROG, tản nhiệt 3 quạt siêu mát." },
    { id: 31, category: 'laptop', name: "Dell Alienware m16 R2", price: 45000000, isBestSeller: true, img: "./images/Dell Alienware m16 R2.jpg", desc: "Đẳng cấp Alienware, hiệu năng mạnh mẽ trong thân hình gọn nhẹ." }
];

const pcs = [
    { id: 13, category: 'pc', name: "Bộ PC Gaming i9-14900K Ultra", price: 65000000, isBestSeller: true, img: "./images/Bộ PC Gaming Intel Core i9-14900K.jpg", desc: "Cấu hình siêu cấp, tản nhiệt nước AIO, Case kính cường lực, chiến mọi game 4K." },
    { id: 14, category: 'pc', name: "PC Đồ Họa Core i7 14700F", price: 35000000, img: "./images/PC Đồ Họa Core, I7 14700F.jpg", desc: "Tối ưu cho thiết kế 3D, Premiere, Blender với 32GB RAM và card đồ họa chuyên dụng." },
    { id: 15, category: 'pc', name: "PC Gaming Core i5 12400F Eco", price: 12000000, img: "./images/PC GAMING CORE I5,12400F.jpg", desc: "Giá rẻ hiệu năng cao, chuyên trị Liên Minh, FO4, Valorant ở mức thiết kế max setting." },
    { id: 32, category: 'pc', name: "G-VN Phantom i7-14700F RTX 4070", price: 42500000, oldPrice: 48000000, isFlashSale: true, img: "./images/G-VN Phantom i7-14700F  RTX 4070.jpg", desc: "Bộ máy chiến game 2K cực mượt, linh kiện chính hãng cao cấp." }
];

const headphones = [
    { id: 23, category: 'headphone', name: "Logitech G733 LIGHTSPEED", price: 3800000, img: "./images/Tai nghe Logitech G733 LIGHTSPEED .jpg", desc: "Tai nghe không dây siêu nhẹ, âm thanh vòm DTS Headphone:X 2.0, LED RGB đẹp mắt." },
    { id: 24, category: 'headphone', name: "AirPods 4 Chính Hãng", price: 4400000, img: "./images/Tai nghe Apple AirPods 4 Chính Hãng.jpg", desc: "Chống ồn chủ động ANC, chip H2 mạnh mẽ, âm thanh không gian cá nhân hóa." },
    { id: 25, category: 'headphone', name: "Logitech G321 LightSpeed", price: 2500000, img: "./images/Tai nghe Logitech G321 LightSpeed .jpg", desc: "Kết nối ổn định, đệm tai vải thoáng khí, thời lượng pin lên đến 40 giờ liên tục." },
    { id: 33, category: 'headphone', name: "Razer BlackShark V2 Pro", price: 4500000, img: "./images/Razer BlackShark V2 Pro.jpg", desc: "Mic chuẩn phát thanh, âm thanh Esport chuyên nghiệp." }
];

const gears = [
    { id: 26, category: 'gear', name: "Ghế Extreme Zero S Red", price: 2900000, img: "./images/Ghế Chơi Game Extreme Zero S .jpg", desc: "Chất liệu da PU cao cấp, có gối đầu và tựa lưng, ngả 180 độ nghỉ ngơi tiện lợi." },
    { id: 27, category: 'gear', name: "Bàn Gaming chân kim loại BS005", price: 1200000, img: "./images/Bàn Gaming chân kim loại BS005.jpg", desc: "Mặt bàn gỗ công nghiệp chống nước, chân sắt chữ K chắc chắn, có lỗ đi dây điện." },
    { id: 28, category: 'gear', name: "Combo Bàn Ghế Gaming Z-Plus", price: 4800000, img: "./images/Combo Bàn Game Mặt Khuyết.jpg", desc: "Thiết kế công thái học giúp ngồi lâu không mỏi, tăng thẩm mỹ cho góc gaming." },
    { id: 34, category: 'gear', name: "Bàn phím Corsair K100 RGB", price: 5800000, img: "./images/Bàn phím Corsair K100 RGB.webp", desc: "Siêu phẩm bàn phím cơ, tốc độ phản hồi 4000Hz." },
    { id: 35, category: 'gear', name: "Chuột Razer DeathAdder V3 Pro", price: 3400000, img: "./images/Chuột Razer DeathAdder V3 Pro.png", desc: "Trọng lượng siêu nhẹ 63g, cảm biến quang học 30K DPI." }
];

const components = [
    { id: 17, category: 'component', name: "VGA RTX 5080 Gigabyte", price: 48000000, img: "./images/VGA GIGABYTE GEFORCE RTX 5080 .jpg", desc: "Kiến trúc Blackwell mới nhất, DLSS 4.0, hiệu năng Ray Tracing vượt bậc." },
    { id: 18, category: 'component', name: "VGA RX 580 8GB JGINYUE", price: 3500000, img: "./images/VGA AMD JGINYUE RX 580 8GB.jpg", desc: "Sự lựa chọn tiết kiệm cho PC gaming giá rẻ, chiến tốt game Esport." },
    { id: 36, category: 'component', name: "CPU Intel Core i9-14900K", price: 15500000, img: "./images/CPU Intel Core i9-14900K.webp", desc: "Đỉnh cao hiệu năng đơn nhân và đa nhân." },
    { id: 37, category: 'component', name: "RAM G.Skill Trident Z5 RGB 32GB", price: 3800000, img: "./images/RAM G.Skill Trident Z5 RGB 32GB.webp", desc: "DDR5 bus 6000MHz, LED RGB đẹp mắt." }
];

const componentsList = [...phones, ...laptops, ...pcs, ...headphones, ...gears, ...components];

// Ưu tiên lấy từ storageProducts (nếu có), nếu không mới lấy mảng gốc
let products = storageProducts || componentsList;

// --- 2. HÀM HIỂN THỊ SẢN PHẨM QUẢNG CÁO ---
function renderPromotions() {
    const flashList = document.getElementById('flash-sale-list');
    const bestList = document.getElementById('best-seller-list');
    if (!flashList || !bestList) return;

    // Vẽ Flash Sale
    const flashSaleData = products.filter(p => p.isFlashSale);
    flashList.innerHTML = flashSaleData.map(p => {
        const percent = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 10;
        return `
        <div class="card" style="border: 1px solid #ffebeb;">
            <div style="position: absolute; top: 10px; left: 10px; background: var(--primary); color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; z-index: 1;">-${percent}%</div>
            <img src="${p.img}" alt="${p.name}" onclick="showProductDetail(${p.id})" style="cursor:pointer">
            <h3 style="font-size: 14px; margin: 10px 0;">${p.name}</h3>
            <p style="color: var(--primary); font-weight: 800; font-size: 18px; margin:0;">${p.price.toLocaleString()}đ</p>
            <p style="text-decoration: line-through; color: #999; font-size: 12px;">${p.oldPrice ? p.oldPrice.toLocaleString() + 'đ' : ''}</p>
            <div style="display:flex; gap:5px; margin-top:10px;">
                <button onclick="addToCart(${p.id})" class="btn-auth" style="padding: 8px; font-size:11px; flex:1">MUA NGAY</button>
                ${isAdmin ? `<button onclick="adminDeleteProduct(${p.id})" style="background:#000; color:#fff; border:none; padding:8px; border-radius:4px; font-size:10px; cursor:pointer">XÓA</button>` : ''}
            </div>
        </div>`;
    }).join('');

    // Vẽ Bán Chạy
    const bestSellerData = products.filter(p => p.isBestSeller);
    bestList.innerHTML = bestSellerData.map(p => `
        <div class="card">
            <div style="position: absolute; top: 10px; right: 10px; color: #fbbf24; font-size: 11px; font-weight:bold;"><i class="fas fa-fire"></i> BÁN CHẠY</div>
            <img src="${p.img}" alt="${p.name}" onclick="showProductDetail(${p.id})" style="cursor:pointer">
            <h3 style="font-size: 14px; margin: 10px 0;">${p.name}</h3>
            <p style="color: #ed1c24; font-weight: 800; font-size: 18px;">${p.price.toLocaleString()}đ</p>
            <div style="display:flex; gap:5px; margin-top:10px;">
                <button onclick="addToCart(${p.id})" class="btn-auth" style="background: #2563eb; padding: 8px; font-size:11px; flex:1">THÊM VÀO GIỎ</button>
                ${isAdmin ? `<button onclick="adminDeleteProduct(${p.id})" style="background:#000; color:#fff; border:none; padding:8px; border-radius:4px; font-size:10px; cursor:pointer">XÓA</button>` : ''}
            </div>
        </div>`).join('');
}

// --- LOGIC ĐỒNG HỒ ĐẾM NGƯỢC ---
function startCountdown() {
    const countdownElem = document.getElementById('countdown');
    if (!countdownElem) return;
    let time = 3 * 60 * 60 + 59 * 60 + 59; 
    setInterval(() => {
        time--;
        let h = Math.floor(time / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = time % 60;
        if (countdownElem) countdownElem.innerText = `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
    }, 1000);
}

// --- 2. HÀM HIỂN THỊ SẢN PHẨM CHÍNH ---
function renderProducts(data) {
    const list = document.getElementById('product-list');
    if (!list) return;

    list.innerHTML = data.map(p => {
        const autoImg = `https://source.unsplash.com/featured/?${encodeURIComponent(p.name)},technology`;
        const finalImg = (p.img && p.img.trim() !== "") ? p.img : autoImg;

        // CÔNG CỤ QUẢN TRỊ ADMIN
        const adminTools = isAdmin ? `
            <div style="background: #fff1f2; padding: 5px; margin-top: 5px; border-radius: 4px; display: flex; gap: 5px;">
                <button onclick="adminEditPrice(${p.id})" style="flex:1; background: #eab308; color: white; border: none; padding: 5px; cursor: pointer; border-radius: 3px; font-size:10px; font-weight:bold;">SỬA GIÁ</button>
                <button onclick="adminDeleteProduct(${p.id})" style="flex:1; background: #e11d48; color: white; border: none; padding: 5px; cursor: pointer; border-radius: 3px; font-size:10px; font-weight:bold;">XÓA</button>
            </div>` : '';

        return `
        <div class="card">
            <div class="card-img" onclick="showProductDetail(${p.id})" style="height: 180px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <img src="${finalImg}" alt="${p.name}" style="max-height: 100%; max-width: 100%;" onerror="this.src='https://placehold.co/400x400?text=TechStore'">
            </div>
            <div class="card-info" style="text-align: center; padding: 10px;">
                <h3 style="font-size: 16px; margin: 10px 0; cursor: pointer; height:45px; overflow:hidden;">${p.name}</h3>
                <p style="color: red; font-weight: bold; margin-bottom: 10px;">${p.price.toLocaleString()}đ</p>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                    <button onclick="addToCart(${p.id})" style="cursor: pointer; padding: 8px 15px; border-radius: 4px; border: none; background: #3b82f6; color: white; font-weight:bold;">Thêm vào giỏ</button>
                    <button onclick="showProductDetail(${p.id})" style="cursor: pointer; padding: 5px 15px; border-radius: 4px; border: 1px solid #3b82f6; background: white; color: #3b82f6; font-size: 12px;">Chi tiết sản phẩm</button>
                    ${adminTools}
                </div>
            </div>
        </div>
    `}).join('');
}

// --- 3. HỆ THỐNG TÀI KHOẢN ---
function handleRegister(e) {
    e.preventDefault();
    const user = document.getElementById('reg-user').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const repass = document.getElementById('reg-repass').value;
    if (pass !== repass) { showToast("❌ MẬT KHẨU KHÔNG KHỚP!", "error"); return; }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.username === user)) { showToast("❌ TÀI KHOẢN ĐÃ TỒN TẠI!", "error"); return; }
    users.push({ username: user, password: pass });
    localStorage.setItem('users', JSON.stringify(users));
    showToast("✅ Đăng ký thành công!");
    switchTab('login');
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    
    // TRƯỜNG HỢP ADMIN
    if (user === "admin" && pass === "123456") {
        isLoggedIn = true;
        currentUser = "Quản trị viên";
        isAdmin = true; 
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('currentUser', currentUser);
        showToast("✅ QUYỀN ADMIN ĐÃ KÍCH HOẠT!", "info");
        toggleModal('auth-modal');
        updateAuthUI();
        renderProducts(products);
        renderPromotions();
        return;
    }

    // TRƯỜNG HỢP USER THƯỜNG
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const validUser = users.find(u => u.username === user && u.password === pass);
    if (validUser) {
        isLoggedIn = true;
        currentUser = user;
        isAdmin = false; 
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('currentUser', user);
        loadData();
        saveData();
        showToast("✅ Đăng nhập thành công!");
        toggleModal('auth-modal');
        updateAuthUI();
        updateCartUI();
        renderProducts(products);
        renderPromotions();
    } else {
        showToast("❌ SAI TÀI KHOẢN HOẶC MẬT KHẨU!", "error");
    }
}

function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    if (authSection && isLoggedIn) {
        authSection.innerHTML = `
            <div style="background: #1e293b; color:white; padding: 8px 15px; border-radius: 8px; display:flex; gap:10px; align-items:center;">
                <span onclick="showBalanceHistory()" style="cursor:pointer; border-right: 1px solid #475569; padding-right: 10px;">
                    <i class="fas fa-wallet" style="color:#10b981"></i> ${userBalance.toLocaleString()}đ
                </span>
                <span><i class="fas fa-user-circle"></i> ${currentUser}</span>
                <button onclick="logout()" style="background:#f87171; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer">Thoát</button>
            </div>`;
    }
}

function logout() {
    saveData();
    isLoggedIn = false;
    currentUser = null;
    isAdmin = false; 
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('saved_cart');
    location.reload();
}

// --- 4. LOGIC QUẢN TRỊ ADMIN ---
function adminEditPrice(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const newPrice = prompt(`Nhập giá mới cho: ${product.name}`, product.price);
    if (newPrice !== null && !isNaN(newPrice) && newPrice !== "") {
        product.price = parseInt(newPrice);
        const isFlash = confirm("Đưa sản phẩm này vào Flash Sale?");
        if (isFlash) {
            product.isFlashSale = true;
            product.oldPrice = product.price + 500000;
        } else {
            product.isFlashSale = false;
        }
        
        syncProducts(); 
        showToast("✅ ĐÃ CẬP NHẬT GIÁ MỚI!");
        handleFilterAndSort(); 
        renderPromotions();
    }
}

function adminDeleteProduct(id) {
    if (confirm("⚠️ Bạn có chắc chắn muốn XÓA VĨNH VIỄN sản phẩm này không?")) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            syncProducts(); 
            showToast("🗑️ ĐÃ XÓA SẢN PHẨM KHỎI HỆ THỐNG!");
            handleFilterAndSort(); 
            renderPromotions();
        }
    }
}

// --- 5. VÍ TIỀN ---
function depositMoney(amount) { userBalance += amount; balanceHistory.unshift({ date: new Date().toLocaleString('vi-VN'), type: 'Nạp tiền', amount: amount, description: 'Nạp qua hệ thống QR' }); saveData(); updateAuthUI(); showToast(`✅ NẠP THÀNH CÔNG ${amount.toLocaleString()}đ!`); }

function showBalanceHistory() {
    if (!isLoggedIn) { showToast("⚠️ VUI LÒNG ĐĂNG NHẬP!", "error"); toggleModal('auth-modal'); return; }
    const content = document.getElementById('detail-content');
    let historyHTML = `<div style="padding: 20px;"><h2 style="text-align:center; margin-bottom: 20px;">VÍ CỦA TÔI</h2><div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 25px;"><p style="margin:0; font-size: 14px; opacity: 0.9;">Số dư khả dụng</p><h1 style="margin: 10px 0; font-size: 40px;">${userBalance.toLocaleString()}đ</h1><button onclick="openDepositModal()" style="margin-top:10px; padding: 10px 25px; border-radius: 25px; border:none; background: white; color: #059669; font-weight: bold; cursor:pointer;">+ NẠP TIỀN</button></div><div style="max-height: 300px; overflow-y: auto; background: #f8fafc; border-radius: 10px; padding: 10px;">`;
    if (balanceHistory.length === 0) { historyHTML += `<p style="text-align:center; color:#94a3b8; padding: 30px;">Chưa có giao dịch.</p>`; } 
    else { balanceHistory.forEach(item => { const isNeg = item.amount < 0; historyHTML += `<div style="display:flex; justify-content:space-between; align-items:center; padding: 15px; border-bottom: 1px solid #e2e8f0;"><div><div style="font-weight: bold;">${item.type}</div><div style="font-size: 12px; color: #64748b;">${item.date}</div></div><div style="font-weight: bold; color: ${isNeg ? '#ef4444' : '#10b981'};">${isNeg ? '' : '+'}${item.amount.toLocaleString()}đ</div></div>`; }); }
    historyHTML += `</div></div>`; content.innerHTML = historyHTML; toggleModal('detail-modal');
}

function openDepositModal() {
    const content = document.getElementById('detail-content');
    content.innerHTML = `<div style="text-align:center; padding: 30px;"><i class="fas fa-university" style="font-size: 50px; color: #3b82f6; margin-bottom: 15px;"></i><h2 style="color: #1e293b;">NẠP TIỀN VÀO TÀI KHOẢN</h2><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0;"><button class="btn-auth" onclick="depositMoney(500000); showBalanceHistory()">500.000đ</button><button class="btn-auth" onclick="depositMoney(1000000); showBalanceHistory()">1.000.000đ</button><button class="btn-auth" onclick="depositMoney(5000000); showBalanceHistory()">5.000.000đ</button><button class="btn-auth" onclick="depositMoney(10000000); showBalanceHistory()">10.000.000đ</button></div><p style="font-size: 12px; color: #ef4444;">* Trải nghiệm giả lập không mất tiền thật.</p></div>`;
}

// --- 6. GIỎ HÀNG ---
function addToCart(id) {
    if (!isLoggedIn) { showToast("⚠️ VUI LÒNG ĐĂNG NHẬP!", "error"); toggleModal('auth-modal'); return; }
    const product = products.find(p => p.id === id);
    cart.push({...product, cartId: Date.now() + Math.random()}); 
    updateCartUI(); saveData(); 
    showToast("✅ ĐÃ THÊM VÀO GIỎ HÀNG!");
    const cartIcon = document.querySelector('.cart-wrapper');
    if(cartIcon) { cartIcon.classList.add('cart-pop-animation'); setTimeout(() => cartIcon.classList.remove('cart-pop-animation'), 300); }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if(cartCount) cartCount.innerText = cart.length;
    const list = document.getElementById('cart-items-list');
    const totalElem = document.getElementById('cart-total');
    if(!list || !totalElem) return;
    list.innerHTML = ""; 
    if (cart.length === 0) { list.innerHTML = '<p style="text-align: center; padding: 20px; color: #94a3b8;">Giỏ hàng trống...</p>'; totalElem.innerText = '0đ'; return; }
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `<div style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f1f5f9;"><img src="${item.img}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 8px;"><div style="flex: 1;"><h4 style="font-size: 14px; margin: 0; color: #1e293b;">${item.name}</h4><p style="color: #ef4444; font-weight: bold; margin: 4px 0 0 0;">${item.price.toLocaleString()}đ</p></div><button onclick="removeFromCart(${index})" style="border: none; background: none; color: #ef4444; cursor: pointer; padding: 10px; font-size: 18px;"><i class="fas fa-trash-alt"></i></button></div>`;
    });
    totalElem.innerText = total.toLocaleString() + 'đ';
}

function removeFromCart(index) { cart.splice(index, 1); updateCartUI(); saveData(); showToast("🗑️ ĐÃ XÓA KHỎI GIỎ HÀNG!", "info"); }

// --- 7. THANH TOÁN ---
function toggleInstallment(show) {
    const box = document.getElementById('installment-box');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if(box) {
        box.style.display = show ? 'block' : 'none';
        if(show) updateInstallmentTable(total - discountAmount);
    }
}

function updateInstallmentTable(total) {
    const months = document.getElementById('installment-month').value;
    const eachMonth = Math.round(total / months);
    const info = document.getElementById('installment-info');
    if(info) info.innerText = `Góp mỗi tháng: ${eachMonth.toLocaleString()}đ x ${months} tháng`;
}

function openCheckout() {
    if (cart.length === 0) { showToast("⚠️ GIỎ HÀNG ĐANG TRỐNG!", "error"); return; }
    toggleModal('cart-modal');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    discountAmount = 0; 
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="text-align:center; color: #ed1c24; margin-bottom: 20px;">XÁC NHẬN GIAO HÀNG</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <input type="text" id="ship-name" placeholder="Họ tên người nhận" style="width:100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom:10px;">
                    <textarea id="ship-address" placeholder="Địa chỉ chi tiết..." style="width:100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; height: 80px;"></textarea>
                </div>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <p style="font-weight:bold; margin-bottom:10px;">Phương thức thanh toán</p>
                    <label style="display:block; margin-bottom:8px; cursor:pointer;"><input type="radio" name="pay-method" value="full" checked onclick="toggleInstallment(false)"> Thanh toán toàn bộ</label>
                    <label style="display:block; cursor:pointer;"><input type="radio" name="pay-method" value="installment" onclick="toggleInstallment(true)"> Trả góp 0% lãi suất</label>
                    <div id="installment-box" style="display:none; margin-top:15px; padding-top:10px; border-top: 1px dashed #ddd;">
                        <select id="installment-month" onchange="updateInstallmentTable(${total})" style="width:100%; padding:8px;">
                            <option value="3">3 tháng</option><option value="6">6 tháng</option><option value="12">12 tháng</option>
                        </select>
                        <p id="installment-info" style="font-size:12px; margin-top:10px; color:#2563eb; font-weight:bold;"></p>
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom:15px;"><input type="text" id="coupon-input" placeholder="Nhập mã TECHSTORE2026" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px;"><button onclick="applyCoupon(${total})" style="padding: 10px 20px; background: #333; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">ÁP DỤNG</button></div>
            <div style="background:#f1f5f9; padding:15px; border-radius:10px; margin:20px 0;"><p id="display-discount" style="color: #059669; display: none;"></p><p style="font-size: 20px; font-weight: 800;">Tổng thanh toán: <b id="final-total" style="color: #ed1c24;">${total.toLocaleString()}đ</b></p></div>
            <button onclick="confirmFinal()" class="btn-auth" style="background: #ed1c24; width: 100%; height: 50px; color:white; border:none; border-radius:8px; font-weight:bold; font-size:16px;">XÁC NHẬN ĐẶT HÀNG</button>
        </div>`;
    toggleModal('detail-modal');
}

function applyCoupon(total) {
    const code = document.getElementById('coupon-input').value.trim().toUpperCase();
    const display = document.getElementById('display-discount');
    const finalElem = document.getElementById('final-total');

    if (code === "TECHSTORE2026") {
        discountAmount = total * 0.1;
        showToast("✅ ÁP DỤNG MÃ GIẢM 10% THÀNH CÔNG!");
        display.style.display = "block"; display.innerHTML = `Giảm giá: <b>-${discountAmount.toLocaleString()}đ</b>`;
        const newTotal = total - discountAmount;
        finalElem.innerText = newTotal.toLocaleString() + "đ";
        if(document.getElementById('installment-box').style.display === 'block') updateInstallmentTable(newTotal);
    } else {
        showToast("❌ MÃ GIẢM GIÁ KHÔNG HỢP LỆ!", "error");
    }
}

function confirmFinal() {
    const name = document.getElementById('ship-name').value;
    const address = document.getElementById('ship-address').value;
    const payMethod = document.querySelector('input[name="pay-method"]:checked').value;
    
    if (!name || !address) { showToast("⚠️ THIẾU THÔNG TIN NHẬN HÀNG!", "error"); return; }
    
    const subTotal = cart.reduce((sum, item) => sum + item.price, 0);
    const totalToPay = subTotal - discountAmount;

    if (payMethod === 'full') {
        if (userBalance < totalToPay) { showToast("❌ SỐ DƯ VÍ KHÔNG ĐỦ!", "error"); return; }
        userBalance -= totalToPay;
    } else {
        const months = document.getElementById('installment-month').value;
        const firstMonth = Math.round(totalToPay / months);
        if (userBalance < firstMonth) { showToast("❌ KHÔNG ĐỦ TIỀN ĐÓNG KỲ ĐẦU!", "error"); return; }
        userBalance -= firstMonth;
    }

    balanceHistory.unshift({ date: new Date().toLocaleString('vi-VN'), type: 'Mua hàng', amount: -totalToPay, description: payMethod === 'full' ? 'Thanh toán thẳng' : 'Góp kỳ 1' });
    purchaseHistory.unshift({ id: "TS" + Math.floor(Math.random() * 100000), date: new Date().toLocaleString('vi-VN'), customer: name, address: address, items: [...cart], total: totalToPay, status: "Đang giao hàng 🚚" });

    cart = []; saveData(); updateAuthUI(); updateCartUI();
    setTimeout(() => { showToast("🚀 ĐẶT HÀNG THÀNH CÔNG!"); toggleModal('detail-modal'); }, 500);
}

// --- 8. TIỆN ÍCH KHÁC (ĐÃ THÊM TÍNH NĂNG HỦY ĐƠN) ---
function showHistory() {
    if (!isLoggedIn) { showToast("⚠️ VUI LÒNG ĐĂNG NHẬP!", "error"); toggleModal('auth-modal'); return; }
    const content = document.getElementById('detail-content');
    if (purchaseHistory.length === 0) { content.innerHTML = `<div style="text-align:center; padding:40px;"><p>Bạn chưa có đơn hàng nào.</p></div>`; } 
    else {
        let historyHTML = `<h2 style="text-align:center; margin-bottom:20px;">LỊCH SỬ MUA HÀNG</h2>`;
        purchaseHistory.forEach((order, index) => { 
            // KIỂM TRA ĐIỀU KIỆN HỦY
            const canCancel = order.status === "Đang giao hàng 🚚";
            
            historyHTML += `<div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; margin-bottom: 15px; background: #f8fafc;">
                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #ddd; padding-bottom:5px;">
                    <b>Mã: ${order.id}</b>
                    <span style="color: ${order.status === 'Đã hủy ❌' ? 'red' : '#059669'};">${order.status}</span>
                </div>
                <div style="font-size: 13px; margin: 5px 0;"><b>Giao đến:</b> ${order.address}</div>
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">${order.items.map(item => `• ${item.name}`).join('<br>')}</div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight:bold; color:red;">Tổng: ${order.total.toLocaleString()}đ</div>
                    ${canCancel ? `<button onclick="cancelOrder(${index})" style="background:#ef4444; color:white; border:none; padding:5px 12px; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold;">HỦY ĐƠN</button>` : ''}
                </div>
            </div>`; 
        });
        content.innerHTML = historyHTML;
    }
    toggleModal('detail-modal');
}

function cancelOrder(index) {
    if (confirm("⚠️ Bạn có chắc chắn muốn HỦY đơn này và NHẬN LẠI TIỀN không?")) {
        const order = purchaseHistory[index];
        // 1. Hoàn tiền
        userBalance += order.total;
        // 2. Ghi vào lịch sử ví
        balanceHistory.unshift({ date: new Date().toLocaleString('vi-VN'), type: 'Hoàn tiền', amount: order.total, description: `Hủy đơn ${order.id}` });
        // 3. Đổi trạng thái
        order.status = "Đã hủy ❌";
        // 4. Lưu và cập nhật
        saveData(); updateAuthUI(); showToast("✅ ĐÃ HỦY & HOÀN TIỀN!");
        showHistory(); 
    }
}

function showProductDetail(id) {
    const product = products.find(p => p.id === id); if (!product) return;
    const content = document.getElementById('detail-content');
    content.innerHTML = `<div style="display: flex; gap: 40px; padding: 20px;"><div style="flex: 1; text-align: center;"><img src="${product.img}" style="width: 100%; max-height: 350px; object-fit: contain; border-radius: 15px;" onerror="this.src='https://placehold.co/400x400?text=Sản+Phẩm'"></div><div style="flex: 1; text-align: left;"><h2 style="margin-bottom: 15px; color: #1e293b;">${product.name}</h2><p style="color: #ef4444; font-size: 28px; font-weight: 800; margin-bottom: 20px;">${product.price.toLocaleString()}đ</p><p style="color: #64748b; font-size: 16px; margin-bottom: 30px; line-height: 1.6;">${product.desc}</p><button onclick="addToCart(${product.id}); toggleModal('detail-modal')" style="width: 100%; padding: 18px; background: #3b82f6; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px;">THÊM VÀO GIỎ HÀNG</button></div></div>`;
    document.getElementById('detail-modal').style.display = 'block';
}

function toggleModal(id) { const m = document.getElementById(id); if (m) m.style.display = (m.style.display === 'block') ? 'none' : 'block'; }
function switchTab(type) { const l = document.getElementById('login-form'), r = document.getElementById('register-form'); if (type === 'login') { l.style.display = 'block'; r.style.display = 'none'; } else { l.style.display = 'none'; r.style.display = 'block'; } }
function searchProducts() { const term = document.getElementById('search-input').value.toLowerCase(); renderProducts(products.filter(p => p.name.toLowerCase().includes(term))); }

function filterProduct(type) {
    currentCategory = type;
    handleFilterAndSort();
}

function handleFilterAndSort() {
    let filtered = [...products];
    if (currentCategory !== 'all') { filtered = filtered.filter(p => p.category === currentCategory); }
    const priceRange = document.getElementById('sort-price').value;
    if (priceRange === 'under-10') { filtered = filtered.filter(p => p.price < 10000000); } 
    else if (priceRange === '10-25') { filtered = filtered.filter(p => p.price >= 10000000 && p.price <= 25000000); } 
    else if (priceRange === 'above-25') { filtered = filtered.filter(p => p.price > 25000000); }
    const order = document.getElementById('order-price').value;
    if (order === 'asc') { filtered.sort((a, b) => a.price - b.price); } 
    else if (order === 'desc') { filtered.sort((a, b) => b.price - a.price); }
    renderProducts(filtered);
}

// --- LOGIC SIÊU SLIDESHOW QUẢNG CÁO ---
const mainSliderImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470", 
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1470",
    "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=1470"
];
const sideSlider1Images = [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500", 
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=500",
];
const sideSlider2Images = [
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=500", 
    "https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=500",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=500"
];

let mainIdx = 0, side1Idx = 0, side2Idx = 0;

function initSlideshow() {
    const mainImg = document.getElementById('slider-img');
    const sideBanners = document.querySelectorAll('.side-banners img');
    if (mainImg) mainImg.src = mainSliderImages[0];
    if (sideBanners.length >= 2) {
        sideBanners[0].src = sideSlider1Images[0];
        sideBanners[1].src = sideSlider2Images[0];
    }
}

function runAllSliders() {
    const mainImg = document.getElementById('slider-img');
    const sideBanners = document.querySelectorAll('.side-banners img');
    if (mainImg) { mainIdx = (mainIdx + 1) % mainSliderImages.length; applyFadeEffect(mainImg, mainSliderImages[mainIdx]); }
    if (sideBanners.length >= 2) {
        side1Idx = (side1Idx + 1) % sideSlider1Images.length;
        applyFadeEffect(sideBanners[0], sideSlider1Images[side1Idx]);
        side2Idx = (side2Idx + 1) % sideSlider2Images.length;
        applyFadeEffect(sideBanners[1], sideSlider2Images[side2Idx]);
    }
}

function applyFadeEffect(element, newSrc) {
    if (!element) return;
    element.style.opacity = '0.5';
    setTimeout(() => {
        element.src = newSrc;
        element.style.opacity = '1';
    }, 300);
}

setInterval(runAllSliders, 4000);

// --- HÀM TẠO THÔNG BÁO TOAST ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span style="margin-left: 12px; color: #ffffff !important; font-weight: 900;">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { toast.remove(); }, 500);
    }, 3000);
}

// --- KHỞI CHẠY ---
window.onload = function() {
    initSlideshow();
    loadData(); renderProducts(products); renderPromotions(); startCountdown(); updateAuthUI(); updateCartUI(); 
    if (document.getElementById('login-form')) document.getElementById('login-form').onsubmit = handleLogin;
    if (document.getElementById('register-form')) document.getElementById('register-form').onsubmit = handleRegister;
};