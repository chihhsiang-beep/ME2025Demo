const answer = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
function onGuess(){
    const guessField = document.getElementById("guessField");
    const guess = Number(guessField.value);
    attempts++;

    if (guess === answer) {
        alert(`恭喜你猜對了！答案是${answer}。你總共猜了${attempts}次。`);
        attempts = 0; 
        answer = Math.floor(Math.random() * 100) + 1;
        guessField.value = '';
    } else if (guess < answer) {
        alert("太小了，再試一次！");
    } else if (guess > answer) {   
        alert("太大了，再試一次！");
    }
}

