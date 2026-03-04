document.addEventListener("DOMContentLoaded", function () {

    const products = [
        {id:1, name:"Laptop Asus Vivobook", price:14500000, img:"../images/asus.jpg", category:"laptop"},
        {id:2, name:"Laptop MSI Gaming", price:21900000, img:"../images/msi.jpg", category:"laptop"},
        {id:3, name:"Macbook Air M1", price:23500000, img:"../images/macbook.jpg", category:"laptop"},

        {id:4, name:"Chuột Logitech G102", price:450000, img:"../images/mouse_logi.jpg", category:"phukien"},
        {id:5, name:"Bàn phím RK84 RGB", price:1350000, img:"../images/keyboard_rk.jpg", category:"phukien"},

        {id:6, name:"SSD Samsung 1TB", price:1900000, img:"../images/ssd_samsung.jpg", category:"linhkien"},
        {id:7, name:"RAM 16GB DDR4", price:1200000, img:"../images/ram_corsair.jpg", category:"linhkien"},

        {id:8, name:"Tai nghe Sony WH-1000XM4", price:5500000, img:"../images/headphone_sony.jpg", category:"amthanh"},
        {id:9, name:"Loa Bluetooth JBL", price:2500000, img:"../images/speaker_jbl.jpg", category:"amthanh"},

        {id:10, name:"Ghế Gaming RGB", price:3500000, img:"../images/chair_dx.jpg", category:"gaming"},
        {id:11, name:"Bàn Gaming", price:2800000, img:"../images/table_gaming.jpg", category:"gaming"}
    ];

    const productContainer = document.querySelector(".products");
    const menuLinks = document.querySelectorAll(".menu a");
    const searchInput = document.getElementById("searchInput");
    const cartCount = document.getElementById("cartCount");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.innerText = cart.length;

    function renderProducts(list) {
        productContainer.innerHTML = "";

        if(list.length === 0){
            productContainer.innerHTML = "<p>Không tìm thấy sản phẩm</p>";
            return;
        }

        list.forEach(product => {
            productContainer.innerHTML += `
                <div class="product">
                    <img src="${product.img}">
                    <h4>${product.name}</h4>
                    <p class="price">${product.price.toLocaleString()} VND</p>
                    <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
                </div>
            `;
        });
    }

    window.addToCart = function(id){
        const product = products.find(p => p.id === id);
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        cartCount.innerText = cart.length;
        alert("Đã thêm vào giỏ!");
    }

    // MENU FILTER
    menuLinks.forEach(link => {
        link.addEventListener("click", function(e){
            e.preventDefault();

            menuLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            const category = this.dataset.category;

            if(category === "all"){
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });

    // SEARCH
    searchInput.addEventListener("input", function(){
        const keyword = this.value.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(keyword)
        );
        renderProducts(filtered);
    });

    // LOGIN LOGIC
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if(localStorage.getItem("user")){
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline";
    }

    logoutBtn.addEventListener("click", function(){
        localStorage.removeItem("user");
        location.reload();
    });

    renderProducts(products);

});