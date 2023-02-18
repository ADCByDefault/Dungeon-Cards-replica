/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

/** @type {HTMLElement} */
const gameOverE = document.querySelector(".game-over");

canvas.width =
    MortoreGioco.dimensione.x * Carta.dimensione.x +
    MortoreGioco.dimensione.x * 10 +
    10;
canvas.height =
    MortoreGioco.dimensione.y * Carta.dimensione.y +
    MortoreGioco.dimensione.y * 10 +
    10;

ctx.textAlign = "center";
ctx.font = "bold 18px sans-serif";
const motore = new MortoreGioco(ctx);

const movimento = {
    sinistra: false,
    destra: false,
    su: false,
    giu: false,
};
let lost = false;
let animationID;

function animateGame() {
    animationID = window.requestAnimationFrame(animateGame);
    motore.disegna();
    if (motore.eroe.vita <= 0) {
        console.log("lost");
        gameOver();
        window.cancelAnimationFrame(animationID);
    }
}
animateGame();

window.addEventListener("keydown", (e) => {
    let key = e.key.toUpperCase();
    if ((key == "ARROWDOWN" || key == "S") && !lost) {
        motore.muoviGiu();
    }
    if ((key == "ARROWUP" || key == "W") && !lost) {
        motore.muoviSu();
    }
    if ((key == "ARROWLEFT" || key == "A") && !lost) {
        motore.muoviSinistra();
    }
    if ((key == "ARROWRIGHT" || key == "D") && !lost) {
        motore.muoviDestra();
    }
});

function gameOver() {
    gameOverE.style.display = "block";
}
