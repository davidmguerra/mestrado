class Agente {

    renderizar() {        
        push();
        strokeWeight(1);
        stroke(50,50,100);
        fill(this.cor);
        translate(this.x, this.y);
        circle(0, 0, 8);
        pop();
    }
}

class Segregacao {

    constructor() {
        this.estado = 1; //1: Parado; 2: Executando; 3: Pausado.
        this.agentes = [];
    }

    init() {

        this.btn = document.querySelector('#btn');
        this.paramOrder = document.querySelector("#param-order");
        this.log = document.querySelector("#log");
        this.numberAgents = document.querySelector('#numeroAgentes').value; // number of agents
        this.raioVizinhanca = document.querySelector('#raioVizinhanca').value; // neighborhood radius
        this.raioVizinhanca = parseInt(parseInt(this.raioVizinhanca)*(width>height?height:width)/100);
        this.threshold = document.querySelector('#limiteMover').value; // threshold for moving
        this.types = document.querySelector('#tiposAgentes').value;
        this.iterators = document.querySelector('#iteracoes').value;
        this.agentColor = ['#F00','#0F0','#00F','#F0F','#0FF','#AAA', '#555', '#111', '#A93'];

        this.iterator = 0;
        this.agentes = [];
        this.proximoAgente = undefined;
        this.paramOrder.innerHTML = '';
        this.log.innerHTML = '';

        this.series = [ { data: [] }];

        ['numeroAgentes','raioVizinhanca','limiteMover','tiposAgentes']
            .forEach(el => document.getElementById(el).disabled = true);

        if (this.types > 9) {
            alert('Permitido no máximo 9 tipo de agentes. Configurações alteradas.')
            this.types = 9;
        }

        for (var i=0;i<this.numberAgents;i++) {
            var agente = new Agente();
            agente.type = Math.floor((Math.random() * this.types));
            agente.x = Math.random() * width;
            agente.y = Math.random() * height;
            agente.id = 'a' + i;
            agente.cor = this.agentColor[agente.type];
            this.agentes.push(agente);
        }

    }

    run() {

        if (!this.agentes.length) {
            return;
        }

        let agente = this.proximoAgente?this.proximoAgente:this.agentes[Math.floor((Math.random() * this.numberAgents))];
        let neighbors;

        neighbors = this.calcNeighbors(agente);

        var log = 'Vizinhos em análise<br/>';
        log += this.iterator + ' iterações<br/>'
        neighbors.forEach(agente => log += '<font color=' + this.agentColor[agente.type] + '>o</font> ' + agente.id + '<br/>');
        document.querySelector('#log').innerHTML = log;
        
        push();
        translate(agente.x, agente.y);
        fill(255, 255, 0, 220);
        circle(0, 0, this.raioVizinhanca*2);;
        fill(agente.cor);
        circle(0, 0, 12);
        pop();

        this.agentes.forEach(ag => {
            ag.renderizar();
        });

        if (this.iterator >= this.iterators && this.iterators != 0) {
            parar();
        }

        if (this.estado == 2) {

            this.iterator++;        
            
            if (neighbors.length > 0) {
                var q = neighbors.filter(nb => nb.type == agente.type).length / neighbors.length
                if (q < this.threshold) {
                    agente.x = Math.random() * width;
                    agente.y = Math.random() * height;
                }
            }

            this.proximoAgente = this.agentes[Math.floor((Math.random() * this.numberAgents))];
            
        }
        
        
    }

    showParamOrder() {
        var paramOrder = Highcharts.chart('param-order', {
            title: { text: 'Parâmetros de ordem' },
            subtitle: { text: 'por threshold' },
            yAxis: { title: { text: 'Nível de Segregação' } },
            xAxis: { categories: ['0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9'] },
            legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
            plotOptions: { series: { label: { connectorAllowed: false }, pointStart: 1 } },
            series: [ { name: 'Threshold', data: []} ]
        });
        paramOrder.update({
            series: this.series
        });
    }

    calcShcelling() {
        this.series[0].data = [];
        [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
            .forEach((threshold) => {
            let paramOrderAgente = [];
            this.agentes.forEach((agente, index) => {
                var neighbors = this.calcNeighbors(agente);
                neighbors.push(agente);
                if (neighbors.length) {
                    var q = neighbors.filter(nb => nb.type == agente.type).length / neighbors.length;
                    paramOrderAgente[index] = q < threshold?0:1;
                } else {
                    paramOrderAgente[index] = 1;
                }
            });
            var total = paramOrderAgente.reduce((total, num) => total + num);
            this.series[0].data.push(total / this.numberAgents);
        });
    }

    calcNeighbors(agente) {
        return this.agentes.filter(nb => {
            return ((agente.x - nb.x)**2 + (agente.y - nb.y)**2 < this.raioVizinhanca**2) && nb != agente;
        });
    }

}

let width = document.documentElement.clientWidth;
let heightCanvas = document.documentElement.clientHeight - 100;
let height = heightCanvas * 2 / 3.1;
let segregacao;

function setup() {
    
    let canvas = createCanvas(width, heightCanvas);
    canvas.parent("agentes"); // Adiciona a imgagem no DIV   

    segregacao = new Segregacao();

    document.getElementById('log').style.height = (heightCanvas - height + 10) + 'px';
    
    frameRate(60);

}

function draw() {

    let canvas = document.querySelector('#agentes canvas');
    let ctx = canvas.getContext('2d');

    // Cria gradientes
    let ceu = ctx.createLinearGradient(0, heightCanvas - height, 0, heightCanvas);
    ceu.addColorStop(0, '#ccc');
    ceu.addColorStop(0.5, '#fff');
    ceu.addColorStop(0.5, '#999');
    ceu.addColorStop(1, '#fff');

    let gramado = ctx.createLinearGradient(0, 50, 0, 95);
    gramado.addColorStop(0.5, '#000');
    gramado.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // Atribui gradientes para preencher e traçar estilos
    ctx.fillStyle = ceu;
    ctx.strokeStyle = gramado;

    // Renderiza os elementos
    ctx.fillRect(0, 0, width, heightCanvas);
    
    segregacao.run();

}

function processar() {

    if (segregacao.estado == 1 || segregacao.estado == 3) {
        if (segregacao.estado == 1) {
            segregacao.init();
        }
        segregacao.estado = 2;
        segregacao.btn.innerHTML = 'Pausar';
        document.querySelector("#param-order").innerHTML = '';
    } else if (segregacao.estado == 2) {
        segregacao.btn.innerHTML = 'Continuar';
        segregacao.estado = 3;
        showOrder();
    }
     
}

function parar() {
    ['numeroAgentes','raioVizinhanca','limiteMover','tiposAgentes']
        .forEach(el => document.getElementById(el).disabled = false);
    segregacao.btn.innerHTML = 'Executar';
    segregacao.estado = 1;
    showOrder();
     
}

function showOrder() {
    segregacao.calcShcelling();
    segregacao.showParamOrder();
}

// Ajusta o tamanho da imagem quando redimensionar a janela
function windowResized() {
    width = document.documentElement.clientWidth;
    heightCanvas = document.documentElement.clientHeight - 100;
    height = heightCanvas * 2 / 3.1;
    resizeCanvas(windowWidth, windowHeight);
}

let velocidade = document.getElementById("velocidade");
velocidade.oninput = (el) => {
    frameRate(parseInt(el.target.value));
}