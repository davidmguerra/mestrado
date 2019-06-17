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
 *      É TETA(nlg(n)) para qualquer caso, pois sempre divide o problema em dois que a soma dá o total
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
 * @param {*} p 
 * @param {*} i 
 * @param {*} j 
 * @return Um array com o custo na primeira kiição e a parentização na segunda
 */
let guloso = (p, i = 1, j = p.length-1) => {

    if (i == j) {
        return [0, 'A' + i];
    }
    
    let mk = Number.MAX_VALUE;
    let k;

    //m[i, j] = m[i, k] + m[k + 1, j] + Pi-1PkPj
    for (let ki = i; ki < j; ki++) {
        let m = p[i - 1] * p[ki] * p[j];
        if (m < mk) {
            mk = m;
            k = ki;
        }
    }

    //min {m[i, k] + m[k+1, j] + Pi-1*Pk*Pj} i<=k<j
    let custo = mk;
    let parentizacao = "(";
    let mik = guloso(p, i, k);
    custo += mik[0];
    parentizacao += mik[1]; 

    let mk1j = guloso(p, k + 1, j);
    custo += mk1j[0]; 
    parentizacao += mk1j[1]; 
    parentizacao += ')';

    return [custo, parentizacao];
}
