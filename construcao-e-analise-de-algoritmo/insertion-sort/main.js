
function processar() {
    eval(document.querySelector('#code').value);
    let A = document.querySelector('#A').value.split(/[ ,]*/).convertIndex();
    let n = document.querySelector('#n').value;
    insertionSort(A, n);
    document.querySelector('#resultado').innerHTML = A.slice(1).join(', ');
    return false;
}