const carrito = new Carrito();
const productRows = document.getElementById("productRows");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const apiProducts = "https://jsonblob.com/api/jsonBlob/1388090865699971072";

let productList = [];
let currency = "€";

fetch(apiProducts)
  .then(response => response.json())
  .then(data => {
    productList = data.products;
    currency = data.currency || "€";
    generarTabla(productList);
  })
  .catch(error => {
    console.error("Error al cargar productos:", error);
  });


function generarTabla(productList) {
  productList.forEach(product => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <strong>${product.title}</strong><br>
        <small>Ref: ${product.SKU}</small>
      </td>
      <td class="quantityControls">
        <button class="btnLess">-</button>
        <input type="number" class="inputQuantity" value="0" min="0" data-sku="${product.SKU}" />
        <button class="btnMore">+</button>
      </td>
      <td>${parseFloat(product.price).toFixed(2)}${currency}</td>
      <td class="itemSubtotal">0${currency}</td>
    `;

    productRows.appendChild(row);
  });

  añadirEventos();
}

function añadirEventos() {
  productRows.addEventListener("click", e => {
    const input = e.target.parentElement.querySelector(".inputQuantity");
    if (!input) return;

    const sku = input.dataset.sku;
    let cantidad = parseInt(input.value);

    if (e.target.classList.contains("btnMore")) cantidad++;
    else if (e.target.classList.contains("btnLess")) cantidad = Math.max(0, cantidad - 1);
    else return;

    input.value = cantidad;
    carrito.actualizarUnidades(sku, cantidad);
    actualizarVista();
  });

  productRows.addEventListener("input", e => {
    if (e.target.classList.contains("inputQuantity")) {
      const sku = e.target.dataset.sku;
      const cantidad = parseInt(e.target.value) || 0;
      carrito.actualizarUnidades(sku, cantidad);
      actualizarVista();
    }
  });
}

function actualizarVista() {
  productList.forEach((product, index) => {
    const fila = productRows.rows[index];
    const input = fila.querySelector(".inputQuantity");
    const subtotal = parseInt(input.value) * parseFloat(product.price);
    fila.querySelector(".itemSubtotal").textContent = `${subtotal.toFixed(2)}${currency}`;
  });

  const resumen = carrito.obtenerResumen(productList);
  cartItemsContainer.innerHTML = "";

  resumen.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cartItemRow");
    div.innerHTML = `
      <span>${item.nombre}</span>
      <span>${item.subtotal}${currency}</span>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = `${carrito.obtenerTotal(productList)}${currency}`;
}

