/**
 * https://en.wikipedia.org/wiki/Heap's_algorithm
 *  Gera todas as permutassões possíveis
 * 
 * @param {*} matriz 
 */
let construirCaminhoBruta = (matriz) => {
    
    let indices = matriz.map((value, index) => index).slice(1);

    let menorCusto = Number.MAX_VALUE;
    let solucao = null;

    let gerarSolucao = (n, indices) => {
        if (n == 1) {
            let caminho = indices.slice();
            caminho.unshift(0);
            caminho.push(0);
            let custo = calcularCusto(matriz, caminho);
            if (custo < menorCusto) {
                menorCusto = custo;
                solucao = caminho;
            }
        } else {
            for (let i = 0; i <= n - 1; i++) {
                gerarSolucao(n - 1, indices);
                troca(indices, n % 2 == 0 ? i : 0, n - 1);
            }
        }
    }

    gerarSolucao(indices.length, indices);

    return solucao;

}

let troca = (Arr, el1, el2) => {
    let tmp = Arr[el1];
    Arr[el1] = Arr[el2];
    Arr[el2] = tmp;
}