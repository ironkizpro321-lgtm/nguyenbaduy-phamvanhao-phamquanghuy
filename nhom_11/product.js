// ==========================================
// FINAL, SIMPLIFIED, LOCAL-IMAGE-ONLY DATA
// ==========================================

const phones = [
    { id: 3, category: 'phone', name: "iPhone 16 Pro Max", price: 29000000, isBestSeller: true, img: "images/iphone-16-pro-max.jpg", desc: "Chip A18 Pro, pin trâu, camera mạnh." },
    { id: 5, category: 'phone', name: "Samsung S26 Ultra", price: 32000000, oldPrice: 35000000, isFlashSale: true, img: "images/samsung-s26-ultra.jpg", desc: "Camera 200MP, S-Pen." },
    { id: 40, category: 'phone', name: "Xiaomi 14 Ultra", price: 32000000, isBestSeller: true, img: "images/xiaomi-14-ultra.jpg", desc: "Camera Leica." },
];

const laptops = [
    { id: 9, category: 'laptop', name: "MSI Raider", price: 52000000, isBestSeller: true, img: "images/msi-raider.jpg", desc: "RTX 4090, i9." },
    { id: 10, category: 'laptop', name: "Asus TUF A15", price: 24000000, isBestSeller: true, img: "images/asus-tuf.jpg", desc: "Ryzen 7, RTX 4060." },
    { id: 44, category: 'laptop', name: "MacBook Pro M3", price: 95000000, isBestSeller: true, img: "images/macbook-pro.jpg", desc: "Đồ họa mạnh." },
];

const pcs = [
    { id: 13, category: 'pc', name: "PC i9 Ultra", price: 65000000, isBestSeller: true, img: "images/pc-i9.jpg", desc: "Gaming 4K." },
    { id: 15, category: 'pc', name: "PC i5 Eco", price: 12000000, img: "images/pc-i5.jpg", desc: "Giá rẻ." },
    { id: 49, category: 'pc', name: "PC White", price: 16500000, img: "images/pc-white.jpg", desc: "RGB đẹp." },
];

const headphones = [
    { id: 23, category: 'headphone', name: "Logitech G733", price: 3800000, img: "images/logitech-g733.jpg", desc: "RGB đẹp." },
    { id: 24, category: 'headphone', name: "AirPods", price: 4400000, isBestSeller: true, img: "images/airpods.jpg", desc: "Apple." },
    { id: 52, category: 'headphone', name: "Sony XM5", price: 7500000, isBestSeller: true, img: "images/sony-xm5.jpg", desc: "Chống ồn." }
];

const gears = [
    { id: 26, category: 'gear', name: "Ghế Gaming", price: 2900000, img: "images/ghe-gaming.jpg", desc: "Ngả 180." },
    { id: 34, category: 'gear', name: "Bàn phím RGB", price: 5800000, img: "images/ban-phim.jpg", desc: "Cơ cao cấp." },
    { id: 35, category: 'gear', name: "Chuột Gaming", price: 3400000, img: "images/chuot-gaming.jpg", desc: "Siêu nhẹ." }
];

const components = [
    { id: 17, category: 'component', name: "RTX 5080", price: 48000000, img: "images/rtx-5080.jpg", desc: "GPU mạnh." },
    { id: 37, category: 'component', name: "RAM 32GB", price: 3800000, img: "images/ram-32gb.jpg", desc: "DDR5." },
    { id: 60, category: 'component', name: "Mainboard", price: 16500000, img: "images/mainboard.jpg", desc: "Cao cấp." }
];

// GỘP DỮ LIỆU
const componentsList = [...phones, ...laptops, ...pcs, ...headphones, ...gears, ...components];

let products;
try {
    // Đọc từ bộ nhớ trình duyệt, nếu có và đúng chuẩn thì dùng
    const storageProductsJSON = localStorage.getItem('all_products');
    if (storageProductsJSON && storageProductsJSON.length > 10) {
        products = JSON.parse(storageProductsJSON);
    } else {
        // Nếu trống thì nạp từ danh sách mặc định
        products = componentsList;
        localStorage.setItem('all_products', JSON.stringify(products));
    }
} catch (error) {
    products = componentsList;
    localStorage.setItem('all_products', JSON.stringify(products));
}
console.log("✅ PRODUCT LIST READY - LOCAL IMAGES ONLY");