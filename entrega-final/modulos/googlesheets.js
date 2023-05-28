// Etsa es la funcion que hae el fetch de la data y la procesa para convertirla en un objeto javascript
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

function init(dni) {
    // Hago la consulta con el fetch que dentro tiene un filtro en sql del numero de DNI y  despues la respuesta la transformo en un objeto json
    data = [];
    qu = `Select A,B,C,D,G WHERE A = ${dni}`;
    query = encodeURIComponent(qu);
    url = `${base}&sheet=${sheetName}&tq=${query}`;
    console.log('ready');
    
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            const jsData = JSON.parse(rep.substring(47).slice(0,-2));
            console.log(jsData);
            const colz = [];
            // Extraigo del json en un array los rotulos de las columnas
            jsData.table.cols.forEach((heading)=>{
                console.log(heading);
                if (heading.label) {
                    colz.push(heading.label.toLowerCase().replace(/\s/g,''));
                }
            });
            // Hago una iteración para poder construir una matriz a partir de las celdas de cada fila
            jsData.table.rows.forEach((main)=>{
                console.log(main);
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
        return data;
        })
        .catch(error => {
            // Mostrar mensaje de error con SweetAlert
            swal("Error", error.message, "error");
        });

}