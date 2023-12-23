let horasAtual = parseInt(sessionStorage.getItem("horasAtual")) || 0;
let minutosAtual = parseInt(sessionStorage.getItem("minutosAtual")) ||  0;
let segundosAtual = parseInt(sessionStorage.getItem("segundosAtual")) ||  0;
let mileSegundosAtual = parseInt(sessionStorage.getItem("mileSegundosAtual")) ||  0;

const temporizador = () => {
  mileSegundosAtual++;
  sessionStorage.setItem("mileSegundosAtual", mileSegundosAtual);
  if (mileSegundosAtual >= 60) {
    mileSegundosAtual = 0;
    segundosAtual++;
    sessionStorage.setItem("segundosAtual", segundosAtual);
  } else if (segundosAtual >= 60) {
    segundosAtual = 0;
    minutosAtual++;
    sessionStorage.setItem("minutosAtual", minutosAtual);
  } else if (minutosAtual >= 60) {
    minutosAtual = 0;
    horasAtual++;
    sessionStorage.setItem("horasAtual", horasAtual);
  }

  const horasFormatadas = horasAtual < 10 ? "0" + horasAtual : horasAtual;
  const minutosFormatados = minutosAtual < 10 ? "0" + minutosAtual : minutosAtual;
  const segundosFormatados = segundosAtual < 10 ? "0" + segundosAtual : segundosAtual;
  const mileSegundosFormatadas = mileSegundosAtual < 10 ? "0" + mileSegundosAtual : mileSegundosAtual;

  document.getElementById("tempo").innerHTML = `
  ${horasFormatadas}:${minutosFormatados}:${segundosFormatados}:${mileSegundosFormatadas} `;
};

window.addEventListener("DOMContentLoaded", () => {
  tempTempo = setInterval(() => {
    temporizador();
  }, 20);
});
