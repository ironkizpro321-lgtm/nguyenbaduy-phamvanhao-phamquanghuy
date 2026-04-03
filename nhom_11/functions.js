/**
 * Kích hoạt và ghi nhớ quyền admin vĩnh viễn cho tài khoản đang đăng nhập trên trình duyệt này.
 * Gọi hàm này từ Console của trình duyệt: grantAdmin()
 */
window.grantAdmin = function() {
    console.log("--- [ADMIN] Bắt đầu quá trình cấp quyền ---");
    if (!isLoggedIn) {
        console.error("[ADMIN] Lỗi: Người dùng chưa đăng nhập. Không thể cấp quyền.");
        showToast("❌ Bạn cần đăng nhập trước khi cấp quyền!", "error");
        return;
    }

    // Ghi nhớ UID của người dùng này vào localStorage để cấp quyền (sẽ bị xóa khi đăng xuất)
    localStorage.setItem('techstore_admin_uid', currentUser.uid);
    console.log(`[ADMIN] Đã ghi nhớ tài khoản ${currentUser.email} (UID: ${currentUser.uid}) là admin.`);

    isAdmin = true;
    updateAuthUI();
    handleFilterAndSort(); // Render lại sản phẩm để hiển thị nút Sửa/Xóa
    showToast("🚀 KÍCH HOẠT ADMIN THÀNH CÔNG! Quyền sẽ mất khi bạn đăng xuất.", "success");
    console.log("[ADMIN] Quá trình hoàn tất.");
}

// --- 1. CÁC HÀM HỖ TRỢ (ĐÃ TÁI CẤU TRÚC) ---
function getAdminToolsHTML(productId) {
    // Các style này nên được chuyển vào file CSS và gọi bằng class để dễ quản lý
    if (!isAdmin) return '';
    return `
        <div class="admin-tools">
            <button onclick="openEditProductModal(${productId})" class="admin-edit-btn">SỬA</button>
            <button onclick="adminDeleteProduct(${productId})" class="admin-delete-btn">XÓA</button>
        </div>`;
}

function getStarRatingHTML(product) {
    // Hàm được gia cố để chống lỗi dữ liệu
    let avgRating = 0;
    const reviews = (product && Array.isArray(product.reviews)) ? product.reviews : [];
    const reviewCount = reviews.length;

    if (reviewCount > 0) {
        const totalRating = reviews.reduce((acc, rev) => {
            const rating = (rev && rev.rating) ? parseInt(rev.rating, 10) : 0;
            return acc + (isNaN(rating) ? 0 : rating);
        }, 0);
        avgRating = Math.round((totalRating / reviewCount) * 10) / 10;
    }

    const starsHtml = Array.from({ length: 5 }, (_, i) => i + 1).map(i => {
        if (i <= avgRating) return '<i class="fas fa-star"></i>';
        if (i - 0.5 <= avgRating) return '<i class="fas fa-star-half-alt"></i>';
        return '<i class="far fa-star"></i>';
    }).join('');
    
    return `<div class="product-rating">${starsHtml} <span>(${reviewCount})</span></div>`;
}

// --- 2. HÀM HIỂN THỊ SẢN PHẨM QUẢNG CÁO ---
function renderPromotions() {
    const bestList = document.getElementById('best-seller-list');
    if (!bestList) return;
    renderFlashSale(true); // Tham số true để bắt buộc render lần đầu khi tải web

    const bestSellerData = products.filter(p => p && p.isBestSeller);
    bestList.innerHTML = bestSellerData.map(p => {
        const name = p.name || 'Sản phẩm TechStore';
        const price = p.price || 0;
        return `
        <div class="card card-bestseller">
            <div class="sticker-bestseller"><i class="fas fa-fire"></i> BÁN CHẠY</div>
            <div class="card-img" onclick="showProductDetail(${p.id})">
                <img src="${p.img ? p.img.trim() : ''}" alt="${name}" onerror="this.src='https://placehold.co/400x400?text=TechStore'">
            </div>
            <div class="card-info">
                <h3 class="product-name" onclick="showProductDetail(${p.id})">${name}</h3>
                ${getStarRatingHTML(p)}
                <p class="bestseller-price">${price.toLocaleString()}đ</p>
                <div class="card-actions">
                    <button class="btn-add-cart-bestseller" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> THÊM VÀO GIỎ</button>
                    ${getAdminToolsHTML(p.id)}
                </div>
            </div>
        </div>`
    }).join('');
}

function renderFlashSale(isInitialRender = false) {
    const flashList = document.getElementById('flash-sale-list');
    if (!flashList) return;

    const flashSaleData = products.filter(p => p.isFlashSale);
    if (flashSaleData.length === 0) return;

    const totalPages = Math.ceil(flashSaleData.length / flashSaleItemsPerPage);
    
    // Nếu dữ liệu <= 4 sản phẩm (chỉ có 1 trang), không tự động nhảy trang để tránh nhấp nháy màn hình
    if (totalPages <= 1 && !isInitialRender) return; 

    if (flashSalePage >= totalPages) flashSalePage = 0; // Chạy hết thì quay vòng lại trang đầu

    const currentData = flashSaleData.slice(flashSalePage * flashSaleItemsPerPage, (flashSalePage + 1) * flashSaleItemsPerPage);

    flashList.style.opacity = '0'; // Hiệu ứng làm mờ biến mất
    
    setTimeout(() => {
        flashList.innerHTML = currentData.map(p => {
            const percent = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 10;

            return `
            <div class="card card-flashsale">
                <div class="sticker-flashsale"><i class="fas fa-bolt"></i> -${percent}%</div>
                <div class="card-img" onclick="showProductDetail(${p.id})">
                    <img src="${p.img ? p.img.trim() : ''}" alt="${p.name}" onerror="this.src='https://placehold.co/400x400?text=TechStore'">
                </div>
                <div class="card-info">
                    <h3 class="product-name" onclick="showProductDetail(${p.id})">${p.name}</h3>
                    ${getStarRatingHTML(p)}
                    <div class="product-price">
                        <p class="flashsale-price-final">${p.price.toLocaleString()}đ</p>
                        <p class="flashsale-price-old">${p.oldPrice ? p.oldPrice.toLocaleString() + 'đ' : ''}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn-add-cart-flashsale" onclick="addToCart(${p.id})">MUA NGAY</button>
                        ${getAdminToolsHTML(p.id)}
                    </div>
                </div>
            </div>`;
        }).join('');
        
        flashList.style.transition = 'opacity 0.4s ease-in-out';
        flashList.style.opacity = '1'; // Hiệu ứng xuất hiện trở lại
    }, 300);
}

// --- LOGIC ĐỒNG HỒ ĐẾM NGƯỢC ---
function startCountdown() {
    const countdownElem = document.getElementById('countdown');
    if (!countdownElem) return;
    let time = 3 * 60 * 60 + 59 * 60 + 59; 
    setInterval(() => {
        time--;
        if (time < 0) {
            time = 0; // Tránh thời gian chạy lố sang số âm
        }
        let h = Math.floor(time / 3600);
        let m = Math.floor((time % 3600) / 60);
        let s = time % 60;
        if (countdownElem) countdownElem.innerText = `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
    }, 1000);
}

// --- HÀM HỖ TRỢ CHO RENDER SẢN PHẨM CHÍNH ---
function getProductStickersHTML(product) {
    let stickersHtml = '';
    if (product.oldPrice && product.oldPrice > product.price) {
        const percent = Math.round((1 - product.price / product.oldPrice) * 100);
        stickersHtml += `<div class="sticker sale-sticker"><i class="fas fa-arrow-down"></i> ${percent}%</div>`;
    }
    if (product.price >= 5000000) {
        stickersHtml += `<div class="sticker freeship-sticker"><i class="fas fa-shipping-fast"></i> Freeship</div>`;
    }
    return stickersHtml ? `<div class="card-stickers">${stickersHtml}</div>` : '';
}

function getProductPriceHTML(product) {
    if (product.oldPrice && product.oldPrice > product.price) {
        return `
            <p class="product-price-final">${product.price.toLocaleString()}đ</p>
            <p class="product-price-old">${product.oldPrice.toLocaleString()}đ</p>
        `;
    }
    return `<p class="product-price-final">${product.price.toLocaleString()}đ</p>`;
}

// --- 2. HÀM HIỂN THỊ SẢN PHẨM CHÍNH (ĐÃ TỐI ƯU & GIA CỐ) ---
function renderProducts(data) {
    const list = document.getElementById('product-list');
    if (!list) return;

    // Đảm bảo data là một mảng và lọc các item lỗi
    const validData = Array.isArray(data) ? data.filter(p => p && typeof p === 'object' && p.id) : [];

    if (validData.length === 0) {
        list.innerHTML = `<p style="text-align: center; padding: 50px; color: #94a3b8; grid-column: 1 / -1;">Không tìm thấy sản phẩm nào phù hợp.</p>`;
        return;
    }

    list.innerHTML = validData.map(p => {
        const name = p.name || 'Sản phẩm TechStore';
        const price = p.price || 0;
        // Tạo một object sạch để truyền vào các hàm helper
        const productData = { ...p, name, price };

        const finalImg = (p.img && p.img.trim() !== "") ? p.img.trim() : 'https://placehold.co/400x400?text=Image+Not+Found';

        return `
        <div class="card">
            ${getProductStickersHTML(productData)}
            <div class="card-img" onclick="showProductDetail(${p.id})">
                <img src="${finalImg}" alt="${name}" onerror="this.onerror=null;this.src='https://placehold.co/400x400?text=TechStore';">
            </div>
            <div class="card-info">
                <h3 class="product-name" onclick="showProductDetail(${p.id})">${name}</h3>
                ${getStarRatingHTML(productData)}
                <div class="product-price">${getProductPriceHTML(productData)}</div>
                <div class="card-actions">
                    <button class="btn-add-cart" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Thêm vào giỏ</button>
                    <button class="btn-detail" onclick="showProductDetail(${p.id})">Chi tiết</button>
                    ${getAdminToolsHTML(p.id)}
                </div>
            </div>
        </div>
    `;}).join('');
}

// --- HÀM PHÂN TRANG ---
function updateProductDisplay(data) {
    currentFilteredProducts = data; // Gắn dữ liệu cần phân trang vào biến tạm
    currentPage = 1; // Khôi phục lại trang 1
    renderPaginatedProducts();
}

function renderPaginatedProducts() {
    const totalPages = Math.ceil(currentFilteredProducts.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = currentFilteredProducts.slice(start, end); // Cắt lấy sản phẩm cho trang hiện tại

    renderProducts(paginatedData);
    renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
    const controls = document.getElementById('pagination-controls');
    if (!controls) return;
    if (totalPages <= 1) { controls.innerHTML = ''; return; } // Nếu chỉ có 1 trang thì ẩn luôn thanh chuyển trang
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    controls.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    renderPaginatedProducts();
    document.getElementById('product-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    if (authSection && isLoggedIn) {
        const userIdentifier = currentUser.displayName || currentUser.email; // Ưu tiên hiển thị Tên, nếu không có thì mới hiện email
        const adminBtn = isAdmin ? `<button onclick="showAdminPanel()" style="background: linear-gradient(135deg, #f59e0b, #d97706); color:white; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><i class="fas fa-cogs"></i> Admin Panel</button>` : '';
        authSection.innerHTML = `
            <div style="background: #1e293b; color:white; padding: 8px 15px; border-radius: 8px; display:flex; gap:10px; align-items:center;">
                <span onclick="showBalanceHistory()" style="cursor:pointer; border-right: 1px solid #475569; padding-right: 10px;">
                    <i class="fas fa-wallet" style="color:#10b981"></i> ${userBalance ? userBalance.toLocaleString() : 0}đ
                </span>
                <span><i class="fas fa-user-circle"></i> ${userIdentifier}</span>
                ${adminBtn}
                <button onclick="logout()" style="background:#f87171; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer">Thoát</button>
            </div>`;
    } else if (authSection) {
        // Hiển thị lại nút Đăng nhập khi ở trạng thái khách
        authSection.innerHTML = `
            <button onclick="toggleModal('auth-modal')" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 10px 22px; border-radius: 4px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                <i class="fas fa-user-circle"></i> <span>Đăng nhập</span>
            </button>`;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const repass = document.getElementById('reg-repass').value;

    if (pass !== repass) { showToast("❌ Mật khẩu không khớp!", "error"); return; }

    try {
        showToast("Đang xử lý...", "info");
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, pass);
        const user = userCredential.user;
        
        await user.updateProfile({ displayName: name }); // Cập nhật tên
        
        try {
            // Khởi tạo các cấu trúc dữ liệu trống ngay khi vừa đăng ký
            await db.collection('users').doc(user.uid).set({
                email: email,
                displayName: name,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                userBalance: 0,
                balanceHistory: [],
                purchaseHistory: [],
                cart: []
            });
        } catch(e) { console.warn("Không thể tạo Data Firestore (Có thể do Rule):", e); }

        showToast("✅ Đăng ký thành công! Đang đăng nhập...", "success");
        document.getElementById('register-form').reset();
        toggleModal('auth-modal'); // Tự đóng Modal (vì firebase sẽ auto login sau khi đăng ký)
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') showToast("❌ Email đã được sử dụng!", "error");
        else if (error.code === 'auth/weak-password') showToast("❌ Mật khẩu phải từ 6 ký tự!", "error");
        else showToast("❌ Lỗi: " + error.message, "error");
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;

    try {
        showToast("Đang xác thực...", "info");
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, pass);
        
        // KIỂM TRA TÀI KHOẢN BỊ KHÓA
        const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
        if (userDoc.exists && userDoc.data().isBanned === true) {
            await firebase.auth().signOut(); // Đăng xuất ngay lập tức
            showToast("❌ Tài khoản của bạn đã bị khóa!", "error");
            return;
        }

        toggleModal('auth-modal');
        document.getElementById('login-form').reset(); // Xóa sạch dữ liệu đã gõ
    } catch (error) {
        // Giờ đây, mọi lần đăng nhập đều qua Firebase, nên nếu sai sẽ báo lỗi chung.
        showToast("❌ Sai Email, Mật khẩu hoặc tài khoản bị khóa!", "error");
    }
}

async function logout() {
    // --- LOGIC ĐĂNG XUẤT ADMIN RIÊNG BIỆT ---
    try {
        // Hủy quyền admin ngay khi đăng xuất
        localStorage.removeItem('techstore_admin_uid');
        
        await firebase.auth().signOut();
        // onAuthStateChanged sẽ tự động lắng nghe sự kiện này và xử lý các bước còn lại
        // (reset biến, cập nhật UI), nên ta chỉ cần hiển thị thông báo ở đây.
        showToast("Đã đăng xuất thành công!", "info");
    } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        showToast("❌ Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.", "error");
    }
}

// --- 4. LOGIC QUẢN TRỊ ADMIN ---

function openEditProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="margin-bottom: 20px; color: var(--primary); text-align: center;"><i class="fas fa-edit"></i> SỬA THÔNG TIN SẢN PHẨM</h2>
            <form onsubmit="handleEditProduct(event, ${product.id})">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <input type="text" id="edit-prod-name" value="${product.name}" placeholder="Tên sản phẩm" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    <select id="edit-prod-cat" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                        <option value="phone" ${product.category === 'phone' ? 'selected' : ''}>Điện thoại</option>
                        <option value="laptop" ${product.category === 'laptop' ? 'selected' : ''}>Laptop</option>
                        <option value="pc" ${product.category === 'pc' ? 'selected' : ''}>PC Gaming</option>
                        <option value="headphone" ${product.category === 'headphone' ? 'selected' : ''}>Tai nghe</option>
                        <option value="gear" ${product.category === 'gear' ? 'selected' : ''}>Gaming Gear</option>
                        <option value="component" ${product.category === 'component' ? 'selected' : ''}>Linh kiện</option>
                    </select>
                    <input type="number" id="edit-prod-price" value="${product.price}" placeholder="Giá bán" required min="0" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    <input type="text" id="edit-prod-img" value="${product.img}" placeholder="Link ảnh" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                </div>
                <textarea id="edit-prod-desc" placeholder="Mô tả sản phẩm" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 15px; height: 80px;">${product.desc || ''}</textarea>
                <div style="margin-bottom: 15px; background: #fffbeb; padding: 10px; border-radius: 6px; border: 1px solid #fde68a;">
                    <label style="cursor: pointer; font-weight: bold; color: #d97706;"><input type="checkbox" id="edit-prod-flash" ${product.isFlashSale ? 'checked' : ''}> Đưa vào Flash Sale (Tự động tạo giá cũ cao hơn giá mới)</label>
                </div>
                <div style="margin-bottom: 15px; background: #eff6ff; padding: 10px; border-radius: 6px; border: 1px solid #bfdbfe;">
                    <label style="cursor: pointer; font-weight: bold; color: #1d4ed8;"><input type="checkbox" id="edit-prod-bestseller" ${product.isBestSeller ? 'checked' : ''}> Đánh dấu là Sản phẩm Bán chạy</label>
                </div>
                <button type="submit" style="padding: 12px; background: var(--primary); color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; width: 100%;">LƯU THAY ĐỔI</button>
            </form>
        </div>
    `;
    document.getElementById('detail-modal').style.display = 'block';
}

function handleEditProduct(e, id) {
    e.preventDefault();
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Tạo một bản sao để cập nhật, tránh thay đổi state cục bộ trực tiếp
    const updatedData = {
        name: document.getElementById('edit-prod-name').value.trim(),
        category: document.getElementById('edit-prod-cat').value,
        price: parseInt(document.getElementById('edit-prod-price').value),
        img: document.getElementById('edit-prod-img').value.trim(),
        desc: document.getElementById('edit-prod-desc').value.trim(),
        isBestSeller: document.getElementById('edit-prod-bestseller').checked
    };
 
    const isFlash = document.getElementById('edit-prod-flash').checked;
    updatedData.isFlashSale = isFlash;
    if (isFlash) {
        // Nếu bật Flash Sale, tự động tính giá cũ nếu cần
        if (!product.oldPrice || product.oldPrice <= updatedData.price) {
            updatedData.oldPrice = updatedData.price + Math.floor(updatedData.price * 0.15);
        } else {
            updatedData.oldPrice = product.oldPrice;
        }
    } else {
        updatedData.oldPrice = null; // Xóa giá cũ nếu không còn trong Flash Sale
    }

    // Ghi đè dữ liệu cũ
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedData };
    }
    syncProducts();
    showToast("✅ ĐÃ CẬP NHẬT THÔNG TIN SẢN PHẨM!");
    document.getElementById('detail-modal').style.display = 'none';
    handleFilterAndSort();
    renderPromotions();
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

async function adminAddProduct(e) {
    e.preventDefault();
    const name = document.getElementById('add-prod-name').value.trim();
    const category = document.getElementById('add-prod-cat').value;
    const price = parseInt(document.getElementById('add-prod-price').value);
    const img = document.getElementById('add-prod-img').value.trim();
    const desc = document.getElementById('add-prod-desc').value.trim();
    const isFlashSale = document.getElementById('add-prod-flash').checked;
    const isBestSeller = document.getElementById('add-prod-bestseller').checked;

    if (!name || !category || isNaN(price) || !img || !desc) {
        showToast("❌ Vui lòng điền đầy đủ thông tin!", "error");
        return;
    }

    const newId = Date.now(); // Tạo ID duy nhất
    const newProduct = {
        id: newId,
        category: category,
        name: name,
        price: price,
        oldPrice: isFlashSale ? price + Math.floor(price * 0.15) : null,
        img: img,
        desc: desc,
        isFlashSale: isFlashSale,
        isBestSeller: isBestSeller,
        reviews: [] // Khởi tạo mảng review rỗng
    };

    products.unshift(newProduct); // Thêm lên đầu danh sách
    syncProducts();
    showToast("✅ THÊM SẢN PHẨM THÀNH CÔNG!");
    showAdminPanel('products'); // Load lại tab sản phẩm để xóa form
    handleFilterAndSort(); // Cập nhật danh sách trang chủ
}

// --- HỆ THỐNG ADMIN PANEL ---
async function showAdminPanel(tab = 'dashboard') {
    if (!isAdmin) return;

    // FIX: Tải lại dữ liệu mới nhất từ Firestore mỗi khi mở Admin Panel.
    // Điều này đảm bảo các báo cáo (doanh thu, người dùng mới, đơn hàng mới) luôn được cập nhật.
    showToast("Đang tải dữ liệu Admin mới nhất...", "info");
    await loadAdminData();

    const content = document.getElementById('detail-content');
     
    let totalRevenue = 0;
    let successOrders = 0, pendingOrders = 0, canceledOrders = 0;
    
    // Tạo mảng 7 ngày gần nhất để làm nhãn trục X
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        let d = new Date(today);
        d.setDate(d.getDate() - i);
        let match = d.toLocaleString('vi-VN').match(/\d{1,2}\/\d{1,2}\/\d{4}/);
        let dateStr = match ? match[0] : `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
        last7Days.push(dateStr);
    }

    const revenueByDate = {};
    last7Days.forEach(date => revenueByDate[date] = 0); // Đặt mặc định 0đ cho 7 ngày qua

    // FIX: Thêm các kiểm tra an toàn để tránh lỗi khi dữ liệu đơn hàng hoặc người dùng bị lỗi/thiếu.
    // Lỗi này có thể khiến toàn bộ Admin Panel không thể hiển thị.
    if (Array.isArray(allOrders)) {
        allOrders.forEach(order => {
            if (!order || !order.status || typeof order.total !== 'number') return; // Bỏ qua đơn hàng lỗi

            if (order.status.includes('thành công')) successOrders++;
            else if (order.status.includes('hủy')) canceledOrders++;
            else pendingOrders++;

            if (!order.status.includes('hủy')) {
                const dateMatch = String(order.date || '').match(/\d{1,2}\/\d{1,2}\/\d{4}/);
                const dateString = dateMatch ? dateMatch[0] : 'Khác';
                
                if (revenueByDate[dateString] !== undefined) {
                    revenueByDate[dateString] += order.total;
                }
                totalRevenue += order.total;
            }
        });
    }

    const chartLabels = last7Days;
    const chartData = last7Days.map(date => revenueByDate[date]);

    // Lấy danh sách Top Khách hàng nạp tiền nhiều nhất
    let topDepositors = [];
    if (Array.isArray(allUsers)) {
        topDepositors = allUsers.map(u => {
            let totalDeposit = 0;
            if (u && Array.isArray(u.balanceHistory)) {
                u.balanceHistory.forEach(history => {
                    if (history && (history.type === 'Nạp tiền' || history.type === 'Được Admin cấp') && typeof history.amount === 'number') {
                        totalDeposit += history.amount;
                    }
                });
            }
            return { username: u.displayName || 'N/A', total: totalDeposit };
        }).filter(u => u.total > 0)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5); // FIX: Gán lại giá trị sau khi cắt mảng
    }

    // Dựng khung Layout Admin Panel (Sidebar + Content)
    let html = `
        <div style="display: flex; gap: 20px; height: 70vh;">
            <!-- Sidebar -->
            <div style="width: 220px; background: #f8fafc; border-right: 1px solid #e2e8f0; padding: 15px; border-radius: 10px 0 0 10px; display: flex; flex-direction: column; gap: 8px;">
                <h3 style="color: var(--primary); margin-bottom: 20px; font-size: 16px; text-align: center;"><i class="fas fa-shield-alt"></i> ADMIN PANEL</h3>
                <button onclick="showAdminPanel('dashboard')" style="text-align: left; padding: 12px; border: none; background: ${tab === 'dashboard' ? 'var(--primary)' : 'transparent'}; color: ${tab === 'dashboard' ? 'white' : '#475569'}; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;"><i class="fas fa-chart-pie" style="width: 25px;"></i> Tổng quan</button>
                <button onclick="showAdminPanel('orders')" style="text-align: left; padding: 12px; border: none; background: ${tab === 'orders' ? 'var(--primary)' : 'transparent'}; color: ${tab === 'orders' ? 'white' : '#475569'}; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;"><i class="fas fa-shopping-bag" style="width: 25px;"></i> Đơn hàng</button>
                <button onclick="showAdminPanel('users')" style="text-align: left; padding: 12px; border: none; background: ${tab === 'users' ? 'var(--primary)' : 'transparent'}; color: ${tab === 'users' ? 'white' : '#475569'}; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;"><i class="fas fa-users" style="width: 25px;"></i> Khách hàng</button>
                <button onclick="showAdminPanel('products')" style="text-align: left; padding: 12px; border: none; background: ${tab === 'products' ? 'var(--primary)' : 'transparent'}; color: ${tab === 'products' ? 'white' : '#475569'}; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;"><i class="fas fa-box" style="width: 25px;"></i> Sản phẩm</button>
                <button onclick="showAdminPanel('reviews')" style="text-align: left; padding: 12px; border: none; background: ${tab === 'reviews' ? 'var(--primary)' : 'transparent'}; color: ${tab === 'reviews' ? 'white' : '#475569'}; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s;"><i class="fas fa-star" style="width: 25px;"></i> Đánh giá</button>
            </div>
            
            <!-- Nội dung chính -->
            <div style="flex: 1; overflow-y: auto; padding-right: 15px;">
    `;

    // Tab 1: TỔNG QUAN
    if (tab === 'dashboard') {
        html += `
            <h2 style="margin-bottom: 20px; color: #1e293b;">BÁO CÁO THỐNG KÊ</h2>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
                <div style="background: #eff6ff; padding: 15px; border-radius: 12px; border: 1px solid #bfdbfe; text-align: center;">
                    <p style="margin:0; font-size: 12px; color: #1d4ed8; font-weight: bold;">DOANH THU</p>
                    <h3 style="margin: 5px 0 0 0; color: #1e40af; font-size: 18px;">${totalRevenue.toLocaleString()}đ</h3>
                </div>
                <div style="background: #fef3c7; padding: 15px; border-radius: 12px; border: 1px solid #fde047; text-align: center;">
                    <p style="margin:0; font-size: 12px; color: #b45309; font-weight: bold;">ĐANG GIAO</p>
                    <h3 style="margin: 5px 0 0 0; color: #92400e; font-size: 22px;">${pendingOrders}</h3>
                </div>
                <div style="background: #dcfce7; padding: 15px; border-radius: 12px; border: 1px solid #86efac; text-align: center;">
                    <p style="margin:0; font-size: 12px; color: #15803d; font-weight: bold;">THÀNH CÔNG</p>
                    <h3 style="margin: 5px 0 0 0; color: #166534; font-size: 22px;">${successOrders}</h3>
                </div>
                <div style="background: #fee2e2; padding: 15px; border-radius: 12px; border: 1px solid #fca5a5; text-align: center;">
                    <p style="margin:0; font-size: 12px; color: #b91c1c; font-weight: bold;">ĐÃ HỦY</p>
                    <h3 style="margin: 5px 0 0 0; color: #991b1b; font-size: 22px;">${canceledOrders}</h3>
                </div>
            </div>

            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.02); margin-bottom: 25px;">
                <h4 style="margin-bottom: 15px; color: #475569;"><i class="fas fa-bullhorn" style="color: #ea580c;"></i> PHÁT THÔNG BÁO TOÀN HỆ THỐNG</h4>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="admin-sys-notice" placeholder="Nhập nội dung thông báo chạy ngang trên đỉnh trang web (VD: Sale khủng 50%)..." value="${systemNotice}" style="flex: 1; padding: 10px 15px; border: 1px solid #fde68a; border-radius: 6px; outline: none; font-weight: bold; color: #d97706; background: #fffbeb;">
                    <button onclick="setSystemNotice()" style="background: #ea580c; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#c2410c'" onmouseout="this.style.background='#ea580c'"><i class="fas fa-broadcast-tower"></i> PHÁT SÓNG</button>
                    <button onclick="clearSystemNotice()" style="background: #94a3b8; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#64748b'" onmouseout="this.style.background='#94a3b8'"><i class="fas fa-eye-slash"></i> TẮT</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                    <h4 style="margin-bottom: 15px; color: #475569;">Biểu đồ doanh thu theo ngày</h4>
                    <div style="height: 250px; width: 100%;"><canvas id="adminRevenueChart"></canvas></div>
                </div>
                <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                    <h4 style="margin-bottom: 15px; color: #475569;"><i class="fas fa-crown" style="color: #fbbf24;"></i> TOP NẠP TIỀN</h4>
                    <div style="display: flex; flex-direction: column; gap: 10px; max-height: 250px; overflow-y: auto; padding-right: 5px;">
                        ${topDepositors.length > 0 ? topDepositors.map((u, i) => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <div style="width: 24px; height: 24px; border-radius: 50%; background: ${i === 0 ? '#fef08a' : (i === 1 ? '#e2e8f0' : (i === 2 ? '#ffedd5' : '#f1f5f9'))}; color: ${i === 0 ? '#b45309' : (i === 1 ? '#475569' : (i === 2 ? '#9a3412' : '#64748b'))}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">${i + 1}</div>
                                    <span style="font-weight: bold; font-size: 14px; color: #1e293b;">@${u.username}</span>
                                </div>
                                <span style="font-weight: 900; color: #10b981; font-size: 14px;">${u.total.toLocaleString()}đ</span>
                            </div>
                        `).join('') : '<p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 20px;">Chưa có dữ liệu nạp tiền.</p>'}
                    </div>
                </div>
            </div>
        `;
    } 
    // Tab 2: ĐƠN HÀNG
    else if (tab === 'orders') {
        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #1e293b;">QUẢN LÝ ĐƠN HÀNG</h2>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="search-orders" placeholder="Tìm mã đơn, tên khách..." onkeyup="filterAdminOrders()" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; outline: none; font-size: 13px; width: 220px;">
                        <button onclick="exportOrdersToCSV()" style="background: #10b981; color: white; border: none; padding: 8px 15px; border-radius: 6px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3); transition: 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'"><i class="fas fa-file-excel"></i> Xuất File</button>
                    </div>
                 </div>`;
        if (allOrders.length === 0) html += `<p>Chưa có đơn hàng nào.</p>`;
        allOrders.forEach(order => {
            const statusColor = order.status.includes('hủy') ? '#ef4444' : (order.status.includes('thành công') ? '#10b981' : '#f59e0b');
            html += `
            <div class="admin-order-card" style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 15px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="display:flex; justify-content:space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom:10px; margin-bottom: 10px;">
                    <div><b style="font-size: 16px;">Mã: <span style="color: var(--primary);">${order.id}</span></b></div>
                    <span style="color: ${statusColor}; font-weight: bold; background: ${statusColor}15; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${order.status}</span>
                </div>
                <div style="font-size: 13px; margin: 4px 0;"><b>Khách:</b> ${order.customer} <span style="color:#94a3b8">(@${order.username})</span> <span style="float:right; color:#64748b;"><i class="far fa-clock"></i> ${order.date || new Date(order.timestamp?.toDate()).toLocaleString('vi-VN')}</span></div>
                <div style="font-size: 13px; margin: 4px 0 12px 0;"><b>Giao đến:</b> ${order.address}</div>
                ${order.note ? `<div style="font-size: 13px; margin-bottom: 12px; color: #d97706; background: #fffbeb; padding: 8px; border-radius: 6px; border: 1px dashed #fde68a;"><b><i class="fas fa-comment-dots"></i> Ghi chú:</b> ${order.note}</div>` : ''}
                <div style="font-size: 12px; color: #475569; margin-bottom: 12px; background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #f1f5f9;">${order.items.map(item => `• ${item.name} <b style="color:var(--primary)">(x${item.quantity || 1})</b>`).join('<br>')}</div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-weight:900; color:#ef4444; font-size: 18px;">${order.total.toLocaleString()}đ</div>
                    <div style="display: flex; gap: 5px;">
                        <button onclick="updateOrderStatus('${order.id}', 'Đang giao hàng 🚚', '${order.userUid}')" style="padding: 6px 12px; font-size: 12px; cursor: pointer; border: 1px solid #f59e0b; background: white; color: #f59e0b; border-radius: 6px; font-weight: bold; transition: 0.2s;" onmouseover="this.style.background='#f59e0b'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#f59e0b'">Đang giao</button>
                        <button onclick="updateOrderStatus('${order.id}', 'Đã giao thành công ✅', '${order.userUid}')" style="padding: 6px 12px; font-size: 12px; cursor: pointer; border: 1px solid #10b981; background: white; color: #10b981; border-radius: 6px; font-weight: bold; transition: 0.2s;" onmouseover="this.style.background='#10b981'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#10b981'">Hoàn thành</button>
                        <button onclick="updateOrderStatus('${order.id}', 'Đã hủy ❌', '${order.userUid}')" style="padding: 6px 12px; font-size: 12px; cursor: pointer; border: 1px solid #ef4444; background: white; color: #ef4444; border-radius: 6px; font-weight: bold; transition: 0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#ef4444'">Hủy đơn</button>
                    </div>
                </div>
            </div>`;
        });
    }
    // Tab 3: KHÁCH HÀNG
    else if (tab === 'users') {
        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #1e293b;">QUẢN LÝ KHÁCH HÀNG</h2>
                    <input type="text" id="search-users" placeholder="Tìm tên khách hàng..." onkeyup="filterAdminUsers()" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; outline: none; font-size: 13px; width: 250px;">
                 </div>`;
        if (allUsers.length === 0) html += `<p>Chưa có khách hàng đăng ký.</p>`;
        html += `<div style="display: grid; gap: 12px;">`;
        allUsers.forEach(u => {
            const balance = u.userBalance || 0;
            const orderCount = u.purchaseHistory ? u.purchaseHistory.length : 0;
            
            const isBanned = u.isBanned === true;
            const banBtnHtml = u.displayName !== 'admin' ? `<button onclick="toggleBanUser('${u.uid}', '${u.displayName}')" style="background: ${isBanned ? '#10b981' : '#ef4444'}; color: white; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.2s;"><i class="fas ${isBanned ? 'fa-unlock' : 'fa-ban'}"></i> ${isBanned ? 'MỞ KHÓA' : 'KHÓA TK'}</button>` : '';
            const bannedTag = isBanned ? `<span style="background: #fee2e2; color: #ef4444; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 5px; font-weight: bold;">BỊ KHÓA</span>` : '';

            html += `
            <div class="admin-user-card" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid ${isBanned ? '#fca5a5' : '#e2e8f0'}; border-radius: 10px; background: ${isBanned ? '#fef2f2' : 'white'}; opacity: ${isBanned ? '0.85' : '1'};">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="width: 45px; height: 45px; background: linear-gradient(135deg, var(--primary), #b91c1c); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 20px; font-weight: bold; box-shadow: 0 4px 10px rgba(237,28,36,0.2); filter: ${isBanned ? 'grayscale(1)' : 'none'};">
                        ${(u.displayName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style="font-weight: bold; font-size: 16px; color: #1e293b;">@${u.displayName} ${bannedTag}</div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 2px;"><i class="fas fa-shopping-bag"></i> Đã đặt: ${orderCount} đơn</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 2px;">Số dư khả dụng</div>
                    <div style="font-weight: 900; color: #10b981; font-size: 16px;">${balance.toLocaleString()}đ</div>
                    <div style="display: flex; gap: 5px; justify-content: flex-end; margin-top: 6px;">
                        <button onclick="adminAdjustBalance('${u.uid}', '${u.displayName}')" style="background: #3b82f6; color: white; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'"><i class="fas fa-edit"></i> CỘNG / TRỪ</button>
                        ${banBtnHtml}
                    </div>
                </div>
            </div>`;
        });
        html += `</div>`;
    }
    // Tab 4: HƯỚNG DẪN QUẢN LÝ SẢN PHẨM
    else if (tab === 'products') {
        html += `
            <h2 style="margin-bottom: 20px; color: #1e293b;">QUẢN LÝ SẢN PHẨM</h2>
            
            <div style="background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                <h3 style="margin-bottom: 15px; color: var(--primary);"><i class="fas fa-plus-circle"></i> Thêm sản phẩm mới</h3>
                <form onsubmit="adminAddProduct(event)">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <input type="text" id="add-prod-name" placeholder="Tên sản phẩm" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                        <select id="add-prod-cat" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                            <option value="">Chọn danh mục...</option>
                            <option value="phone">Điện thoại</option>
                            <option value="laptop">Laptop</option>
                            <option value="pc">PC Gaming</option>
                            <option value="headphone">Tai nghe</option>
                            <option value="gear">Gaming Gear</option>
                            <option value="component">Linh kiện</option>
                        </select>
                        <input type="number" id="add-prod-price" placeholder="Giá bán (VNĐ)" required min="0" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                        <input type="text" id="add-prod-img" placeholder="Link ảnh (URL)" required style="padding: 10px; border: 1px solid #ddd; border-radius: 6px;">
                    </div>
                    <textarea id="add-prod-desc" placeholder="Mô tả sản phẩm" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 15px; height: 80px;"></textarea>
                    <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <label style="flex: 1; cursor: pointer; font-weight: bold; color: #d97706; background: #fffbeb; padding: 10px; border-radius: 6px; border: 1px solid #fde68a;"><input type="checkbox" id="add-prod-flash"> Thêm vào Flash Sale</label>
                        <label style="flex: 1; cursor: pointer; font-weight: bold; color: #1d4ed8; background: #eff6ff; padding: 10px; border-radius: 6px; border: 1px solid #bfdbfe;"><input type="checkbox" id="add-prod-bestseller"> Đánh dấu Bán chạy</label>
                    </div>
                    <button type="submit" style="padding: 10px 20px; background: var(--success); color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s;"><i class="fas fa-save"></i> THÊM SẢN PHẨM</button>
                </form>
            </div>

            <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 25px; border-radius: 12px; color: #92400e; line-height: 1.8;">
                <h3 style="margin-bottom: 10px; color: #b45309;"><i class="fas fa-lightbulb"></i> Tính năng quản lý trực quan</h3>
                <p>TechStore được thiết kế cho phép Admin thao tác trực tiếp trên giao diện trang chủ để có cái nhìn thực tế nhất về sản phẩm (What you see is what you get).</p>
                <p style="margin-top: 10px;">Vui lòng đóng bảng Admin này và cuộn ra trang chủ. Dưới mỗi sản phẩm (nếu đang ở quyền Admin) sẽ xuất hiện 2 công cụ:</p>
                <ul style="margin-left: 20px; margin-top: 10px;">
                    <li style="margin-bottom: 5px;"><b style="color: #ea580c;">SỬA:</b> Cho phép bạn thay đổi toàn bộ thông tin (Tên, Ảnh, Giá, Mô tả) hoặc thiết lập Flash Sale.</li>
                    <li><b style="color: #ea580c;">XÓA:</b> Gỡ bỏ vĩnh viễn sản phẩm khỏi hệ thống cửa hàng.</li>
                </ul>
                <button onclick="toggleModal('detail-modal')" style="margin-top: 20px; padding: 12px 25px; background: #ea580c; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#c2410c'" onmouseout="this.style.background='#ea580c'">ĐÓNG BẢNG ADMIN</button>
            </div>`;
    }
    // Tab 5: QUẢN LÝ ĐÁNH GIÁ (DÀNH CHO ADMIN)
    else if (tab === 'reviews') {
        const sortSelect = document.getElementById('admin-review-sort');
        const currentSort = sortSelect ? sortSelect.value : 'newest';

        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #1e293b;">QUẢN LÝ ĐÁNH GIÁ</h2>
                    <select id="admin-review-sort" onchange="showAdminPanel('reviews')" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; outline: none; font-size: 13px; cursor: pointer; font-weight: bold; background: #f8fafc; color: #475569;">
                        <option value="newest" ${currentSort === 'newest' ? 'selected' : ''}>Mặc định (Mới nhất)</option>
                        <option value="lowest" ${currentSort === 'lowest' ? 'selected' : ''}>Số sao: Thấp đến Cao (Ưu tiên)</option>
                        <option value="highest" ${currentSort === 'highest' ? 'selected' : ''}>Số sao: Cao đến Thấp</option>
                    </select>
                 </div>`;
        let allReviews = [];
        products.forEach(p => {
            if (p.reviews && p.reviews.length > 0) {
                p.reviews.forEach((r, idx) => {
                    allReviews.push({ ...r, productId: p.id, productName: p.name, reviewIndex: idx });
                });
            }
        });

        if (currentSort === 'lowest') {
            allReviews.sort((a, b) => a.rating - b.rating);
        } else if (currentSort === 'highest') {
            allReviews.sort((a, b) => b.rating - a.rating);
        }

        if (allReviews.length === 0) {
            html += `<p>Chưa có đánh giá nào từ khách hàng trên hệ thống.</p>`;
        } else {
            html += `<div style="display: grid; gap: 12px;">`;
            allReviews.forEach(rev => {
                const ratingBadge = `<span style="background: #fef08a; color: #b45309; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px; margin-right: 8px;">${rev.rating} <i class="fas fa-star"></i></span>`;
                const stars = ratingBadge + '<i class="fas fa-star" style="color:#fbbf24; font-size: 11px;"></i>'.repeat(rev.rating) + '<i class="far fa-star" style="color:#fbbf24; font-size: 11px;"></i>'.repeat(5 - rev.rating);
                const adminReplyHtml = rev.adminReply ? `<div style="margin-top: 8px; padding: 8px 12px; background: #eff6ff; border-left: 3px solid #3b82f6; font-size: 13px; color: #1e40af; border-radius: 4px;"><b><i class="fas fa-headset"></i> Admin phản hồi:</b> ${rev.adminReply}</div>` : '';
                html += `
                <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-start; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <div style="flex: 1; padding-right: 15px;">
                        <div style="font-size: 12px; color: var(--primary); font-weight: bold; margin-bottom: 5px;">Sản phẩm: ${rev.productName}</div>
                        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 5px;">
                            <span style="font-weight: bold; color: #1e293b;"><i class="fas fa-user-circle"></i> @${rev.username}</span>
                            <span style="font-size: 12px; color: #94a3b8;">${rev.date}</span>
                        </div>
                        <div style="margin-bottom: 5px;">${stars}</div>
                        <p style="font-size: 14px; color: #475569; margin: 0;">"${rev.comment}"</p>
                        ${adminReplyHtml}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <button onclick="adminReplyReview(${rev.productId}, ${rev.reviewIndex})" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; transition: 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'"><i class="fas fa-reply"></i> Phản hồi</button>
                        <button onclick="adminDeleteReview(${rev.productId}, ${rev.reviewIndex})" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; transition: 0.2s;" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#ef4444'"><i class="fas fa-trash"></i> Xóa</button>
                    </div>
                </div>`;
            });
            html += `</div>`;
        }
    }

    html += `</div></div>`; // Đóng flex container
    content.innerHTML = html;
    document.getElementById('detail-modal').style.display = 'block';

    // Kích hoạt vẽ biểu đồ cho Tab Dashboard
    if (tab === 'dashboard') {
        setTimeout(() => {
            const ctx = document.getElementById('adminRevenueChart');
            if (ctx && typeof Chart !== 'undefined') {
                // Tạo hiệu ứng màu Gradient cho biểu đồ thêm phần hiện đại
                const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(237, 28, 36, 0.5)'); // Đỏ nhạt
                gradient.addColorStop(1, 'rgba(237, 28, 36, 0.0)'); // Trong suốt

                new Chart(ctx, {
                    type: 'line', // Đổi thành biểu đồ đường (Line chart)
                    data: {
                        labels: chartLabels,
                        datasets: [{ 
                            label: 'Doanh thu', 
                            data: chartData, 
                            borderColor: '#ed1c24', 
                            backgroundColor: gradient, 
                            borderWidth: 3,
                            pointBackgroundColor: '#ffffff',
                            pointBorderColor: '#ed1c24',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            fill: true,
                            tension: 0.4 // Làm đường biểu đồ uốn lượn mềm mại
                        }]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false }, // Hiển thị tooltip khi trỏ chuột dọc theo trục
                        plugins: { 
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function(context) { return ' ' + context.parsed.y.toLocaleString() + 'đ'; }
                                }
                            }
                        },
                        scales: { 
                            x: { grid: { display: false } },
                            y: { 
                                beginAtZero: true, 
                                border: { dash: [5, 5] },
                                grid: { color: '#e2e8f0' },
                                ticks: { 
                                    maxTicksLimit: 6,
                                    callback: function(value) { 
                                        if (value >= 1000000) return (value / 1000000) + ' Tr';
                                        return value.toLocaleString() + 'đ'; 
                                    } 
                                } 
                            } 
                        }
                    }
                });
            }
        }, 100);
    }
}

function adminDeleteReview(productId, reviewIndex) {
    if (confirm("⚠️ Bạn có chắc chắn muốn xóa bình luận này không?")) {
        const product = products.find(p => p.id === productId);
        if (product && product.reviews) {
            product.reviews.splice(reviewIndex, 1);
            syncProducts();
            showToast("🗑️ Đã xóa bình luận thành công!");
            showAdminPanel('reviews'); // Load lại tab Đánh giá
            handleFilterAndSort(); // Làm mới lại số sao ở trang chủ
        }
    }
}

function adminReplyReview(productId, reviewIndex) {
    if (!isAdmin) return;

    const product = products.find(p => p.id === productId);
    if (product && product.reviews) {
        const review = product.reviews[reviewIndex];

        if (review) {
            const existingReply = review.adminReply || '';
            const replyText = prompt(`Nhập nội dung phản hồi cho bình luận của @${review.username} (Để trống nếu muốn xóa phản hồi):`, existingReply);

            if (replyText !== null) { 
                const trimmedReply = replyText.trim();
                if (trimmedReply === '') {
                    delete review.adminReply;
                    showToast("🗑️ Đã xóa phản hồi!", "info");
                } else {
                    review.adminReply = trimmedReply;
                    showToast("✅ Đã gửi phản hồi thành công!");
                }
                
                syncProducts(); // Lưu cập nhật vào bộ nhớ máy

                // Cập nhật lại UI
                const detailModal = document.getElementById('detail-modal');
                if (detailModal && detailModal.style.display === 'block' && document.getElementById('detail-content').innerHTML.includes('ADMIN PANEL')) {
                    showAdminPanel('reviews');
                } else if (document.getElementById('product-detail-view') && document.getElementById('product-detail-view').style.display === 'block') {
                    showProductDetail(productId); 
                }
            }
        }
    }
}

async function adminAdjustBalance(userUid, username) {
    if (!isAdmin) return;
    const amountStr = prompt(`Nhập số tiền muốn CỘNG/TRỪ cho @${username}\n(VD: 50000 để cộng, -50000 để trừ):`, "0");
    if (amountStr === null || amountStr.trim() === '') return;
    
    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount === 0) {
        showToast("❌ Số tiền không hợp lệ!", "error");
        return;
    }

    const userRef = db.collection('users').doc(userUid);
    try {
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw "Không tìm thấy người dùng!";
            }
            const userData = userDoc.data();
            let newBalance = (userData.userBalance || 0) + amount;
            if (newBalance < 0) newBalance = 0; // Prevent negative balance

            const newBalanceEntry = { date: new Date().toLocaleString('vi-VN'), type: amount > 0 ? 'Được Admin cấp' : 'Admin trừ tiền', amount: amount, description: 'Xử lý bởi hệ thống Admin' };
            const newBalanceHistory = [newBalanceEntry, ...(userData.balanceHistory || [])];

            transaction.update(userRef, {
                userBalance: newBalance,
                balanceHistory: newBalanceHistory
            });
        });

        // Update local state if it's the current user
        if (isLoggedIn && currentUser && currentUser.uid === userUid) {
            userBalance += amount;
            if (userBalance < 0) userBalance = 0;
            balanceHistory.unshift({ date: new Date().toLocaleString('vi-VN'), type: amount > 0 ? 'Được Admin cấp' : 'Admin trừ tiền', amount: amount, description: 'Xử lý bởi hệ thống Admin' });
            updateAuthUI();
        }

        showToast(`✅ Đã ${amount > 0 ? 'CỘNG' : 'TRỪ'} ${Math.abs(amount).toLocaleString()}đ cho tài khoản @${username}!`);
        await loadAdminData(); // Reload admin data to get the latest user info
        showAdminPanel('users');

    } catch (error) {
        console.error("Lỗi khi thay đổi số dư:", error);
        showToast("❌ Có lỗi xảy ra!", "error");
    }
}

async function toggleBanUser(userUid, username) {
    if (!isAdmin || !userUid || username === 'admin') return;

    const userRef = db.collection('users').doc(userUid);
    try {
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw "Không tìm thấy người dùng!";
        }
        const isCurrentlyBanned = userDoc.data().isBanned === true;
        const actionName = isCurrentlyBanned ? 'MỞ KHÓA' : 'KHÓA';

        if (confirm(`⚠️ Bạn có chắc chắn muốn ${actionName} tài khoản @${username} không?`)) {
            await userRef.update({ isBanned: !isCurrentlyBanned });
            showToast(`✅ Đã ${actionName} tài khoản @${username} thành công!`, isCurrentlyBanned ? 'success' : 'info');
            await loadAdminData(); // Reload admin data
            showAdminPanel('users');
        }
    } catch (error) {
        console.error("Lỗi khi khóa/mở khóa người dùng:", error);
        showToast("❌ Có lỗi xảy ra!", "error");
    }
}

function filterProduct(type) {
    if (typeof goBackHome === 'function') goBackHome();
    currentCategory = type;
    handleFilterAndSort();
}

function searchProducts() {
    // Khi người dùng gõ vào ô tìm kiếm, chúng ta chỉ cần gọi lại hàm lọc tổng thể.
    handleFilterAndSort();
}

function handleFilterAndSort() {
    let filtered = [...products].filter(p => p && typeof p === 'object'); // Đảm bảo dữ liệu chuẩn
    
    // 1. Lọc theo Danh mục (Category)
    if (currentCategory !== 'all') filtered = filtered.filter(p => p.category === currentCategory);
    
    // 2. Lọc theo Ô tìm kiếm (Search Input)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filtered = filtered.filter(p => 
                (p.name || '').toLowerCase().includes(searchTerm) ||
                (p.desc || '').toLowerCase().includes(searchTerm)
            );
        }
    }

    // 3. Lọc theo Hãng (Dropdown)
    const brandObj = document.getElementById('sort-brand');
    if (brandObj && brandObj.value !== 'all') {
        const brand = brandObj.value.toLowerCase();
        filtered = filtered.filter(p => {
            const name = (p.name || '').toLowerCase();
            if (brand === 'apple') return name.includes('iphone') || name.includes('macbook') || name.includes('airpods') || name.includes('ipad') || name.includes('apple');
            return name.includes(brand);
        });
    }

    // 4. Lọc theo Khoảng giá (Dropdown)
    const priceRangeObj = document.getElementById('sort-price');
    if (priceRangeObj) {
        const priceRange = priceRangeObj.value;
        if (priceRange === 'under-10') filtered = filtered.filter(p => (p.price || 0) < 10000000);
        else if (priceRange === '10-25') filtered = filtered.filter(p => (p.price || 0) >= 10000000 && (p.price || 0) <= 25000000);
        else if (priceRange === 'above-25') filtered = filtered.filter(p => (p.price || 0) > 25000000);
    }
    
    // 5. Sắp xếp (Dropdown)
    const orderObj = document.getElementById('order-price');
    if (orderObj) {
        const order = orderObj.value;
        if (order === 'asc') filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        else if (order === 'desc') filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    updateProductDisplay(filtered);
}

async function updateOrderStatus(orderId, newStatus, userUid) {
    if (!orderId || !userUid) return;
    const orderRef = db.collection('orders').doc(String(orderId));
    const userRef = db.collection('users').doc(userUid);

    try {
        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) {
            showToast("❌ Không tìm thấy đơn hàng!", "error");
            return;
        }
        const orderData = orderDoc.data();
        const isCanceling = newStatus.includes('hủy') && !orderData.status.includes('hủy');

        const batch = db.batch();
        batch.set(orderRef, { status: newStatus }, { merge: true });

        const userDoc = await userRef.get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            const purchaseHistory = (userData.purchaseHistory || []).map(p => String(p.id) === String(orderId) ? { ...p, status: newStatus } : p);
            
            if (isCanceling) {
                const newBalance = (userData.userBalance || 0) + orderData.total;
                const newBalanceEntry = { date: new Date().toLocaleString('vi-VN'), type: 'Hoàn tiền', amount: orderData.total, description: `Hủy đơn hàng ${orderId} bởi Admin` };
                const newBalanceHistory = [newBalanceEntry, ...(userData.balanceHistory || [])];
                batch.update(userRef, { purchaseHistory, userBalance: newBalance, balanceHistory: newBalanceHistory });
            } else {
                batch.update(userRef, { purchaseHistory });
            }
        }
        
        await batch.commit();
        
        // Update local state for immediate UI feedback
        const localOrder = allOrders.find(o => String(o.id) === String(orderId));
        if (localOrder) localOrder.status = newStatus;
        
        showToast("✅ Cập nhật trạng thái thành công!");
        // Tải lại dữ liệu admin để đảm bảo nhất quán
        await loadAdminData();
        showAdminPanel('orders');
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        showToast("❌ Có lỗi xảy ra!", "error");
    }
}

function exportOrdersToCSV() {
    if (allOrders.length === 0) {
        showToast("⚠️ Không có đơn hàng nào để xuất!", "error");
        return;
    }

    // Tạo tiêu đề (Header) cho file CSV
    let csvContent = "Mã Đơn Hàng,Ngày Đặt,Khách Hàng,Tài Khoản,Địa Chỉ,Ghi Chú,Tổng Tiền,Trạng Thái,Chi Tiết Sản Phẩm\n";

    allOrders.forEach(order => {
        const itemsList = order.items.map(item => `${item.name} (x${item.quantity || 1})`).join('; ');
        const escapeCSV = (text) => `"${String(text).replace(/"/g, '""')}"`; // Xử lý các dấu nháy kép để không bị vỡ cột

        const row = [
            escapeCSV(order.id), // Mã đơn hàng
            escapeCSV(order.date),
            escapeCSV(order.customer),
            escapeCSV(order.username),
            escapeCSV(order.address),
            escapeCSV(order.note || ''),
            escapeCSV(order.total),
            escapeCSV(order.status.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim()), // Bỏ các emoji để CSV chuyên nghiệp hơn
            escapeCSV(itemsList)
        ];
        csvContent += row.join(",") + "\n";
    });

    // Thêm BOM (\uFEFF) để phần mềm Excel đọc chuẩn Tiếng Việt UTF-8
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); 
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Danh_Sach_Don_Hang_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✅ Đã tải xuống file Excel thành công!");
}

async function setSystemNotice() {
    if (!isAdmin) return;
    const text = document.getElementById('admin-sys-notice').value.trim();
    if (text === '') {
        showToast("⚠️ Vui lòng nhập nội dung thông báo!", "error");
        return;
    }
    try {
        await db.collection('settings').doc('general').set({ systemNotice: text }, { merge: true });
        systemNotice = text;
        if (typeof renderSystemNotice === 'function') renderSystemNotice();
        showToast("✅ Đã phát thông báo toàn hệ thống!");
    } catch (error) {
        console.error("Lỗi khi đặt thông báo:", error);
        showToast("❌ Có lỗi xảy ra!", "error");
    }
}

async function clearSystemNotice() {
    if (!isAdmin) return;
    try {
        await db.collection('settings').doc('general').update({ systemNotice: '' });
        systemNotice = '';
        document.getElementById('admin-sys-notice').value = '';
        if (typeof renderSystemNotice === 'function') renderSystemNotice();
        showToast("🗑️ Đã tắt thông báo hệ thống!", "info");
    } catch (error) {
        console.error("Lỗi khi xóa thông báo:", error);
        showToast("❌ Có lỗi xảy ra!", "error");
    }
}

function filterAdminOrders() {
    const term = document.getElementById("search-orders").value.toLowerCase();
    document.querySelectorAll(".admin-order-card").forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(term) ? "block" : "none";
    });
}

function filterAdminUsers() {
    const term = document.getElementById("search-users").value.toLowerCase();
    document.querySelectorAll(".admin-user-card").forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(term) ? "flex" : "none";
    });
}

// --- 5. VÍ TIỀN ---
function depositMoney(amount) { userBalance += amount; balanceHistory.unshift({ date: new Date().toLocaleString('vi-VN'), type: 'Nạp tiền', amount: amount, description: 'Nạp qua hệ thống QR' }); saveData(); updateAuthUI(); showToast(`✅ NẠP THÀNH CÔNG ${amount.toLocaleString()}đ!`); }

function showBalanceHistory() {
    if (!isLoggedIn) { showToast("⚠️ VUI LÒNG ĐĂNG NHẬP!", "error"); return; }
    const content = document.getElementById('detail-content');
    let historyHTML = `<div style="padding: 20px;"><h2 style="text-align:center; margin-bottom: 20px;">VÍ CỦA TÔI</h2><div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 25px;"><p style="margin:0; font-size: 14px; opacity: 0.9;">Số dư khả dụng</p><h1 style="margin: 10px 0; font-size: 40px;">${userBalance.toLocaleString()}đ</h1><button onclick="openDepositModal()" style="margin-top:10px; padding: 10px 25px; border-radius: 25px; border:none; background: white; color: #059669; font-weight: bold; cursor:pointer;">+ NẠP TIỀN</button></div><div style="max-height: 300px; overflow-y: auto; background: #f8fafc; border-radius: 10px; padding: 10px;">`;
    if (balanceHistory.length === 0) { historyHTML += `<p style="text-align:center; color:#94a3b8; padding: 30px;">Chưa có giao dịch.</p>`; } 
    else { balanceHistory.forEach(item => { const isNeg = item.amount < 0; historyHTML += `<div style="display:flex; justify-content:space-between; align-items:center; padding: 15px; border-bottom: 1px solid #e2e8f0;"><div><div style="font-weight: bold;">${item.type}</div><div style="font-size: 12px; color: #64748b;">${item.date}</div></div><div style="font-weight: bold; color: ${isNeg ? '#ef4444' : '#10b981'};">${isNeg ? '' : '+'}${item.amount.toLocaleString()}đ</div></div>`; }); }
    historyHTML += `</div></div>`; content.innerHTML = historyHTML; 
    document.getElementById('detail-modal').style.display = 'block'; // Ép buộc luôn mở
}

function openDepositModal() {
    const content = document.getElementById('detail-content');
    content.innerHTML = `<div style="text-align:center; padding: 30px;"><i class="fas fa-university" style="font-size: 50px; color: #3b82f6; margin-bottom: 15px;"></i><h2 style="color: #1e293b;">NẠP TIỀN VÀO TÀI KHOẢN</h2><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0;"><button class="btn-auth" onclick="depositMoney(500000); showBalanceHistory()">500.000đ</button><button class="btn-auth" onclick="depositMoney(1000000); showBalanceHistory()">1.000.000đ</button><button class="btn-auth" onclick="depositMoney(5000000); showBalanceHistory()">5.000.000đ</button><button class="btn-auth" onclick="depositMoney(10000000); showBalanceHistory()">10.000.000đ</button></div><p style="font-size: 12px; color: #ef4444;">* Trải nghiệm giả lập không mất tiền thật.</p></div>`;
}

// --- 6. GIỎ HÀNG ---
function addToCart(id) {
    if (!isLoggedIn) { showToast("⚠️ VUI LÒNG ĐĂNG NHẬP!", "error"); return; }

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        const product = products.find(p => p.id === id);
        if (product) {
            cart.push({ ...product, quantity: 1 });
        }
    }

    updateCartUI(); saveData(); 
    showToast("✅ ĐÃ THÊM VÀO GIỎ HÀNG!");
    
    // Kích hoạt hiệu ứng rung lắc giỏ hàng
    const cartIcon = document.getElementById('cart-btn');
    if (cartIcon) {
        cartIcon.classList.remove('shake-animation'); // Xóa class cũ đi (nếu có)
        void cartIcon.offsetWidth; // Ép trình duyệt vẽ lại (reflow) để animation chạy lại ngay lập tức
        cartIcon.classList.add('shake-animation'); // Thêm lại class để kích hoạt
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if(cartCount) cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    const list = document.getElementById('cart-items-list');
    const totalElem = document.getElementById('cart-total');
    if(!list || !totalElem) return;
    if (cart.length === 0) { list.innerHTML = '<p style="text-align: center; padding: 20px; color: #94a3b8;">Giỏ hàng trống...</p>'; totalElem.innerText = '0đ'; return; }
    let total = 0;
    list.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
            <img src="${item.img ? item.img.trim() : ''}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 8px;" onerror="this.src='https://placehold.co/400x400?text=IMG'">
            <div style="flex: 1;">
                <h4 style="font-size: 14px; margin: 0; color: #1e293b;">${item.name}</h4>
                <p style="color: #ef4444; font-weight: bold; margin: 4px 0 0 0;">${item.price.toLocaleString()}đ</p>
            </div>
            <div style="display: flex; align-items: center; gap: 5px; border: 1px solid #e2e8f0; border-radius: 6px;">
                <button onclick="updateCartQuantity(${item.id}, -1)" style="border: none; background: none; cursor: pointer; padding: 8px; font-size: 14px; color: #333; width: 30px;">-</button>
                <span style="font-weight: bold; font-size: 14px; min-width: 20px; text-align: center;">${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, 1)" style="border: none; background: none; cursor: pointer; padding: 8px; font-size: 14px; color: #333; width: 30px;">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})" style="border: none; background: none; color: #ef4444; cursor: pointer; padding: 10px; font-size: 18px;"><i class="fas fa-trash-alt"></i></button>
        </div>`;
    }).join('');
    totalElem.innerText = total.toLocaleString() + 'đ';
}

function updateCartQuantity(id, change) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
            saveData();
        }
    }
}

function removeFromCart(id) { 
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        updateCartUI();
        saveData();
        showToast("🗑️ ĐÃ XÓA KHỎI GIỎ HÀNG!", "info");
    }
}

// --- 7. THANH TOÁN (MÃ GIẢM GIÁ & TRẢ GÓP) ---
function toggleInstallment(show) {
    const box = document.getElementById('installment-box');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

async function openCheckout() {
    if (!isLoggedIn) { showToast("⚠️ VUI LÒNG ĐĂNG NHẬP!", "error"); toggleModal('cart-modal'); return; }
    if (cart.length === 0) { showToast("⚠️ GIỎ HÀNG ĐANG TRỐNG!", "error"); return; }
    toggleModal('cart-modal');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    discountAmount = 0; 
    const content = document.getElementById('detail-content');
    content.innerHTML = `
        <div style="padding: 20px;">
            <h2 style="text-align:center; color: #ed1c24; margin-bottom: 20px;">XÁC NHẬN GIAO HÀNG</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <input type="text" id="ship-name" placeholder="Họ tên người nhận" value="${currentUser.displayName || ''}" style="width:100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom:10px;">
                    <textarea id="ship-address" placeholder="Địa chỉ chi tiết..." style="width:100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; height: 80px;"></textarea>
                    <textarea id="order-note" placeholder="Ghi chú (VD: Giao giờ hành chính, bọc chống sốc...)" style="width:100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; height: 60px; margin-top: 10px;"></textarea>
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
    document.getElementById('detail-modal').style.display = 'block';
}

function applyCoupon(total) {
    const code = document.getElementById('coupon-input').value.trim().toUpperCase();
    const display = document.getElementById('display-discount');
    const finalElem = document.getElementById('final-total');

    if (code === "TECHSTORE2026") {
        discountAmount = total * 0.1;
        showToast("✅ ÁP DỤNG MÃ GIẢM 10% THÀNH CÔNG!");
        display.style.display = "block"; display.innerHTML = `Giảm giá: <b>-${discountAmount.toLocaleString()}đ</b>`;
    } else {
        discountAmount = 0; // Phải đặt lại về 0 nếu người dùng nhập sai mã
        showToast("❌ MÃ GIẢM GIÁ KHÔNG HỢP LỆ!", "error");
        display.style.display = "none";
    }
    const newTotal = total - discountAmount;
    finalElem.innerText = newTotal.toLocaleString() + "đ";
    if(document.getElementById('installment-box').style.display === 'block') updateInstallmentTable(newTotal);
}

async function confirmFinal() {
    const name = document.getElementById('ship-name').value;
    const address = document.getElementById('ship-address').value;
    const note = document.getElementById('order-note').value.trim();
    const payMethod = document.querySelector('input[name="pay-method"]:checked').value;
    if (!name || !address) { showToast("⚠️ THIẾU THÔNG TIN NHẬN HÀNG!", "error"); return; }
    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalToPay = subTotal - discountAmount;

    // FIX: Tách logic tính toán số tiền cần trừ để xử lý cho cả trả góp và trả thẳng
    let amountToDeduct = totalToPay;
    let paymentType = 'Mua hàng';
    let paymentDescription = `Thanh toán đơn hàng`;

    if (payMethod === 'full') {
        if (userBalance < totalToPay) { showToast("❌ SỐ DƯ VÍ KHÔNG ĐỦ!", "error"); return; }
    } else {
        const months = document.getElementById('installment-month').value;
        const firstMonth = Math.round(totalToPay / months);
        if (userBalance < firstMonth) { showToast("❌ KHÔNG ĐỦ TIỀN ĐÓNG KỲ ĐẦU!", "error"); return; }
        amountToDeduct = firstMonth;
        paymentType = `Trả góp (Kỳ 1/${months})`;
        paymentDescription = `Thanh toán kỳ đầu đơn hàng`;
    }
    userBalance -= amountToDeduct; // Trừ tiền khỏi số dư local

    // TẠO MỘT BẢN SAO "SẠCH" CỦA GIỎ HÀNG ĐỂ LƯU VÀO FIRESTORE
    // Điều này tránh lỗi "Unsupported field value: undefined" khi một sản phẩm trong giỏ có các trường không xác định (ví dụ: oldPrice, isFlashSale).
    // Chúng ta chỉ lưu những thông tin cần thiết cho một đơn hàng.
    const cleanCartForOrder = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        img: item.img,
        quantity: item.quantity
    }));

    const orderDataForCollections = {
        date: new Date().toLocaleString('vi-VN'),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        customer: name,
        username: currentUser.displayName,
        userUid: currentUser.uid,
        address: address,
        note: note,
        items: cleanCartForOrder, // Sử dụng giỏ hàng đã được làm sạch
        total: totalToPay,
        status: "Đang xử lý ⏳"
    };

    try {
        const batch = db.batch();
        const orderRef = db.collection('orders').doc();
        batch.set(orderRef, orderDataForCollections);
        const orderId = orderRef.id;

        const userRef = db.collection('users').doc(currentUser.uid);
        // FIX: Ghi nhận lịch sử giao dịch với số tiền và mô tả chính xác
        const newBalanceEntry = { date: new Date().toLocaleString('vi-VN'), type: paymentType, amount: -amountToDeduct, description: `${paymentDescription} ${orderId}` };
        
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        
        const newBalanceHistory = [newBalanceEntry, ...(userData.balanceHistory || [])];

        // FIX: Không lưu serverTimestamp vào mảng purchaseHistory
        // Firestore không cho phép FieldValue.serverTimestamp() bên trong một mảng.
        // Chúng ta tạo một bản sao của đơn hàng và loại bỏ trường 'timestamp' trước khi lưu.
        const { timestamp, ...orderForHistory } = orderDataForCollections;
        const newPurchaseHistory = [{ ...orderForHistory, id: orderId }, ...(userData.purchaseHistory || [])];

        batch.update(userRef, {
            userBalance: userBalance, // Sử dụng số dư đã trừ ở local
            balanceHistory: newBalanceHistory,
            purchaseHistory: newPurchaseHistory
        });

        await batch.commit();

        // Cập nhật state local
        balanceHistory = newBalanceHistory;
        purchaseHistory = newPurchaseHistory;
        if (isAdmin) { allOrders.unshift({ ...orderDataForCollections, id: orderId }); }
        cart.length = 0;
        updateAuthUI();
        updateCartUI();

    const content = document.getElementById('detail-content');
        content.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
            <div style="width: 80px; height: 80px; background: #10b981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; margin: 0 auto 20px auto; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <i class="fas fa-check"></i>
            </div>
            <h2 style="color: #10b981; margin-bottom: 10px; font-size: 28px;">ĐẶT HÀNG THÀNH CÔNG!</h2>
            <p style="color: #64748b; font-size: 16px; margin-bottom: 5px;">Cảm ơn bạn đã tin tưởng và mua sắm tại TechStore.</p>
            <p style="color: #1e293b; font-weight: bold; font-size: 18px; margin-bottom: 30px;">Mã đơn hàng của bạn: <span style="color: #ed1c24;">${orderId}</span></p>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="toggleModal('detail-modal')" style="padding: 12px 25px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; color: #1e293b; font-weight: bold; cursor: pointer; transition: 0.2s;">TIẾP TỤC MUA SẮM</button>
                <button onclick="showHistory()" style="padding: 12px 25px; border-radius: 8px; border: none; background: #ed1c24; color: white; font-weight: bold; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(237, 28, 36, 0.3);">XEM ĐƠN HÀNG</button>
            </div>
        </div>
        <style>
            @keyframes scaleIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        </style>
    `;
        if (typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }

    } catch (error) {
        console.error("Lỗi nghiêm trọng khi đặt hàng:", error);
        showToast("❌ Đã có lỗi xảy ra, không thể đặt hàng!", "error");
        // FIX: Hoàn lại đúng số tiền đã trừ nếu giao dịch lỗi
        userBalance += amountToDeduct;
        updateAuthUI();
    }

}

// --- 8. TIỆN ÍCH KHÁC ---
function showHistory() {
    if (!isLoggedIn) { showToast("⚠️ VUI LÒNG ĐĂNG NHẬP!", "error"); return; }
    const content = document.getElementById('detail-content');
    if (purchaseHistory.length === 0) { content.innerHTML = `<div style="text-align:center; padding:40px;"><p>Bạn chưa có đơn hàng nào.</p></div>`; } 
    else {
        let historyHTML = `<h2 style="text-align:center; margin-bottom:20px;">LỊCH SỬ MUA HÀNG</h2>`;
        purchaseHistory.forEach((order) => { 
            const isCanceled = order.status.includes('hủy');
            const statusColor = isCanceled ? '#ef4444' : '#059669';
            
            // Nút hủy đơn hàng (chỉ hiển thị nếu đơn hàng chưa bị hủy)
            const cancelButton = !isCanceled ? `<button onclick="cancelOrder('${order.id}')" style="padding: 6px 12px; border-radius: 4px; border: 1px solid #ef4444; background: white; color: #ef4444; cursor: pointer; font-weight: bold; font-size: 12px; transition: 0.2s;" onmouseover="this.style.background='#ef4444'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#ef4444'">HỦY ĐƠN</button>` : '';
            
            historyHTML += `<div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; margin-bottom: 15px; background: #f8fafc;">
                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #ddd; padding-bottom:5px;"><b>Mã: ${order.id}</b><span style="color: ${statusColor}; font-weight: bold;">${order.status}</span></div>
                <div style="font-size: 13px; margin: 5px 0;"><b>Giao đến:</b> ${order.address}</div>
                ${order.note ? `<div style="font-size: 12px; margin-bottom: 8px; color: #d97706;"><b>Ghi chú:</b> ${order.note}</div>` : ''}
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">${order.items.map(item => `• ${item.name} (x${item.quantity || 1})`).join('<br>')}</div>
                <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                    <div style="font-weight:bold; color:red; margin-top: 5px;">Tổng: ${order.total.toLocaleString()}đ</div>
                    ${cancelButton}
                </div>
            </div>`; 
        });
        content.innerHTML = historyHTML;
    }
    document.getElementById('detail-modal').style.display = 'block';
}

async function cancelOrder(orderId) {
    if (!isLoggedIn || !currentUser) { showToast("⚠️ Vui lòng đăng nhập lại!", "error"); return; }
    if (!confirm("⚠️ Bạn có chắc chắn muốn hủy đơn hàng này? Tiền sẽ được hoàn lại vào ví.")) return;

    const order = purchaseHistory.find(o => String(o.id) === String(orderId));
    if (order && !order.status.includes('hủy')) {
        const newStatus = "Đã hủy ❌";
        const userRef = db.collection('users').doc(currentUser.uid);
        const orderRef = db.collection('orders').doc(String(orderId));

        try {
            const batch = db.batch();
            batch.set(orderRef, { status: newStatus }, { merge: true });

            const userDoc = await userRef.get();
            const userData = userDoc.data();
            
            const newPurchaseHistory = (userData.purchaseHistory || []).map(p => String(p.id) === String(orderId) ? { ...p, status: newStatus } : p);
            const newBalance = (userData.userBalance || 0) + order.total;
            const newBalanceEntry = { date: new Date().toLocaleString('vi-VN'), type: 'Hoàn tiền', amount: order.total, description: `Hủy đơn hàng ${orderId}` };
            const newBalanceHistory = [newBalanceEntry, ...(userData.balanceHistory || [])];

            batch.update(userRef, {
                purchaseHistory: newPurchaseHistory,
                userBalance: newBalance,
                balanceHistory: newBalanceHistory
            });

            await batch.commit();

            // Update local state
            userBalance = newBalance;
            balanceHistory = newBalanceHistory;
            purchaseHistory = newPurchaseHistory;
            
            updateAuthUI();
            showHistory();
            showToast("✅ Đã hủy đơn và hoàn tiền thành công!", "info");

        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
            showToast("❌ Có lỗi xảy ra khi hủy đơn!", "error");
        }
    }
}

function showProductDetail(id) {
    const product = products.find(p => p.id === id); if (!product) return;

    // Đóng detail-modal nếu đang mở từ các form khác
    const modal = document.getElementById('detail-modal');
    if (modal) modal.style.display = 'none';

    // 1. Tính toán điểm sao trung bình
    if (!product.reviews) product.reviews = [];
    let avgRating = 0, reviewCount = product.reviews.length;
    let ratingStats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (reviewCount > 0) {
        avgRating = Math.round((product.reviews.reduce((acc, rev) => acc + parseInt(rev.rating), 0) / reviewCount) * 10) / 10;
        product.reviews.forEach(r => {
            if (r.rating >= 1 && r.rating <= 5) ratingStats[r.rating]++;
        });
    }
    
    let avgStarsHtml = '';
    for(let i = 1; i <= 5; i++) {
        if (i <= avgRating) avgStarsHtml += '<i class="fas fa-star"></i>';
        else if (i - 0.5 <= avgRating) avgStarsHtml += '<i class="fas fa-star-half-alt"></i>';
        else avgStarsHtml += '<i class="far fa-star"></i>';
    }

    let ratingProgressHtml = '';
    if (reviewCount > 0) {
        ratingProgressHtml = `<div style="display: flex; align-items: center; gap: 30px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 25px;">
            <div style="text-align: center; padding-right: 30px; border-right: 1px solid #e2e8f0;">
                <div style="font-size: 40px; font-weight: 900; color: #ef4444; line-height: 1;">${avgRating}<span style="font-size: 20px; color: #94a3b8;">/5</span></div>
                <div style="color: #fbbf24; font-size: 16px; margin: 10px 0;">${avgStarsHtml}</div>
                <div style="font-size: 13px; color: #64748b; font-weight: bold;">${reviewCount} đánh giá</div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                ${[5, 4, 3, 2, 1].map(star => {
                    let percent = Math.round((ratingStats[star] / reviewCount) * 100) || 0;
                    return `
                    <div style="display: flex; align-items: center; gap: 12px; font-size: 13px;">
                        <span style="width: 45px; color: #475569; font-weight: bold; display: flex; align-items: center; gap: 4px;">${star} <i class="fas fa-star" style="color: #fbbf24; font-size: 10px;"></i></span>
                        <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                            <div style="width: ${percent}%; height: 100%; background: #ef4444; border-radius: 4px;"></div>
                        </div>
                        <span style="width: 40px; text-align: right; color: #64748b; font-weight: bold;">${percent}%</span>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    }

    // 2. Tạo khung Danh sách bình luận
    let reviewsHtml = `<div style="margin-top: 30px; border-top: 1px dashed #e2e8f0; padding-top: 20px;">
        <h3 style="margin-bottom: 15px; color: var(--primary); font-size: 18px;"><i class="fas fa-comments"></i> Đánh giá sản phẩm</h3>
        ${ratingProgressHtml}
        <div id="product-reviews-list-container"></div>`;

    // 3. Tạo Form nhập bình luận (Kiểm tra đăng nhập)
    if (isLoggedIn) {
        const hasBought = purchaseHistory.some(order => !order.status.includes('hủy') && order.items.some(item => item.id === product.id));
        if (hasBought) {
            // Lấy lại dữ liệu đang viết dở dang từ LocalStorage (nếu có)
            const draftComment = localStorage.getItem('draft_review_' + product.id) || '';
            const draftRating = localStorage.getItem('draft_rating_' + product.id) || '5';

            reviewsHtml += `
                <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 10px;">
                    <h4 style="font-size: 14px; margin-bottom: 12px; color: #1e293b;">Viết đánh giá của bạn</h4>
                    <form onsubmit="submitReview(event, ${product.id})">
                        <div style="margin-bottom: 12px;">
                            <select id="review-rating" onchange="localStorage.setItem('draft_rating_' + ${product.id}, this.value)" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #ddd; outline: none; font-weight: bold; cursor: pointer;">
                                <option value="5" ${draftRating === '5' ? 'selected' : ''}>⭐⭐⭐⭐⭐ Tuyệt vời (5 sao)</option>
                                <option value="4" ${draftRating === '4' ? 'selected' : ''}>⭐⭐⭐⭐ Rất tốt (4 sao)</option>
                                <option value="3" ${draftRating === '3' ? 'selected' : ''}>⭐⭐⭐ Bình thường (3 sao)</option>
                                <option value="2" ${draftRating === '2' ? 'selected' : ''}>⭐⭐ Tệ (2 sao)</option>
                                <option value="1" ${draftRating === '1' ? 'selected' : ''}>⭐ Rất tệ (1 sao)</option>
                            </select>
                        </div>
                        <textarea id="review-comment" oninput="localStorage.setItem('draft_review_' + ${product.id}, this.value)" required placeholder="Chia sẻ cảm nhận chi tiết của bạn về sản phẩm..." style="width: 100%; height: 80px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; outline: none; margin-bottom: 12px; font-family: inherit; resize: none;">${draftComment}</textarea>
                        <button type="submit" style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s; width: 100%;"><i class="fas fa-paper-plane"></i> GỬI ĐÁNH GIÁ</button>
                    </form>
                </div>`;
        } else {
            reviewsHtml += `<div style="background: #eff6ff; border: 1px dashed #93c5fd; padding: 15px; text-align: center; border-radius: 8px; margin-top: 15px;"><p style="margin:0; color: #1e40af; font-size: 14px;">Chỉ những khách hàng đã mua sản phẩm này mới có thể viết đánh giá.</p></div>`;
        }
    } else {
        reviewsHtml += `<div style="background: #fff1f2; border: 1px dashed #fecaca; padding: 15px; text-align: center; border-radius: 8px; margin-top: 15px;"><p style="margin:0; color: #ef4444; font-size: 14px;">Vui lòng đăng nhập để viết đánh giá cho sản phẩm này.</p></div>`;
    }
    reviewsHtml += `</div>`;

    // 4. Lắp ráp và hiển thị nội dung vào "Trang riêng"
    const detailView = document.getElementById('product-detail-view');
    detailView.innerHTML = `
        <button onclick="goBackHome()" style="background: transparent; border: none; font-size: 16px; font-weight: bold; cursor: pointer; color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 8px;"><i class="fas fa-arrow-left"></i> Quay lại trang chủ</button>
        <div style="display: flex; gap: 40px; background: white; padding: 30px; border-radius: 16px; box-shadow: var(--shadow); align-items: flex-start;">
            <div style="flex: 1; text-align: center; position: sticky; top: 100px;">
                <img src="${product.img ? product.img.trim() : ''}" style="width: 100%; max-height: 500px; object-fit: contain; border-radius: 15px;" onerror="this.src='https://placehold.co/400x400?text=Sản+Phẩm'">
        </div>
        <div style="flex: 1; text-align: left; display: flex; flex-direction: column;">
            <h2 style="margin-bottom: 10px; color: #1e293b; font-size: 28px;">${product.name}</h2>
            <div style="color: #fbbf24; font-size: 15px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                <div>${avgStarsHtml}</div> 
                <span style="color: #94a3b8; font-size: 13px; font-weight: bold;">(${avgRating} / 5.0) - ${reviewCount} đánh giá</span>
            </div>
            <p style="color: #ef4444; font-size: 36px; font-weight: 900; margin-bottom: 20px;">${product.price.toLocaleString()}đ</p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px;">
                <h4 style="margin-bottom: 10px; color: #1e293b;">Đặc điểm nổi bật:</h4>
                <p style="color: #475569; font-size: 15px; margin: 0; line-height: 1.8;">${product.desc}</p>
            </div>
            <div style="display: flex; gap: 15px; margin-bottom: 30px;">
                <button onclick="addToCart(${product.id});" style="flex: 1; padding: 18px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px; transition: 0.2s; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'"><i class="fas fa-cart-plus"></i> THÊM VÀO GIỎ</button>
                <button onclick="addToCart(${product.id}); openCheckout();" style="flex: 1; padding: 18px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px; transition: 0.2s; box-shadow: 0 4px 10px rgba(237, 28, 36, 0.3);" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='none'">MUA NGAY</button>
            </div>
            ${reviewsHtml}
        </div>
    </div>`;
    
    // Chuyển đổi giao diện ẩn trang chủ và mở trang chi tiết
    document.getElementById('home-view').style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hiển thị danh sách bình luận (trang 1)
    renderProductReviews(product.id, 1);
}

function renderProductReviews(productId, page) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const container = document.getElementById('product-reviews-list-container');
    if (!container) return;

    if (!product.reviews || product.reviews.length === 0) {
        container.innerHTML = `<p style="color: #64748b; font-style: italic; font-size: 14px; margin-bottom: 20px;">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>`;
        return;
    }

    // Map thêm originalIndex để chức năng xóa vẫn hoạt động đúng khi phân trang
    let processedReviews = product.reviews.map((rev, idx) => ({ ...rev, originalIndex: idx }));

    const reviewsPerPage = 10; // Thay đổi số lượng bình luận trên mỗi trang tại đây
    const totalPages = Math.ceil(processedReviews.length / reviewsPerPage);
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;

    const start = (page - 1) * reviewsPerPage;
    const end = start + reviewsPerPage;
    const paginatedReviews = processedReviews.slice(start, end);

    let html = `<div style="margin-bottom: 20px;">`;
    paginatedReviews.forEach((rev) => {
        const stars = '<i class="fas fa-star" style="color:#fbbf24; font-size: 11px;"></i>'.repeat(rev.rating) + '<i class="far fa-star" style="color:#fbbf24; font-size: 11px;"></i>'.repeat(5 - rev.rating);
        const deleteBtn = (isLoggedIn && rev.username === currentUser.displayName) ? `<button onclick="deleteMyReview(${product.id}, ${rev.originalIndex})" style="background: transparent; color: #ef4444; border: none; cursor: pointer; font-size: 12px; margin-left: 10px;" title="Xóa bình luận này"><i class="fas fa-trash-alt"></i></button>` : '';
        const adminReplyBtn = isAdmin ? `<button onclick="adminReplyReview(${product.id}, ${rev.originalIndex})" style="background: transparent; color: #3b82f6; border: none; cursor: pointer; font-size: 12px; margin-left: 10px;" title="Phản hồi bình luận này"><i class="fas fa-reply"></i> Phản hồi</button>` : '';
        
        const hasBought = allUsers.flatMap(u => u.purchaseHistory || []).some(order => order.username === rev.username && !order.status.includes('hủy') && order.items.some(item => item.id === product.id));
        const verifiedBadge = hasBought ? `<span style="background: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 8px; font-weight: bold; border: 1px solid #bbf7d0;"><i class="fas fa-check-circle"></i> Đã mua hàng tại TechStore</span>` : '';

        const replyHtml = rev.adminReply ? `
            <div style="margin-top: 10px; background: #eff6ff; padding: 12px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                <div style="font-weight: bold; font-size: 13px; color: #1e40af; margin-bottom: 4px;"><i class="fas fa-headset"></i> Quản trị viên TechStore</div>
                <p style="font-size: 14px; color: #1e3a8a; margin: 0; line-height: 1.5;">${rev.adminReply}</p>
            </div>` : '';

        html += `
            <div style="background: #f8fafc; padding: 12px 15px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #f1f5f9;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div><span style="font-weight: bold; font-size: 14px; color: #1e293b;"><i class="fas fa-user-circle"></i> ${rev.username}</span>${verifiedBadge}${deleteBtn}${adminReplyBtn}</div>
                    <span style="font-size: 12px; color: #94a3b8;"><i class="far fa-clock"></i> ${rev.date}</span>
                </div>
                <div style="margin-bottom: 5px;">${stars}</div>
                <p style="font-size: 14px; color: #475569; margin: 0; line-height: 1.5;">${rev.comment}</p>
                ${replyHtml}
            </div>`;
    });
    html += `</div>`;

    // Tạo dãy nút bấm số trang nếu có nhiều hơn 1 trang
    if (totalPages > 1) {
        html += `<div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 20px;">`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<button onclick="renderProductReviews(${productId}, ${i})" style="padding: 5px 12px; border: 1px solid ${i === page ? 'var(--primary)' : '#e2e8f0'}; background: ${i === page ? 'var(--primary)' : 'white'}; color: ${i === page ? 'white' : '#475569'}; border-radius: 4px; cursor: pointer; font-weight: bold; transition: 0.2s;">${i}</button>`;
        }
        html += `</div>`;
    }

    container.innerHTML = html;
}

function goBackHome() {
    const detailView = document.getElementById('product-detail-view');
    if (detailView) detailView.style.display = 'none';
    document.getElementById('home-view').style.display = 'block';
    handleFilterAndSort(); // Làm mới danh sách để cập nhật số sao
    renderPromotions();    // Làm mới cả phần Flash Sale và Bán chạy
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function submitReview(e, productId) {
    e.preventDefault();
    if (!isLoggedIn) return;

    const rating = parseInt(document.getElementById('review-rating').value);
    const comment = document.getElementById('review-comment').value.trim();
    if (!comment) { showToast("❌ Vui lòng nhập nội dung đánh giá!", "error"); return; }

    const product = products.find(p => p.id === productId);
    if (product) {
        if (!product.reviews) product.reviews = [];
        product.reviews.unshift({ // Chèn review mới lên đầu mảng
            username: currentUser.displayName,
            rating: rating,
            comment: comment,
            date: new Date().toLocaleDateString('vi-VN')
        });

        syncProducts(); // Lưu trực tiếp dữ liệu sản phẩm vào bộ nhớ máy

        // Xóa bản nháp sau khi đã gửi thành công
        localStorage.removeItem('draft_review_' + productId);
        localStorage.removeItem('draft_rating_' + productId);

        showToast("✅ Đã gửi đánh giá thành công!");
        showProductDetail(productId); // Render lại màn hình để hiển thị review mới vừa viết
    }
}

function deleteMyReview(productId, reviewIndex) {
    if (confirm("⚠️ Bạn có chắc chắn muốn xóa bình luận này của mình không?")) {
        const product = products.find(p => p.id === productId);
        if (product && product.reviews) {
            // Kiểm tra bảo mật lần nữa đảm bảo chỉ người viết mới được xóa
            if (product.reviews[reviewIndex].username === currentUser.displayName) {
                product.reviews.splice(reviewIndex, 1);
                syncProducts();
                showToast("🗑️ Đã xóa bình luận thành công!", "info");
                showProductDetail(productId); // Render lại để cập nhật danh sách review trên trang chi tiết
                handleFilterAndSort(); // Làm mới lại điểm sao trung bình ở màn hình chính
            }
        }
    }
}