class Carrito {
  constructor() {
    this.carrito = new Map();
  }

  actualizarUnidades(sku, unidades) {
    if (unidades <= 0) {
      this.carrito.delete(sku);
    } else {
      this.carrito.set(sku, unidades);
    }
  }

  obtenerCantidad(sku) {
    return this.carrito.get(sku) || 0;
  }

  obtenerTotal(productList) {
    let total = 0;
    this.carrito.forEach((cantidad, sku) => {
      const producto = productList.find(p => p.SKU === sku);
      if (producto) {
        total += cantidad * parseFloat(producto.price);
      }
    });
    return total.toFixed(2);
  }

  obtenerResumen(productList) {
    let items = [];
    this.carrito.forEach((cantidad, sku) => {
      const producto = productList.find(p => p.SKU === sku);
      if (producto) {
        items.push({
          nombre: producto.title,
          subtotal: (cantidad * parseFloat(producto.price)).toFixed(2)
        });
      }
    });
    return items;
  }
}