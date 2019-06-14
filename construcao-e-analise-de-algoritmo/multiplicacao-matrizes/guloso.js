/**
 * 
 * Algoritmo recursivo guloso para o problema de parentização da multiplicação de uma cadeia de matrizes (Seção 15.2 do 
 * CLRS – Introduction to Algorithms, 3ª Edição).
 * 
 * Observações:
 * 
 * Primeira e última dimensão informa a quantidade de linhas da primeira matriz e a quantidade de colunas da última matriz.
 *      Ou seja, matriz resultante será A p[0] x p[n-1]
 * Equação de reocorrência: T(n) = 2T(n/2) + cn
 *      cn lg(n) + cn (igual ao merge sort)
 * 
 * Ex.:
 * 
 * 3
 * 2 2 3 7 
 * 3 2 3 7 2 
 * 4 8 3 1 10 1
 * 
 * A2x3 B3x7
 * A2x3 B3x7 C7x2
 * A8x3 B3x1 C1x10 D10x1
 * 
 * @param {*} dimensoes 
 * @param {*} inicio 
 * @param {*} fim 
 * @return Um array com o custo na primeira posição e a parentização na segunda
 */
let guloso = (dimensoes, inicio, fim) => {

    if (inicio == fim) {
        return [0, 'A' + inicio];
    }
    
    let menorCusto = Number.MAX_VALUE;
    let dimensaoMenorCusto = -1;

    for (let pos = inicio; pos < fim; pos++) {
        let custoDimensao = dimensoes[inicio - 1] * dimensoes[pos] * dimensoes[fim];
        if (custoDimensao < menorCusto) {
            menorCusto = custoDimensao;
            dimensaoMenorCusto = pos;
        }
    }

    let parentizacao = "(";
    let esquerda = guloso(dimensoes, inicio, dimensaoMenorCusto);
    let custo = menorCusto + esquerda[0];
    parentizacao += esquerda[1]; 

    let direita = guloso(dimensoes, dimensaoMenorCusto + 1, fim);
    custo += direita[0]; 
    parentizacao += direita[1]; 
    parentizacao += ')';

    return [custo, parentizacao];
}
