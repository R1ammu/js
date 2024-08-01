function getRandomInt() {
    const min = 1;
    const max = 3;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getComputerChoice() {
    if (getRandomInt() === 1) {
        return 'rock'
    } else if (getRandomInt() === 2) {
        return 'paper'
    } else {
        return 'scissors'
    }
}



function getHumanChoice() {
    let userInput = prompt('rock, paper, scissors!');
    userInput = userInput.toLowerCase();
    while (userInput !== 'rock' && userInput !== 'paper' && userInput !== 'scissors') {
        userInput = prompt('You have to type either "rock", "paper" or "scissors"').toLowerCase();
    }
    return userInput;
}

console.log(getHumanChoice())
console.log(getComputerChoice())