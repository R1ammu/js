function getRandomInt() {
    const min = 1;
    const max = 3;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getComputerChoice() {
    if (getRandomInt() === 1) {
        console.log('opponent picked rock')
        return 'rock'
    } else if (getRandomInt() === 2) {
        console.log('opponent picked paper')
        return 'paper'
    } else {
        console.log('opponent picked scissors')
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










function playRound(humanChoice, computerChoice) {
    humanChoice = getHumanChoice()
    computerChoice = getComputerChoice()

    if (humanChoice === computerChoice) {
        return 'ROUND DRAWN!';
    } else if ((humanChoice === 'rock' && computerChoice === 'scissors') ||
    (humanChoice === 'paper' && computerChoice === 'rock') ||
    (humanChoice === 'scissors' && computerChoice === 'paper')) {
        return 'ROUND WON!';
    } else {
        return 'ROUND LOST.'
    }
}


console.log(playRound())






// if human = computer = draw
//     human > computer = winner 
// else loser