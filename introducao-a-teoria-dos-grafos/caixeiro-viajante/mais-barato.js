let construirMaisBarato = (matriz) => {
    
    let ciclo = [0,1,2];
    let caminho = ciclo.slice();
    let selecionados = [true, true, true];

    while (caminho.length < matriz.length) {

        let valorReferencia = Number.MAX_VALUE;
        let vizinhoSelecionado = null;

        for (let i = 0; i < caminho.length; i++) {
            for (let j = 0; j < matriz[i].length; j++) {
                if (!selecionados[j] && valorReferencia > matriz[caminho[i]][j]) {
                    vizinhoSelecionado = j;
                    valorReferencia = matriz[caminho[i]][j];
                }
            }
        }

        let menorCusto = Number.MAX_VALUE;
        let pos = -1;
        for (let i=0; i < caminho.length-1; i++) {
            let custo = matriz[caminho[i]][vizinhoSelecionado] + matriz[vizinhoSelecionado][caminho[i+1]] - matriz[caminho[i]][caminho[i+1]];
            if (custo < menorCusto) {
                menorCusto = custo;
                pos = i + 1;
            }
        }

        caminho.splice(pos, 0, vizinhoSelecionado);

        selecionados[vizinhoSelecionado] = true;

    }

    caminho.push(0);

    return caminho;

}