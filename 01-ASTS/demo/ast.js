// Recibe una operación aritmética y devuelve el resultado junto con el
// el árbol de sintáxis que lo resolvió
const { isSpace } = require("markdown-it/lib/common/utils");
const t_eof = 1;
const t_literal = 2;
const t_add = 3;
const t_sub = 4;
const t_mul = 5;
const t_div = 6;


const Tokenizer = {
  init: (entrada) => {
    this.entrada = entrada.concat('\n').split('');
    this._index = 0;
    this.nextToken = this.entrada[this._index];
    this.buffer = null;
    return `Se va a procesar la cadena ${this.entrada}`;
    this.ended = false;
  },
  length: () => this.entrada?.length,
  finished: () => this.ended,
  getChar: () => this.entrada.shift(),
  scan: () => {
    let c = Tokenizer.getChar();
    while (isSpace(c)) {
      c = Tokenizer.getChar();
    }

    if (c === '\n') {
      console.log('Se alcanzó el final de la cadena!')
      return t_eof;
    } 

    if (Number.isInteger(c)) {
      Tokenizer.buffer = [];
      do {
        Tokenizer.buffer.push(c);
        c = Tokenizer.getChar();
      } while (Number.isInteger(c));
      Tokenizer.buffer.push('\0');
      return t_literal;
    }

    switch (c) {
      case '+': c = Tokenizer.getchar(); return t_add;
      case '-': c = Tokenizer.getchar(); return t_sub;
      case '*': c = Tokenizer.getchar(); return t_mul;
      case '/': c = Tokenizer.getchar(); return t_div;
      default:
        throw 'Algo malio sal.'
    }
  },
  peek: () => this.nextToken
}

Tokenizer.init("   222*5+3")
// Tokenizer.scan()