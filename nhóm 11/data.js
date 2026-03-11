let isLoggedIn = false; 
let currentUser = null;
let cart = [];

// --- 1. DANH MỤC SẢN PHẨM (Đã thêm thông tin chi tiết 'desc') ---
const phones = [
    { id: 1, category: 'phone', name: "iPhone 17 Promax", price: 35000000, img: "./images/iPhone 17 Promax.jpg", desc: "Màn hình LTPO OLED 6.9 inch, Chip A19 Bionic mạnh mẽ, Camera Periscope zoom 10x." },
    { id: 2, category: 'phone', name: "iPhone 17", price: 28000000, img: "./images/iPhone 17.jpg", desc: "Thiết kế titan siêu nhẹ, màn hình 120Hz mượt mà, hỗ trợ Apple Intelligence toàn diện." },
    { id: 3, category: 'phone', name: "iPhone 16 Promax", price: 29000000, img: "./images/iPhone 16 Promax.jpg", desc: "Chip A18 Pro, nút điều khiển Camera Control chuyên nghiệp, pin dung lượng cực lớn." },
    { id: 4, category: 'phone', name: "iPhone 16", price: 22000000, img: "./images/iPhone 16.jpg", desc: "Nhiều màu sắc cá tính, chip A18, camera 48MP chất lượng điện ảnh." },
    { id: 5, category: 'phone', name: "Samsung S26 Ultra 5G", price: 32000000, img: "./images/Samsung S26 Ultra 5G.jpg", desc: "Bút S-Pen tích hợp, Camera 200MP zoom không gian 100x, khung viền Titan cao cấp." },
    { id: 6, category: 'phone', name: "Samsung Galaxy Z Fold7", price: 41000000, img: "./images/Samsung Galaxy Z Fold7.jpg", desc: "Màn hình gập thế hệ mới không nếp gấp, hỗ trợ đa nhiệm 4 cửa sổ cùng lúc." },
    { id: 7, category: 'phone', name: "Samsung Galaxy Z Flip 4", price: 15000000, img: "./images/Samsung Galaxy Z Flip 4.jpg", desc: "Thiết kế gập vỏ sò thời trang, màn hình phụ tiện lợi, kháng nước IPX8." },
    { id: 8, category: 'phone', name: "Nubia Red Magic 10S", price: 18000000, img: "./images/Nubia Red Magic 10S.jpg", desc: "Smartphone gaming đỉnh cao, quạt tản nhiệt vật lý 22.000 vòng/phút, nút trigger cảm ứng." }
];

const laptops = [
    { id: 9, category: 'laptop', name: "Laptop MSI Raider", price: 52000000, img: "./images/Laptop MSI Raider .jpg", desc: "Core i9-14900HX, RTX 4090, Màn hình 4K 144Hz, dải LED RGB Mystic Light." },
    { id: 10, category: 'laptop', name: "Asus TUF Gaming A15", price: 24000000, img: "./images/Laptop Asus TUF Gaming A15.jpg", desc: "Ryzen 7, RTX 4060, Độ bền chuẩn quân đội Mỹ, hệ thống tản nhiệt chống bụi." },
    { id: 11, category: 'laptop', name: "Acer Gaming Nitro 5", price: 19000000, img: "./images/Acer Gaming Nitro 5.jpg", desc: "Mẫu laptop gaming quốc dân, phím LED RGB 4 vùng, hỗ trợ 2 khe cắm SSD." },
    { id: 12, category: 'laptop', name: "Lenovo LOQ 15ARP9", price: 21500000, img: "./images/Lenovo LOQ 15ARP9 Ryzen 5-7235HS , 16G...jpg", desc: "Thiết kế hầm hố từ dòng Legion, tản nhiệt buồng hơi, hiệu năng ổn định cho sinh viên." }
];

const pcs = [
    { id: 13, category: 'pc', name: "Bộ PC Gaming i9-14900K", price: 65000000, img: "./images/Bộ PC Gaming Intel Core i9-14900K.jpg", desc: "Cấu hình siêu cấp, tản nhiệt nước AIO, Case kính cường lực, chiến mọi game 4K." },
    { id: 14, category: 'pc', name: "PC Đồ Họa Core i7 14700F", price: 35000000, img: "./images/PC Đồ Họa Core, I7 14700F.jpg", desc: "Tối ưu cho thiết kế 3D, Premiere, Blender với 32GB RAM và card đồ họa chuyên dụng." },
    { id: 15, category: 'pc', name: "PC Gaming Core i5 12400F", price: 12000000, img: "./images/PC GAMING CORE I5,12400F.jpg", desc: "Giá rẻ hiệu năng cao, chuyên trị Liên Minh, FO4, Valorant ở mức thiết kế max setting." }
];

const headphones = [
    { id: 23, category: 'headphone', name: "Logitech G733 LIGHTSPEED", price: 3800000, img: "./images/Tai nghe Logitech G733 LIGHTSPEED .jpg", desc: "Tai nghe không dây siêu nhẹ, âm thanh vòm DTS Headphone:X 2.0, LED RGB đẹp mắt." },
    { id: 24, category: 'headphone', name: "AirPods 4 Chính Hãng", price: 4400000, img: "./images/Tai nghe Apple AirPods 4 Chính Hãng.jpg", desc: "Chống ồn chủ động ANC, chip H2 mạnh mẽ, âm thanh không gian cá nhân hóa." },
    { id: 25, category: 'headphone', name: "Logitech G321 LightSpeed", price: 2500000, img: "./images/Tai nghe Logitech G321 LightSpeed .jpg", desc: "Kết nối ổn định, đệm tai vải thoáng khí, thời lượng pin lên đến 40 giờ liên tục." }
];

const gears = [
    { id: 26, category: 'gear', name: "Ghế Extreme Zero S", price: 2900000, img: "./images/Ghế Chơi Game Extreme Zero S .jpg", desc: "Chất liệu da PU cao cấp, có gối đầu và tựa lưng, ngả 180 độ nghỉ ngơi tiện lợi." },
    { id: 27, category: 'gear', name: "Bàn Gaming chân kim loại", price: 1200000, img: "./images/Bàn Gaming chân kim loại BS005.jpg", desc: "Mặt bàn gỗ công nghiệp chống nước, chân sắt chữ K chắc chắn, có lỗ đi dây điện." },
    { id: 28, category: 'gear', name: "Combo Bàn Ghế Mặt Khuyết", price: 4800000, img: "./images/Combo Bàn Game Mặt Khuyết.jpg", desc: "Thiết kế công thái học giúp ngồi lâu không mỏi, tăng thẩm mỹ cho góc gaming." },
    { id: 29, category: 'gear', name: "Bàn chân sắt chữ U", price: 1100000, img: "./images/Bàn chân sắt chữ U khung đen .jpg", desc: "Tối giản, hiện đại, chịu lực tốt, phù hợp cho cả học tập và làm việc." }
];

const components = [
    { id: 17, category: 'component', name: "VGA RTX 5080", price: 48000000, img: "./images/VGA GIGABYTE GEFORCE RTX 5080 .jpg", desc: "Kiến trúc Blackwell mới nhất, DLSS 4.0, hiệu năng Ray Tracing vượt bậc." },
    { id: 18, category: 'component', name: "VGA RX 580 8GB", price: 3500000, img: "./images/VGA AMD JGINYUE RX 580 8GB.jpg", desc: "Sự lựa chọn tiết kiệm cho PC gaming giá rẻ, chiến tốt game Esport." }
];

const products = [...phones, ...laptops, ...pcs, ...headphones, ...gears, ...components];

// --- 2. HÀM HIỂN THỊ SẢN PHẨM ---
function renderProducts(data) {
    const list = document.getElementById('product-list');
    if (!list) return;

    list.innerHTML = data.map(p => `
        <div class="card">
            <div class="card-img" onclick="showProductDetail(${p.id})" style="height: 180px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <img src="${p.img}" alt="${p.name}" style="max-height: 100%; max-width: 100%;" onerror="this.src='https://placehold.co/200x200?text=Lỗi+Ảnh'">
            </div>
            <div class="card-info" style="text-align: center; padding: 10px;">
                <h3 style="font-size: 16px; margin: 10px 0; cursor: pointer;" onclick="showProductDetail(${p.id})">${p.name}</h3>
                <p style="color: red; font-weight: bold; margin-bottom: 10px;">${p.price.toLocaleString()}đ</p>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                    <button onclick="addToCart(${p.id})" style="cursor: pointer; padding: 8px 15px; border-radius: 4px; border: none; background: #3b82f6; color: white;">Thêm vào giỏ</button>
                    <button onclick="showProductDetail(${p.id})" style="cursor: pointer; padding: 5px 15px; border-radius: 4px; border: 1px solid #3b82f6; background: white; color: #3b82f6; font-size: 12px;">Chi tiết sản phẩm</button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- 3. HỆ THỐNG TÀI KHOẢN ---
function handleRegister(e) {
    e.preventDefault();
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;
    const repass = document.getElementById('reg-repass').value;

    if (pass !== repass) {
        alert("❌ Mật khẩu nhập lại không khớp!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.username === user)) {
        alert("❌ Tên tài khoản đã tồn tại!");
        return;
    }

    users.push({ username: user, password: pass });
    localStorage.setItem('users', JSON.stringify(users));
    alert("✅ Đăng ký thành công! Hãy đăng nhập ngay.");
    switchTab('login');
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const validUser = users.find(u => u.username === user && u.password === pass);

    if ((user === 'admin' && pass === '123456') || validUser) {
        isLoggedIn = true;
        currentUser = user;
        alert("✅ Đăng nhập thành công!");
        toggleModal('auth-modal');
        updateAuthUI();
    } else {
        alert("❌ Sai tài khoản hoặc mật khẩu!");
    }
}

function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    if (authSection && isLoggedIn) {
        authSection.innerHTML = `
            <div style="background: #1e293b; color:white; padding: 8px 15px; border-radius: 8px; display:flex; gap:10px; align-items:center;">
                <span><i class="fas fa-user-circle"></i> ${currentUser}</span>
                <button onclick="location.reload()" style="background:#f87171; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer">Thoát</button>
            </div>`;
    }
}

// --- 4. GIỎ HÀNG & CHI TIẾT ---
function addToCart(id) {
    if (!isLoggedIn) {
        alert("⚠️ Vui lòng đăng nhập!");
        toggleModal('auth-modal');
        return;
    }
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
    alert("Đã thêm vào giỏ!");
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const list = document.getElementById('cart-items-list');
    const totalElem = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #888;">Giỏ hàng trống...</p>';
        totalElem.innerText = '0đ';
        return;
    }

    let total = 0;
    list.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <img src="${item.img}" style="width: 40px;">
                <div style="flex:1; font-size:14px;">${item.name}</div>
                <div style="color:red; font-weight:bold;">${item.price.toLocaleString()}đ</div>
                <button onclick="removeFromCart(${index})" style="border:none; color:red; cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>`;
    }).join('');
    totalElem.innerText = total.toLocaleString() + 'đ';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// HÀM SHOW CHI TIẾT ĐÃ ĐƯỢC CẬP NHẬT
function showProductDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div style="display: flex; gap: 30px; flex-wrap: wrap; padding: 10px;">
            <div style="flex: 1; min-width: 250px; text-align: center;">
                <img src="${product.img}" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            </div>
            <div style="flex: 1; text-align: left; min-width: 280px;">
                <span style="background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">${product.category.toUpperCase()}</span>
                <h2 style="margin: 10px 0; color: #1e293b; font-size: 28px;">${product.name}</h2>
                <p style="color: #ef4444; font-size: 32px; font-weight: 800; margin-bottom: 20px;">${product.price.toLocaleString()}đ</p>
                
                <div style="border-top: 2px solid #f1f5f9; padding-top: 20px;">
                    <h4 style="color: #64748b; margin-bottom: 10px;">THÔNG TIN SẢN PHẨM:</h4>
                    <p style="line-height: 1.6; color: #334155; font-size: 16px;">
                        ${product.desc || "Đang cập nhật nội dung cho sản phẩm này..."}
                    </p>
                </div>

                <div style="margin-top: 30px; display: flex; gap: 10px;">
                    <button onclick="addToCart(${product.id}); toggleModal('detail-modal')" style="flex: 1; padding: 15px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 16px;">
                        <i class="fas fa-cart-plus"></i> THÊM VÀO GIỎ
                    </button>
                    <button onclick="toggleModal('detail-modal')" style="padding: 15px; background: #f1f5f9; color: #64748b; border: none; border-radius: 8px; cursor: pointer;">
                        Đóng
                    </button>
                </div>
            </div>
        </div>`;
    
    // Đảm bảo modal hiện lên
    const m = document.getElementById('detail-modal');
    if (m) m.style.display = 'block';
}

// --- 5. TIỆN ÍCH KHÁC ---
function toggleModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = (m.style.display === 'block') ? 'none' : 'block';
}

function switchTab(type) {
    document.getElementById('login-form').style.display = (type === 'login' ? 'block' : 'none');
    document.getElementById('register-form').style.display = (type === 'reg' ? 'block' : 'none');
    document.getElementById('tab-login').classList.toggle('active', type === 'login');
    document.getElementById('tab-reg').classList.toggle('active', type === 'reg');
}

function searchProducts() {
    const term = document.getElementById('search-input').value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
}

function filterProduct(type) {
    renderProducts(type === 'all' ? products : products.filter(p => p.category === type));
}

// KHỞI CHẠY
window.onload = function() {
    renderProducts(products);
    if (document.getElementById('login-form')) document.getElementById('login-form').onsubmit = handleLogin;
    if (document.getElementById('register-form')) document.getElementById('register-form').onsubmit = handleRegister;
};