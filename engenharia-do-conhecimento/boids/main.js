class Passaro {

    // Inicializa os parâmetros
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.aceleracao = createVector(0, 0);
        this.velocidade = createVector(random(-1, 1), random(-1, 1));
        this.posicao = createVector(x, y);
    }

    // Desloca o pássaro conforme análise de separação, alinhamento e coesão
    movimentar(passaros, barreiras) {
        this.analisarVizinhanca(passaros, barreiras);
        this.atualizarPosicao();
        this.verificarLimites(barreiras);
        this.renderizar();
    }

    // Verifica a influência dos pássaros vizinhos e adiciona na aceleração
    analisarVizinhanca(passaros, barreiras) {
        this.aceleracao.add(this.separacao(passaros));
        this.aceleracao.add(this.alinhamento(passaros));
        this.aceleracao.add(this.coesao(passaros));
        if (this.efeitoGaiola) {
            this.aceleracao.add(this.limitesGaiola());
        }
    }

    // Atualiza a posição do pássaro
    atualizarPosicao() {
        this.velocidade.add(this.aceleracao);
        this.velocidade.limit(this.velocidadeMaxima);
        this.posicao.add(this.velocidade);
        this.aceleracao.mult(0);
    }

    // Renderiza os pássaros no canvas
    renderizar() {
        let theta = this.velocidade.heading() + radians(90);
        push();
        translate(this.posicao.x, this.posicao.y);
        rotate(theta);
        image(passarosImg[Math.floor(random(0, 7.99))], 0, 0);
        pop();
        iteracoes++;
    }

    // Verifica se a posição do pássaro ficou fora do canvas
    verificarLimites(barreiras) {
        for (let i = 0; i < barreiras.length; i++) {
            let b = barreiras[i];
            if (this.posicao.x + 10 >= b.x && this.posicao.x - 10 <= b.x + 10 &&
                this.posicao.y + 10 >= b.y) {
                this.posicao.x = this.velocidade.x > 0 ? this.posicao.x - this.velocidadeMaxima : this.posicao.x + this.velocidadeMaxima;
                this.posicao.y -= this.velocidadeMaxima;
                this.velocidade.x *= -1;
                this.velocidade.y *= -1;
                if (this.posicao.x + 10 >= b.x && this.posicao.x - 10 <= b.x + 10 &&
                    this.posicao.y + 10 >= b.y) {
                    this.posicao.x += 30;
                    this.posicao.y += 30;
                }
                break;
            }
        }
        if (this.efeitoGaiola) {
            if (this.posicao.x < 0) this.posicao.x = 0;
            if (this.posicao.y < 0) this.posicao.y = 0;
            if (this.posicao.x > width) this.posicao.x = width;
            if (this.posicao.y > height) this.posicao.y = height;
        } else {
            if (this.posicao.x < 0) this.posicao.x = width;
            if (this.posicao.y < 0) this.posicao.y = height;
            if (this.posicao.x > width) this.posicao.x = 0;
            if (this.posicao.y > height) this.posicao.y = 0;
        }
    }

    // Limita o movimentos dos pássaros ao "céu"
    limitesGaiola() {
        let direcao = createVector(0, 0);
        if ((this.posicao.x < width * 0.05 && this.velocidade.x < 0) || (this.posicao.x > width * 0.95 && this.velocidade.x > 0)) {
            direcao.x = this.velocidade.x * -1;
        } else if ((this.posicao.y < height * 0.1 && this.velocidade.y < 0) || (this.posicao.y > height * 0.9 && this.velocidade.y > 0)) {
            direcao.y = this.velocidade.y * -1;
        }

        if (direcao.mag() > 0) {
            direcao.normalize();
            direcao.mult(this.velocidadeMaxima);
            direcao.sub(this.velocidade);
            direcao.limit(this.forcaMaximaSeparacao);
        }
        return direcao;
    }

    // Verifica os pássaros ao reder e se afasta
    // Obtém um vetor que corresponde a média da soma das distâncias entre o pássaro em consideração 
    // e os demais em seu raio de separação (25 pixels), levando em conta que uma distância maior 
    // representa uma necessidade menor de separação
    separacao(passaros) {
        let direcao = createVector(0, 0);
        let count = 0;
        passaros.forEach(passaro => {
            let distancia = p5.Vector.dist(this.posicao, passaro.posicao);
            if (passaro != this && distancia < this.raioSeparacao) {
                let diff = p5.Vector.sub(this.posicao, passaro.posicao);
                diff.normalize();
                diff.div(distancia);
                direcao.add(diff);
                count++;
            }
        });
        // Calcula a média
        if (count > 0) {
            direcao.div(count);
        }

        if (direcao.mag() > 0) {
            // Reynolds: Steering = Desired - Velocity
            direcao.normalize();
            direcao.mult(this.velocidadeMaxima);
            direcao.sub(this.velocidade);
            direcao.limit(this.forcaMaximaSeparacao);
        }
        return direcao;
    }

    // Calcular a velocidade média de cada pássaro
    // Média das direções de deslocamento daqueles pássaros contidos no raio maior do pássaro em consideração
    alinhamento(passaros) {
        let sum = createVector(0, 0);
        let count = 0;
        passaros.forEach(passaro => {
            let distancia = p5.Vector.dist(this.posicao, passaro.posicao);
            if (passaro != this && distancia < this.raioAlinhamento) {
                sum.add(passaro.velocidade);
                count++;
            }
        });
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.velocidadeMaxima);
            let steer = p5.Vector.sub(sum, this.velocidade);
            steer.limit(this.forcaMaximaAlinhamento);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }

    // Para a localização média (ou seja, centro) de todos os pássaros próximos, calcule o vetor 
    // de direção em direção a esse local
    // Média das posições atuais dos pássaros existentes no raio maior, efetivamente indicando uma 
    // posição de centro de massa para onde um pássaro específico deverá ser deslocado
    coesao(passaros) {
        let sum = createVector(0, 0);
        let count = 0;
        passaros.forEach(passaro => {
            let distancia = p5.Vector.dist(this.posicao, passaro.posicao);
            if (passaro != this && distancia < this.raioCoesao) {
                sum.add(passaro.posicao);
                count++;
            }
        });
        if (count > 0) {
            sum.div(count);
            // Calcula e aplica uma força em direção ao pássaro verificado
            let desired = p5.Vector.sub(sum, this.posicao);
            desired.normalize();
            desired.mult(this.velocidadeMaxima);
            let direcao = p5.Vector.sub(desired, this.velocidade);
            direcao.limit(this.forcaMaximaCoesao);
            return direcao;
        } else {
            return createVector(0, 0);
        }
    }
}

class Bando {

    constructor(barreiras) {
        this.passaros = [];
        this.barreiras = barreiras;
    }

    movimentar() {
        this.passaros.forEach(passaro => {
            passaro.movimentar(this.passaros, this.barreiras);
        });
    }

    adicionarPassaro(b) {
        this.passaros.push(b);
    }

}

let width = document.documentElement.clientWidth;
let heightCanvas = document.documentElement.clientHeight - 50;
let height = heightCanvas * 2 / 3.1;

const passarosImg = [];
let bando;
let barreiras;

let iteracoes;
let inicio;

function setup() {
    [1, 2, 3, 4, 5, 6, 7, 8].forEach(b => passarosImg.push(loadImage('img/' + b + '.png')));
    let canvas = createCanvas(width, heightCanvas);
    canvas.parent("boids"); // Adiciona a imgagem no DIV
    frameRate(60);
    init();
}

function init() {
    iteracoes = 0;
    inicio = (new Date()).getTime();
    let qtdPassaros = parseInt(document.getElementById('qtdPassaros').value);
    barreiras = [];
    bando = new Bando(barreiras);
    for (let i = 0; i < qtdPassaros; i++) { // Cria 150 elementos no centro da imagem
        let passaro = new Passaro(Math.random() * width, 0);
        passaro.velocidadeMaxima = parseInt(document.getElementById('velocidadeMaxima').value);
        passaro.forcaMaximaCoesao = 0.04;
        passaro.forcaMaximaAlinhamento = 0.04;
        passaro.forcaMaximaSeparacao = 0.05;
        passaro.raioSeparacao = parseInt(document.getElementById('raioSeparacao').value);
        passaro.raioAlinhamento = parseInt(document.getElementById('raioAlinhamento').value);
        passaro.raioCoesao = parseInt(document.getElementById('raioCoesao').value);
        passaro.efeitoGaiola = document.getElementById('efeitoGaiola').checked;
        bando.adicionarPassaro(passaro);
    }
}

function draw() {

    let canvas = document.querySelector('#boids canvas');
    let ctx = canvas.getContext('2d');

    // Cria gradientes
    let ceu = ctx.createLinearGradient(0, heightCanvas - height, 0, heightCanvas);
    ceu.addColorStop(0, '#00ABEB');
    ceu.addColorStop(0.5, '#fff');
    ceu.addColorStop(0.5, '#26C000');
    ceu.addColorStop(1, '#fff');

    let gramado = ctx.createLinearGradient(0, 50, 0, 95);
    gramado.addColorStop(0.5, '#000');
    gramado.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // Atribui gradientes para preencher e traçar estilos
    ctx.fillStyle = ceu;
    ctx.strokeStyle = gramado;

    // Renderiza os elementos
    ctx.fillRect(0, 0, width, heightCanvas);

    if (width > 890) {
        fill(0);
        ctx.font = '16pt "Neucha"';
        ctx.fillText('Tempo: ' + Math.floor((((new Date()).getTime() - inicio) / 1000)) + 's', 20, heightCanvas - 40);
        ctx.fillText('Iterações: ' + Math.floor((iteracoes / 1000)) + 'k', 20, heightCanvas - 10);
    }

    barreiras.forEach(b => {
        push();
        fill(92, 64, 51);
        translate(b.x, b.y);
        rect(0, 0, 10, (height * 1.05) - b.y);
        pop();
    });
    bando.movimentar();

}

class Barreira {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Adiciona uma barreira no local do click
function mousePressed() {
    if (width > 890) {
        let selecionada = barreiras.find(b => (mouseX >= b.x && mouseX <= b.x + 10 && mouseY >= b.y));
        if (selecionada) {
            barreiras.splice(barreiras.indexOf(selecionada), 1);
        } else {
            if (mouseY < height) {
                barreiras.push(new Barreira(mouseX, mouseY));
                fill(0);
                rect(0, 0, 20, 30);
            }
        }
    }
}

// Ajusta o tamanho da imagem quando redimensionar a janela
function windowResized() {
    width = document.documentElement.clientWidth;
    heightCanvas = document.documentElement.clientHeight - 50;
    height = heightCanvas * 2 / 3.1;
    resizeCanvas(windowWidth, windowHeight);
}

let velocidade = document.getElementById("velocidade");
velocidade.oninput = (el) => {
    frameRate(parseInt(el.target.value));
}