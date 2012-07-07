/*jslint node: true */

"use strict";

var connect = require('connect');
var server = connect()
	.use(connect.static(__dirname + '/static'))
	.listen(3000);

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({server: server});

var numClients = 0;

wss.on('connection', function (ws) {

    function broadcastToClients(msg) {
        var i;
        for (i in wss.clients) {
            if (wss.clients.hasOwnProperty(i)) {
                wss.clients[i].send(msg);
            }
        }
    }

    ws.on('message', function (message) {
//      console.log('received: %s', message);
        broadcastToClients(message);
    });

    ws.on('close', function () {
        numClients = numClients - 1;
        broadcastToClients(numClients + ' client(s)');
    });

    numClients = numClients + 1;
    broadcastToClients(numClients + ' client(s)');
});

// var mdns = require('mdns');
// var ad = mdns.createAdvertisement(mdns.tcp('http'), 3000, {name: "chatterm"});
// ad.start();
