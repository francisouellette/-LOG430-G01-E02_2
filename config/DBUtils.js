var squel = require("squel");
var DBUtils = {};
//CONNECT TO DB
DBUtils.connect = function () {
  let mysql = require('mysql');

  let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'log430',
    port: 3309,
    insecureAuth: true
  });

  conn.connect(function (err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
  });
  return conn;
}

//Adds a new payload if not in DB or updates the old value with the new one fetched from MQTT
DBUtils.addValue = function (conn, topic, P_CreateUtc, P_Desc, P_ExpiryUtc, P_Status, P_Unit, P_Value) {

  var sql = "INSERT INTO payload (Topic, P_CreateUtc,P_Desc,P_ExpiryUtc,P_Status,P_Unit,P_Value) " +
    "VALUES (" + conn.escape(topic) + "," + conn.escape(P_CreateUtc) + "," + conn.escape(P_Desc) + "," + conn.escape(P_ExpiryUtc) + "," + conn.escape(P_Status) + "," + conn.escape(P_Unit) + "," + conn.escape(P_Value) + ")"
    +"ON DUPLICATE KEY UPDATE Topic = " + conn.escape(topic)
    + ", P_CreateUtc="+conn.escape(P_CreateUtc) + ",P_Desc=" + conn.escape(P_Desc) + ",P_ExpiryUtc=" + conn.escape(P_ExpiryUtc) + ",P_Status=" + conn.escape(P_Status) + ",P_Unit=" + conn.escape(P_Unit) + ",P_Value=" + conn.escape(P_Value);

  conn.query(sql, function (err, result) {
    if (err) throw err;
  });
}

//Get all distinct topics 
DBUtils.getTopics = function (conn) {
  let sql = squel.select()
    .from("payload")
    .field("Topic")
    .distinct()
    .toString()
  return new Promise(function (resolve, reject) {
    conn.query(sql, function (err, rows) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve(JSON.parse(JSON.stringify(rows)))
      }
    }
    )
  })
}
DBUtils.AddAggregate = function(conn, topic, start, end, current, interval, agregate, value){
  console.log("-----------------------")
  console.log("START " + start)
  console.log("END " + end)
  console.log("CURRENT " +current)
  console.log("INTERVAL " + interval)
  console.log("Aggregate Value = " +agregate)
  console.log("-----------------------")
  let sql = squel.insert()
  .into("agregat")
  .set("Topic = " + conn.escape(topic))
  .set("Debut = " + conn.escape(start))
  .set("Fin = " + conn.escape(end))
  .set("Intervalle = " + conn.escape(interval))
  .set("Agregateur = " + conn.escape(agregate))
  .set("Valeur = " + conn.escape(value))
  .set("Courant = " + conn.escape(current))
  .toString()
  /*conn.query(sql, function (err, result) {
    if (err) throw err;
  });*/
}

//Get All topics from Name 
DBUtils.getDataFromTopic = function (conn, topic, data){
  let sql = squel.select()
    .from("payload")
    .where("Topic = " + conn.escape(topic))
    .toString()
  return new Promise(function (resolve, reject) {
    conn.query(sql, function (err, rows) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        let json = JSON.parse(JSON.stringify(rows))
        resolve(json[0][data])
      }
    }
    )
  }
  )
}
module.exports = DBUtils;
