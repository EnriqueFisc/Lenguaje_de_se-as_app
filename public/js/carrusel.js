const slider = document.querySelector('#slider-container');
const btnSiguiente = document.querySelector('#siguiente');
const btnAnterior = document.querySelector('#anterior');

const speed = '500';
const autoplay = true;
const interval = 6000;

let intervaloAutoplay;

const sliderMoverSiguiente = () => {

    if ( slider.children.length > 0 ) {
        // Get the fist slisdecontainers element
        const firstElement = slider.children[0];
        slider.style.transition = `.${ speed }s ease-out all`;

        const widthSlide = slider.children[0].offsetWidth;
        slider.style.transform = `translateX( -${ widthSlide }px ) `;
        
        const transition = () => {
            slider.style.transition = 'none';
            slider.style.transform = 'translateX(0)';
            slider.appendChild( firstElement );
            slider.removeEventListener( 'transitionend', transition );
        }

        slider.addEventListener( 'transitionend', transition );
    }

};

const sliderMoverAnterior = () => {

    if ( slider.children.length > 0 ) {
        const lastElement = slider.children[ slider.children.length - 1 ];
        slider.insertBefore( lastElement, slider.firstChild );

        const widthSlide = slider.children[0].offsetWidth;
        slider.style.transition = 'none';
        slider.style.transform = `translateX( -${ widthSlide }px ) `;

        setTimeout(() => {
            slider.style.transition = `.${ speed }s ease-out all`;
            slider.style.transform = `translateX( 0 ) `;    
        }, 30);
    }
};

btnAnterior.addEventListener('click', sliderMoverAnterior);
btnSiguiente.addEventListener('click', sliderMoverSiguiente);

if ( autoplay ) {
    intervaloAutoplay = setInterval(() => {
        sliderMoverSiguiente();
    }, interval );


    slider.addEventListener( 'mouseenter', () =>{
        clearInterval( intervaloAutoplay );
    });

    slider.addEventListener( 'mouseleave', () =>{
        intervaloAutoplay = setInterval(() => {
            sliderMoverSiguiente();
        }, interval );
    });
}