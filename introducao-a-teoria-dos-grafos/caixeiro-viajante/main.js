let processar = () => {

    let inicio, solucao, custo;
    let qtd = document.querySelector('#qtd').value;
    document.querySelector('#resultado').innerHTML = '';

    let elementos = document.querySelector('#M').value;
    let matriz = gerarMatriz(elementos);
    let labels = elementos.substr(0, elementos.indexOf('\n')).split(/\s{4,}|\t/).slice(1);;

    custo = Number.MAX_VALUE;
    inicio = Date.now();
    for (var i = 0; i < qtd; i++) {
        var solucaoCandidata = construirCaminhoAleatorio(matriz);
        var custoCandidato = calcularCusto(matriz, solucaoCandidata);
        if (custoCandidato < custo) {
            custo = custoCandidato;
            solucao = solucaoCandidata;
        }
    }
    imprimirCaminho('Soluções aleatórias', solucao, labels, custo, (Date.now() - inicio));

    inicio = Date.now();
    solucao = construirCaminho(matriz);
    custo = calcularCusto(matriz, solucao);
    imprimirCaminho('Solucao vizinho mais próximo', solucao, labels, custo, (Date.now() - inicio));

    inicio = Date.now();
    solucao = construirCaminhoBruta(matriz);
    custo = calcularCusto(matriz, solucao);
    imprimirCaminho('Solucao força bruta', solucao, labels, custo, (Date.now() - inicio));

    inicio = Date.now();
    solucao = construirMaisBarato(matriz);
    custo = calcularCusto(matriz, solucao);
    imprimirCaminho('Solução vértice mais próximo e aresta mais barata', solucao, labels, custo, (Date.now() - inicio));

    return false;

}

let gerarProblema = () => {
    var qtd = parseInt(document.querySelector('#qtdMatriz').value);
    var aux = '';
    for (var j = 0; j < qtd; j++) {
        aux += '	' + String.fromCharCode(65+j);
    }
    aux += '\n';
    for (var i = 0; i < qtd; i++) {
        for (var j = 0; j < qtd; j++) {
            if (j == 0) {
                aux += String.fromCharCode(65+i);
                aux += '	' + Math.floor((Math.random() * 99) + 1);
            } else {
                aux += '	' + Math.floor((Math.random() * 99) + 1);
            }
        }
        aux += '\n';
    }
    document.querySelector('#M').value = aux;
}

let gerarMatriz = (elementos) => {
    var matriz = [];
    var linhas = elementos.split('\n');
    var pos = -1;
    for (var i = 1; i < linhas.length; i++) {
        if (linhas[i].trim() == '') continue;
        var colunas = linhas[i].split(/\s{4,}|\t/);
        matriz[++pos] = [];
        for (var j = 1; j < colunas.length; j++) {
            matriz[pos][j - 1] = parseInt(colunas[j]);
        }

    }
    return matriz;
}

let calcularCusto = (matriz, caminho) => {
    return matriz.reduce((accumulator, currentValue, i) => accumulator + matriz[caminho[i]][caminho[i + 1]], 0);
}

let imprimirCaminho = (tipo, caminho, labels, custo, tempo) => {
    let str = tipo + '\n';
    caminho.forEach(vertice => {
        str += labels[vertice] + ' ';
    });
    str += '\nCusto: ' + custo;
    str += '\nTempo: ' + tempo + 'ms\n\n';
    document.querySelector('#resultado').innerHTML += str;
}
