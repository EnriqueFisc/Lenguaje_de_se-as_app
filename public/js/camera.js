import arregloAbecedario from './fixed/abecedario.js';

const video = document.querySelector( "#video" );
const canvas = document.querySelector( "#canvas1" );
const ctxCanvas = canvas.getContext( '2d' );

const labelCargandoCamara = document.querySelector( '#cargando-camara' );

const letra = document.querySelector( '#letra' );
const imgManoEjemplo = document.querySelector( '#imagenMano' );

const btnAtras = document.querySelector( '#atras' );
const btnSiguiente = document.querySelector( '#adelante' );

const tarjetaLetra = document.querySelector( '#card' );
const checadorSeñas = document.querySelector( '#checador' );

let contadorDeLetras = 0;

let tamaño = 200;

canvas.width = tamaño;
canvas.height = tamaño;

ctxCanvas.width = tamaño;
ctxCanvas.height = tamaño;

letra.innerHTML= arregloAbecedario[ contadorDeLetras ].letra;
imgManoEjemplo.src = arregloAbecedario[ contadorDeLetras ].url;



const cargarCamara = ( steam ) => {
    video.srcObject = steam;
}

const encenderCanvas = ( video, tamaño ) => {
    ctxCanvas.drawImage( video, 0, 0, tamaño, tamaño );
}

const convertirImagenEnArreglo = ( canvasFrame ) => {

    let imgData = canvasFrame.getImageData(0,0, 200, 200);

    if ( modelo !== null ) {
        let imagenEnArreglo = [];
        let arrPixelesAux = [];

        for (let p=0; p < imgData.data.length; p+= 4) {
            let rojo = imgData.data[p] / 255;
            let verde = imgData.data[p+1] / 255;
            let azul = imgData.data[p+2] / 255;

            arrPixelesAux.push([ rojo, verde, azul ]);
            if (arrPixelesAux.length == 200) {
                imagenEnArreglo.push( arrPixelesAux );
                arrPixelesAux = [];
            }
        }

        return [ imagenEnArreglo ];

    }
    
}


const predecir = () => {

    const imagenEnArreglo = convertirImagenEnArreglo( ctxCanvas );
    
    const tensor = tf.tensor4d( imagenEnArreglo );
    const resultado = modelo.predict( tensor ).dataSync();

    const respuesta = resultado.indexOf( Math.max.apply( null, resultado ) );
    

    if ( contadorDeLetras === respuesta ) {
        
        agregarClaseExitoSeña();

    }
    
    setTimeout( () => {
        predecir();
    } , 500);
                

}


btnSiguiente.addEventListener( 'click' , () => {
    contadorDeLetras++;
    letra.innerHTML = arregloAbecedario[ contadorDeLetras ].letra;
    imgManoEjemplo.src = arregloAbecedario[ contadorDeLetras ].url;
    borrarClasesExitoSeña();

    if ( !arregloAbecedario[ contadorDeLetras + 1 ] ) {
        btnSiguiente.disabled = true;
    }
    btnAtras.disabled = false;
});

btnAtras.addEventListener( 'click' , () => {
    contadorDeLetras--;
    letra.innerHTML = arregloAbecedario[ contadorDeLetras ].letra;
    imgManoEjemplo.src = arregloAbecedario[ contadorDeLetras ].url;
    borrarClasesExitoSeña();

    if ( !arregloAbecedario[ contadorDeLetras - 1 ] ) {
        btnAtras.disabled = true;
    }
    btnSiguiente.disabled = false;
});


const borrarClasesExitoSeña = () => {
    checadorSeñas.classList.add('hidden');
    tarjetaLetra.classList.remove( 'animate__heartBeat' );
    tarjetaLetra.classList.remove( 'success' );
}
const agregarClaseExitoSeña = () => {
    checadorSeñas.classList.remove('hidden');
    tarjetaLetra.classList.add( 'animate__heartBeat' );
    tarjetaLetra.classList.add( 'success' );
}

const ejecutarApp = async() => {
    try {
        
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cargarCamara( mediaStream );
        
        setInterval(() => {
            encenderCanvas( video, tamaño )
        }, 30);
        predecir();
        
    } catch ( err ) {
        console.log( err );
    }
}

btnAccionModal.addEventListener( 'click', async() => {
    if ( modeloCargado ) {
        modal.classList.remove( 'animate__bounceIn' );
        modal.classList.add( 'animate__bounceOut' );
        modalContainer.classList.add( 'hidden' );
        await ejecutarApp();
        labelCargandoCamara.classList.add( 'no-desplegado' );
        video.classList.remove( 'no-desplegado' );
    }else {
        window.location.reload();
    }
});
