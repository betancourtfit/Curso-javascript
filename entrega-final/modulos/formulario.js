/* 
---------------------------------------------------------
1. Esta es la funcion principal del formulario de alta, lo que hace es limpiar la pantalla, recupera el dni
del sessionstorage para ahorrarle al ususario ese paso y le socilita dos datos adicionales
---------------------------------------------------------
*/
export function displayForm() {
    let output = document.querySelector('.output');
    output.innerHTML = ''
    let dniform = sessionStorage.getItem("dni")
    let formHTML = 
    `<form id="myForm">
        <div class="row justify-content-md-center">
            <div class="col-md-4">
                <div class="mb-3">
                    <label for="dni" class="name">DNI</label>
                    <input type="number" class="form-control" id="dni" readonly value= ${dniform}>
                </div>
                <div class="mb-3">
                    <label for="nombreCompleto" class="name">Nombre Completo</label>
                    <input type="name" class="form-control" id="nombreCompleto">
                </div>
                <div class="mb-3">
                    <label for="EmailSocio" class="form-label">Correo Electrónico</label>
                    <input type="email" class="form-control" id="EmailSocio" aria-describedby="emailHelp">
                    <div id="emailHelp" class="form-text">A este mail enviaremos la solicitud</div>
                </div>
                <button type="submit" class="btn btn-primary">Enviar</button>
            </div>
        </div>
    </form>`
    ;
    output.innerHTML = formHTML;

    // Add event listener for form submission
    document.querySelector('#myForm').addEventListener('submit', submitForm);
}

/* 
---------------------------------------------------------
2. Esta es la funcion que se encarga de enviar la información igresada por el consumidor a un formulario de google

---------------------------------------------------------
*/
function submitForm(e) {
    e.preventDefault();
    let name = document.querySelector('#nombreCompleto').value;
    let mail = document.querySelector('#EmailSocio').value;
    let dnidef = document.querySelector('#dni').value;
    console.log(name)
    console.log(mail)
    console.log(dnidef)

    // Replace with your Google Forms URL
    let googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSfCKIOPdTojYhxHAOyN_3pNbCCHsBxNBuyMQ7-6dE8uo--Q0w/formResponse';
    let formData = new FormData();
    formData.append('entry.1369176150', name);  // Replace '123456' with your Google Forms field ID for name
    formData.append('entry.1143979532', mail);  // Replace '789012' with your Google Forms field ID for mail
    formData.append('entry.2089761810', dnidef);

    fetch(googleFormURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    })
    .then(response => Swal.fire({
        title: 'FELICIDADES, en breve tendras noticias',
        width: 600,
        ocon:'sucess',
        padding: '3em',
        color: '#716add',
        background: '#fff url(/images/trees.png)',
        backdrop: `
          rgba(0,0,123,0.4)
          url("https://www.icegif.com/wp-content/uploads/2023/02/icegif-519.gif")
          left top
          no-repeat
        `
      }))
    .catch(error => console.error('Error:', error));
    let output = document.querySelector('.output');
    output.innerHTML = ''
}

