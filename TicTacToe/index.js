window.onload = function(){
    var reiniciar =document.getElementById('reiniciar');
    reiniciar.style.display='none';
    for(var i=1;i<10;i++){
        document.getElementById(i).addEventListener('click',pulsar);
    }
}
var turno = "X";
var victoria = false;
var empate = false;
var posibilidades = [[1,2,3],[1,4,7],[1,5,9],[2,5,8],[3,5,7],[3,6,9],[4,5,6],[7,8,9]];
var resultado = "";
function pulsar(event){
    var evento = event.target.id;
    var objeto = document.getElementById(evento);
    var valor = objeto.innerHTML;
    if(valor != "X" && valor != "O" && !victoria && !empate){
        //CASILLA NO PULSADA
        
        objeto.innerHTML = turno;

        //COMPROBAR VICTORIA
        
        victoria = compruebaVictoria();
        
        if(victoria == false){
            //COMPROBAR EMPATE
            empate = compruebaEmpate();
            if(empate){
                resultado+="HABEIS EMPATADO";
                document.getElementById('resultado').innerHTML = resultado;
                var reiniciar = document.getElementById('reiniciar').style.display='block';
            }
            else{
                
                if(turno == "X"){
                    turno = "O";
                }
                else{
                    turno = "X";
                }
    
            }
        }
        else{
            resultado+="VICTORIA DE "+ turno;
            document.getElementById('resultado').innerHTML = resultado;
            var reiniciar = document.getElementById('reiniciar').style.display='block';
        }

    }
}
function compruebaVictoria(){
    console.log("Entramos en funcion compruebaVictoria");
    var victora = false;
    for(var i = 0; i<8; i++){
        var index = posibilidades[i];
        var value1 = index[0];
        var value2 = index[1];
        var value3 = index[2];
        var celda1 = document.getElementById(value1).innerHTML;
        var celda2 = document.getElementById(value2).innerHTML;
        var celda3 = document.getElementById(value3).innerHTML;
        if(celda1 == turno && celda2 == turno && celda3 == turno){
            victoria = true;
            return victoria;
        }
    }
    return victoria;
    
}

function compruebaEmpate(){
    var empate = true;
    for(var i = 1; i<10;i++){
        var value = document.getElementById(i).innerHTML;
        if(value!="X" && value != "O"){
            empate = false;
            return empate;
        }
    }
    return empate;
}