// --- 0. KHỞI TẠO BIẾN HỆ THỐNG ---
let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
let currentUser = localStorage.getItem('currentUser') || null;
let cart = JSON.parse(localStorage.getItem('saved_cart')) || []; 

let userBalance = 0;
let balanceHistory = [];
let purchaseHistory = [];

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
    const user = document.getElementById('reg-user').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const repass = document.getElementById('reg-repass').value;

    if (pass !== repass) { alert("❌ Mật khẩu nhập lại không khớp!"); return; }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.username === user)) { alert("❌ Tên tài khoản đã tồn tại!"); return; }

    users.push({ username: user, password: pass });
    localStorage.setItem('users', JSON.stringify(users));
    alert("✅ Đăng ký thành công! Hãy đăng nhập ngay.");
    switchTab('login');
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const validUser = users.find(u => u.username === user && u.password === pass);

    if ((user === 'admin' && pass === '123456') || validUser) {
        isLoggedIn = true;
        currentUser = user;
        loadData(); 
        saveData();
        alert("✅ Đăng nhập thành công!");
        toggleModal('auth-modal');
        updateAuthUI();
        updateCartUI();
    } else {
        alert("❌ Sai tài khoản hoặc mật khẩu!");
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
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('saved_cart');
    location.reload();
}

// --- 4. QUẢN LÝ VÍ & BIẾN ĐỘNG SỐ DƯ ---
function depositMoney(amount) {
    userBalance += amount;
    balanceHistory.unshift({
        date: new Date().toLocaleString('vi-VN'),
        type: 'Nạp tiền',
        amount: amount,
        description: 'Nạp tiền qua hệ thống QR'
    });
    saveData();
    updateAuthUI(); 
    alert(`✅ Đã nạp thành công ${amount.toLocaleString()}đ vào tài khoản!`);
}

function showBalanceHistory() {
    if (!isLoggedIn) { alert("Vui lòng đăng nhập!"); toggleModal('auth-modal'); return; }
    const content = document.getElementById('detail-content');
    let historyHTML = `
        <div style="padding: 20px;">
            <h2 style="text-align:center; color:#1e293b; margin-bottom: 20px;">VÍ CỦA TÔI</h2>
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 25px;">
                <p style="margin:0; font-size: 14px; opacity: 0.9;">Số dư khả dụng</p>
                <h1 style="margin: 10px 0; font-size: 40px;">${userBalance.toLocaleString()}đ</h1>
                <button onclick="openDepositModal()" style="margin-top:10px; padding: 10px 25px; border-radius: 25px; border:none; background: white; color: #059669; font-weight: bold; cursor:pointer;">+ NẠP TIỀN</button>
            </div>
            <h3 style="font-size: 18px; color: #1e293b; margin-bottom: 15px;">Biến động số dư</h3>
            <div style="max-height: 300px; overflow-y: auto; background: #f8fafc; border-radius: 10px; padding: 10px;">
    `;
    if (balanceHistory.length === 0) {
        historyHTML += `<p style="text-align:center; color:#94a3b8; padding: 30px;">Chưa có lịch sử giao dịch.</p>`;
    } else {
        balanceHistory.forEach(item => {
            const isNegative = item.amount < 0;
            historyHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding: 15px; border-bottom: 1px solid #e2e8f0;">
                    <div>
                        <div style="font-weight: bold; color: #1e293b;">${item.type}</div>
                        <div style="font-size: 12px; color: #64748b;">${item.date}</div>
                        <div style="font-size: 11px; color: #94a3b8;">${item.description}</div>
                    </div>
                    <div style="font-weight: bold; font-size: 16px; color: ${isNegative ? '#ef4444' : '#10b981'};">
                        ${isNegative ? '' : '+'}${item.amount.toLocaleString()}đ
                    </div>
                </div>`;
        });
    }
    historyHTML += `</div></div>`;
    content.innerHTML = historyHTML;
    toggleModal('detail-modal');
}

function openDepositModal() {
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div style="text-align:center; padding: 30px;">
            <i class="fas fa-university" style="font-size: 50px; color: #3b82f6; margin-bottom: 15px;"></i>
            <h2 style="color: #1e293b;">NẠP TIỀN VÀO TÀI KHOẢN</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0;">
                <button class="btn-auth" onclick="depositMoney(500000); showBalanceHistory()">500.000đ</button>
                <button class="btn-auth" onclick="depositMoney(2000000); showBalanceHistory()">2.000.000đ</button>
                <button class="btn-auth" onclick="depositMoney(5000000); showBalanceHistory()">5.000.000đ</button>
                <button class="btn-auth" onclick="depositMoney(10000000); showBalanceHistory()">10.000.000đ</button>
            </div>
            <p style="font-size: 12px; color: #ef4444;">* Trải nghiệm giả lập không mất tiền thật.</p>
        </div>`;
}

// --- 5. GIỎ HÀNG & THANH TOÁN ---
function addToCart(id) {
    if (!isLoggedIn) { alert("⚠️ Vui lòng đăng nhập!"); toggleModal('auth-modal'); return; }
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
    saveData();
    alert("Đã thêm vào giỏ!");
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if(cartCount) cartCount.innerText = cart.length;
    const list = document.getElementById('cart-items-list');
    const totalElem = document.getElementById('cart-total');
    if(!list || !totalElem) return;

    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align: center; padding: 20px;">Giỏ hàng trống...</p>';
        totalElem.innerText = '0đ';
        return;
    }

    let total = 0;
    list.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <img src="${item.img}" style="width: 40px;">
                    <div style="flex:1; font-size:14px;">${item.name}</div>
                    <div style="color:red; font-weight:bold;">${item.price.toLocaleString()}đ</div>
                    <button onclick="removeFromCart(${index})" style="border:none; color:red; cursor:pointer; background:none;"><i class="fas fa-trash"></i></button>
                </div>`;
    }).join('');
    totalElem.innerText = total.toLocaleString() + 'đ';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    saveData();
}

function openCheckout() {
    if (cart.length === 0) { alert("Giỏ hàng đang trống!"); return; }
    toggleModal('cart-modal');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="text-align:center; color: #10b981; margin-bottom: 20px;">THÔNG TIN GIAO HÀNG</h2>
            <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
                <input type="text" id="ship-name" placeholder="Họ tên người nhận" style="padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <input type="tel" id="ship-phone" placeholder="Số điện thoại" style="padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <textarea id="ship-address" placeholder="Địa chỉ chi tiết..." style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; height: 60px;"></textarea>
            </div>
            <div style="background:#f1f5f9; padding:15px; border-radius:10px; margin:20px 0;">
                <p>Số dư: <b>${userBalance.toLocaleString()}đ</b></p>
                <p style="font-size: 18px; font-weight: 700;">Tổng: <b style="color: red;">${total.toLocaleString()}đ</b></p>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <div id="method-wallet" onclick="selectMethod('wallet')" style="flex:1; border:2px solid #10b981; padding:15px; border-radius:10px; cursor:pointer; text-align:center;">Ví điện tử</div>
                <div id="method-qr" onclick="selectMethod('qr')" style="flex:1; border:2px solid #ddd; padding:15px; border-radius:10px; cursor:pointer; text-align:center;">Quét QR</div>
            </div>
            <div id="qr-display" style="display:none; text-align:center;">
                <img src="QR thanh toán.jpg" style="width: 180px; border-radius: 10px;">
                <p style="font-size:12px; color:#666;">Chủ TK: NGUYEN BA DUY</p>
            </div>
            <button onclick="confirmFinal()" class="btn-auth" style="background: #10b981; width: 100%; height: 50px; color:white; border:none; border-radius:8px; font-weight:bold;">XÁC NHẬN ĐẶT HÀNG</button>
        </div>`;
    toggleModal('detail-modal');
    window.selectedPaymentMethod = 'wallet'; 
}

function selectMethod(type) {
    window.selectedPaymentMethod = type;
    document.getElementById('qr-display').style.display = (type === 'qr' ? 'block' : 'none');
}

function confirmFinal() {
    const name = document.getElementById('ship-name').value;
    const address = document.getElementById('ship-address').value;
    if (!name || !address) { alert("⚠️ Thiếu thông tin!"); return; }
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    let paymentType = window.selectedPaymentMethod;

    if (paymentType === 'wallet') {
        if (userBalance < total) { alert("⚠️ Không đủ tiền!"); return; }
        userBalance -= total;
        balanceHistory.unshift({ date: new Date().toLocaleString('vi-VN'), type: 'Mua hàng', amount: -total, description: `Ship đến: ${address}` });
    }

    const newOrder = {
        id: "TS" + Math.floor(Math.random() * 100000),
        date: new Date().toLocaleString('vi-VN'),
        customer: name,
        address: address,
        items: [...cart],
        total: total,
        paymentMethod: paymentType,
        status: "Đang giao hàng 🚚"
    };

    purchaseHistory.unshift(newOrder);
    cart = [];
    saveData(); 
    updateAuthUI();
    updateCartUI();
    alert("🚀 Thành công!");
    toggleModal('detail-modal');
}

// --- 6. LỊCH SỬ MUA HÀNG & CHỨC NĂNG HỦY ĐƠN ---
function cancelOrder(index) {
    const order = purchaseHistory[index];
    if(!confirm(`Bạn có chắc muốn hủy đơn hàng ${order.id}?`)) return;

    // Nếu thanh toán bằng ví thì hoàn tiền
    if (order.paymentMethod === 'wallet') {
        userBalance += order.total;
        balanceHistory.unshift({
            date: new Date().toLocaleString('vi-VN'),
            type: 'Hoàn tiền',
            amount: order.total,
            description: `Hoàn tiền hủy đơn: ${order.id}`
        });
    }

    purchaseHistory.splice(index, 1);
    saveData();
    updateAuthUI();
    showHistory(); // Refresh lại giao diện lịch sử
    alert("✅ Đã hủy đơn và hoàn tiền thành công!");
}

function showHistory() {
    if (!isLoggedIn) { alert("Vui lòng đăng nhập!"); toggleModal('auth-modal'); return; }
    const content = document.getElementById('detail-content');
    if (purchaseHistory.length === 0) {
        content.innerHTML = `<div style="text-align:center; padding:40px;"><p>Bạn chưa có đơn hàng nào.</p></div>`;
    } else {
        let historyHTML = `<h2 style="text-align:center; margin-bottom:20px;">LỊCH SỬ MUA HÀNG</h2>`;
        purchaseHistory.forEach((order, index) => {
            historyHTML += `
                <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; margin-bottom: 15px; background: #f8fafc;">
                    <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #ddd; padding-bottom:5px;">
                        <b>Mã: ${order.id}</b>
                        <span style="color: #059669;">${order.status}</span>
                    </div>
                    <div style="font-size: 13px; margin: 5px 0;"><b>Giao đến:</b> ${order.address}</div>
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                        ${order.items.map(item => `• ${item.name}`).join('<br>')}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <button onclick="cancelOrder(${index})" style="background: #fee2e2; color: #ef4444; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: bold;">Hủy đơn hàng</button>
                        <div style="font-weight:bold; color:red;">Tổng: ${order.total.toLocaleString()}đ</div>
                    </div>
                </div>`;
        });
        content.innerHTML = historyHTML;
    }
    toggleModal('detail-modal');
}

// --- 7. CHI TIẾT SẢN PHẨM ---
function showProductDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div style="display: flex; gap: 30px; flex-wrap: wrap; padding: 10px;">
            <div style="flex: 1; text-align: center;">
                <img src="${product.img}" style="width: 100%; max-height: 350px; object-fit: contain;">
            </div>
            <div style="flex: 1; text-align: left;">
                <h2>${product.name}</h2>
                <p style="color: #ef4444; font-size: 24px; font-weight: 800;">${product.price.toLocaleString()}đ</p>
                <p>${product.desc}</p>
                <button onclick="addToCart(${product.id}); toggleModal('detail-modal')" style="width: 100%; padding: 15px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer;">THÊM VÀO GIỎ</button>
            </div>
        </div>`;
    document.getElementById('detail-modal').style.display = 'block';
}

// --- 8. TIỆN ÍCH ---
function toggleModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = (m.style.display === 'block') ? 'none' : 'block';
}

function switchTab(type) {
    document.getElementById('login-form').style.display = (type === 'login' ? 'block' : 'none');
    document.getElementById('register-form').style.display = (type === 'reg' ? 'block' : 'none');
}

function searchProducts() {
    const term = document.getElementById('search-input').value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
}

function filterProduct(type) {
    renderProducts(type === 'all' ? products : products.filter(p => p.category === type));
}

// --- KHỞI CHẠY HỆ THỐNG ---
window.onload = function() {
    loadData(); 
    renderProducts(products);
    updateAuthUI();
    updateCartUI(); 
    
    if (document.getElementById('login-form')) document.getElementById('login-form').onsubmit = handleLogin;
    if (document.getElementById('register-form')) document.getElementById('register-form').onsubmit = handleRegister;
};