class BinaryTree {
  constructor(valor) {
    this.value = valor;
    this.left = null;
    this.right = null;
  }
  addLeft(valor) {
    var nuevoArbol = new BinaryTree(valor);
    this.left = nuevoArbol;
  }
  addRight(valor) {
    var nuevoArbol = new BinaryTree(valor);
    this.right = nuevoArbol;
  }
}

class Hoja {
  constructor(valor) {
    this.value = valor;
  }
}
module.exports = {BinaryTree, Hoja};