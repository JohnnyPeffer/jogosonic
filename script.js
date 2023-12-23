const cenario = document.getElementById("cenario");
const sonic = document.getElementById("sonic");
const placa = document.getElementById("placa");

const gameOver = document.getElementById("game-over");
const reiniciar = document.getElementById("reiniciar");

const aneis = document.getElementById("aneis");
const vidas = document.getElementById("vidas");

const larguraCenario = cenario.offsetWidth;
const alturaCenario = cenario.offsetHeight;

const larguraSonic = sonic.offsetWidth;
const alturaSonic = sonic.offsetHeight;

const sonicAndandoDireito = "url(/imagens/img5.gif)";
const sonicAndandoEsquerdo = "url(/imagens/img6.gif)";

const sonicParadoDireito = "url(/imagens/img2.gif)";
const sonicParadoEsquerdo = "url(/imagens/img3.gif)";

const sonicEsperandoDireito = "url(/imagens/img1.gif)";
const sonicEsperandoEsquerdo = "url(/imagens/img4.gif)";

const sonicPulandoDireito = "url(/imagens/img7.gif)";
const sonicPulandoEsquerdo = "url(/imagens/img8.gif)";

const posicoesLeftAneis = [
  900, 1050, 1800, 1950, 2100, 3200, 3400, 4400, 4600, 4800, 6000, 6200, 6400,
  7000, 7200, 7400, 7600, 8600, 8800, 9000, 9600, 9800, 10000, 10200, 11200,
  11400, 11600, 11800, 12400, 12600, 12800, 13000, 13800, 14000, 14200, 14400,
  15000, 15200, 15400, 15600, 16700, 16900, 17100, 17700, 17900, 18100, 18300,
  19400, 19600, 19800,
];

const posicoesImagens = [
  0, 1350, 2700, 4050, 5400, 6750, 8100, 9450, 10800, 12150, 13500, 14850,
  16200, 17550, 18900, 20250,
];

const posicoesLeftInimigos = [
  1500, 2500, 3500, 4500, 5500, 6500, 7500, 8500, 9500, 10500, 11500, 12500,
  13500, 14500, 15500,
];

const ladosImagens = [
  "scaleX(1)",
  "scaleX(-1)",
  "scaleX(1)",
  "scaleX(-1)",
  "scaleX(1)",
  "scaleX(-1)",
  "scaleX(1)",
  "scaleX(-1)",
  "scaleX(1)",
  "scaleX(-1)",
  "scaleX(1)",
  "scaleX(-1)",
  "scaleX(1)",
  "scaleX(-1)",
  "scaleX(1)",
  "scaleX(-1)",
];

let teclas = null;
let posicaoJogador = larguraCenario / 2 - larguraSonic;
let posicaoCenario = 0;
let posicaoMaximaCenario = 20250;
let posicaoCenarioAtual = posicaoCenario;
let direcao = 0;
let velocidade = 10;
let aneisAtual = parseInt(sessionStorage.getItem("aneisAtual")) || 0;
let vidasAtual = parseInt(sessionStorage.getItem("vidasAtual")) || 3;
let ladoDirecao = "direito";
let estaPulando = false;
let estaAndando = false;
let minPosicaoCenario = false;
let maxPosicaoCenario = false;
let sonicMorreu = false;
let tempColisaoInimigos;
let tempColisaoAneis;
let tempChecaFim;
let tempContinue;
let tempCenario;
let tempSonic;
let tempTempo;

const teclaPressionada = (tecla) => {
  if (!teclas) {
    if (tecla.keyCode === 37 || tecla.keyCode === 39) {
      teclas = tecla.keyCode;
    }
    if (tecla.keyCode === 37) {
      direcao = -1;
      sonic.style.backgroundImage = sonicAndandoEsquerdo;
      ladoDirecao = "esquerdo";
      estaAndando = true;
    } else if (tecla.keyCode === 39) {
      direcao = 1;
      sonic.style.backgroundImage = sonicAndandoDireito;
      ladoDirecao = "direito";
      estaAndando = true;
    }
  }
  if (!estaPulando && tecla.keyCode === 32) {
    sonic.style.animation = "pulo 500ms ease";
    const audioPulo = new Audio("/audios/audio15.mp3");
    audioPulo.play();
    cenario.appendChild(audioPulo);
    audioPulo.addEventListener("ended", () => {
      audioPulo.remove();
    });

    if (ladoDirecao === "direito") {
      sonic.style.backgroundImage = sonicPulandoDireito;
    } else {
      sonic.style.backgroundImage = sonicPulandoEsquerdo;
    }
    estaPulando = true;
    estaParado = false;
    sonic.addEventListener("animationend", () => {
      sonic.style.animation = "none";
      if (!estaAndando) {
        if (ladoDirecao === "direito") {
          sonic.style.backgroundImage = sonicParadoDireito;
        } else if (ladoDirecao === "esquerdo") {
          sonic.style.backgroundImage = sonicParadoEsquerdo;
        }
      } else {
        if (ladoDirecao === "direito") {
          sonic.style.backgroundImage = sonicAndandoDireito;
        } else if (ladoDirecao === "esquerdo") {
          sonic.style.backgroundImage = sonicAndandoEsquerdo;
        }
      }
      estaPulando = false;
    });
  }
};

const teclaSolta = (tecla) => {
  if (tecla.keyCode === teclas) {
    teclas = null;
    if (tecla.keyCode === 37) {
      direcao = 0;
      sonic.style.backgroundImage = sonicParadoEsquerdo;
      estaAndando = false;
      estaParado = true;
    } else if (tecla.keyCode === 39) {
      direcao = 0;
      sonic.style.backgroundImage = sonicParadoDireito;
      estaAndando = false;
    }
  }
};

const moveSonic = () => {
  const larguraMaxima = larguraCenario - larguraSonic - 500;
  posicaoJogador += direcao * velocidade;
  if (minPosicaoCenario) {
    if (posicaoJogador < 0) {
      posicaoJogador = 0;
    }
  }
  if (!minPosicaoCenario) {
    if (posicaoJogador <= 300) {
      posicaoJogador = 300;
    }
  }
  if (maxPosicaoCenario) {
    if (posicaoJogador > larguraCenario - larguraSonic) {
      posicaoJogador = larguraCenario - larguraSonic;
    }
  }
  if (!maxPosicaoCenario) {
    if (posicaoJogador > larguraMaxima) {
      posicaoJogador = larguraMaxima;
    }
  }
  sonic.style.left = posicaoJogador + "px";
  tempSonic = requestAnimationFrame(moveSonic);
};

const criaImagens = () => {
  let index = 0;
  for (let i = 1; i <= 16; i++) {
    const novaImagem = document.createElement("div");
    novaImagem.className = "imagem-cenario";
    novaImagem.style.transform = ladosImagens[index];
    cenario.appendChild(novaImagem);
    index = (index + 1) % ladosImagens.length;
  }
};

const criaAneis = () => {
  for (let i = 0; i < posicoesLeftAneis.length; i++) {
    const anel = document.createElement("div");
    anel.className = "anel";
    anel.style.top = "200px";
    cenario.appendChild(anel);
  }
};

const criaInimigos = () => {
  for (let i = 0; i < 15; i++) {
    const inimigo = document.createElement("div");
    inimigo.className = "inimigo";
    cenario.appendChild(inimigo);
  }
};

const moveCenario = () => {
  if (
    (!minPosicaoCenario && posicaoJogador <= 300) ||
    (!maxPosicaoCenario &&
      posicaoJogador + larguraSonic >= larguraCenario - 500)
  ) {
    posicaoCenario += direcao * velocidade;
  }
  if (posicaoCenario <= 0) {
    posicaoCenario = 0;
    minPosicaoCenario = true;
  } else if (posicaoCenario > 300) {
    minPosicaoCenario = false;
  }
  if (posicaoCenario > posicaoMaximaCenario) {
    posicaoCenario = posicaoMaximaCenario;
    maxPosicaoCenario = true;
  } else if (posicaoCenario < posicaoMaximaCenario) {
    maxPosicaoCenario = false;
  }

  const imagemCenario = document.querySelectorAll(".imagem-cenario");
  imagemCenario.forEach((imagem, posicaoImagem) => {
    if (posicaoImagem < posicoesImagens.length) {
      imagem.style.left =
        posicoesImagens[posicaoImagem] - posicaoCenario + "px";
    }
  });

  for (let i = 0; i < posicoesLeftAneis.length; i++) {
    const aAtuais = document.querySelectorAll(".anel");
    aAtuais.forEach((aAtual, posicaoAnelAtual) => {
      if (posicaoAnelAtual < posicoesLeftAneis.length) {
        aAtual.style.left =
          posicoesLeftAneis[posicaoAnelAtual] - posicaoCenario + "px";
      }
    });

    const todosInimigos = document.querySelectorAll(".inimigo");
    todosInimigos.forEach((inimigoAtual, posicaoInimigoAtual) => {
      if (posicaoInimigoAtual < posicoesLeftInimigos.length) {
        inimigoAtual.style.left =
          posicoesLeftInimigos[posicaoInimigoAtual] - posicaoCenario + "px";
      }
    });

    const placa = document.getElementById("placa");
    placa.style.left = 20600 - posicaoCenario + "px";
  }
  tempCenario = requestAnimationFrame(moveCenario);
};

const colisaoAneis = () => {
  const todosAneisAtual = cenario.querySelectorAll(".anel");
  todosAneisAtual.forEach((anel) => {
    const retantulosAnel = anel.getBoundingClientRect();
    const retantulosSonic = sonic.getBoundingClientRect();
    if (
      retantulosAnel.left < retantulosSonic.right &&
      retantulosAnel.right > retantulosSonic.left &&
      retantulosAnel.top < retantulosSonic.bottom &&
      retantulosAnel.bottom > retantulosSonic.top
    ) {
      const audioAnel = new Audio("/audios/audio4.mp3");
      audioAnel.play();
      audioAnel.addEventListener("ended", () => {
        audioAnel.remove();
      });
      aneisAtual++;
      sessionStorage.setItem("aneisAtual", aneisAtual);
      aneis.textContent = aneisAtual;
      anel.style.display = "none";
      if (aneisAtual >= 50) {
        aneisAtual = 0;
        aneis.textContent = aneisAtual;
        sessionStorage.setItem("aneisAtual", aneisAtual);
        vidasAtual++;
        vidas.textContent = vidasAtual;
        sessionStorage.setItem("vidasAtual", vidasAtual);
        const audio23 = new Audio("/audios/audio23.mp3");
        audio23.play();
        cenario.appendChild(audio23);
      }
    }
  });
  tempColisaoAneis = requestAnimationFrame(colisaoAneis);
};

const colisaoInimigos = () => {
  const inimigos = document.querySelectorAll(".inimigo");
  inimigos.forEach((inimigo) => {
    const retantulosInimigo = inimigo.getBoundingClientRect();
    const retantulosSonic = sonic.getBoundingClientRect();
    if (
      !estaPulando &&
      !sonicMorreu &&
      retantulosInimigo.left < retantulosSonic.right &&
      retantulosInimigo.right > retantulosSonic.left &&
      retantulosInimigo.top < retantulosSonic.bottom &&
      retantulosInimigo.bottom > retantulosSonic.top
    ) {
      document.removeEventListener("keydown", teclaPressionada);
      document.removeEventListener("keyup", teclaSolta);
      cancelAnimationFrame(tempCenario);
      cancelAnimationFrame(tempSonic);
      cancelAnimationFrame(tempColisaoAneis);
      cancelAnimationFrame(tempColisaoInimigos);
      clearInterval(tempTempo);
      sonic.style.backgroundImage = "url(/imagens/sonic-dano.png)";
      sonic.classList.add("dano");
      vidasAtual--;
      sessionStorage.setItem("vidasAtual", vidasAtual);
      vidas.textContent = vidasAtual;
      sonicMorreu = true;
      tempContinue = setTimeout(() => {
        if (vidasAtual > 0) {
          location.reload();
        } else if (vidasAtual <= 0) {
          gameOver.style.display = "flex";
          const audioJogo = document.getElementById("audio-jogo");
          audioJogo.volume = 0;
          const audio20 = new Audio("/audios/audio20.mp3");
          audio20.play();
        }
      }, 2500);
    }
    if (
      estaPulando &&
      retantulosInimigo.left < retantulosSonic.right &&
      retantulosInimigo.right > retantulosSonic.left &&
      retantulosInimigo.top < retantulosSonic.bottom &&
      retantulosInimigo.bottom > retantulosSonic.top
    ) {
      inimigo.style.display = "none";
    }
  });
  tempColisaoInimigos = requestAnimationFrame(colisaoInimigos);
};

const iniciar = () => {
  document.addEventListener("keydown", teclaPressionada);
  document.addEventListener("keyup", teclaSolta);
  const audioJogo = new Audio("/audios/audio24.mp3");
  audioJogo.id = "audio-jogo";
  audioJogo.loop = true;
  audioJogo.play();
  cenario.appendChild(audioJogo);
  criaImagens();
  criaAneis();
  moveSonic();
  moveCenario();
  colisaoAneis();
  criaInimigos();
  colisaoInimigos();
  tempChecaFim = setInterval(checaFim, 50);
  vidas.textContent = vidasAtual;
  aneis.textContent = aneisAtual;
};

reiniciar.addEventListener("click", () => {
  sessionStorage.clear();
  location.reload();
});

const checaFim = () => {
  if (sonic.offsetLeft > placa.offsetLeft + 400) {
    document.removeEventListener("keydown", teclaPressionada);
    document.removeEventListener("keyup", teclaSolta);
    cancelAnimationFrame(tempCenario);
    cancelAnimationFrame(tempSonic);
    cancelAnimationFrame(tempColisaoAneis);
    cancelAnimationFrame(tempColisaoInimigos);
    clearInterval(tempTempo);
    clearInterval(tempChecaFim);
    const todosAneis = document.querySelectorAll(".anel");
    todosAneis.forEach((anel) => {
      anel.remove();
    });
    const todosInimigos = document.querySelectorAll(".inimigo");
    todosInimigos.forEach((inimigo) => {
      inimigo.remove();
    });
    gameOver.remove();
    sonic.style.backgroundImage = "url(/imagens/sonic-fim.png)";
    const audioJogo = document.getElementById("audio-jogo");
    audioJogo.volume = 0;
    const audio21 = new Audio("/audios/audio21.mp3");
    audio21.play();
  }
};

window.addEventListener("load", iniciar);
