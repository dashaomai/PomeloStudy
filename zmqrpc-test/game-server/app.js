var pomelo = require('pomelo'),
    zmq = require('pomelo-rpc-zeromq');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'zmqrpc-test');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : true
    });
});

// global zeromq rpc
app.configure('production|development', function() {
  app.set('proxyConfig', { rpcClient: zmq.client });
  app.set('remoteConfig', { rpcServer: zmq.server });
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
