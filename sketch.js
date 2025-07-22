let personaje;
let galletas = [];
let puntuacion = 0;
let record = 0;
let velocidadGalleta = 8;
let saltoSonido, musicaFondo;
let personajeImg, galletaImg, pastelImg;
let juegoTerminado = false;
let botonReiniciar;
let tulipanImg, margaritaImg, lirioImg;
let mensajeEspecial = "";
let tiempoMensaje = 0;

function preload() {
  personajeImg = loadImage('personaje.png');
  galletaImg = loadImage('galleta.png');
  pastelImg = loadImage('pastel.png');
  saltoSonido = loadSound('salto.mp3');
  musicaFondo = loadSound('musica.mp3');
  tulipanImg = loadImage('tulipan.png');
  margaritaImg = loadImage('margarita.png');
  lirioImg = loadImage('lirio.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  personaje = new Personaje();
  musicaFondo.setVolume(0.7);
  musicaFondo.setLoop(true);
  musicaFondo.play();

  // Cargar record guardado
  let recordGuardado = localStorage.getItem('recordJuego');
  if (recordGuardado !== null) {
    record = parseInt(recordGuardado);
  }
}

function draw() {
  background(255, 228, 245); // Fondo rosita

  // Caminito
  fill(255, 204, 229);
  rect(0, height - 100, width, 100);

  personaje.mostrar();
  personaje.mover();

  // Crear galletas y pasteles
  if (frameCount % 90 === 0) {
    if (puntuacion >= 20 && random() < 0.3) {
      galletas.push(new Pastel());
    } else {
      galletas.push(new Galleta());
    }
    velocidadGalleta = 8 + Math.floor(puntuacion / 10);
  }

  for (let i = galletas.length - 1; i >= 0; i--) {
    const galleta = galletas[i];
    galleta.mover();
    galleta.mostrar();

    if (galleta.colision(personaje)) {
      if (galleta instanceof Pastel) {
        mensajeEspecial = "¡Encontraste un pastel de amor, mamacita hermosa! 💞";
        tiempoMensaje = millis();
        puntuacion++; // Sumar puntito
        galletas.splice(i, 1); // Quitar pastel sin detener juego
      } else {
        juegoTerminado = true;

        // Guardar record si es mejor
        if (puntuacion > record) {
          record = puntuacion;
          localStorage.setItem('recordJuego', record);
        }

        if (!botonReiniciar) {
          botonReiniciar = createButton('Reintentar 💖');
          botonReiniciar.position(width / 2 - 60, height / 2 + 40);
          botonReiniciar.style('font-size', '20px');
          botonReiniciar.style('background-color', '#ffb6c1');
          botonReiniciar.style('border', 'none');
          botonReiniciar.style('padding', '10px 20px');
          botonReiniciar.style('border-radius', '12px');
          botonReiniciar.mousePressed(reiniciarJuego);
        }

        musicaFondo.stop();
        noLoop();
        textSize(30);
        fill(0);
        textAlign(CENTER);
        text("💔 ¡AY MAMITA! Tocaste una galleta", width / 2, height / 2 - 20);
      }
    }

    if (galleta.x < -50) {
      galletas.splice(i, 1);
      puntuacion++;
    }
  }

  fill(0);
  textSize(20);
  textAlign(LEFT);
  text("Puntaje: " + puntuacion, 20, 30);
  text("Récord: " + record, 20, 60);
  text("Velocidad: " + velocidadGalleta, 20, 90);

  // Mostrar mensaje especial por 3 segundos
  if (mensajeEspecial && millis() - tiempoMensaje < 3000) {
    fill(255, 0, 127);
    textSize(24);
    textAlign(CENTER);
    text(mensajeEspecial, width / 2, 60);
  } else {
    mensajeEspecial = ""; // Borra el mensaje después de 3 segundos
  }
}

function keyPressed() {
  if (!juegoTerminado && (key === ' ' || keyCode === UP_ARROW)) {
    personaje.saltar();
  }

  if (juegoTerminado && (key === 'r' || key === 'R')) {
    reiniciarJuego();
  }
}

function mousePressed() {
  if (!juegoTerminado) {
    personaje.saltar();
  }
}

function reiniciarJuego() {
  if (botonReiniciar) {
    botonReiniciar.remove();
    botonReiniciar = null;
  }

  personaje = new Personaje();
  galletas = [];
  puntuacion = 0;
  juegoTerminado = false;
  mensajeEspecial = "";
  musicaFondo.play();
  loop();
}

// -------------------------
// CLASES
// -------------------------

class Personaje {
  constructor() {
    this.x = 100;
    this.y = height - 130;
    this.velY = 0;
    this.gravedad = 1;
    this.tocandoSuelo = true;
  }

  saltar() {
    if (this.tocandoSuelo) {
      this.velY = -18;
      this.tocandoSuelo = false;
      if (saltoSonido.isPlaying()) {
        saltoSonido.stop();
      }
      saltoSonido.play();
    }
  }

  mover() {
    this.y += this.velY;
    this.velY += this.gravedad;

    if (this.y >= height - 130) {
      this.y = height - 130;
      this.tocandoSuelo = true;
    }
  }

  mostrar() {
    image(personajeImg, this.x, this.y, 80, 80);
  }
}

class Galleta {
  constructor() {
    this.x = width;
    this.y = height - 100;
    this.vel = velocidadGalleta;
  }

  mover() {
    this.x -= this.vel;
  }

  mostrar() {
    image(galletaImg, this.x, this.y, 50, 50);
  }

  colision(p) {
    return (
      this.x < p.x + 80 &&
      this.x + 50 > p.x &&
      this.y < p.y + 80 &&
      this.y + 50 > p.y
    );
  }
}

class Pastel extends Galleta {
  constructor() {
    super();
  }

  mostrar() {
    image(pastelImg, this.x, this.y, 50, 50);
  }
}
