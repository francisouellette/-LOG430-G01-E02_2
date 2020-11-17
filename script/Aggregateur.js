var Aggregateur = {};
const DBUtils = require('../config/DBUtils');
const moment = require('moment');

Aggregateur.MoyenneSurTemps = function(topics){
    let total = 0 
    for (i = 0; i < topics.length; i++) {
        total += parseInt(topics[i]["P_Value"])
    }
    let moyenne = total / topics.length
    console.log("Moyenne sur temps " + moyenne)
}

Aggregateur.TotalSurTemps = function(topics){
    let total = 0 
    for (i = 0; i < topics.length; i++) {
        total += parseInt(topics[i]["P_Value"])
    }
    console.log("Total sur temps " + total)
}

Aggregateur.MedianeSurTemps = function(topics){
    let array = []
    for (i = 0; i < topics.length; i++) {
        array.push(parseInt(topics[i]["P_Value"]))
    }
    array.sort(function(a, b) {
        return a - b;
      });
      var mid = array.length / 2;
      let mediane = mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;

      console.log("Mediane sur temps " + mediane)
}
//2020/11/16 20:00
Aggregateur.CreateAggregate = function(conn,end,topic,interval,agregate){  
    console.log('test')
    let debut = moment().format('LLL')
    let fin = moment(end)
    let delay = fin.diff(debut,'millisecond')
    console.log(delay)

    let timerId = setInterval(() => {
        let current = moment().format('LLL')
        DBUtils.AddAggregate(conn,topic,debut,end,current,interval,agregate,10)
    }
    , interval);
    setTimeout(() => { clearInterval(timerId); console.log("FINI"); }, delay);
}
module.exports = Aggregateur;
