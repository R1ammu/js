// SUM

function calculateSum() {
    // Use let for variables that will change
    let num1 = parseFloat(document.getElementById('num1').value);
    let num2 = parseFloat(document.getElementById('num2').value);
  
    // Calculate the sum
    let sum = num1 + num2;
  
    // Display the result
    document.getElementById('result').innerText = sum;
  }