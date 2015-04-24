var pomelo = require('pomelo');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
  this.channelService = app.get('channelService');
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
  var uid = 1000;
  var self = this;

  var sessionService = this.app.get('sessionService');
  var loggedSessions = sessionService.getByUid(uid);
  if (!!loggedSessions && !!loggedSessions.length) {
    sessionService.kick(uid);
  }

  session.bind(uid, function(err) {
    if (!!err) {
      console.error(err);
      next(err);
    } else {

      session.on('closed', onUserLeave.bind(null, self.app));
      session.pushAll();

      var channel = self.channelService.getChannel('onlineChannel', true);
      channel.add(uid, session.frontendId, function(err) {
        if (!!err) {
          console.error(err);
          next(err);
        } else {
        }
      });

      setTimeout(function() {
        channel.pushMessage({route: 'onHi', msg: 'hi, egret!'});
      }, 1000);

      next(null, {code: 200, msg: 'game server is ok.'});
    }
  });
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};

function onUserLeave(app, session) {
  // nothing;
}
