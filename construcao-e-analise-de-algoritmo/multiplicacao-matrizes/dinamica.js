let dinamica = (dimensoes) => {
    let m = [];
    let s = [];
    for (let i=0;i<dimensoes.length;i++) {
        m[i] = [];
        s[i] = [];
        for (let j=0;j<dimensoes.length;j++) {
            m[i][j] = 0;
            s[i][j] = 0;
        }
    }

    for (let i = 2; i < dimensoes.length; i++) {
        for (let j = 1; j <= dimensoes.length - i; j++) {
            let zzz = j + i - 1;
            m[j][zzz] = Number.MAX_VALUE;;
            for (let k = j; k < zzz; k++) {
                let q = m[j][k] + m[k + 1][zzz] + (dimensoes[j - 1] * dimensoes[k] * dimensoes[zzz]);
                if (q < m[j][zzz]) {
                    m[j][zzz] = q;
                    s[j][zzz] = k;
                }
            }
        }
    }

    return [m[1][dimensoes.length - 1], printar(s, 1, dimensoes.length - 1)];
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