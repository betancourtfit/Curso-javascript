let fechahoy = new Date()
console.log(fechahoy)

//// - La fecha de tu nacimiento
let fechanacimiento = new Date("September 22 1990")
console.log(fechanacimiento)

//// - Un variable que indique si hoy es más tarde (>) que la fecha de tu nacimiento
console.log(fechahoy.getTime() < fechanacimiento.getTime())
let indicador = fechahoy.getTime() < fechanacimiento.getTime();
console.log(indicador)

//// - Una variable que contenga el mes de tu nacimiento (recuerda que Enero es mes 0
let mesNacimiento = fechanacimiento.getMonth()+1
console.log(mesNacimiento)

/// - Una variable que contenga el año de tu nacimiento (con 4 dígitos)
let anyoNacimiento = fechanacimiento.getFullYear()
console.log(anyoNacimiento)