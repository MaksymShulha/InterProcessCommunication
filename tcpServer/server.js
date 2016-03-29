var api = {};
global.api = api;
api.net = require('net');

var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11, 6];
var result = [];
var clients = [];
var buffer = [];
var count = 0;
var numOfClients = 3;

var server = api.net.createServer(function(socket) {
    console.log('Connected: ' + socket.localAddress);
    socket.on('data', function (data) {
        packet = JSON.parse(data);
        console.log('Data received (by server): ' + packet.data);
        if (Array.isArray(packet.data)) {
            buffer[packet.tId] = packet.data;
            count++;
            if (count == numOfClients) {
                count = 0;
                for (var i = 0; i < buffer.length; i++) {
                    result.push.apply(result, buffer[i]);
                }
                console.log('Result data: ' + result);
            }
        }

    });
}).listen(2000);

server.on('connection', function (socket) {

    clients.push(socket);
    console.log('Number of clients: ' + clients.length);

    if (clients.length == numOfClients) {
        var sizeForClient = task.length / numOfClients;
        for (var i = 0; i < clients.length; i++) {
            var packet = {};
            packet.data = task.slice(i * sizeForClient, (i + 1) * sizeForClient);
            packet.tId = i;
            clients[i].write(JSON.stringify(packet));
        }
    }
});
