var api = {};
global.api = api;
api.net = require('net');

var socket = new api.net.Socket();

socket.connect({
  port: 2000,
  host: '127.0.0.1',
}, function() {
    socket.write(JSON.stringify({ data: 'Hello from client' }));
    socket.on('data', function(data) {
        packet = JSON.parse(data);
        console.log('Data received (by client): ' + packet.data);
        if (Array.isArray(packet.data)) {
            packet.data = packet.data.map(function (item) { return item *= 2; });
            console.log('Data to send: ' + packet.data);
            socket.write(JSON.stringify(packet));
        }

    });
});
