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

console.log(getComputerChoice())