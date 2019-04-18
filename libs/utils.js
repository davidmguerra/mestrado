Array.prototype.addAll = function() {
    this.push.apply(this, this.concat.apply([], arguments));
};

Array.prototype.convertIndex = function() {
    console.log(this);
    let convertedArray = [null];
    for (var i=0;i<this.length;i++) {
        convertedArray.push(this[i]);
    }
    this.splice(0, this.length);
    this.addAll(convertedArray);
    return this;
};

let random = (inicio, fim) => {
    let number = fim-inicio+1;
    return Math.floor((Math.random() * number))+inicio;
}

let evalContent = (content) => {
    try {
        eval(content);
    } catch(e) {
        alert('ERROR: ' + e)
    }
}

let escapeHTML = (html) => {
    return document.createElement('div').appendChild(document.createTextNode(html)).parentNode.innerHTML;
}

let writeHTML = (html) => {
    return document.write(escapeHTML(html));
}
