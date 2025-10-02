let answer = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let timerId = null;

function startTimer() {
    let seconds = 0;
    const timerElement = document.getElementById("times");
    return setInterval(() => {
        seconds ++;
        timerElement.textContent = `已經過時間: ${seconds} 秒`;
    }, 1000);       
}
function stopTimer(timer) {
    clearInterval(timer);
}
function onGuess(){
    if (attempts === 0 && !timerId) {
        timerId = startTimer();
    }
    const guessField = document.getElementById("guessField");
    const guess = Number(guessField.value);
    attempts++;

    if (guess === answer) {
        stopTimer(timerId);
        alert(`恭喜你猜對了！答案是${answer}。你總共猜了${attempts}次。`);
        attempts = 0; 
        answer = Math.floor(Math.random() * 100) + 1;
        guessField.value = '';
    } else if (guess < answer) {
        document.getElementById("message").textContent = "太小了，再試一次！";
    } else if (guess > answer) {   
        document.getElementById("message").textContent = "太大了，再試一次！";
    }
}

