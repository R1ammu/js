const rock = 1
const paper = 2
const scissors = 3
let rockPaperScissors

document.getElementById( "placeholder" ). innerText = rockPaperScissors;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
function getRPS(getRandomInt) {
    if (getRandomInt === 1) {
        console.log("rock")
    } else if (getRandomInt === 2) {
        console.log("paper")
    } else if (getRandomInt === 3) {
        console.log("scissors")
    }
}
  
getRPS(getRandomInt(1, 3))