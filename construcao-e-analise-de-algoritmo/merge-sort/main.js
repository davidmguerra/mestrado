function processar() {
    eval(document.querySelector('#code').value);
    let A = document.querySelector('#A').value.split(/[ ,]*/).convertIndex();
    let p = parseInt(document.querySelector('#p').value);
    let r = parseInt(document.querySelector('#r').value);
    mergeSort(A, p, r);
    document.querySelector('#resultado').innerHTML = A.slice(1).join(', ');
    return false;
}
