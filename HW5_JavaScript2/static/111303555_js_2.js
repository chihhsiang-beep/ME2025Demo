
function checkqty (inputId) {
    let input = document.getElementById(inputId);

    let stockId;
    if (inputId === 'melonsnum') {
        stockId = 'melonqty';
    } else if (inputId === 'banananum') {
        stockId = 'bananaqty';
    } else if (inputId === 'RTXnum') {
        stockId = 'RTXqty';
    }
    let stockElement = document.getElementById(stockId);
    let stock = stockElement ? parseInt(stockElement.textContent) : Infinity;
    let num = parseInt(input.value);
        if (isNaN (num) || num < 1) {
            num = 1;
        }  else if (num > stock) {
        num = stock; 
    }
    input.value = num;
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
    let purchasedQuantities = {}; 

    checkboxes.forEach(cb => {
        let qtyInputId = cb.getAttribute("data_qty");
        let totalId = cb.getAttribute("data_total");
        let stockId = cb.getAttribute("data-stock-id");

        let qtyInput = document.getElementById(qtyInputId);
        let stockElement = document.getElementById(stockId);
        let totalElement = document.getElementById(totalId);

        if (!qtyInput || !stockElement || !totalElement) {
            return; // 如果找不到元素，跳過這個商品
        }

        let qty = parseInt(qtyInput.value) || 0; 
        let subtotal = parseInt(totalElement.textContent.replace("$", "")) || 0;
        let productName = cb.parentElement.nextElementSibling.textContent.trim().split('\n').pop().trim();
    if (cb.checked && qty > 0) {
        total += subtotal;
        purchasedQuantities[productName] = qty; 

        let stock = parseInt(stockElement.textContent); 

         if (stock >= qty) {
                stock -= qty;
            } else {
                stock = 0; 
            }
            stockElement.textContent = stock;
            qtyInput.value = 1;
            totalElement.textContent = "$0"; // 重設小計
            cb.checked = false; // 取消勾選

            if (stock <= 0) {
                qtyInput.value = 0; 
                qtyInput.disabled = true;
            } 
        }   else {

             qtyInput.value = 1;
             totalElement.textContent = "$0";
             cb.checked = false;
    } 
});
    document.getElementById("checkbox_all").checked = false;

    if (total <= 0){
        return;
    }
    document.getElementById("total").textContent = "$" + total;

 alert("感謝您的購買，您購買的產品如下:"
        + "\n西瓜: " + (purchasedQuantities["西瓜"] || 0) + " 顆"
        + "\n香蕉: " + (purchasedQuantities["香蕉"] || 0) + " 根"
        + "\nRTX5070: " + (purchasedQuantities["RTX5070"] || 0) + " 張"
        + "\n總金額: " + document.getElementById("total").textContent);

    updatetotal()

    checkboxes.forEach(cb => {
        cb.checked = false;
    })
    
}
