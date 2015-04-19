var PomeloClient = require('pomelo-client'),
    Promise = require('promise');

if (process.argv.length < 4) {
  consoloe.error('Usage: ./app.js <server address> <port> <number of clients>');
} else {

  var serverIp = process.argv[1];
  var port = parseInt(process.argv[2]);
  var clientAmount = parseInt(process.argv[3]);
  var route = 'chat.messageHandler.echo';

  var clients = [];
  var inites = [];
  var requests = [];

  var client, promise;

  var i, m;
  for (i = 0, m = clientAmount; i<m; i++) {
    client = new PomeloClient();
    promise = new Promise(function(resolve, reject) {

      client.init({host: serverIp, port: port}, function(err, response) {
        if (!!err) {
          reject(err);
        } else {
          clients.push(client);
          response(response);
        }
      });
    });

    inites.push(promise);

    promise = new Promise(function(resolve, reject) {
      client.request('')
    });
  }

  Promise.all(inites)
    .then(function() {
      for (i = 0, m = clients.length; i<m ; i++) {
        client = clients[i];

        promise = new Promise(function(resolve, reject) {

          client.request(route, msg, function(err, response) {
            if (!!err) {
              reject(err);
            } else {
              resolve(response);
            }
          });

        });

        requests.push(promise);
      }

      setInterval(function() {
        i = Math.floor(Math.random() * requests.length);
        promise = requests[i];

        var begin;
        var end;

        begin = Date.now();

        promise.then(function() {
          end = Date.now();

          console.log('完成一次到服务器的请求，费时：%d 毫秒', end - begin);
        }, function() {
          end = Date.now();

          console.error('到服务器的请求失败了一次！费时：%d 毫秒', end - begin);
        });
      }, 10);
    });
}
