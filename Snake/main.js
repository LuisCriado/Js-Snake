const ANCHO = 500;
const INTERVALO = 80;
const PESO = 10;
const DIRECCION = {
    A:[-1,0],
    D:[1,0],
    S:[0,1],
    W:[0,-1],

    a:[-1,0],
    d:[1,0],
    s:[0,1],
    w:[0,-1],

    ArrowUp:[0,-1],
    ArrowDown:[0,1],
    ArrowLeft:[-1,0],
    ArrowRight:[1,0],
}
let padonde
let controles = {
direccion:{x:1, y:0},
bicho:[{x:0, y:0}], 
victima:{x:0,y:2},
jugando: false,
crecimiento: 0,

};


let papel = document.querySelector('canvas');
let ctx = papel.getContext('2d');

let looper = () =>{

    let cola = {};

    
    Object.assign(cola, controles.bicho[controles.bicho.length-1]);
    const sq = controles.bicho[0]
    let atrapado = sq.x === controles.victima.x && sq.y === controles.victima.y;
    if(detectarChoque()){
        controles.jugando = false;
        
        
        reiniciar()
        
    }
    let dx = controles.direccion.x;
    let dy = controles.direccion.y;
    let Tamanio = controles.bicho.length-1;
    if(controles.jugando){
        for (let idx = Tamanio; idx > -1; idx--) {
       const sq = controles.bicho[idx];
       if(idx === 0) {
        sq.x += dx;
        sq.y += dy;
       }else{
        sq.x = controles.bicho[idx-1].x;               
        sq.y = controles.bicho[idx-1].y;

       }
    }
    
       
    }


   
    if(atrapado){
        controles.crecimiento += 2
        revictima();
    }




    if(controles.crecimiento > 0){
       controles.bicho.push(cola);
       controles.crecimiento -= 1;
    }

    requestAnimationFrame(dibujar);


    setTimeout(looper, INTERVALO)
}

let detectarChoque = () =>{
    const head = controles.bicho[0];


    if(head.x < 0 || head.x >= ANCHO/PESO || head.y >= ANCHO/PESO || head.y < 0){
        return true;
    }
    for(let idx = 1 ; idx < controles.bicho.length;idx++){
        const sq = controles.bicho[idx];
        if(head.x === sq.x && head.y === sq.y){
            return true;
        }
    }
}
document.onkeydown =  (e) =>{
    padonde = DIRECCION[e.key]
    const [x, y] = padonde;
    if(-x !== controles.direccion.x && -y !== controles.direccion.y){
        controles.direccion = {x, y};
    }
    
}
let dibujar = () =>{
    ctx.clearRect(0,0,ANCHO,ANCHO)
    

    for(let idx = 0; idx < controles.bicho.length; idx++){
        const {x , y} = controles.bicho[idx];
        dibujarActores('green', x, y);
    }
    

    const victima = controles.victima;
    dibujarActores('yellow', victima.x,victima.y);
}

let dibujarActores = (color , x , y) =>{
    
    ctx.fillStyle = color
    ctx.fillRect(x*PESO,y*PESO,PESO,PESO);
}

let cualquierLado = () =>{

    let direcion = Object.values(DIRECCION);

    return {
        x: parseInt(Math.random()*ANCHO/PESO),
        y: parseInt(Math.random()*ANCHO/PESO),
        d: direcion[[parseInt(Math.random()*11)]]                
    }
}

let revictima = () =>{
    let nuevaPos = cualquierLado()
    let victima = controles.victima 
    victima.x = nuevaPos.x;
    victima.y = nuevaPos.y;
}

let reiniciar = () =>{
    controles = {
    direccion:{x:1, y:0},
    bicho:[{x:0, y:0}], 
    victima:{x:0,y:2},
    jugando: false,
    crecimiento: 0,

}
    
   posiciones = cualquierLado()
    let head = controles.bicho[0] 
    head.x = posiciones.x;
    head.y = posiciones.y;
    controles.direccion.x = posiciones.d[0];
    controles.direccion.y = posiciones.d[1];
    posicionVictima = cualquierLado();
    let victima = controles.victima 
    victima.x = posicionVictima.x;
    victima.y = posicionVictima.y;

    controles.jugando = true;
}


window.onload = () =>{
    reiniciar()
 
    
    looper() 
}
