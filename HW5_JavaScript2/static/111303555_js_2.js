
function checkqty (inputId) {
    let input = document.getElementById(inputId);
    let num = parseInt(input.value);
        if (isNaN (num) || num < 1) {
            input.value = 1;
        } else {
        input.value = num; 
    }
    updatetotal()
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
    updatetotal()
    }

function decrease (inputId) {
    let input = document.getElementById(inputId);
    let a = parseInt(input.value);
    if (a >= 1) {
        a --    
    }   
    document.getElementById(inputId).value = a;
    updatetotal()
}
function updatetotal() {
    calculate("melonsnum", "melonprice", "melontotal");
    calculate("banananum", "bananaprice", "bananatotal");
    calculate("RTXnum", "RTXprice", "RTXtotal");

}
function calculate(numId, priceId, totalId) {
    let qty = parseInt(document.getElementById(numId).value);
    let price = parseInt(document.getElementById(priceId).textContent.replace("$", ""));
    let total = qty * price;
    document.getElementById(totalId).textContent = "$" + total;
}

function AllCheckboxes(selectCheckbox) {
    const checkboxes = document.querySelectorAll(".product");
    checkboxes.forEach(cb => {
        cb.checked = selectCheckbox.checked;  // 根據 select checkbox 的勾選狀態設定其他商品的勾選狀態
    });
    }
function selectAllcheckedbox() {
    const checkboxes  = document.querySelectorAll(".product");
    const selectAllcheckedbox = document.getElementById("checkbox_all");
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    selectAllcheckedbox.checked = allChecked;
    if (!allChecked) {
         selectAllcheckedbox.checked = false;
    }
}



function checkout() {
    let checkboxes = document.querySelectorAll(".product");
    let total = 0;

    checkboxes.forEach(cb => {
        let qtyId = cb.getAttribute("data_qty");
        let totalId = cb.getAttribute("data_total");
        let qty = parseInt(document.getElementById(qtyId).value) || 0;
        let subtotal = parseInt(document.getElementById(totalId).textContent.replace("$", "")) || 0;

    if (cb.checked) {
        total += subtotal;
        let stockId = cb.getAttribute("data_qty"); 
        let stock = parseInt(document.getElementById(stockId).textContent);
         if (stock >= qty) {
                stock -= qty;
            } else {
                stock = 0; 
            }

            document.getElementById(stockId).textContent = stock;
            
            if (stock > 0) {
                document.getElementById(qtyId).value = 1;
            } else {
                document.getElementById(qtyId).value = 0;
                document.getElementById(qtyId).disabled = true;  
            }
    } else {
        document.getElementById(qtyId).value = 0;
        document.getElementById(totalId).textContent = "$0";
    }
});
    if (total <= 0){
        return;
    }
    document.getElementById("total").textContent = "$" + total;

    alert("感謝您的購買，您購買的產品如下:"
    + "\n西瓜: " + document.getElementById("melonsnum").value + " 顆"
    + "\n香蕉: " + document.getElementById("banananum").value + " 根"
    + "\nRTX5070: " + document.getElementById("RTXnum").value + " 張"
    + "\n總金額: " + document.getElementById("total").textContent); 

    updatetotal()

    checkboxes.forEach(cb => {
        cb.checked = false;
    })
    
}
