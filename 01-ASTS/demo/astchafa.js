// Recibe una operación aritmética y devuelve el resultado junto con el
// el árbol de sintáxis que lo resolvió

const Tokenizer = {
  init: (entrada) => {
    this.entrada = entrada;
    this._index = 0;
    this.nextToken = this.entrada[this._index];
    return `Se va a procesar la cadena ${this.entrada}`;
    this.ended = false;
  },
  length: () => this.entrada?.length,
  finished: () => this.ended,
  scanToken: () => {
    this._index++;
    if (this._index >= this.entrada.length) {
      this.ended = true;
      return undefined;
    }
    this.nextToken = this.entrada[this._index];
    return this.entrada[this._index-1];
  },
  peek: () => this.nextToken
}
Tokenizer.init("2*5+3")
Tokenizer.scanToken()
Tokenizer.scanToken()
Tokenizer.scanToken()
Tokenizer.scanToken( )
Tokenizer.finished()
while (!Tokenizer.finished) {

}
/*
class Entero {
  constructor(valor) {
    this.value = valor;
  }
  solve(){
    return this.value;
  }
  print(){
    return this.value;
  }
}
class TreeNode  {
  constructor(type, izq, der, solve, print) {
    this.type = type;
    this.left = izq;
    this.right = der;
  }
}
const suma = new TreeNode('+', new Entero(5), new Entero(3))
const multiplicar = new TreeNode('*', new Entero(2), suma)
*/

// Toda subClase debe implementar el método .eval() y el método print()
// El elemento más simple es el entero y el NodoÁrbol
// class tokenUnario {
//   constructor(tipo, calcular, imprimir) {
//     this.tipo = tipo;
//     this.calcular = calcular;
//     this.imprimir = imprimir;
//   }
// }
// const resolver = (t1)
// const sss = (tn) => {
// }
// const print = (tn) => {
// }
// sumar.solve(sss)
//   sumar.print(print)

// class Add {
//   constructor(izq, der) {
//     this.left = izq;
//     this.right = der;
//     this._calcular = () => {this.left.calcular()+this.right.calcular()};
//     this._print = () => {this.left.calcular() + '➕' + this.right.calcular()};
//     this.type = "Sumar";
//   }
//   print() {
//     return this._print //?+
//   }
//   calcular() {
//     return this._calcular()
//   }}
// const Multiply = ("Multiplicar", ()=>{this.left()*this.right()}, ()=>`${this.left()} ✖ ${this.right}`)
// class Multiply {
//   constructor(izq, der) {
//     this.left = izq;
//     this.right = der;
//     this.calcular = () => {this.left.calcular()*this.right.calcular()};
//     this.print = () => {this.left.calcular() + '✖' + this.right.calcular()};
//     this.type = "Multiplicar";
//   }
// }


// let primeraCuenta = new Add( new Entero(3),  new Entero(9))
// primeraCuenta.calcular() //?+
// let segundaCuenta = new Multiply( primeraCuenta, new Entero(2) ) 
// primeraCuenta.print()
// segundaCuenta.print();
/*
// const Substract = new tokenBinario("Restar", ()=>{this.left()-this.right()}, ()=>`${this.left()} ➖ ${this.right}`)
class Substract {
  constructor() {
    super(
      ()=>{this.left()-this.right()},
      ()=>`${this.left()} ➖ ${this.right}`
    );
    this.tipo = "Dividir";
  }
}
  // const Divide = ("Dividir", ()=>{this.left()/this.right()}, ()=>`${this.left()} ➗ ${this.right}`)
  class Divide {
    constructor() {
      super(
        ()=>{this.left()*this.right()},
        ()=>`${this.left()} ➗ ${this.right}`
        );
        this.tipo = "Dividir";
      }
    }*/
    
    
// Expresiónes

// Términos

// Factores




    // setLeft(token) {
    //   this.left = token;
    // }
    // setRight(token) {
    //   this.right = token;
    // }