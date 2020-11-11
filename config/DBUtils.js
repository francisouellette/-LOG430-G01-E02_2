var squel = require("squel");
var DBUtils = {};
//CONNECT TO DB
DBUtils.connect = function(){
  let mysql = require('mysql');

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'log430',
    port: 3309
});

conn.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
  });
  return conn;
}

//AJOUT DE USER
DBUtils.addValue = function( conn, topic, P_CreateUtc, P_Desc, P_ExpiryUtc, P_Status, P_Unit,P_Value ) {

    var sql = "INSERT INTO payload (Topic, P_CreateUtc,P_Desc,P_ExpiryUtc,P_Status,P_Unit,P_Value) "+ 
    "VALUES ("+conn.escape(topic)+","+ conn.escape(P_CreateUtc)+"," +conn.escape(P_Desc)+","+conn.escape(P_ExpiryUtc)+","+conn.escape(P_Status)+","+conn.escape(P_Unit)+","+conn.escape(P_Value)+")";

    conn.query(sql, function (err, result) {
      if (err) throw err;
    });
}

//Get all distinct topics 
DBUtils.getTopics = function(conn){
  let sql = squel.select()
      .from("payload")
      .field("Topic")        
      .distinct()
      .toString()
  return new Promise(function(resolve, reject){
    conn.query(sql,function(err, rows){                                                
            if(rows === undefined){
                reject(new Error("Error rows is undefined"));
            }else{
              resolve(JSON.parse(JSON.stringify(rows)))
            }
        }
    )}
)}


//Get All topics from Name 
DBUtils.getDataFromTopic = function(conn, name,start, end){
  let sql = squel.select()
      .from("payload")
      .where("Topic = " + conn.escape(name))
      .where("P_CreateUtc BETWEEN ? and ?", start,end)

      .toString()
  return new Promise(function(resolve, reject){
    conn.query(sql,function(err, rows){                                                
            if(rows === undefined){
                reject(new Error("Error rows is undefined"));
            }else{
              resolve(JSON.parse(JSON.stringify(rows)))
            }
        }
    )}
)}
module.exports = DBUtils;
