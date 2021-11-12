const btnAccionModal = document.querySelector( '#boton-accion-modal' );
const modal = document.querySelector( '#modal' );
const modalContainer = document.querySelector( '#modal-container' );

let modelo;
let modeloCargado = false; 

(async() => {
    try {
        console.log( "Cargando modelo..." );
        modelo = await tf.loadLayersModel( "../LSM-modelo-v1/model.json" );
        console.log( "Modelo cargado" );

        modeloCargado = true;
        btnAccionModal.innerHTML = 'Cerrar';
    } catch ( err ) {
        console.log( err );
        modeloCargado = false
        btnAccionModal.innerHTML = 'Reintentar';
    }
    btnAccionModal.disabled = false;
})();


