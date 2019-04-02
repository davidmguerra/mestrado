
function processar() {

   let restricoes = document.querySelector('#restricoes').value.replace(/ /g, '').split(/[\r\n]+/);
   let funcao = document.querySelector('#funcao').value.replace(/ /g, '');
   let tipo = funcao.substr(0,3);
   let elementos = funcao.substr(3).split(/[\+\-]/).map(el => {
       let aux = el.match(/\d*([A-Za-z\d]*)/);
       return el[2];
   });

   let pos = 0;
   let series = [];
   
   let maxX1 = 0, maxX2 = 0;

    for (var i=0;i<restricoes.length;i++) {
        if (!restricoes[i]) {
            continue;
        }
        let rest, restX, x1, x2, operacao1, operacao2, resultado1, resultado2;
        
        rest = restricoes[i].replace(/ /g, '').match(/(.*)([\<\>]+[\=]+)(.*)/);
        x1 = rest[1].split(/[\+\-]/).find(el => el.indexOf('x1') != -1);
        x2 = rest[1].split(/[\+\-]/).find(el => el.indexOf('x2') != -1);
        if (x1) {
            x1 = x1.replace(/x1/g, '');
            if (!x1) {
                x1 = 1;
            }
        }
        if (x2) {
            x2 = x2.replace(/x2/g, '');
            if (!x2) {
                x2 = 1;
            }
        }
        resultado = rest[3];

        let data = [];
        if (x1 == undefined || x1 == '') {
            data.push([eval(resultado + '/' + x2), 0]);
            data.push([eval(resultado + '/' + x2), eval(resultado + '/' + x2)]);
        } else if (x2 == undefined || x2 == '') {
            data.push([0, eval(resultado + '/' + x1)]);
            data.push([eval(resultado + '/' + x1), eval(resultado + '/' + x1)]);
        } else {
            data.push([0, eval(resultado + '/' + x1)]);
            data.push([eval(resultado + '/' + x2), 0]);
        }
        
        maxX1 = data[0][0]>maxX1?data[0][0]:data[1][0]>maxX1?data[1][0]:maxX1;
        maxX2 = data[0][1]>maxX2?data[0][1]:data[1][1]>maxX2?data[1][1]:maxX2;
        
        series[pos++] = { name: 'Restrição ' + pos, data: data};

   }
   series.forEach((serie, index) => {
        if (serie.data[0][1] > 0 && serie.data[1][1] > 0) {
            serie.data[1][0] = maxX1;
        }
        if (serie.data[0][0] > 0 && serie.data[1][0] > 0) {
            serie.data[1][1] = maxX2;
        }
    });
   series.push({ name: 'E', data: [[1,1]]})
   
   var grafico = Highcharts.chart('grafico', {
        chart: { type: 'area' },
        title: { text: 'Gráfico' },
        yAxis: { allowDecimals: false, title: { text: 'x2' } },
        xAxis: { allowDecimals: false, title: { text: 'x1' } },
        legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
        plotOptions: { series: { label: { connectorAllowed: false }, pointStart: 0 } },
        series: series
    });

    grafico.update({
        series: series
    });
    
    return false;
}