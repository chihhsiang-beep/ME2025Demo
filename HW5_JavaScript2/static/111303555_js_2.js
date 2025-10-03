
function checkqty (inputId) {
    let input = document.getElementById(inputId);
    let num = parseInt(input.value);
        if (isNaN (num) || num < 1) {
            input.value = 1;
        } else {
        input.value = num; 
    }

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
    }

function decrease (inputId) {
    let input = document.getElementById(inputId);
    let a = parseInt(input.value);
    if (a >= 1) {
        a --    
    }
    document.getElementById(inputId).value = a;
}