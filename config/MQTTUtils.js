
var fs = require('fs');
var config = require('config');
var topic = config.get('default_topic')
var mqtt_url = config.get('host');
var mqtt_port = config.get('port')
var topic_list_file = config.get('topic_list_path')
var init_mode = false
var topic_list = []
var mqtt = require('mqtt')
var DBUtils = require('./DBUtils')

var MQTTUtils = {};

MQTTUtils.init = function (myArgs) {
    if(myArgs[0] == '-i'){
        console.log('Topic initialisation mode');
        console.log('WARNING config/topic_list.txt will be overwrite');
        init_mode = true
        topic_list = [topic]
    }else{
        fs.closeSync(fs.openSync(topic_list_file, 'a')) //Lazy create file if no exist
        var _topics = fs.readFileSync(topic_list_file).toString().split('\n')
        if(!_topics || _topics.lenght == 0 || _topics == ''){
            console.log('*****!ERROR!*****\nTopic list is empty\nUse node App.js -i to retrieve the topic list from the mqtt server.')
            return 0
        }
        _topics.forEach(_topic => {
            if(!_topic.startsWith('# ') && _topic != ''){
                topic_list.push(_topic.trim().replace(',', ''))
            }
        });
    }
}

MQTTUtils.connect = function () {
    var client = mqtt.connect(mqtt_url+':'+mqtt_port);
    //overwrite mqtt client function
    client.on('connect', ()=>{
        
        console.log("Listening MQTT Server...")
    
        if(topic_list.length == 0){
            console.log('*****!ERROR!*****\nTopic file is not empty but everything is ignored.\nDelete # char from line you want active.')
            client.end()
        }else{
            client.subscribe(topic_list)
        }
    })
    return client;
}

MQTTUtils.receiveMessage = function (client, conn) {
client.on('message', function(topic, payload) {
    if(init_mode){
        if(!topic_list.includes(topic)){
            topic_list.push(topic)
            topic_list.sort()
            var file = fs.createWriteStream(topic_list_file);
            file.on('error', function(err) { console.log('*****!ERROR!*****\n'+err) });
            topic_list.forEach(function(_topic) { file.write('# '+_topic+'\n'); });
            file.end();
            console.log('NEW TOPIC! number of topics: '+topic_list.length)
        }
    }else{
        const json = JSON.parse(payload);
        DBUtils.addValue(
          conn,
            topic,
            json["CreateUtc"],
            json["Desc"],
            json["ExpiryUtc"],
            json["Status"],
            json["Unit"],
            json["Value"]
        )
    }
  })
}

module.exports = MQTTUtils;
