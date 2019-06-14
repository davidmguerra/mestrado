let processar = () => {

    let elementos = document.querySelector('#M').value;
    let matrizes = elementos.split('\n').slice(1).filter(val => val.trim() != '');
    document.querySelector('#resultado').innerHTML = 'Solução gulosa\n';
    matrizes.forEach(matriz => {
        let aux = matriz.split(/\s+/).map(val => parseInt(val));
        let resultado = guloso(aux.slice(1), 1, aux[0]);
        document.querySelector('#resultado').innerHTML += resultado[1] + ' ' + resultado[0] + '\n';
    });
    document.querySelector('#resultado').innerHTML += '\nSolução programação dinâmica\n';
    matrizes.forEach(matriz => {
        let aux = matriz.split(/\s+/).map(val => parseInt(val));
        let resultado = dinamica(aux.slice(1), 1, aux[0]);
        document.querySelector('#resultado').innerHTML += resultado[1] + ' ' + resultado[0] + '\n';
    });

    return false;

}