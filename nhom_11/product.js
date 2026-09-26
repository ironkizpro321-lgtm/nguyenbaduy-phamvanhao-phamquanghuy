// ==========================================
// TẠO DỮ LIỆU SẢN PHẨM THEO NGÀNH HỌC & THƯƠNG HIỆU (TECHSTORE)
// ==========================================

function buildDefaultProducts() {
    const majorProducts = {
        pc: [
            { 
                name: 'PC Gaming ASUS ROG Strix RTX 4060', 
                price: 38900000, 
                oldPrice: 42900000,
                isBestSeller: true, 
                isFlashSale: true,
                img: 'images/pc-i9.jpg', 
                desc: 'PC gaming ASUS cấu hình mạnh với CPU Intel Core i7 và card đồ họa RTX 4060, phù hợp chơi game và làm đồ họa.',
                reviews: [
                    { username: 'HoangLong', rating: 5, comment: 'PC chạy mượt các game phổ biến và xử lý đồ họa tốt.', date: '20/09/2026' }
                ]
            },
            { 
                name: 'PC Gaming MSI Raider Core i9 RTX 4080', 
                price: 54900000, 
                oldPrice: 62000000, 
                isFlashSale: true, 
                img: 'images/pc-white.jpg', 
                desc: 'PC gaming MSI dùng CPU Intel Core i9 và RTX 4080, dành cho chơi game độ phân giải cao và dựng nội dung.',
                reviews: [
                    { username: 'MinhTri', rating: 5, comment: 'Hiệu năng mạnh, chơi game và render đều nhanh.', date: '18/09/2026' }
                ]
            },
            { 
                name: 'PC Esport Gaming Ryzen 5 5600G', 
                price: 11500000, 
                oldPrice: 13500000,
                isBestSeller: true, 
                img: 'images/PC Esport Ryzen 5 5600G.jpg', 
                desc: 'Dàn PC Gaming quốc dân tối ưu chi phí, mượt mà LMHT, CS:GO, Valorant và tác vụ học tập.',
                reviews: []
            },
            { 
                name: 'Tai nghe Razer BlackShark V2 Pro Gaming', 
                price: 4290000, 
                oldPrice: 5190000, 
                isFlashSale: true, 
                img: 'images/Razer BlackShark V2 Pro.jpg', 
                desc: 'Tai nghe Razer esports không dây hàng đầu, âm thanh vòm THX Spatial Audio định vị cực chuẩn.',
                reviews: []
            },
            { 
                name: 'PC Gaming Acer Nitro Core i5 RTX 3050', 
                price: 21990000, 
                img: 'images/PC Esport Ryzen 5 5600G.jpg', 
                desc: 'PC gaming tầm trung dùng CPU Core i5 và RTX 3050, phù hợp chơi game Full HD và học tập.',
                reviews: []
            },
            { 
                name: 'Tai nghe Gaming Logitech G733 LIGHTSPEED', 
                price: 2990000, 
                oldPrice: 3690000, 
                isFlashSale: true, 
                img: 'images/logitech-g733.jpg', 
                desc: 'Tai nghe không dây Logitech siêu nhẹ, đèn LED RGB Lightsync và micro tích hợp bộ lọc Blue VO!CE.',
                reviews: []
            }
        ],
        it: [
            { 
                name: 'PC Workstation lập trình Intel Core i7', 
                price: 28900000, 
                isBestSeller: true, 
                img: 'images/pc-i5.jpg', 
                desc: 'Máy tính để bàn cho lập trình, biên dịch dự án lớn, chạy máy ảo và các công cụ phát triển phần mềm.',
                reviews: [
                    { username: 'DevHanoi', rating: 5, comment: 'Chạy IDE, Docker và máy ảo ổn định.', date: '21/09/2026' }
                ]
            },
            { 
                name: 'Enterprise IT Solution PC Core i5', 
                price: 12000000, 
                isBestSeller: true, 
                img: 'images/pc-i5.jpg', 
                desc: 'Máy tính doanh nghiệp cho học tập, lập trình Web/Mobile và làm việc CNTT hiệu quả.',
                reviews: []
            },
            { 
                name: 'Developer Lab Workstation Intel i7', 
                price: 28000000, 
                oldPrice: 34000000, 
                isFlashSale: true, 
                img: 'images/pc-i5.jpg', 
                desc: 'PC phát triển phần mềm, test hệ thống microservices và triển khai dự án tích hợp.',
                reviews: []
            },
            { 
                name: 'Software Engineering Pro Workstation', 
                price: 22500000, 
                img: 'images/pc-i5.jpg', 
                desc: 'Máy tính tối ưu dựng project lớn, biên dịch mã nguồn và chạy máy ảo đa môi trường.',
                reviews: []
            },
            { 
                name: 'Bàn phím cơ lập trình viên Gaming Pro', 
                price: 1850000, 
                img: 'images/ban-phim.jpg', 
                desc: 'Bàn phím cơ gõ êm, switch cơ học độ bền 80 triệu lần bấm, hỗ trợ hot-swap tiện lợi.',
                reviews: []
            }
        ],
        ai: [
            { 
                name: 'Enterprise AI Workstation Pro RTX 5080', 
                price: 65000000, 
                isBestSeller: true, 
                img: 'images/rtx-5080.jpg', 
                desc: 'Workstation AI doanh nghiệp trang bị card RTX 5080, xử lý dữ liệu lớn và huấn luyện mô hình học máy LLM.',
                reviews: [
                    { username: 'DataScientist', rating: 5, comment: 'Tốc độ train model nhanh gấp 3 lần card đời trước, rất đáng tiền.', date: '22/09/2026' }
                ]
            },
            { 
                name: 'Deep Learning Workstation Max i9-14900K', 
                price: 72000000, 
                img: 'images/CPU Intel Core i9-14900K.webp', 
                desc: 'Workstation chuyên sâu cho deep learning với CPU Intel Core i9-14900K 24 nhân 32 luồng đỉnh cao.',
                reviews: []
            },
            { 
                name: 'Data Science Enterprise X Supercomputer', 
                price: 59000000, 
                oldPrice: 67000000, 
                isFlashSale: true, 
                img: 'images/pc-i9.jpg', 
                desc: 'Máy trạm phân tích khoa học dữ liệu, tính toán ma trận và mô hình hóa thuật toán phức tạp.',
                reviews: []
            },
            { 
                name: 'Card đồ họa Asus GeForce RTX 5060 Ti 16G', 
                price: 14500000, 
                img: 'images/GeForce RTX 5060 Ti 16G .jpg', 
                desc: 'Card đồ họa ASUS RTX 5060 Ti 16GB VRAM GDDR6, phục vụ chạy inference model và xử lý đồ họa AI.',
                reviews: []
            },
            { 
                name: 'AI Vision Studio 2026 High-Performance', 
                price: 43000000, 
                oldPrice: 49900000, 
                isFlashSale: true, 
                img: 'images/pc-i9.jpg', 
                desc: 'Máy tính AI phục vụ thị giác máy tính OpenCV, YOLO và phát triển ứng dụng nhận diện hình ảnh.',
                reviews: []
            }
        ],
        network: [
            { 
                name: 'Network Lab Core System Enterprise', 
                price: 21000000, 
                oldPrice: 25500000, 
                isFlashSale: true, 
                img: 'images/pc-i5.jpg', 
                desc: 'Máy tính chuyên dụng phòng lab mạng, mô phỏng hệ thống mạng ảo hóa EVE-NG và GNS3.',
                reviews: []
            },
            { 
                name: 'Cyber Security Lab PC Core i9 Defense', 
                price: 36000000, 
                isBestSeller: true, 
                img: 'images/pc-i9.jpg', 
                desc: 'Máy tính an ninh mạng phục vụ đào tạo pentest, kiểm thử lỗ hổng và phòng chống tấn công mạng.',
                reviews: []
            },
            { 
                name: 'Network Engineering Pro Workstation', 
                price: 26000000, 
                oldPrice: 31500000, 
                isFlashSale: true, 
                img: 'images/pc-i5.jpg', 
                desc: 'Hệ thống quản trị mạng, cấu hình thiết bị switch/router Cisco, Juniper và firewall doanh nghiệp.',
                reviews: []
            },
            { 
                name: 'Enterprise Network Security Server Tower', 
                price: 39000000, 
                img: 'images/pc-i9.jpg', 
                desc: 'Máy chủ quản lý mạng cục bộ, cân bằng tải và giám sát hệ thống hạ tầng 24/7.',
                reviews: []
            },
            { 
                name: 'Routing & Switching Simulation PC System', 
                price: 24000000, 
                img: 'images/pc-i5.jpg', 
                desc: 'PC mô phỏng định tuyến chuyên sâu cho kỹ sư quản trị mạng CCNA, CCNP.',
                reviews: []
            }
        ],
        design: [
            { 
                name: 'PC Workstation đồ họa RTX 4070', 
                price: 59900000, 
                isBestSeller: true, 
                img: 'images/G-VN Phantom i7-14700F  RTX 4070.jpg', 
                desc: 'PC workstation trang bị RTX 4070 cho thiết kế 3D, dựng phim và xử lý đồ họa chuyên nghiệp.',
                reviews: [
                    { username: 'LinhDesign', rating: 5, comment: 'Dựng hình 3D và render video nhanh, ổn định.', date: '19/09/2026' }
                ]
            },
            { 
                name: 'Card đồ họa Gigabyte RTX 3050 Workstation', 
                price: 8990000, 
                isBestSeller: true, 
                img: 'images/GeForce RTX 3050 WINDFORCE OC .jpg', 
                desc: 'Card đồ họa rời Gigabyte RTX 3050 dành cho PC thiết kế 2D, chỉnh sửa ảnh và dựng hình cơ bản.',
                reviews: []
            },
            { 
                name: 'Creative Design Workstation White Edition', 
                price: 16500000, 
                img: 'images/pc-white.jpg', 
                desc: 'Máy tính đồ họa thanh lịch màu trắng cho thiết kế 2D Photoshop, Illustrator và thiết kế kiến trúc.',
                reviews: []
            },
            { 
                name: 'Multimedia Studio Pro 4K Editing', 
                price: 33000000, 
                img: 'images/pc-white.jpg', 
                desc: 'Workstation chuyên render đồ họa 3D Blender, dựng phim Adobe Premiere và kỹ xảo kỹ thuật số.',
                reviews: []
            },
            { 
                name: 'Design Master Enterprise Studio Rig', 
                price: 31000000, 
                img: 'images/pc-white.jpg', 
                desc: 'PC thiết kế doanh nghiệp tối ưu độ bền, card đồ họa rời mạnh mẽ và tản nhiệt êm ái.',
                reviews: []
            }
        ],
        electrical: [
            { 
                name: 'IoT Automation Workstation Pro Lab', 
                price: 24500000, 
                isBestSeller: true, 
                img: 'images/pc-white.jpg', 
                desc: 'PC kỹ thuật phục vụ lập trình vi điều khiển STM32, Arduino, ESP32 và tự động hóa công nghiệp.',
                reviews: []
            },
            { 
                name: 'Industrial IoT Lab PC Siemens PLC Support', 
                price: 29000000, 
                oldPrice: 34900000, 
                isFlashSale: true, 
                img: 'images/pc-white.jpg', 
                desc: 'Hệ thống máy tính giao tiếp chuẩn RS485, Modbus, điều khiển PLC Siemens và hệ thống SCADA.',
                reviews: []
            },
            { 
                name: 'Automation Control System Lab PC', 
                price: 27000000, 
                img: 'images/pc-white.jpg', 
                desc: 'Máy tính mô phỏng hệ thống điều khiển tự động, mô hình nhà máy thông minh và cánh tay robot.',
                reviews: []
            },
            { 
                name: 'Embedded Systems Workstation Microchip', 
                price: 32000000, 
                img: 'images/pc-white.jpg', 
                desc: 'PC chuyên dụng cho kỹ sư hệ thống nhúng, thiết kế mạch Altium Designer và mô phỏng Proteus.',
                reviews: []
            },
            { 
                name: 'Smart Grid Research PC Power Lab', 
                price: 33500000, 
                img: 'images/pc-white.jpg', 
                desc: 'Máy tính tính toán lưới điện thông minh, phân tích chất lượng điện năng và năng lượng tái tạo.',
                reviews: []
            }
        ]
    };

    let idCounter = 1000;
    return Object.entries(majorProducts).flatMap(([major, items]) =>
        items.map(item => {
            idCounter += 1;
            return {
                id: idCounter,
                category: 'pc',
                major: major,
                name: item.name,
                price: item.price,
                oldPrice: item.oldPrice || null,
                isBestSeller: Boolean(item.isBestSeller),
                isFlashSale: Boolean(item.isFlashSale),
                img: item.img,
                desc: item.desc,
                reviews: Array.isArray(item.reviews) ? item.reviews : []
            };
        })
    );
}

function normalizeProductList(rawProducts) {
    if (!Array.isArray(rawProducts)) return [];

    return rawProducts
        .filter(p => p && typeof p === 'object' && p.name)
        .map((p, index) => {
            const numericId = Number(p.id) || (index + 1001);
            const price = Number(p.price) || 0;
            const oldPrice = Number(p.oldPrice) || null;
            const cat = String(p.category || 'pc').trim().toLowerCase();
            const maj = String(p.major || cat || 'it').trim().toLowerCase();

            return {
                id: numericId,
                category: cat,
                major: maj,
                name: String(p.name || 'Sản phẩm TechStore'),
                price: price,
                oldPrice: oldPrice && oldPrice > price ? oldPrice : null,
                isBestSeller: Boolean(p.isBestSeller),
                isFlashSale: Boolean(p.isFlashSale),
                img: p.img || 'images/pc-i5.jpg',
                desc: p.desc || 'Sản phẩm công nghệ TechStore chính hãng.',
                reviews: Array.isArray(p.reviews) ? p.reviews : []
            };
        });
}

function isOutOfScopeMobileDevice(product) {
    return /\b(laptop|notebook|macbook|iphone|ipad|smartphone|mobile phone|điện thoại|galaxy)\b/i.test(product.name || '');
}

const componentsList = buildDefaultProducts();

function mergeDefaultProductsForMissingMajors(rawProducts) {
    const normalizedProducts = normalizeProductList(rawProducts);
    const mergedProducts = normalizedProducts.filter(product => !isOutOfScopeMobileDevice(product));
    const removedCount = normalizedProducts.length - mergedProducts.length;
    const majors = ['pc', 'it', 'network', 'electrical', 'ai', 'design'];
    let nextId = mergedProducts.reduce((maxId, product) => Math.max(maxId, product.id), 1000) + 1;
    let addedCount = 0;

    majors.forEach(major => {
        const hasMajorProducts = mergedProducts.some(product => product.major === major || product.category === major);
        if (hasMajorProducts) return;

        componentsList
            .filter(product => product.major === major)
            .forEach(defaultProduct => {
                if (mergedProducts.some(product => product.name === defaultProduct.name)) return;

                const product = { ...defaultProduct };
                if (mergedProducts.some(existing => existing.id === product.id)) {
                    product.id = nextId++;
                }
                mergedProducts.push(product);
                addedCount += 1;
            });
    });

    return { products: mergedProducts, addedCount, removedCount };
}

let products;

try {
    const storageProductsJSON = localStorage.getItem('all_products');
    const storedProducts = storageProductsJSON ? JSON.parse(storageProductsJSON) : [];
    const validProducts = normalizeProductList(storedProducts);

    // Nếu dữ liệu cũ chưa có đa dạng ngành học hoặc thiếu sản phẩm, cập nhật lại bộ sản phẩm mới
    if (validProducts.length >= 20) {
        products = validProducts;
    } else {
        products = componentsList;
        localStorage.setItem('all_products', JSON.stringify(products));
    }
} catch (error) {
    products = componentsList;
    localStorage.setItem('all_products', JSON.stringify(products));
}

products = mergeDefaultProductsForMissingMajors(products).products;
localStorage.setItem('all_products', JSON.stringify(products));

console.log('✅ PRODUCT LIST READY - TECHSTORE CATALOG LOADED (' + products.length + ' sản phẩm)');