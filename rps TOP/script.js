function getRandomInt() {
    const min = 1;
    const max = 3;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getComputerChoice() {
    if (getRandomInt() === 1) {
        console.log('Opponent picked rock')
        return 'rock'
    } else if (getRandomInt() === 2) {
        console.log('Opponent picked paper')
        return 'paper'
    } else {
        console.log('Opponent picked scissors')
        return 'scissors'
    }
}

function getHumanChoice() {
    let userInput = prompt('rock, paper, scissors!');
    userInput = userInput.toLowerCase();
    while (userInput !== 'rock' && userInput !== 'paper' && userInput !== 'scissors') {
        userInput = prompt('You have to type either "rock", "paper" or "scissors"').toLowerCase();
    } if (userInput === 'rock') {
        console.log('You picked rock')
        return userInput;
    } else if (userInput === 'paper') {
        console.log('You picked paper')
        return userInput;
    } else {
        console.log('You picked scissors')
        return userInput;
    }
}

function playRound(humanChoice, computerChoice) {
    humanChoice = getHumanChoice()
    computerChoice = getComputerChoice()

    if (humanChoice === computerChoice) {
        console.log('ROUND DRAWN.')
        return 'draw';
    } else if ((humanChoice === 'rock' && computerChoice === 'scissors') ||
    (humanChoice === 'paper' && computerChoice === 'rock') ||
    (humanChoice === 'scissors' && computerChoice === 'paper')) {
        console.log('ROUND WON.')
        return 'win';
    } else {
        console.log('ROUND LOST.')
        return 'loss';
    }
}

function playGame() {
    let humanScore = 0 
    let computerScore = 0
        while (humanScore < 5 && computerScore < 5) {
            result = playRound() 
            if (result === 'win') {
                humanScore++
                console.log('Your score is ' + humanScore)
                console.log('Your opponents score is ' + computerScore)
            } else if (result === 'loss') {
                computerScore++
                console.log('Your score is ' + humanScore)
                console.log('Your opponents score is ' + computerScore)
            } else {
                console.log('Your score is ' + humanScore)
                console.log('Your opponents score is ' + computerScore)
        }
    } if (humanScore === 5) {
        console.log('YOU WON THE GAME!')
    } else {
        console.log('YOU LOST.')
    }
}





console.log(playGame())