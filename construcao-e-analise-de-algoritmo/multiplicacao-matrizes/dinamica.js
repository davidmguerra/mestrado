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
 * Somente o primeiro for que não pode ter a ordem alterada, pois ele itera cada nível do problema. 
 * Problemas de mesmo nível não dependem uns dos outros.
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
 * 1	2	3	4	5	6	7
A1x4	B4x2	C2x3	D3x2	E2x5	F5x3	G3x2
Pi-1*Pk*Pj
m[3,6]
	k = 3
		0 + 48 + (2*3*3) = 66
	k = 4
		12 + 30 + (2*2*3) = 54
	k = 5
		32 + 0 + (2*5*3) = 62
m[2,4]
	k = 2
		0 + 12 + (4*2*2) = 28
	k = 3
		24 + 0 + (4*3*2) = 48
m[2,5]
	k = 2
		0 + 32 + (4*2*5) = 72
	k = 3
		24 + 30 + (4*3*5) = 114
	k = 4
        28 + 0 + (4*2*5) = 68
        
 * 
 * @param {*} p Dimensões da matriz 
 * @return Um array com o custo na primeira posição e a parentização na segunda
 */
let dinamica = (p) => {
    let m = [];
    let s = []; //// s[i][j] armazena o valor ótimo de k para AiAi+1...Aj, dividindo a matriz em Ak e Ak+1

    for (let i = 0; i < p.length; i++) {
        m[i] = [];
        s[i] = [];
        m[i][i] = 0;
    }

    for (let l = 2; l < p.length; l++) { //Nível
        for (let i = 1; i <= p.length - l; i++) { //Grupos de matrizes
            let j = i + l - 1;
            m[i][j] = Number.MAX_VALUE;
            for (let k = i; k < j; k++) { // k
                let q = m[i][k] + m[k + 1][j] + (p[i - 1] * p[k] * p[j]);
                if (q < m[i][j]) {
                    m[i][j] = q;
                    s[i][j] = k;
                }
            }
        }
    }
    
    return [m[1][p.length - 1], parentizacao(s, 1, p.length - 1)];
}

let parentizacao = (s, inicio, fim) => {
    if (inicio == fim)
        return 'A' + inicio;
    else {
        let str = '(';
        str += parentizacao(s, inicio, s[inicio][fim]);
        str += parentizacao(s, s[inicio][fim] + 1, fim);
        return str + ')';
    }
}