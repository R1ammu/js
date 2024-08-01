const human = getInput()
const computer = getRPS()


// User output
function getInput(userInput) {
    userInput = prompt('rock, paper, scissors!')
    if ( userInput === 'rock' || userInput === 'paper' || userInput === 'scissors') {
        return userInput
    } else {
        while ( userInput !== 'rock' || userInput !== 'paper' || userInput !== 'scissors') {
            userInput = prompt('You have to type either "rock", "paper" or "scissors"')
            if ( userInput === 'rock' || userInput === 'paper' || userInput === 'scissors') {
                return userInput
            }
        }
    }
}

// GPT CODE 
// function getImput() {
//     let userImput = prompt('rock, paper, scissors!');
//     while (userImput !== 'rock' && userImput !== 'paper' && userImput !== 'scissors') {
//         userImput = prompt('You have to type either "rock", "paper" or "scissors"');
//     }
//     return userImput;
// }


// Computer output
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
function getRPS() {
    const randomInt = getRandomInt(1, 3);
    let computerInput
    if (randomInt === 1) {
       computerInput = "rock"
    } else if (randomInt === 2) {
        computerInput = "paper"
    } else if (randomInt === 3) {
        computerInput = "scissors"
    }
    return computerInput
}


// Winner determenator
function getWinnerEasy() {
    if (human === 'rock' && computer === 'scissors' || 
        human === 'paper' && computer === 'rock' ||
        human === 'scissors' && computer === 'paper') {
            console.log('YOU WON!')
    } else if (human === 'rock' && computer === 'rock' || 
               human === 'paper' && computer === 'paper' ||
               human === 'scissors' && computer === 'scissors') {
                    console.log('A DRAW.')
    } else { 
        console.log('YOU LOST.')
    }
}


function rockPaperScissorsConsole () {
    console.log('You played ' + human)
    console.log('Your opponent played ' + computer)
    getWinnerEasy()
}

rockPaperScissorsConsole()