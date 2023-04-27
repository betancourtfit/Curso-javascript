const misdatos = {
    nombre: "juan",
    apellido: "betancourt",
    edad:32,
    altura:167,
    eresDesarrollador: true
}

console.log(misdatos)

let edadjuan = misdatos.edad;
console.log(edadjuan)

const lista = [misdatos]
console.log(lista)

const datosAmigos = [
    {
        nombre: "andres",
        apellido:"ospina",
        edad:25,
        altura:168,
        eresDesarrollador: false
    },
    {
        nombre:"laura",
        apellido: "ospina",
        edad:19,
        altura:157,
        eresDesarrollador: false
    }
]

console.log(datosAmigos)
const amigos = [misdatos, ...datosAmigos]
console.log(amigos)

amigos.sort((a,b) => b.edad - a.edad)
console.log(amigos)