window.addEventListener('load', generaEventos);

var decimal = false;
var num1 = "";
var num2 = "";
var operador = ""; // Cambiado el nombre de la variable para evitar conflicto
var paso = 1; // Asegurémonos de que la variable paso esté definida correctamente

function generaEventos() {
    console.log("Evento de carga ejecutado");
    for (var i = 0; i < 10; i++) {
        document.getElementById(i).addEventListener("click", digito);   
    }
    document.getElementById("punto").addEventListener("click", decimal);
    document.getElementById("suma").addEventListener("click", seleccionarOperador);
    document.getElementById("resta").addEventListener("click", seleccionarOperador);
    document.getElementById("producto").addEventListener("click", seleccionarOperador);
    document.getElementById("division").addEventListener("click", seleccionarOperador);
    document.getElementById("igual").addEventListener("click", calcular);
}

function decimal() {
    alert("Pulsado en el punto");
    console.log("Función decimal ejecutada");
    if (paso == 1) {
        if (num1 == "" && decimal == false) {
            num1 += "0.";
            decimal = true;
        } else if (num1 != "" && decimal == false) {
            num1 += ".";
            decimal = true;
        }
        document.getElementById('lcd-value').innerHTML = num1;
    } else if (paso == 2) {
        if (num2 == "" && decimal == false) {
            num2 += "0.";
            decimal = true;
        } else if (num2 != "" && decimal == false) {
            num2 += ".";
            decimal = true;
        }
        document.getElementById('lcd-value').innerHTML = num2;
    } else if (paso == 3) {
        paso = 1;
        num1 = "0.";
        num2 = "";
        operador = ""; // Restablecemos el operador
        document.getElementById('lcd-value').innerHTML = num1;
    }
}

function digito() {
    alert("Pulsado en el dígito");
    console.log("Función digito ejecutada");
    var obj = event.target;
    var valor = obj.innerHTML;
    if (paso == 1) {
        num1 += "" + valor;
        document.getElementById('lcd-value').innerHTML = num1;
    } else if (paso == 2) {
        num2 += valor;
        document.getElementById('lcd-value').innerHTML = num2;
    } else if (paso == 3) {
        paso = 1;
        num1 = "";
        num2 = "";
        document.getElementById('lcd-value').innerHTML = num1;
        operador = ""; // Restablecemos el operador
    }
}

function seleccionarOperador() {
    alert("Pulsado en el operador");
    console.log("Función seleccionarOperador ejecutada");
    if (paso == 1 || paso == 3) {
        // Elegimos operacion y pasamos al paso 2
        operador = event.target.innerHTML;
        decimal = false;
        paso = 2;
    }
}

function calcular() {
    alert("Pulsado en el igual");
    console.log("Función calcular ejecutada");
    decimal = false;
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    if (paso == 2) {
        switch (operador) {
            case "+":
                num1 = num1 + num2;
                break;
            case "-":
                num1 = num1 - num2;
                break;
            case "*":
                num1 = num1 * num2;
                break;
            case "/":
                if (num2 == 0) {
                    alert("Error! Intento de División por 0");
                    return; // Salir de la función si hay división por cero
                } else {
                    num1 = num1 / num2;
                }
                break;
        }
        document.getElementById("lcd-value").innerHTML = num1;
        // Restablecer variables y estado
        num2 = ""; // Restablecer num2 a una cadena vacía
        operador = "";
        paso = 3;
    }
}

