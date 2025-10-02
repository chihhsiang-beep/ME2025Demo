
function checkqty () {
    melonsnum = document.getElementById("melonsnum").value
    melonqty = document.getElementById("melonqty").value
    if (melonsnum > melonqty) {
        document.getElementById("melonsnum").value = melonqty
    }
}

function increase () {
    document.getElementById("melonsnum").value ++
}

function decrease () {
    let a = parseInt(document.getElementById("melonsnum").value) 
    if (a > 0) {
        a --    
    }
    document.getElementById("melonsnum").value = a;
}