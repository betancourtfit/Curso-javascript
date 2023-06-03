/*
---------------------------------------------------------
Importo la funcion display() del módulo para desplegar el fomrulario de contacto
---------------------------------------------------------
*/
import {displayForm} from './modulos/formulario.js' 
/*
---------------------------------------------------------
1. Acá inicia la declaracion de las funciones despelgar el modal de dni, solicitar la informacion a la base de datos 
que es un google sheets real, validar si el dni ingresado existe o no y en caso de que exista mostrar 
información del status del socio
---------------------------------------------------------
*/
// 1.1 Declaracion de variables y constantes necesarias para el fetch de google sheets
const sheetID = '1sDzQURSh6jqT4GAOyW-spRsGXUiPFgexOgyYhh0en0E';
let base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
const sheetName = 'BBDD_Memb';
let dni = 95489618;
let qu = `Select A,B,C,D,G WHERE A = ${dni}`
let query = encodeURIComponent(qu);
let data = [];
let url = `${base}&sheet=${sheetName}&tq=${query}`;
let output = document.querySelector('.output');
sessionStorage.clear()

//-----------------------------------------------------------------------------------
// 1.2 La funcion init() es la que se encarga de hacer el fetch al google sheets filtrado por el número de dni
//-----------------------------------------------------------------------------------
async function init() {
    return new Promise((resolve, reject) => {
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
                        //console.log(ele);
                        row[ele] = (main.c[ind] != null) ? main.c[ind].v : '';  
                    });
                    data.push(row);
                });
                for (let i = 0; i < data.length; i++) {
                    // Obtén los valores de año, mes y día del atributo 'INGRESO' en cada objeto
                const matches = data[i].ingreso.match(/\d+/g);
                const year = Number(matches[0]);
                const month = Number(matches[1]);
                //console.log(year,month)
                    
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
                data = JSON.stringify(data);
                console.log('eltipo de data de dtaa es '+typeof(data));  
                console.log(data)   
                sessionStorage.setItem("dataAlmacenada",data);  
                resolve();
                })
            .catch(error => {
                // Mostrar mensaje de error con SweetAlert
                console.log('error en la funcion de fetch')
                swal("Error", error.message, "error");
            });
    })
}

//-----------------------------------------------------------------------------------
// 1.3 Esta funcion es la que dispara el modal y valida el dni ingresado si existe en la base de datos
// si existe entonces avanza con llamar a executemkaer() que es la función que renderiza el resulta no vacío
// en cambio si el dni no existe, muestra un modal que le da la opción de darse de alta en el club
//-----------------------------------------------------------------------------------

function validaciondesocio() {
    Swal.fire({
        title: 'Este sitio es exclusivo para socios',
        input: 'number',
        inputLabel: 'Ingrese su DNI en números',
        inputValue: dni,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!/^\d+$/.test(value)) {
            return 'El DNI no es válido, debe ingresar sólo números'
            }
        }
        }).then((result) => {
            if (result.isConfirmed) {
            // Obtén el valor de dniNuevo desde el resultado del modal
                let dniNuevo = result.value;
            // Almacena el dniNuevo en sessionStorage y actualiza el valor de dni
                sessionStorage.setItem("dni", dniNuevo);
                dni = dniNuevo;
                console.log('antes de init');
            // Ejecuta la función init para obtener los datos de Google Sheets
                init().then(() => {
                    const arrayVacio = JSON.parse(sessionStorage.getItem("dataAlmacenada")).length == 0
                    console.log(arrayVacio)
                    console.log('después de init');
                    if (arrayVacio) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'El DNI ingresado no pertenece a un socio',
                            showDenyButton:true,
                            denyButtonText: 'Solicitar alta',
                            denyButtonColor:'#7CFC00',
                        }).then((result) => {
                            if(result.isDenied) {
                                displayForm();
                                resolve();
                            }
                        }).then(() => {
                            validaciondesocio()
                        });
                    } else {
                        const dataA = JSON.parse(sessionStorage.getItem("dataAlmacenada"));
                        const nombre = dataA[0].nombrecompleto
                        console.log('se almaceno data con el tipo ' + typeof(dataA));
                        
                        Swal.fire(`Bienvenido ${nombre}`)
                        let dataAlmacenada = sessionStorage.getItem("dataAlmacenada");
                        let data = JSON.parse(dataAlmacenada);
                        executeMaker(data)
                        //maker(data)
                    }
                    
                    
            });
        }
    });
}  

// 1.5 Simplemente invoco la funcion principal que a partir de acá se van invocando el resto de las fucniones
// en base al flow de condiciones y peticiones del consumidor
validaciondesocio()



/* 
---------------------------------------------------------
2. Esta es la funcion que inserta la tabla en el HTML a partir del array de rotulos y la matriz de filas y columnas
---------------------------------------------------------
*/

function maker(json){
    return new Promise((resolve, reject) => {
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
    resolve();
    });
}


/* 
---------------------------------------------------------
3. Evento que activa nuevamente la funcion inicial en caso de que el usuario asi lo solicite
---------------------------------------------------------
*/

const botonReconsulta = document.querySelector('#nuevaConsulta')
botonReconsulta.addEventListener('click',() => {sessionStorage.clear; output.innerHTML = ''; validaciondesocio() })

/* 
---------------------------------------------------------
4. Modal de espera que indica al usuario que su petición se hizo con éxito y sólo debe esperar, esta con un 
timeout porque si no, nunca se me mostraba ya que la consulta es bastante rápida
---------------------------------------------------------
*/
async function executeMaker(json) {
    // Mostrar el modal de espera
    console.log("inicio modal 1")
    const waitingModal = new bootstrap.Modal(document.getElementById("waitingModal"), {
        backdrop: "static",
        keyboard: false
    });
    waitingModal.show();
    console.log("inicio modal 2")

    // Ejecutar la función init y esperar a que se complete
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await maker(json);
    console.log("inicio modal 3")

    // Ocultar el modal de espera
    waitingModal.hide();
}

