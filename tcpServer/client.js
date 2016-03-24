var api = {};
global.api = api;
api.net = require('net');

var socket = new api.net.Socket();
var arr;
var result = [];

socket.connect({
  port: 2000,
  host: '127.0.0.1',
}, function() {
    socket.write(JSON.stringify('Hello from client'));
    socket.on('data', function(data) {
        arr = JSON.parse(data);
        console.log('Data received (by client): ' + data);
        arr.forEach(function (item) { result.push(item * 2); });
        console.log('Result array: ' + result);
        socket.write(JSON.stringify(result));
    });
});
