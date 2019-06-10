let construirCaminho = (matriz) => {

    let selecionados = [true];
    let caminho = [0];

    for (let i = 0; i < matriz.length; i++) {

        let valorReferencia = Number.MAX_VALUE;
        let vizinhoSelecionado = null;

        for (let j = 0; j < matriz[i].length; j++) {
            if (!selecionados[j] && valorReferencia > matriz[caminho[i]][j]) {
                vizinhoSelecionado = j;
                valorReferencia = matriz[caminho[i]][j];
            }
        }

        caminho[i + 1] = vizinhoSelecionado;
        selecionados[vizinhoSelecionado] = true;

    }

    caminho[matriz.length] = 0;

    return caminho;

}