var Aggregateur = {};
const DBUtils = require('../config/DBUtils');
const moment = require('moment-timezone');
var squel = require("squel");

Aggregateur.CalculateAggregate = function(values,id){
    switch(id){
        case '1':
            return Aggregateur.MoyenneSurTemps(values)
        case '2' : 
            return Aggregateur.TotalSurTemps(values)
        case '3' : 
            return Aggregateur.MedianeSurTemps(values)
    }
}
Aggregateur.MoyenneSurTemps = function(values){
    let total = 0 
    for (i = 0; i < values.length; i++) {
        total += parseInt(values[i])
    }
    let moyenne = total / values.length
    console.log("Moyenne sur temps " + moyenne)
    return moyenne;
}

Aggregateur.TotalSurTemps = function(values){
    let total = 0 
    for (i = 0; i < values.length; i++) {
        total += parseInt(values[i])
    }
    console.log("Total sur temps " + total)
    return total;
}

Aggregateur.MedianeSurTemps = function(values){
    let array = []
    for (i = 0; i < values.length; i++) {
        array.push(parseInt(values[i]))
    }
    array.sort(function(a, b) {
        return a - b;
      });
      var mid = array.length / 2;
      let mediane = mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;

      console.log("Mediane sur temps " + mediane)
      return mediane
}

Aggregateur.CreateAggregate = function(conn,end,topic,interval,agregate){  
    console.log('Aggregate Created')
    debut = moment(new Date()).format("YYYY-MM-DD HH:mm")
    const fin = moment(end, 'YYYY-MM-DD HH:mm').format("YYYY-MM-DD HH:mm")

    //let delay = fin.diff(debut,'millisecond')
    let delay = 60000;
    let array = []
    
    let timerId = setInterval(() => {
       DBUtils.getDataFromTopic(conn,topic,"P_Value").then(value => {
        array.push(value)
        let agg = Aggregateur.CalculateAggregate(array, agregate)
        let current = moment().format("YYYY-MM-DD HH:mm")
        DBUtils.AddAggregate(conn,topic,debut,end,current,interval,agregate,agg)
       })
    }
    , interval);
    setTimeout(() => { clearInterval(timerId); console.log("FINI"); }, delay);
}
module.exports = Aggregateur;
