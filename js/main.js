function updateCart(items) {
  let cart = document.getElementById("cart");
  cart.innerHTML = "";
  let filteredItem = items.filter((el) => el.cart === true);
  let cartHeader = document.createElement("div");
    cartHeader.classList.add("cart-header");
    cartHeader.innerHTML = `
      <div class="flex">
        <div>Item</div>
        <div>Qty</div>
        <div>Price</div>
      </div>
    `;
    cart.appendChild(cartHeader);
  filteredItem.forEach((item) => {
    let cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <div class="prod">
        <img class="cart-item-img" src="${item.image}">
        <div class="cart-item-name">${item.name}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-remove">-</button><span>${item.qty}</span><button class="qty-add">+</button>
      </div>
      <div class="display-p">${formatAmount(item.total)}</div>
    `;
    cartItem.getElementsByClassName('qty-add')[0].addEventListener("click", () => {
      item.qty = item.qty + 1;
      item.total = item.price.actual * item.qty;
      updateCart(items);
    });
    cartItem.getElementsByClassName('qty-remove')[0].addEventListener("click", () => {
      if (item.qty) {
        item.qty = item.qty - 1;
        item.total = item.price.actual * item.qty;
        if (item.qty === 0) {
          item.cart = false;
        }
        updateCart(items);
      }
    });
    calcTotal(filteredItem);
    cart.appendChild(cartItem);
  });
}

function calcTotal(items) {
  let totalEl = document.getElementById('total-cart')
  let total = 0;
  let discountedTotal = 0;
  let totalDiscount = 0;
  let totalQty = 0;
  items.forEach(item => {
    totalQty += item.qty;
    total += (item.price.display * item.qty);
    discountedTotal += (item.price.actual * item.qty);
  });
  totalDiscount = total-discountedTotal;
  totalEl.innerHTML = `
  <div class="total-cart">
    <label>Items(${totalQty})</label>: ${formatAmount(total)}<br/>
    <label>Discount</label>: -${formatAmount(totalDiscount)}
    <div class="total-order"><label>Order Total</label>: ${formatAmount(discountedTotal)}</div>
  </div> 
  `;
}

function formatAmount(value) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
  return formatter.format(value);
}

function getData() {
  fetch("data/cart.json").then((response) => response.json()).then((data) => {
    let products = document.getElementById("product-list");
    data.items.forEach((item, index) => {
      item.qty = 0;
      let card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="discount">${item.discount}% off</div>
        <img src="${item.image}">
        <div class="name">
          <div>${item.name}</div>
          <div class="flex">
            <div class="price">
              <span class="actual-p">${formatAmount(item.price.display)}</span>
              <span class="display-p">${formatAmount(item.price.actual)}</span>
            </div>
            <div><button type="button" class="add-to-cart">Add To Cart</button></div>
          </div>
        </div>
      `;
      card.getElementsByClassName('add-to-cart')[0].addEventListener("click", () => {
        item.cart = true;
        item.qty = item.qty + 1;
        item.total = item.price.display * item.qty;
        updateCart(data.items);
        scrollToPage();
      });
      products.appendChild(card);
    });
  });
}
function scrollToPage() {
  document.body.scrollIntoView({
    behavior: 'auto', block: 'end',
  });
}
getData();
