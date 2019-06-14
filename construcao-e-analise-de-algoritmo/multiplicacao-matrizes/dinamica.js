/**
 * 
 * Algoritmo iterativo utilizando programação dinâmica para o problema de parentização da multiplicação de uma cadeia de matrizes 
 * (Seção 15.2 do CLRS – Introduction to Algorithms, 3ª Edição).
 * 
 * Observações:
 * 
 * Primeira e última dimensão informa a quantidade de linhas da primeira matriz e a quantidade de colunas da última matriz.
 *      Ou seja, matriz resultante será A p[0] x p[n-1]
 * Custo de TETA(n³), e ocupa espaço de TETA(n²)
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
 * @return Um array com o custo na primeira posição e a parentização na segunda
 */
let dinamica = (dimensoes) => {
    let m = [];
    let s = []; //// s[i][j] armazena o valor ótimo de k para AiAi+1...Aj, dividindo a matriz em Ak e Ak+1

    for (let i = 0; i < dimensoes.length; i++) {
        m[i] = [];
        s[i] = [];
        for (let j = 0; j < dimensoes.length; j++) {
            m[i][j] = 0;
            s[i][j] = 0;
        }
    }

    for (let i = 2; i < dimensoes.length; i++) {
        for (let j = 1; j <= dimensoes.length - i; j++) {
            let zzz = j + i - 1;
            m[j][zzz] = Number.MAX_VALUE;
            for (let k = j; k < zzz; k++) {
                let q = m[j][k] + m[k + 1][zzz] + (dimensoes[j - 1] * dimensoes[k] * dimensoes[zzz]);
                if (q < m[j][zzz]) {
                    m[j][zzz] = q;
                    s[j][zzz] = k;
                }
            }
        }
    }

    let parentizacao = '';
    //parentizacao = printar(s, 1, dimensoes.length - 1);
    let inicio = 1;
    let fim = dimensoes.length - 1;
    while (inicio != fim) {
        parentizacao += '(';
        fim = s[inicio][fim];
    }
    parentizacao += 'A' + inicio;

    fim = dimensoes.length - 1;
    inicio = s[inicio][fim] + 1;
    while (inicio != fim) {
        parentizacao += '(';
        inicio = s[inicio][fim] + 1;
    }
    parentizacao += 'A' + inicio;
    parentizacao += ')';




/*

    if (dimensoes.length == 2) {
        parentizacao = 'A1';
    } else {
        for (var inicio = 1; inicio < dimensoes.length - 1; inicio++) {
            parentizacao += '(';
            while ( inicio != fim) {

            }
            for (let j = 0; j < s[inicio].length - 1;j++) {

            }
            parentizacao += ')';
        }
    }
*/
    return [m[1][dimensoes.length - 1], parentizacao];
}

let printar = (s, inicio, fim) => {
    if (inicio == fim)
        return 'A' + inicio;
    else {
        let str = '(';
        str += printar(s, inicio, s[inicio][fim]);
        str += printar(s, s[inicio][fim] + 1, fim);
        return str + ')';
    }
}