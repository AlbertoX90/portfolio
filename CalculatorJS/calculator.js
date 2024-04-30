window.addEventListener('load', generaEventos);

var decimal = false;
var num1 = "";
var num2 = "";
var paso = 1;
var resultado = "";
var operador;
/*Pasos de la aplicacion
Paso 1: Se digita el número 1 y se espera a que se pulse el operador
Paso 2: Se ha pulsado en un operador y se digita el num2 esperando el igual
Paso 3: Se ha calculado, se espera o reiniciar o digitar el num2
*/
function generaEventos(){
    //Generamos de forma dinámica los eventos para los botones decimales
    for(var i = 0; i<10;i++){
        document.getElementById(i).addEventListener('click',digitarNumero);
    }
    //Generamos eventos para los operadores
    document.getElementById('suma').addEventListener("click",seleccionarOperador);
    document.getElementById('resta').addEventListener("click",seleccionarOperador);
    document.getElementById('producto').addEventListener("click",seleccionarOperador);
    document.getElementById('division').addEventListener("click",seleccionarOperador);
    //Generamos eventos para el igual y el punto
    document.getElementById('punto').addEventListener("click",hacerDecimal);
    document.getElementById("igual").addEventListener("click",calcular);
}

function digitarNumero(){
    var valor = event.target.innerHTML;
    if(paso == 1){
        //Paso 1 y se pulsa en un digito, se digita el num1
        num1+=""+valor;
        document.getElementById("lcd-value").innerText = num1;
    }
    else if(paso == 2){
        //Paso 2 y se pulsa en un digito, se digita el num2
        num2+=""+valor;
        document.getElementById("lcd-value").innerText = num2;

    }
    else{
        //Paso 3 y se pulsa en un digito, se comienza desde cero
        decimal = false;
        num1 = valor.toString();
        num2 = "".toString();
        paso = 1;
        document.getElementById("lcd-value").innerText = num1;
    }
}

function seleccionarOperador(){
    if(paso == 1){
        if(decimal == true){
            num1 = parseFloat(num1);
        }
        else{
            if(num1 == ""){
                num1 = 0;
            }
            num1 = parseInt(num1);
        }
        operador = event.target.innerHTML;
        paso = 2;
        decimal = false;
        document.getElementById("lcd-value").innerText = num2;

    }
    else if(paso == 3){
        //Paso 3 y se pulsa operador, movemos el resultado al num1
        if(isNaN(resultado)){
            resultado = 0;
        }
        num1 = resultado;
        decimal =false;
        paso = 2;
        num2 = "";
        operador = event.target.innerHTML;
        document.getElementById("lcd-value").innerText = num2;


    }
}

function hacerDecimal(){
    if(paso == 1 && decimal == false){
        //Hacemos decimal el num1.
        if(num1 == ""){
            num1 = "0.";

        }
        else{
            num1= num1+".";
        }
        document.getElementById("lcd-value").innerText = num1;
        decimal = true;
    }
    else if(paso == 2 && decimal == false){
        if(num2 == ""){
            num2 = "0.";
        }
        else{
            num2= num2+".";
        }
        document.getElementById("lcd-value").innerText = num2;
        decimal = true;
    }
}

function calcular(){
    if(paso == 2){
        if(decimal == true){
            num2 = parseFloat(num2);
        }
        else{
            if(num2 == ""){
                num2 = 0;
            }
            num2 = parseInt(num2);
        }
        switch (operador){
            case "+":
                resultado = num1+num2;
                break;
            case "-":
                resultado = num1-num2;
                break;
           case "*":
                resultado = num1*num2;
                break; 
            case "/":
                if(num2 == 0){
                    resultado = "DIV/0!";
                }
                else{
                    resultado = num1/num2;
                }
                break;   
        }
        document.getElementById("lcd-value").innerText = resultado;
        paso = 3;
    }
}
