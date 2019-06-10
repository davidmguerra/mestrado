let construirCaminhoAleatorio = (matriz) => {

    let caminho = [0];
    let selecionados = [true];
    let vizinhos = [];

    for(let i = 0; i < matriz.length; i++) {
        let indicesVizinhos = 0;

        for(let j = 0; j < matriz[i].length; j++) {
            if(!selecionados[j]) {
                vizinhos[indicesVizinhos++] = j;
            }
        }

        if(indicesVizinhos == 0) {
            caminho[i + 1] = 0;
        } else {
            var vizinhoSelecionado = Math.floor((Math.random() * indicesVizinhos));
            caminho[i + 1] = vizinhos[vizinhoSelecionado];
            selecionados[vizinhos[vizinhoSelecionado]] = true;
        }
    }
    return caminho;
}