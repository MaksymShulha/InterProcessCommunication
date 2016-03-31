var api = {};
global.api = api;
api.net = require('net');

var task1 = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
var task2 = [22, 1, 14, 15, 9, 0, 11, 2, 17, 3, 2, 5, 7, 15];
var result = [];
var clients = [];
var buffer = [[],[]];
var count = [0, 0];
var isDoneTask = [0, 0];
var nClientsForTask = [2, 2];
var freeClients = 0;

var server = api.net.createServer(function (socket) {
    clients.push({ socket: socket, id: clients.length, isBusy: 0});
    freeClients++;
    console.log('Number of clients: ' + clients.length);

    zzz();

    console.log('Connected: ' + socket.localAddress);
    socket.on('data', function (data) {
        packet = JSON.parse(data);
        console.log('Data received (by server): '+ packet.data);
        if (Array.isArray(packet.data)) {
            clients[packet.clientId].isBusy = 0;
            freeClients++;
            isDoneTask[packet.taskId]++;
            zzz();
            buffer[packet.taskId][packet.id] = packet.data;
            count[packet.taskId]++;
            if (count[packet.taskId] == nClientsForTask[packet.taskId]) {
                for (var i = 0; i < buffer[packet.taskId].length; i++) {
                    result.push.apply(result, buffer[packet.taskId][i]);
                }
                console.log('Result data (task ' + (packet.taskId+1) + '): '+ result);
                result = [];
                buffer[packet.taskId] = [];
            }
        }

    });
}).listen(2000);

server.on('connection', function (socket) {


});

var zzz = function () {
    if (freeClients == nClientsForTask[0] && isDoneTask[0] == 0) {
        var sizeForClient = task1.length / nClientsForTask[0];
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].isBusy == 0) {
                freeClients--;
                var packet = {};
                packet.data = task1.slice(i * sizeForClient, (i + 1) * sizeForClient);
                packet.id = i;
                packet.clientId = clients[i].id;
                packet.taskId = 0;
                clients[i].isBusy = 1;
                clients[i].socket.write(JSON.stringify(packet));
            }
        }
    }
    if (freeClients == nClientsForTask[1] && isDoneTask[1] == 0) {
        var k = 0;
        var sizeForClient = task2.length / nClientsForTask[1];
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].isBusy == 0) {
                freeClients--;
                var packet = {};
                packet.data = task2.slice(k * sizeForClient, (k + 1) * sizeForClient);
                k++;
                packet.id = i;
                packet.clientId = clients[i].id;
                packet.taskId = 1;
                clients[i].isBusy = 1;
                console.log("Client " + clients[i].id + ", gets " + packet.data);
                clients[i].socket.write(JSON.stringify(packet));
            }
        }
    }
}


