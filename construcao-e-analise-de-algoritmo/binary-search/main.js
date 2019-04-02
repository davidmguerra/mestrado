function processar() {
    eval(document.querySelector('#code').value);
    let A = document.querySelector('#A').value.split(/[ ,]*/).convertIndex();
    let v = parseInt(document.querySelector('#v').value);
    let p = parseInt(document.querySelector('#p').value);
    let r = parseInt(document.querySelector('#r').value);
    let value = binarySearch(A, v, p, r);
    document.querySelector('#resultado').innerHTML = value;
    return false;
}
