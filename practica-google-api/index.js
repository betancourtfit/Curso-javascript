// const GSheetReader = require('g-sheets-api');

// GSheetReader(
//     {
//         sheetId: '1sDzQURSh6jqT4GAOyW-spRsGXUiPFgexOgyYhh0en0E',
//         sheetNumber: 1,
//         sheetName: 'BBDD_Memb',
//         returnAllResults: false,
//       // Note: this API Key is locked to this demo, it can't be
//       // used in your own projects.
//         apiKey: "BAIzaSyByUNEi69vg0lOf3w7LDKwVjPAA6Y9IPTg",
//         // filter: {
//         //     'DNI': 95489618,
//         //     },
//     },
//     (results) => {
//         console.log("exito")
//     },
//     (error) => {
//       console.log("error");
//     }
//   );
// ---------------------------------------
// Declaracion de variables y constantes
const sheetID = '1sDzQURSh6jqT4GAOyW-spRsGXUiPFgexOgyYhh0en0E';
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
const sheetName = 'BBDD_Memb';
let dni = 31446785;
let qu = `Select A,B,C,D,G WHERE A = ${dni}`
let query = encodeURIComponent(qu);
const data = [];
let url = `${base}&sheet=${sheetName}&tq=${query}`;
const output = document.querySelector('.output');
/* 
---------------------------------------------------------
Este es el event listener que esta a la espera del envio de datos para iniciar la funcion de validacion del dni Store
---------------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click",validarDni);
});


/* 
---------------------------------------------------------
Esta es la funcion que valida que el número de DNI sea válido y de ser asi ejecuta la funcion init
---------------------------------------------------------
*/
function validarDni() {
    dni = parseInt(document.getElementById("dniInput").value);
    if (dni > 1000) {
        // Deja un log de que el dni fue validado
        console.log("DNI válido:");
        init();
    } else {
        // Muestra un mensaje de error
        alert("DNI inválido, por favor reingrese");
    }
}

/* 
---------------------------------------------------------
Esta es la funcion principal que trae y prepara la informacion desde el archivo de google sheets
---------------------------------------------------------
*/
function init(){
    // Hago la consulta con el fetch que dentro tiene un filtro en sql del numero de DNI y  despues la respuesta la transformo en un objeto json
    qu = `Select A,B,C,D,G WHERE A = ${dni}`
    query = encodeURIComponent(qu);
    url = `${base}&sheet=${sheetName}&tq=${query}`;
    console.log('ready');
    fetch(url)
    .then(res => res.text())
    .then(rep => {
        const jsData = JSON.parse(rep.substring(47).slice(0,-2));
        console.log(jsData);
        const colz = [];
        //Extraigo del json en un array los rotulos de las columnas
        jsData.table.cols.forEach((heading)=>{
            //console.log(heading);
            if(heading.label){
                colz.push(heading.label.toLowerCase().replace(/\s/g,''));
            }
        })
        //Hago una iteración para poder construir una matriz a partir de las celdas de cada fila
        jsData.table.rows.forEach((main)=>{
            console.log(main);
            const row = {};
            colz.forEach((ele,ind)=>{
                console.log(ele);
                row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';  
            })
            data.push(row)
        })
        maker(data);
    })

}

/* 
---------------------------------------------------------
Esta es la funcion que inserta la tabla en el HTML a partir del array de rotulos y la matriz de filas y columnas
---------------------------------------------------------
*/

function maker(json){
    const div  = document.createElement('div');
    div.style.display = 'grid';
    
    output.append(div);
    let first = true;
    json.forEach((el) => {
        //console.log(el);
        const keys = Object.keys(el);
        div.style.gridTemplateColumns = `repeat(${keys.length},1fr)`;
        if(first){
            first = false;
            keys.forEach((heading)=>{
                const ele = document.createElement('div');
                ele.style.background = 'black';
                ele.style.color = 'white';
                ele.textContent = heading.toUpperCase();
                div.append(ele)
        })
        }
        keys.forEach((key) => {
            const ele = document.createElement('div');
            ele.style.border = '1px solid #ddd';
            ele.textContent = el[key];
            div.append(ele);
        console.log(keys)
    })
})
}