let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartList = document.getElementById("cart-list");
let total = 0;

function renderCart() {
  cartList.innerHTML = "";
  total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartList.innerHTML += `
      <div>
        <h4>${item.name}</h4>
        <p>Giá: ${item.price} VND</p>
        <p>Số lượng: ${item.quantity}</p>
        <button onclick="removeItem(${index})">Xóa</button>
        <hr>
      </div>
    `;
  });

  document.getElementById("total").innerText =
    "Tổng tiền: " + total + " VND";
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();