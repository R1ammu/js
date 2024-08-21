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
    let attempts = 0
    const number = getRandomInt()
    document.getElementById('submit').onclick = function() {
        attempts++;
        let userValue = getUserInt();

    console.log(number)

    if (userValue < number) {
       document.getElementById('ph').innerText = "Too low."
    } else if (userValue > number) {
       document.getElementById('ph').innerText = "Too high."
    } else if (userValue === number && attempts <= 5) {
       document.getElementById('ph').innerText = `Congratulations you guessed the number in ${attempts} tries!`
    } else document.getElementById('ph').innerText = "Congratulations you guessed the number,\n now try to guess it in less than 5 attempts."
    }
}


function play() {
    compare()
}

play()