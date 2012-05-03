var connect = require('connect');
var server = connect()
	.use(connect.logger('dev'))
	.use(connect.static(__dirname + '/static'))
	.listen(3000);

var WebSocketServer = require('ws').Server
  ,wss = new WebSocketServer({server: server});

var numClients = 0;

wss.on('connection', function(ws) {

  numClients++;

  ws.on('message', function(message) {
    console.log('received: %s', message);
  });

  ws.on('close', function() {
    console.log('kthxbai!');
    numClients--;
    broadcastToClients(numClients + ' client(s)');
  });
  
  function broadcastToClients(msg) {
    for (var i in wss.clients) {
      if (wss.clients.hasOwnProperty(i)) {
        wss.clients[i].send(msg);
      }
    }
  }

  broadcastToClients(numClients + ' client(s)');
});
