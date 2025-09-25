document.write('<h1>計算機</h1>');
document.write(`<input id="expr" type="text" placeholder="輸入算式，如：6*(8+8)">`);
document.write(`<div class="calc">`);

let buf = `<div class="row">`;
for (let n = 0; n <= 9; n++) {
  // 每列 3 個：0 1 2 / 3 4 5 / 6 7 8，最後一列 9 + clear
  if (n > 0 && n % 3 === 0) { buf += `</div><div class="row">`; }
  if (n === 9) {
    buf += `<button class="btn" onclick="appendChar('9')">9</button>` +
           `<button class="btn wide" onclick="clearExpr()">clear</button>`;
  } else {
    buf += `<button class="btn" onclick="appendChar('${n}')">${n}</button>`;
  }
}
buf += `</div>`;
document.write(buf);

document.write(`<div class="row">` +
               `<button class="btn" onclick="appendChar('+')">+</button>` +
               `<button class="btn" onclick="appendChar('-')">-</button>` +
               `<button class="btn" onclick="appendChar('*')">*</button>` +
               `<button class="btn" onclick="appendChar('/')">/</button>` +
               `</div>`);

               