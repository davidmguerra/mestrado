//Quantidade de instâncias
//n (1 ≤ n ≤ 100) que indica o tamanho da cadeia de matrizes
//A seguir, na mesma linha, há n + 1 inteiros que correspondem às dimensões das matrizes: p0 p1 … pn.

//3
//2 2 3 7 
//3 2 3 7 2 
//4 8 3 1 10 1

//A2x3 B3x7
//A2x3 B3x7 C7x2
//A8x3 B3x1 C1x10 D10x1


/***
 * n = (j - i)  => (1, p.length - 1)
 * Equação de recorrencia: T(n) = 2T(n/2) + n (?)
 * Divisão: sempre escolhendo um K e dividindo o problema em (i, k) e (k + 1, j)
 * Conquista: Somatório da divisão
 * Tudo antes da divisão => Teta(n)(?)
 *
 * Caso sempre o k = i for o menor valor, o seguinte codigo vai ser executado somente uma ver por cada chamada ao método:
 *     valor = x;
 *     auxK = k;
 *
 * @param matriz
 * @param i
 * @param j
 * @return
*/
let guloso = (dimensoes, inicio, fim) => {

    if (inicio == fim) {
        return [0, 'A' + inicio];
    }
    let valor = Number.MAX_VALUE;
    let auxK = -1;

    for (let k = inicio; k < fim; k++) {
        let x = dimensoes[inicio - 1] * dimensoes[k] * dimensoes[fim];
        if (x < valor) {
            valor = x;
            auxK = k;
        }
    }

    let str = "(";
    let aux = guloso(dimensoes, inicio, auxK);
    valor += aux[0];
    str += aux[1]; 

    aux = guloso(dimensoes, auxK + 1, fim);
    valor += aux[0]; 
    str += aux[1]; 
    str += ')';

    return [valor, str];
}
