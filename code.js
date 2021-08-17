// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!
let randomUrl = 'https://jservice.io/api/random';
let cluesUrl = 'https://jservice.io/api/clues';

function getRandomQuestionIndex(max) {
    return Math.floor(Math.random() * max);
}  

function displayQuestion(question, answer) {
    let header = document.querySelector("h1");
    header.innerHTML = question;
    let input = document.querySelector("input");
    input.setAttribute("pattern", `${answer}|${answer.toLowerCase()}|${answer.toUpperCase()}|${answer[0].toUpperCase()}${answer.substring(1)}`);
}

function fetchRandomQuestion() {
    document.querySelector("input").value = "";
    let message = document.querySelector("div");
    if (message) {
        message.remove();
    }

    fetch(randomUrl)
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result, result[0].category_id);
        let categoryId = result[0].category_id;
        console.log('categoryId:', categoryId);
    
        fetch(cluesUrl, { category: categoryId })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            let randomQuestion = result[getRandomQuestionIndex(100)];
            console.log('Random Question:', randomQuestion);

            displayQuestion(randomQuestion.question, randomQuestion.answer);

            clearInterval();
        })
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function incrementScore() {
    let scoreText = document.querySelector(".score");
    let score = parseInt(scoreText.innerText);
    score++;
    scoreText.innerText = score;
}

function displayMessage(correct) {
    let message = document.createElement("div");
    if (correct) {
        message.innerHTML = "Yay, you answered correctly!";
    } else {
        message.innerHTML = "You lost miserably!"
    }
    document.querySelector("form").append(message);
}

let button = document.getElementById("submit");

button.onclick = function(event) {
    event.preventDefault();
    console.log("Clicked submit button");

    let correctAnswer = document.querySelector("input:valid");
    if (correctAnswer) {
        console.log("Yay!");
        incrementScore();
        displayMessage(true);
    } else {
        console.log("You lost miserably!");
        document.querySelector(".score").innerText = 0;
        displayMessage(false);
    }
    setTimeout(fetchRandomQuestion, 1000);
}

fetchRandomQuestion();
