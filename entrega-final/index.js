/* 
---------------------------------------------------------
Esta es la función que me permite importar los datos desde google sheets al inicio de la sesion 
---------------------------------------------------------
*/
// Declaracion de variables y constantes
const sheetID = '1sDzQURSh6jqT4GAOyW-spRsGXUiPFgexOgyYhh0en0E';
let base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
const sheetName = 'BBDD_Memb';
let dni = 95489618;
let qu = `Select A,B,C,D,G WHERE A = ${dni}`
let query = encodeURIComponent(qu);
let data = [];
let url = `${base}&sheet=${sheetName}&tq=${query}`;
let output = document.querySelector('.output');

function init() {
    // Hago la consulta con el fetch que dentro tiene un filtro en sql del numero de DNI y  despues la respuesta la transformo en un objeto json
    data = [];
    qu = `Select A,B,C,D,G WHERE A = ${dni}`;
    query = encodeURIComponent(qu);
    url = `${base}&sheet=${sheetName}&tq=${query}`;
    console.log('ready1');
    
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            const jsData = JSON.parse(rep.substring(47).slice(0,-2));
            //console.log('resultado del primer parse y llamado')
            //console.log(jsData);
            const colz = [];
            // Extraigo del json en un array los rotulos de las columnas
            jsData.table.cols.forEach((heading)=>{
                //console.log(heading);
                if (heading.label) {
                    colz.push(heading.label.toLowerCase().replace(/\s/g,''));
                }
            });
            // Hago una iteración para poder construir una matriz a partir de las celdas de cada fila
            jsData.table.rows.forEach((main)=>{
                //console.log(main);
                const row = {};
                colz.forEach((ele,ind)=>{
                    console.log(ele);
                    row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';  
                });
                data.push(row);
            });
        console.log('se completo el fetch, todo quedo en '+data)
        console.log('se inicia el luxon')
        for (let i = 0; i < data.length; i++) {
            // Obtén los valores de año, mes y día del atributo 'INGRESO' en cada objeto
        const matches = data[i].ingreso.match(/\d+/g);
        console.log(matches)
        
        const year = Number(matches[0]);
        const month = Number(matches[1]);
        console.log(year,month)
            
        const day = Number(matches[2]);
        // Crea un objeto DateTime con Luxon utilizando los valores de año, mes y día
        const fecha = luxon.DateTime.fromObject({
                year: year,
                month: month
        });
          // Formatea la fecha utilizando Luxon
        let f = {month: 'long', year: 'numeric'}
        const formatoFecha = fecha.setLocale('es-ES').toLocaleString(f);
          // Asigna el valor formateado al atributo 'INGRESO' en cada objeto
        data[i].ingreso = formatoFecha; 
        console.log('iteracion del luxon'+i)   
        } 
        // console.log(convertirFecha(data[0].ingreso.value));
        data = JSON.stringify(data)
        console.log('eltipo de data de dtaa es '+typeof(data));  
        console.log(data)   
        sessionStorage.setItem("dataAlmacenada",data)  
        })
        .catch(error => {
            // Mostrar mensaje de error con SweetAlert
            swal("Error", error.message, "error");
        });

}

// //Mensaje inicial en el que solicito el DNI para poderlo contrastar con la base de datos
// const { value: dniNuevo } = await Swal.fire({
//     title: 'Este sitio es exclusivo para socios',
//     input: 'number',
//     inputLabel: 'Ingrese su DNI en números',
//     inputValue: dni,
//     showCancelButton: true,
//     inputValidator: (value) => {
//         if (value < 1000) {
//             return 'El DNI no es válido, ingreselo nuevamente'
//         }
//     }
// })

// //Ejecuto la funcion init para poder traer la data de google sheets
// sessionStorage.setItem("dni",dniNuevo)  
// dni = dniNuevo
// console.log('antes de init')
// init()
// console.log('despued de init')
// const dataA = JSON.parse(sessionStorage.getItem("dataAlmacenada"))
// console.log('se almaceno data conel tipo'+typeof(dataA))


//-----------------------------------------------------------------------------------
// Mensaje inicial en el que solicito el DNI para contrastarlo con la base de datos
Swal.fire({
    title: 'Este sitio es exclusivo para socios',
    input: 'number',
    inputLabel: 'Ingrese su DNI en números',
    inputValue: dni,
    showCancelButton: true,
    inputValidator: (value) => {
      if (value < 1000) {
        return 'El DNI no es válido, ingreselo nuevamente'
      }
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Obtén el valor de dniNuevo desde el resultado del modal
      const dniNuevo = result.value;
      
      // Almacena el dniNuevo en sessionStorage y actualiza el valor de dni
      sessionStorage.setItem("dni", dniNuevo);
      dni = dniNuevo;
      
      console.log('antes de init');
      
      // Ejecuta la función init para obtener los datos de Google Sheets
      init().then(() => {
        console.log('después de init');
        const dataA = JSON.parse(sessionStorage.getItem("dataAlmacenada"));
        console.log('se almaceno data con el tipo ' + typeof(dataA));
        
        // Resto de código a ejecutar después de obtener los datos
        // ...
      });
    }
  });
  
//-------------------------------------------------
if (JSON.parse(sessionStorage.getItem("dataAlmacenada")).length < 3) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El DNI ingresado no pertenece a un socio',
    })
}

if (dniNuevo == a) {
    Swal.fire(`Su DNI es ${ sessionStorage.getItem("dni")}`)
    let dataAlmacenada = sessionStorage.getItem("dataAlmacenada");
    let data = JSON.parse(dataAlmacenada);
    maker(data)
}



/* 
---------------------------------------------------------
Esta es la funcion que inserta la tabla en el HTML a partir del array de rotulos y la matriz de filas y columnas
---------------------------------------------------------
*/

function maker(json){
    output.innerHTML = '';
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
        //console.log(keys)
    })
})
}





