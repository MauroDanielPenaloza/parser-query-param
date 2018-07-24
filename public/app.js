const stringConstructor = "test".constructor;
const arrayConstructor = [].constructor;
const objectConstructor = {}.constructor;

function getQueryMaprams(text) {
    try {
        const object = JSON.parse(text)
        var result = "";
        if(object.constructor === arrayConstructor){ //Valido que sea un json y no un array
            return "No se admiten arreglos debe ser un objeto JSON"
        }
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const e = object[key];
                if(e.constructor === objectConstructor) { //Si descubro que viene un objeto dentro de otro "aplano" el resultado y los atributos del hijo pasan como parametros
                    result += getQueryMaprams(JSON.stringify(e));
                } else if(e.constructor == arrayConstructor) { //Si descubro que viene un arreglo paso todos los parametros con la misma key (Jackso reconoce de esa forma una lista y se mapea a una lista en backend)
                    e.forEach(subE => {
                        if(subE.constructor === objectConstructor) {
                            //TODO hacer que sea generico para un arbol de multiples niveles
                        } else if(subE.constructor === arrayConstructor){
                            //TODO hacer que sea generico y volver a evaluar el arreglo sin limites recursivamente
                        } else {
                            result += key +"="+subE+"&";
                        }
                    });
                } else if( e.constructor === stringConstructor){
                    result += key + "="+e.replace(/ /g, "%20") +"&";//reemplazo el espacio en blanco del string pero en angular 5 no haria falta                     
                } else { //Si descubro que viene un nuemero directamente lo pongo con el valor que corresponde
                    result += key +"="+e + "&";
                }
            }
         
        }
        return "example.com/path"+"?"+result.slice(0, result.length -1);//En este paso elimino el & que quedo al final y ademas agrego el ? al comienzo del string

    } catch(e) {
        console.error(e);
        return "JSON no valido";
    }
}
$(document).ready(function(){
    var initialVa= '\n{\n\t"String":"Soy un string", \n\t"arreglo":["aa","bb"]\n} ';
    $("#text").val(initialVa);
    $("#result").append(getQueryMaprams(initialVa));
    $("#text").keyup(function(){
        const text = $("#text").val();
        result = getQueryMaprams(text);
        $("#result").empty();
        $("#result").append(result);
    });
});