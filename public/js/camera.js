import arregloAbecedario from './fixed/abecedario.js';

const video = document.querySelector( "#video" );
const canvas = document.querySelector( "#canvas1" );
const ctxCanvas = canvas.getContext('2d');

const letra = document.querySelector( '#letra' );
const imgManoEjemplo = document.querySelector('#imagenMano');

const btnAtras = document.querySelector('#atras');
const btnSiguiente = document.querySelector('#adelante');

const checadorSeñas = document.querySelector('#checador');

let contadorDeLetras = 0;

let tamaño = 200;
let modelo = null;

canvas.width = tamaño;
canvas.height = tamaño;

ctxCanvas.width = tamaño;
ctxCanvas.height = tamaño;

letra.innerHTML= arregloAbecedario[ contadorDeLetras ].letra;
imgManoEjemplo.src = arregloAbecedario[ contadorDeLetras ].url;

(async() => {
    try {

        console.log("Cargando modelo...");
        modelo = await tf.loadLayersModel("../modelo_red/model.json");
        console.log("Modelo cargado");
        
    } catch ( err ) {
        console.log( err );
    }
})()

const cargarCamara = ( steam ) => {
    video.srcObject = steam;
}

const encenderCanvas = ( video, tamaño ) => {
    ctxCanvas.drawImage( video, 0, 0, tamaño, tamaño );
}

window.addEventListener('load', async() => {

    try {
        
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cargarCamara( mediaStream );

        setInterval(() => {
            encenderCanvas( video, tamaño )
        }, 30);
        predecir();
        // prediccionDeSeñas();
    } catch ( err ) {
        console.log( err );
    }

});

const convertirImagenEnArregloDeEscalaGrises = ( canvasFrame ) => {

    let imgData = canvasFrame.getImageData(0,0, 200, 200);

    if ( modelo !== null ) {
        let imagenEnArreglo = [];
        let arrPixelesAux = [];

        for (let p=0; p < imgData.data.length; p+= 4) {
            let rojo = imgData.data[p] / 255;
            let verde = imgData.data[p+1] / 255;
            let azul = imgData.data[p+2] / 255;

            let gray = ( rojo + verde + azul ) / 3;

            arrPixelesAux.push([ gray ]);
            if (arrPixelesAux.length == 200) {
                imagenEnArreglo.push(arrPixelesAux);
                arrPixelesAux = [];
            }
        }

        return [ imagenEnArreglo ];

    }
    
}


const predecir = () => {

    const arregloImagenGrises = convertirImagenEnArregloDeEscalaGrises( ctxCanvas );
    
    const tensor = tf.tensor4d( arregloImagenGrises );
    const resultado = modelo.predict(tensor).dataSync();

    const respuesta = resultado.indexOf( Math.max.apply( null, resultado ) );
    

    if ( contadorDeLetras === respuesta ) {
        
        checadorSeñas.classList.remove('hidden');

    }
    
    setTimeout( () => {
        predecir();
    } , 1000);
                

}


btnSiguiente.addEventListener( 'click' , () => {
    contadorDeLetras++;
    letra.innerHTML = arregloAbecedario[ contadorDeLetras ].letra;
    imgManoEjemplo.src = arregloAbecedario[ contadorDeLetras ].url;
    checadorSeñas.classList.add('hidden');

    if ( !arregloAbecedario[ contadorDeLetras + 1 ] ) {
        btnSiguiente.disabled = true;
    }
    btnAtras.disabled = false;
});

btnAtras.addEventListener( 'click' , () => {
    contadorDeLetras--;
    letra.innerHTML = arregloAbecedario[ contadorDeLetras ].letra;
    imgManoEjemplo.src = arregloAbecedario[ contadorDeLetras ].url;
    checadorSeñas.classList.add('hidden');

    if ( !arregloAbecedario[ contadorDeLetras - 1 ] ) {
        btnAtras.disabled = true;
    }
    btnSiguiente.disabled = false;
});