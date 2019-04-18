function openLink(el) {
    let url = "http://dbpedia.org/snorql/?query=";
    window.open(url + encodeURIComponent(el.parentNode.parentNode.querySelector("pre").innerText));
    return false;
}
