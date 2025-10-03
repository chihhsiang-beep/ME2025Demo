
function checkqty (inputId) {
    let input = document.getElementById(inputId);
    let num = parseInt(input.value);
        if (isNaN (num) || num < 1) {
            input.value = 1;
        } else {
        input.value = num; 
    }
    melloncalculate();
    bananacalculate();
    RTXcalculate();
    }


function increase (inputId, qtyId) {
    let input = document.getElementById(inputId);
    let num = parseInt(input.value);
    let qty = parseInt(document.getElementById(qtyId).textContent); 

    if (num < qty) {

        input.value ++
        } else {
            input.value = qty
        }
    melloncalculate();
    bananacalculate();
    RTXcalculate();
    }

function decrease (inputId) {
    let input = document.getElementById(inputId);
    let a = parseInt(input.value);
    if (a >= 1) {
        a --    
    }   
    document.getElementById(inputId).value = a;
    melloncalculate();
    bananacalculate();
    RTXcalculate();
}

function melloncalculate() {
    let qty = parseInt(document.getElementById("melonsnum").value);
    let price = parseInt(document.getElementById("melonprice").textContent.replace("$", ""));
    let total = qty * price;
    document.getElementById("melontotal").textContent = "$" + total;
}

function bananacalculate() {
    let qty = parseInt(document.getElementById("banananum").value);
    let price = parseInt(document.getElementById("bananaprice").textContent.replace("$", ""));
    let total = qty * price;
    document.getElementById("bananatotal").textContent = "$" + total;
}

function RTXcalculate() {
    let qty = parseInt(document.getElementById("RTXnum").value);
    let price = parseInt(document.getElementById("RTXnprice").textContent.replace("$", ""));
    let total = qty * price;
    document.getElementById("RTXtotal").textContent = "$" + total;
}
