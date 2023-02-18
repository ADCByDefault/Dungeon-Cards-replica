class MortoreGioco {
    static dimensione = {
        x: 3,
        y: 3,
    };
    static possibili = [
        ["Arma", [3, 9]],
        ["Arma", [4, 7]],
        ["Mostro", [1, 4]],
        ["Mostro", [2, 7]],
        ["Mostro", [4, 9]],
        ["Moneta", [5, 16]],
        ["Pozione", [-3, +7]],
    ];
    /** @param {CanvasRenderingContext2D} ctx */
    constructor(ctx) {
        this.ctx = ctx;
        /** @type {Arrays} */
        this.gameMatrix = new Array();
        this.eroe = null;
        for (let i = 0; i < MortoreGioco.dimensione.y; i++) {
            this.gameMatrix.push(new Array());
            for (let j = 0; j < MortoreGioco.dimensione.x; j++) {
                if (
                    i == Eroe.posizioneIniziale[1] &&
                    j == Eroe.posizioneIniziale[0]
                ) {
                    this.eroe = new Eroe("Eroe", {
                        x: Carta.dimensione.x * j + j * 10 + 10,
                        y: Carta.dimensione.y * i + i * 10 + 10,
                    });
                    this.gameMatrix[i].push(this.eroe);
                    continue;
                }
                let rand = Math.floor(
                    Math.random() * MortoreGioco.possibili.length
                );
                let randv = Math.floor(
                    Math.random() *
                        (MortoreGioco.possibili[rand][1][0] -
                            MortoreGioco.possibili[rand][1][1]) +
                        MortoreGioco.possibili[rand][1][1]
                );

                let x = Carta.dimensione.x * j + j * 10 + 10;
                let y = Carta.dimensione.y * i + i * 10 + 10;
                let carta = eval(
                    `new ${MortoreGioco.possibili[rand][0]} ("${MortoreGioco.possibili[rand][0]}", {x : ${x}, y : ${y}}, ${randv})`
                );
                this.gameMatrix[i].push(carta);
            }
        }
    }
    disegna() {
        this.gameMatrix.forEach((row) => {
            row.forEach((carta) => {
                carta.disegnaCarta(ctx);
            });
        });
    }
    generaCartaCasuale() {
        let rand = Math.floor(Math.random() * MortoreGioco.possibili.length);
        let randv = Math.floor(
            Math.random() *
                (MortoreGioco.possibili[rand][1][0] -
                    MortoreGioco.possibili[rand][1][1]) +
                MortoreGioco.possibili[rand][1][1]
        );
        let x = this.eroe.posizione.x;
        let y = this.eroe.posizione.y;
        let carta = eval(
            `new ${MortoreGioco.possibili[rand][0]} ("${MortoreGioco.possibili[rand][0]}", {x : ${x}, y : ${y}}, ${randv})`
        );
        return carta;
    }
    interagisci(carta) {
        return this.eroe.interagisci(carta);
    }
    muoviDestra() {
        let posx = this.eroe.posizioneMatrix[0];
        let posy = this.eroe.posizioneMatrix[1];
        if (!this.gameMatrix[posy][posx + 1]) {
            console.log("non puoi muoverti a destra");
            return;
        }
        let c = this.interagisci(this.gameMatrix[posy][posx + 1]);
        if (!c) {
            return;
        }
        let carta = this.generaCartaCasuale();
        this.eroe.posizione = { ...this.gameMatrix[posy][posx + 1].posizione };
        this.gameMatrix[posy].splice(posx + 1, 1, this.eroe);
        this.gameMatrix[posy].splice(posx, 1, carta);
        this.eroe.posizioneMatrix[0]++;
    }
    muoviSinistra() {
        let posx = this.eroe.posizioneMatrix[0];
        let posy = this.eroe.posizioneMatrix[1];
        if (!this.gameMatrix[posy][posx - 1]) {
            console.log("non puoi muoverti a sinistra");
            return;
        }
        let c = this.interagisci(this.gameMatrix[posy][posx - 1]);
        if (!c) {
            return;
        }
        let carta = this.generaCartaCasuale();
        this.eroe.posizione = { ...this.gameMatrix[posy][posx - 1].posizione };
        this.gameMatrix[posy].splice(posx - 1, 1, this.eroe);
        this.gameMatrix[posy].splice(posx, 1, carta);
        this.eroe.posizioneMatrix[0]--;
    }
    muoviSu() {
        let posx = this.eroe.posizioneMatrix[0];
        let posy = this.eroe.posizioneMatrix[1];
        if (!this.gameMatrix[posy - 1]) {
            console.log("non puoi muoverti a su");
            return;
        }
        let c = this.interagisci(this.gameMatrix[posy - 1][posx]);
        if (!c) {
            return;
        }
        let carta = this.generaCartaCasuale();
        this.eroe.posizione = { ...this.gameMatrix[posy - 1][posx].posizione };
        this.gameMatrix[posy - 1].splice(posx, 1, this.eroe);
        this.gameMatrix[posy].splice(posx, 1, carta);
        this.eroe.posizioneMatrix[1]--;
    }
    muoviGiu() {
        let posx = this.eroe.posizioneMatrix[0];
        let posy = this.eroe.posizioneMatrix[1];
        if (!this.gameMatrix[posy + 1]) {
            console.log("non puoi muoverti a giu");
            return;
        }
        let c = this.interagisci(this.gameMatrix[posy + 1][posx]);
        if (!c) {
            return;
        }
        let carta = this.generaCartaCasuale();
        this.eroe.posizione = { ...this.gameMatrix[posy + 1][posx].posizione };
        this.gameMatrix[posy + 1].splice(posx, 1, this.eroe);
        this.gameMatrix[posy].splice(posx, 1, carta);
        this.eroe.posizioneMatrix[1]++;
    }
}

class Carta {
    static dimensione = {
        x: 100,
        y: 150,
    };
    constructor(nome, posizione) {
        this.nome = nome;
        this.posizione = posizione;
    }
}

class Player extends Carta {
    static danniBase = 1;
    constructor(nome, posizione, vita) {
        super(nome, posizione);
        this.vita = vita;
        this.danni = Player.danniBase;
    }
    vieniColpito(cosa) {
        if (cosa.vita) {
            this.vita -= cosa.danni * cosa.vita;
        } else {
            this.vita -= cosa.danni;
        }

        if (this.vita <= 0) {
            return true;
        }
        return false;
    }
}

class Mostro extends Player {
    constructor(nome, posizione, vita) {
        super(nome, posizione, vita);
    }
    /** @param {CanvasRenderingContext2D} ctx */
    disegnaCarta(ctx) {
        ctx.save();
        ctx.fillStyle = "firebrick";
        ctx.fillRect(
            this.posizione.x,
            this.posizione.y,
            Carta.dimensione.x,
            Carta.dimensione.y
        );
        ctx.fillStyle = "black";
        ctx.fillText(
            `${this.nome} - ${this.vita}`,
            this.posizione.x + Carta.dimensione.x / 2,
            this.posizione.y + Carta.dimensione.y / 2
        );
        ctx.restore();
    }
}

class Eroe extends Player {
    static posizioneIniziale = [1, 1];
    static vitaIniziale = 10;
    static sordiIniziali = 25;
    static vitaMax = 15;
    constructor(nome, posizione) {
        super(nome, posizione, Eroe.vitaIniziale);
        this.sordi = Eroe.sordiIniziali;
        this.posizioneMatrix = Eroe.posizioneIniziale;
        /** @type {Arma} */
        this.arma = null;
        this.vita = Eroe.vitaIniziale;
    }
    /** @param {CanvasRenderingContext2D} ctx */
    disegnaCarta(ctx) {
        ctx.save();
        ctx.fillStyle = "skyblue";
        ctx.fillRect(
            this.posizione.x,
            this.posizione.y,
            Carta.dimensione.x,
            Carta.dimensione.y
        );
        ctx.fillStyle = "black";
        ctx.fillText(
            `${this.nome} ${this.vita}`,
            this.posizione.x + Carta.dimensione.x / 2,
            this.posizione.y + Carta.dimensione.y / 2
        );
        if (this.arma) {
            ctx.fillText(
                `+ ${this.arma.danni}`,
                this.posizione.x + Carta.dimensione.x / 2,
                this.posizione.y + Carta.dimensione.y / 2 + 20
            );
        }
        ctx.fillText(
            `${this.sordi}`,
            this.posizione.x + Carta.dimensione.x / 2,
            this.posizione.y + Carta.dimensione.y / 2 + 40
        );
        ctx.restore();
    }
    /**@param {Arma} arma */
    prendiArma(arma) {
        this.arma = arma;
    }
    /**@param {Mostro} mostro */
    colpisci(mostro) {
        let tempMostro = { ...mostro };
        if (this.arma) {
            let tempArma = { ...this.arma };
            this.arma = this.arma.colpisci(tempMostro);
            return mostro.vieniColpito(tempArma);
        }
        mostro.vieniColpito(this);
        this.vieniColpito(tempMostro);
        if (this.vita <= 0) {
            return false;
        }
        return true;
    }
    /**@param {Moneta} moneta */
    prendiMoneta(moneta) {
        this.sordi += moneta.valore;
        return true;
    }
    interagisci(carta) {
        if (carta instanceof Arma) {
            this.prendiArma(carta);
            return true;
        }
        if (carta instanceof Mostro) {
            let c = this.colpisci(carta);
            if (this.vita < 0) {
                this.vita = 0;
            }
            return c;
        }
        if (carta instanceof Moneta) {
            return this.prendiMoneta(carta);
        }
        if (carta instanceof Pozione) {
            let c = carta.vieniPreso(this);
            if (this.vita > Eroe.vitaMax) {
                this.vita = Eroe.vitaMax;
            }
            if (this.vita < 0) {
                this.vita = 0;
            }
            return c;
        }
    }
}

class Arma extends Carta {
    constructor(nome, posizione, danni) {
        super(nome, posizione);
        this.danni = danni;
    }
    /** @param {CanvasRenderingContext2D} ctx */
    disegnaCarta(ctx) {
        ctx.save();
        ctx.fillStyle = "orange";
        ctx.fillRect(
            this.posizione.x,
            this.posizione.y,
            Carta.dimensione.x,
            Carta.dimensione.y
        );
        ctx.fillStyle = "black";
        ctx.fillText(
            `${this.nome} + ${this.danni}`,
            this.posizione.x + Carta.dimensione.x / 2,
            this.posizione.y + Carta.dimensione.y / 2
        );
        ctx.restore();
    }
    colpisci(cosa) {
        this.danni -= cosa.vita;
        if (this.danni > 0) {
            return this;
        }
        return null;
    }
}

class Moneta extends Carta {
    constructor(nome, posizione, valore) {
        super(nome, posizione);
        this.valore = valore;
    }
    /** @param {CanvasRenderingContext2D} ctx */
    disegnaCarta(ctx) {
        ctx.save();
        ctx.fillStyle = "yellow";
        ctx.fillRect(
            this.posizione.x,
            this.posizione.y,
            Carta.dimensione.x,
            Carta.dimensione.y
        );
        ctx.fillStyle = "black";
        ctx.fillText(
            `${this.nome} + ${this.valore}`,
            this.posizione.x + Carta.dimensione.x / 2,
            this.posizione.y + Carta.dimensione.y / 2
        );
        ctx.restore();
    }
}

class Pozione extends Carta {
    constructor(nome, posizione, valore) {
        super(nome, posizione);
        this.valore = valore == 0 ? 1 : valore;
    }
    /**@param {Eroe} eroe */
    vieniPreso(eroe) {
        eroe.vita += this.valore;
        return true;
    }
    disegnaCarta() {
        ctx.save();
        if (this.valore > 0) {
            ctx.fillStyle = "green";
        }
        if (this.valore < 0) {
            ctx.fillStyle = "tomato";
        }
        ctx.fillRect(
            this.posizione.x,
            this.posizione.y,
            Carta.dimensione.x,
            Carta.dimensione.y
        );
        ctx.fillStyle = "black";
        ctx.fillText(
            `${this.nome}`,
            this.posizione.x + Carta.dimensione.x / 2,
            this.posizione.y + Carta.dimensione.y / 2
        );
        ctx.fillText(
            `${this.valore}`,
            this.posizione.x + Carta.dimensione.x / 2,
            this.posizione.y + Carta.dimensione.y / 2 + 20
        );
        ctx.restore();
    }
}
