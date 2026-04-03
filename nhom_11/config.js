// --- CẤU HÌNH FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyAnMKYL2FwjmklCD59flYdWO0DhqKnqV6A",
    authDomain: "techstore-e2900.firebaseapp.com",
    projectId: "techstore-e2900",
    storageBucket: "techstore-e2900.appspot.com",
    messagingSenderId: "943760849073",
    appId: "1:943760849073:web:0464e56fda73096f8b4a90"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- 0. KHỞI TẠO BIẾN HỆ THỐNG ---

/**
 * Hàm an toàn để đọc và phân tích JSON từ localStorage.
 * Nếu dữ liệu không tồn tại hoặc bị lỗi, nó sẽ trả về một giá trị mặc định.
 * @param {string} key - Khóa trong localStorage.
 * @param {*} defaultValue - Giá trị trả về nếu có lỗi.
 * @returns {*} Dữ liệu đã được phân tích hoặc giá trị mặc định.
 */
function safeJSONParse(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.warn(`Lỗi phân tích JSON từ localStorage cho khóa "${key}". Sử dụng giá trị mặc định.`, e);
        return defaultValue;
    }
}

let isLoggedIn = false;
let currentUser = null; // Sẽ là một object từ Firebase, không còn là string

function convertCartToQuantified(oldCart) {
    if (!oldCart || oldCart.length === 0 || oldCart[0].quantity !== undefined) {
        return oldCart || []; // Already new format or empty
    }
    const newCart = [];
    oldCart.forEach(oldItem => {
        const existingItem = newCart.find(newItem => newItem.id === oldItem.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            const { cartId, ...productData } = oldItem; // Remove the old unique cartId
            newCart.push({ ...productData, quantity: 1 });
        }
    });
    return newCart;
}
let cart = []; // Giỏ hàng sẽ được load từ Firestore khi người dùng đăng nhập.
let isAdmin = false; 

let userBalance = 0;
let balanceHistory = [];
let purchaseHistory = [];
let discountAmount = 0;
let currentCategory = 'all';
let currentPage = 1;
const itemsPerPage = 8; // Số lượng sản phẩm trên 1 trang (có thể thay đổi)
let currentFilteredProducts = []; // Lưu danh sách sản phẩm đang được thao tác (lọc/tìm kiếm)
let flashSalePage = 0; // Lưu vị trí trang Flash Sale hiện tại
const flashSaleItemsPerPage = 4; // Số sản phẩm Flash Sale hiển thị mỗi lần
 
let allOrders = []; // Sổ cái lưu toàn bộ đơn hàng của web, sẽ được tải từ Firestore cho Admin
let allUsers = []; // Danh sách tất cả người dùng, sẽ được tải từ Firestore cho Admin
let systemNotice = ''; // Lưu thông báo hệ thống, sẽ được tải từ Firestore

// --- HÀM LƯU DỮ LIỆU ---
function syncProducts() {
    // Đồng bộ toàn bộ danh sách sản phẩm (bao gồm đánh giá) lên Firebase
    db.collection('settings').doc('products').set({ list: products })
        .catch(error => console.error("Lỗi đồng bộ sản phẩm:", error));
}

async function saveData() { // Chuyển thành hàm async
    // Chỉ lưu dữ liệu khi đã đăng nhập và có UID
    if (!isLoggedIn || !currentUser || !currentUser.uid) return;

    const userData = {
        userBalance,
        balanceHistory,
        purchaseHistory,
        cart // Giỏ hàng giờ cũng được lưu theo từng user
    };
    try {
        // Sử dụng UID làm key và lưu vào Firestore, merge:true để không ghi đè các trường khác (như email, createdAt)
        await db.collection('users').doc(currentUser.uid).set(userData, { merge: true });
    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu người dùng lên Firestore: ", error);
        showToast("❌ Không thể đồng bộ dữ liệu lên máy chủ!", "error");
    }
}

// --- HÀM TẢI DỮ LIỆU ---

/**
 * Tải dữ liệu dành riêng cho Admin (tất cả đơn hàng, tất cả người dùng).
 * Chỉ được gọi khi xác định người dùng là Admin.
 */
async function loadAdminData() {
    if (!isAdmin) return;

    try {
        // Tải tất cả đơn hàng, sắp xếp theo ngày mới nhất
        const ordersSnapshot = await db.collection('orders').orderBy('timestamp', 'desc').get();
        allOrders = [];
        ordersSnapshot.forEach(doc => {
            allOrders.push({ id: doc.id, ...doc.data() });
        });
        console.log(`[Admin] Tải ${allOrders.length} đơn hàng thành công.`);

        // Tải tất cả người dùng
        const usersSnapshot = await db.collection('users').get();
        allUsers = [];
        usersSnapshot.forEach(doc => {
            allUsers.push({ uid: doc.id, ...doc.data() });
        });
        console.log(`[Admin] Tải ${allUsers.length} người dùng thành công.`);

    } catch (error) {
        console.error("[Admin] Lỗi khi tải dữ liệu admin:", error);
        showToast("❌ Không thể tải dữ liệu cho Admin!", "error");
    }
}

async function loadSystemNotice() {
    const doc = await db.collection('settings').doc('general').get();
    if (doc.exists && doc.data().systemNotice) {
        systemNotice = doc.data().systemNotice;
    }
}

async function loadData() { // Chuyển thành hàm async
    if (isLoggedIn && currentUser && currentUser.uid) {
        const userDocRef = db.collection('users').doc(currentUser.uid);
        try {
            const userDoc = await userDocRef.get();
            if (userDoc.exists) {
                const data = userDoc.data();
                userBalance = data.userBalance || 0;
                balanceHistory = data.balanceHistory || [];
                purchaseHistory = data.purchaseHistory || [];
                // Load và chuyển đổi giỏ hàng của user từ Firestore, đảm bảo cart không bao giờ là null/undefined
                cart = data.cart ? convertCartToQuantified(data.cart) : [];
            } else {
                // Nếu user đã đăng nhập nhưng chưa có document trong Firestore (VD: đăng ký bị lỗi, hoặc user cũ)
                // --> Tự động tạo một document mới cho họ để đồng bộ.
                console.warn(`User document for ${currentUser.uid} not found. Creating a new one.`);
                const newUserData = {
                    email: currentUser.email, displayName: currentUser.displayName,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    userBalance: 0, balanceHistory: [], purchaseHistory: [], cart: []
                };
                await userDocRef.set(newUserData);
            }
        } catch (error) {
            console.error("Lỗi khi tải/tạo dữ liệu người dùng từ Firestore: ", error);
            showToast("❌ Không thể tải dữ liệu từ máy chủ!", "error");
        }
    }
}