// FIZZBUZZ

let userInput = prompt("Procure the integer!");
let userNumber = parseInt(userInput, 10);

let b = "Buzz";
let f = "Fizz";
let fb = "FizzBuzz";

function numbers(userNumber) {
  if (isNaN(userNumber) || userNumber <= 0) {
    console.log("The input is not a valid positive number.");
    return;
  }

let int = 0;

  while (userNumber > int) {
    int++;
    if (int % 3 === 0 && int % 5 === 0) {
    console.log(fb);
    } else if (int % 5 === 0) {
      console.log(b)
    } else if (int % 3 === 0) {
      console.log(f)
    } else {
      console.log(int)
    }
  }
}

numbers(userNumber);



// FROM TOP
let answer = parseInt(prompt("Please enter the number you would like to FizzBuzz up to: "));

for (let i = 1; i <= answer; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}