var api = {};
global.api = api;
api.net = require('net');

var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
var result = [];
var clients = [];

var server = api.net.createServer(function(socket) {
    console.log('Connected: ' + socket.localAddress);
    socket.on('data', function (data) {
        console.log('Data received (by server): ' + data);
        var arr = JSON.parse(data);
        if (Array.isArray(arr)) {
            result.push.apply(result, arr);
            console.log('Result array: ' + result);
        }
    });
}).listen(2000);

server.on('connection', function (socket) {
    clients.push(socket);
    console.log('Num of clients: ' + clients.length);

    if (clients.length == 2) {
        for (var i = 0; i < clients.length; i++) {
            clients[i].write(JSON.stringify(task.slice(i * (task.length / 2), (i + 1) * (task.length / 2))));
        }
    }
});
