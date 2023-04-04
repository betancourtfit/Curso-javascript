function calculadora(num1, num2, operador) {
  
  let resultado;
    switch(operador) {
      case '+':
        resultado = num1 + num2;
        break;
      case '-':
        resultado = num1 - num2;
        break;
      case '*':
        resultado = num1 * num2;
        break;
      case '/':
        resultado = num1 / num2;
        break;
      default:
        console.log("Operador inválido");
    }
    return resultado;
  }

  let num1 = parseFloat(prompt("Ingrese el primer número:"));
  let num2 = parseFloat(prompt("Ingrese el segundo número:"));
  let operador = prompt("Ingrese el operador aritmético (+, -, *, /):");

  alert(calculadora(num1, num2, operador))