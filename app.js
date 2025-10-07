const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const urlInput = document.getElementById("url");
const priceInput = document.getElementById("price");
const countInput = document.getElementById("count");
const isSaleChexbox = document.getElementById("isSale");
const saleInput = document.getElementById("sale");
const cardsListEL = document.getElementById("cardsList");
const saleBox = document.querySelector(".saleBox");
const submit = document.getElementById("submit");
const shopBtn = document.getElementById("shop-btn");
const cartDropdown = document.getElementById("cart-all");

let cards = [];
let uptadeId = null;
let cartItems = [];

window.addEventListener("DOMContentLoaded", () => {
  loadPruduct();
  loadCart();
  renderProducts();
  renderBtn();
  rendercarts();
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (uptadeId) {
    editCard();
  } else {
    addCard();
  }
});
function addCard() {
  if (nameInput.value.trim() === "") {
    setTimeout(function () {
      nameInput.style.border = "2px solid red";
      nameInput.setAttribute("placeholder", "Iltimos! Name kiriting");
    }, 100);

    return;
  }

  if (urlInput.value.trim() === "") {
    setTimeout(function () {
      urlInput.style.border = "2px solid red";
      urlInput.setAttribute("placeholder", "Iltimos! URL kiriting");
    }, 100);

    return;
  }
  if (priceInput.value.trim() === "") {
    setTimeout(function () {
      priceInput.style.border = "2px solid red";
      priceInput.setAttribute("placeholder", "Iltimos! Narxini kiriting");
    }, 100);
    return;
  }
  if (countInput.value.trim() === "") {
    setTimeout(function () {
      countInput.style.border = "2px solid red";
      countInput.setAttribute("placeholder", "Iltimos! Sonini kiriting");
    }, 100);
    return;
  }
  if (isSaleChexbox.checked) {
    if (saleInput.value.trim() === "") {
      alert("Sale majburiy!");
      saleInput.style.border = "2px solid red";
      return;
    }

    if (+saleInput.value > 99) {
      alert("100% dan baland skidka mavjud emas: Tekin net unce 😂");
      saleInput.style.border = "2px solid red";
      return;
    }
  }

  const newProduct = {
    id: Date.now(),
    name: nameInput.value,
    url: urlInput.value,
    price: Number(priceInput.value),
    isSale: isSaleChexbox.checked,
    sale: Number(saleInput.value) / 100,
    count: Number(countInput.value),
  };

  cards.push(newProduct);
  renderProducts();
  resetForm();
}
isSaleChexbox.addEventListener("change", () => {
  if (isSaleChexbox.checked) {
    saleBox.style.display = "block";
    saleInput.focus();
  } else {
    saleBox.style.display = "none";
  }
});

function deleteBtn(id) {
  cards = cards.filter((del) => del.id !== id);
  savePruduct();
  renderProducts();
}
function editBtn(id) {
  const card = cards.find((edit) => edit.id == id);
  nameInput.value = card.name;
  priceInput.value = card.price;
  urlInput.value = card.url;
  countInput.value = card.count;
  saleInput.value = card.sale;
  isSaleChexbox.checked = card.isSale;
  saleInput.value = card.sale * 100;
  submit.innerHTML = "O'gartirish";
  uptadeId = id;
}
function editCard() {
  cards = cards.map((c) =>
    c.id === uptadeId
      ? {
          ...c,
          name: nameInput.value,
          url: urlInput.value,
          price: Number(priceInput.value),
          count: Number(countInput.value),
          isSale: isSaleChexbox.checked,
          sale: Number(saleInput.value) / 100,
        }
      : c
  );

  renderProducts();
  resetForm();
}

function resetForm() {
  form.reset();
  saleBox.style.display = "none";
  uptadeId = null;
  submit.innerHTML = "Qo‘shish";
}
function addToCart(id) {
  id = Number(id);
  const index = cartItems.findIndex((c) => c.id === id);

  if (index === -1) {
    const item = cards.find((m) => m.id === id);
    cartItems.push(item);
  } else {
    cartItems.splice(index, 1);
  }
  saveCart();
  renderProducts();
  renderBtn();
  rendercarts();
}

function renderBtn() {
  shopBtn.innerHTML = `
   ${cartItems.length}
  `;
}
function renderProducts() {
  if (cards.length === 0) {
    cardsListEL.innerHTML = `
      <tr>
        <td colspan="6" class="py-10">
          <div class="flex flex-col items-center justify-center text-gray-500">
            <i class="fa-solid fa-box-open text-5xl mb-3 text-gray-400"></i>
            <h2 class="text-xl font-semibold mb-2">No products yet</h2>
            <p class="mb-4">Start by adding your first product below</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  savePruduct();
  cardsListEL.innerHTML = cards
    .map((card) => {
      const finalPrice = card.price * (1 - card.sale);
      const index = cartItems.findIndex((c) => c.id === card.id);
      return `
        <tr class="even:bg-gray-50 hover:bg-gray-100 transition">
          <td class="p-3">
            <img
              class="w-12 h-12 object-cover rounded-md shadow"
              src="${card.url}"
              alt="${card.name}"
            />
          </td>
          <td class="p-3 font-medium">${card.name}</td>
          <td class="p-3">
            ${
              card.isSale
                ? `
                  <span class="line-through text-gray-400 mr-2">${card.price} so'm</span>
                  <span class="text-emerald-600 font-semibold">${finalPrice} so'm</span>
                `
                : `<span class="text-emerald-600 font-semibold">${card.price} so'm</span>`
            }
          </td>
          <td class="p-3">${card.count} ta</td>
          <td class="p-3 text-center">
            ${
              card.isSale
                ? `<button 
                     class="px-3 py-1 bg-rose-500 text-white rounded-md text-sm hover:bg-rose-600 transition">
                     ${card.sale * 100}%
                   </button>`
                : `<button 
                     class="px-3 py-1 bg-gray-300 text-gray-600 rounded-md text-sm cursor-not-allowed">
                     —
                   </button>`
            }
          </td>
          <td class="p-3 space-x-2">
           ${
             index === -1
               ? `
         <button id='cartt' onclick="addToCart(${card.id})" class="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition cursor-pointer" title="Savatga qo'shish">
              <i class="fas fa-cart-plus"></i>
            </button>
        `
               : ""
           }
            <button onclick="editBtn(${
              card.id
            })" class="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button onclick="deleteBtn(${
              card.id
            })" class="p-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition cursor-pointer">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function rendercarts() {
  let total = 0;

  if (cartItems.length === 0) {
    cartDropdown.innerHTML = `
      <tr>
        <td colspan="6" class="py-10 text-center text-gray-500">
          <i class="fa-solid fa-cart-shopping text-3xl mb-2 text-gray-400"></i>
          <p>Savat bo‘sh</p>
        </td>
      </tr>
    `;
    document.getElementById("cart-total").innerText = "Jami: 0 so‘m";
    return;
  }

  cartDropdown.innerHTML = cartItems
    .map((cart) => {
      const finalPrice = cart.price * (1 - cart.sale);
      total += finalPrice * cart.count;

      return `
        <tr class="even:bg-gray-50 hover:bg-gray-100 transition">
          <td class="p-3">
            <img class="w-12 h-12 object-cover rounded-md shadow"
                 src="${cart.url}" alt="${cart.name}" />
          </td>
          <td class="p-3 font-medium">${cart.name}</td>
          <td class="p-3">
            ${
              cart.isSale
                ? `<span class="line-through text-gray-400 mr-2">${cart.price} so'm</span>
                   <span class="text-emerald-600 font-semibold">${finalPrice} so'm</span>`
                : `<span class="text-emerald-600 font-semibold">${cart.price} so'm</span>`
            }
          </td>
          <td class="p-3">${cart.count} ta</td>
          <td class="p-3">
            ${
              cart.isSale
                ? `<span class="px-2 py-1 bg-rose-500 text-white rounded-md text-xs">${
                    cart.sale * 100
                  }%</span>`
                : `—`
            }
          </td>
          <td class="p-3">
            <button onclick="addToCart(${cart.id})" 
              class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">
              O‘chirish
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  document.getElementById(
    "cart-total"
  ).innerText = `Jami: ${total.toString()} so‘m`;
}

function savePruduct() {
  localStorage.setItem("cards", JSON.stringify(cards));
}

function loadPruduct() {
  cards = JSON.parse(localStorage.getItem("cards") || []);
}
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

function loadCart() {
  cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
}
