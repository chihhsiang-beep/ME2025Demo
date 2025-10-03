
function checkqty () {
    let input = document.getElementById("melonsnum");
    let melonsnum = parseInt(input.value);
        if (isNaN (melonsnum) || melonsnum < 1) {
            input.value = 1;
        } else {
        input.value = melonsnum; 
    }

    }


function increase () {
    let input = document.getElementById("melonsnum");
    let melonsnum = parseInt(input.value);
    let melonqty = parseInt(document.getElementById("melonqty").textContent); 

    if (melonsnum < melonqty) {

        document.getElementById("melonsnum").value ++
        } else {
            document.getElementById("melonsnum").value = melonqty
        }
    }

function decrease () {
    let input = document.getElementById("melonsnum");
    let a = parseInt(input.value);
    if (a >= 1) {
        a --    
    }
    document.getElementById("melonsnum").value = a;
}