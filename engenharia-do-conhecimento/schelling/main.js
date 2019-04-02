let seriesHistory;
let series;
var paused;
var lastState;
function init() {

    if (document.querySelector('#btn').innerHTML == 'Parar') {
        document.querySelector('#btn').innerHTML = 'Executar';
        document.querySelector('#btnPause').classList.add('d-none');
        return;
    }

    document.querySelector("#param-order").innerHTML = '';
    document.querySelector("#param-order-history").innerHTML = '';

    ['#log','.main .agents']
            .forEach(el => document.querySelector(el).innerHTML = '');

    seriesHistory = [0.1,0.3,0.5,0.7,0.9].map(value => { return { name: value, data: []}; });
    series = [ { data: [] }];

    paused = false;
    document.querySelector('#btnPause').innerHTML = 'Pause';
    document.querySelector('#btnPause').classList.remove('d-none');
    document.querySelector('#btn').innerHTML = "Parar";

    var numberAgents = document.querySelector('#numeroAgentes').value; // number of agents
    var neighborhood = document.querySelector('#raioVizinhanca').value; // neighborhood radius
    var threshold = document.querySelector('#limiteMover').value; // threshold for moving
    var interval = document.querySelector('#intervaloVerificacao').value;
    var types = document.querySelector('#tiposAgentes').value;
    var iterators = document.querySelector('#iteracoes').value;

    ['numeroAgentes','raioVizinhanca','limiteMover','intervaloVerificacao','tiposAgentes']
            .forEach(el => document.getElementById(el).disabled = true);

    var agents = [];
    var agentColor = ['#F00','#0F0','#00F','#F0F','#0FF','#AAA', '#555', '#111', '#A93'];

    if (types > 9) {
        alert('Permitido no máximo 9 tipo de agentes. Configurações alteradas.')
        types = 9;
        document.querySelector('#tiposAgentes').value = 9;
    }

    for (var i=0;i<numberAgents;i++) {
        var agent = [];
        agent.type = Math.floor((Math.random() * types));
        agent.x = Math.random() * 100;
        agent.y = Math.random() * 100;
        agent.id = 'a' + i;
        agents.push(agent)
    }

    var agentsElement = document.querySelector('.main .agents');
    var raio = document.createElement("div");
    raio.className = 'raio';
    agentsElement.appendChild(raio);
    agents.forEach(item => {
        var agent = document.createElement("a");
        agent.className = 'agent';
        agent.id = item.id;
        agent.title = item.id + ' (' + item.x + ',' + item.y + ')';
        agent.style.left = item.x + '%';
        agent.style.top = item.y + '%';
        agent.style.backgroundColor = agentColor[item.type];
        agentsElement.appendChild(agent);
    });

    var iterator = 0;
    function update(agent) {
        if (document.querySelector('#btn').innerHTML == 'Executar') {
            ['numeroAgentes','raioVizinhanca','limiteMover','intervaloVerificacao','tiposAgentes']
                .forEach(el => document.getElementById(el).disabled = false);
            calcShcelling();
            showParamOrder();
            return;
        } else if (!paused) {
            if (iterator >= iterators && iterators != 0) {
                return init();
            }
            iterator++;
            var agentElement = document.getElementById(agent.id);
            var neighbors = calcNeighbors(agent);
            if (neighbors.length > 0) {
                var q = neighbors.filter(nb => nb.type == agent.type).length / neighbors.length
                if (q < threshold) {
                    agent.x = Math.random() * 100;
                    agent.y = Math.random() * 100;
                    agent.title = agent.id + ' (' + agent.x + ',' + agent.y + ')';
                    agentElement.style.left = agent.x + '%';
                    agentElement.style.top = agent.y + '%';
                }
            }
            agentElement.classList.remove('border');
            agent = agents[Math.floor((Math.random() * numberAgents))];
            agentElement = document.getElementById(agent.id);
            agentElement.classList.add('border');
            raio.style.left = 'calc(' + agent.x + '% - ' + neighborhood + '%' + ' + 100vh / 100)';
            raio.style.top = 'calc(' + agent.y + '% - ' + neighborhood + '%' + ' + 100vh / 100)';
            raio.style.width = neighborhood*2 + '%';
            raio.style.height = neighborhood*2 + '%';
            neighbors = agents.filter(nb => {
                return ((agent.x - nb.x)**2 + (agent.y - nb.y)**2 < neighborhood**2);
            });
            var log = 'Em análise<br/>';
            log += iterator + ' iterações<br/>'
            neighbors.forEach(agent => log += '<font color=' + agentColor[agent.type] + '>o</font> ' + agent.id + '<br/>');
            document.querySelector('#log').innerHTML = log;
            calcShcellingHistory();
        } else if (lastState != paused) {
            calcShcelling();
            showParamOrder();
        }
        lastState = paused;
        setTimeout(() => update(agent), interval);
        
    }

    function showParamOrder() {
        var paramOrderHistory = Highcharts.chart('param-order-history', {
            title: { text: 'Histórico de parâmetros de ordem' },
            subtitle: { text: 'por threshold' },
            yAxis: { title: { text: 'Nível de Segregação' } },
            legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
            plotOptions: { series: { label: { connectorAllowed: false }, pointStart: 1 } },
            series: [0.1,0.3,0.5,0.7,0.9].map(value => { return { name: value, data: []}; })
        });
        var paramOrder = Highcharts.chart('param-order', {
            title: { text: 'Parâmetros de ordem' },
            subtitle: { text: 'por threshold' },
            yAxis: { title: { text: 'Nível de Segregação' } },
            xAxis: { categories: ['0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9'] },
            legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
            plotOptions: { series: { label: { connectorAllowed: false }, pointStart: 1 } },
            series: [ { name: 'Threshold', data: []} ]
        });
        paramOrderHistory.update({
            series: seriesHistory
        });
        paramOrder.update({
            series: series
        });
    }

    function calcShcellingHistory() {
        [0.1,0.3,0.5,0.7,0.9]
            .forEach((threshold, nbIndex) => {
            var paramOrderAgente = [];
            agents.forEach((agent, index) => {
                var neighbors = calcNeighbors(agent);
                neighbors.push(agent);
                if (neighbors.length) {
                    var q = neighbors.filter(nb => nb.type == agent.type).length / neighbors.length
                    paramOrderAgente[index] = q < threshold?0:1;
                } else {
                    paramOrderAgente[index] = 1;
                }
            });
            var total = paramOrderAgente.reduce((total, num) => total + num);
            seriesHistory[nbIndex].data.push(total / numberAgents);
        });
    }

    function calcShcelling() {
        series[0].data = [];
        [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
            .forEach((threshold, nbIndex) => {
            var paramOrderAgente = [];
            agents.forEach((agent, index) => {
                var neighbors = calcNeighbors(agent);
                neighbors.push(agent);
                if (neighbors.length) {
                    var q = neighbors.filter(nb => nb.type == agent.type).length / neighbors.length
                    paramOrderAgente[index] = q < threshold?0:1;
                } else {
                    paramOrderAgente[index] = 1;
                }
            });
            var total = paramOrderAgente.reduce((total, num) => total + num);
            series[0].data.push(total / numberAgents);
        });
    }

    function calcNeighbors(agent) {
        return agents.filter(nb => {
            return ((agent.x - nb.x)**2 + (agent.y - nb.y)**2 < neighborhood**2) && nb != agent;
        });
    }

    update(agents[Math.floor((Math.random() * numberAgents))]);

}

function pause() {
    paused = !paused;
    if (paused) {
        document.querySelector('#btnPause').innerHTML = 'Continue';
    } else {
        document.querySelector("#param-order").innerHTML = '';
        document.querySelector("#param-order-history").innerHTML = '';
        document.querySelector('#btnPause').innerHTML = 'Pause';
    }
}
