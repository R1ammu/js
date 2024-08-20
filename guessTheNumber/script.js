function getUserInt() {
    let numberInput = document.getElementById('userInput');
    let inputValue = numberInput.value;
    let convertedValue = parseInt(inputValue, 10);
    
    return convertedValue;
}

// document.getElementById('submit').onclick = function() {
//     let userValue = getUserInt();  // Call the function and store the returned value
//     console.log(userValue);        // Log the returned value or use it in another part of your code
// }

function getRandomInt() {
    const min = 1;
    const max = 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function compare() {
    const number = getRandomInt()
    document.getElementById('submit').onclick = function() {
        let userValue = getUserInt();

    if (userValue < number) {
       console.log("Too low.")
    } else if (userValue > number) {
        console.log("Too high.")
    } else {
        console.log("Congradulations, you guessed the number!")
    }
    }
}

console.log(compare())