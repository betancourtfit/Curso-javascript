// Ejemplo de array con un elemento de fecha en formato "Date(2022,7,1)"
const myArray = [95489618,"juan","Date(2022,7,1)"];
console.log(myArray)

// Obtener el primer elemento (índice 0) del array
function convertirFecha (myArray) {
const dateString = myArray[2];
console.log(dateString)
// Extraer los valores de año y mes de la cadena usando una expresión regular
const regex = /Date\((\d{4}),(\d{1,2}),\d{1,2}\)/;
const match = dateString.match(regex);

if (match) {
  const year = parseInt(match[1]);
  // Los meses en JavaScript van de 0 a 11, así que debes restar 1 al mes extraído
  const month = parseInt(match[2]) - 1;

  // Crear un objeto Date a partir del año y mes extraídos
  const date = new Date(year, month);

  // Crear una función para formatear la fecha
  function formatDate(date) {
    const formattedMonth = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const formattedYear = date.getFullYear();
    return formattedMonth.toString().padStart(2, '0') + '/' + formattedYear;
  }

  // Convertir la fecha al formato MM/YYYY
  const formattedDate = formatDate(date);

  // Reemplazar el primer elemento del array con la nueva fecha formateada
  myArray[0] = formattedDate;
  console.log(formattedDate)
  return formattedDate
}
}

//console.log(convertirFecha(myArray))

