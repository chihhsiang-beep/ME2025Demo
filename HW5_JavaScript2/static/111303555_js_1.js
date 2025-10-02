let answer = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let startTime = null; 

function startTimer() {
    startTime = Date.now();
    const timerElement = document.getElementById("times");

    timerInterval = setInterval(() => {
        let seconds = getElapsedSeconds();
        timerElement.textContent = `已經過時間: ${seconds} 秒`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function getElapsedSeconds() {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
}


function onGuess(){

    if (attempts === 0 && !startTime) {
        startTimer(); 
    }

    const guessField = document.getElementById("guessField");
    const guess = Number(guessField.value);
    attempts++;

    if (guess === answer) {

        let seconds = getElapsedSeconds();
        let list = document.getElementById("list");
        let record = document.createElement("p");

        record.textContent = `猜了${attempts}次，耗時${seconds}秒，時間${new Date().toLocaleTimeString()}`;
        list.appendChild(record);

        alert(`恭喜你猜對了！答案是${answer}。你總共猜了${attempts}次，花了${seconds}秒`);
        attempts = 0; 
        answer = Math.floor(Math.random() * 100) + 1;
        guessField.value = '';
        startTime = null;
        document.getElementById("times").textContent = "秒數:"
        document.getElementById("message").textContent = "";
    } else if (guess < answer) {
        document.getElementById("message").textContent = "太小了，再試一次！";
    } else if (guess > answer) {   
        document.getElementById("message").textContent = "太大了，再試一次！";
    }
}



