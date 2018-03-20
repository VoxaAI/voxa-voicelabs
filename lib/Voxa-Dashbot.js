'use strict';

const _ = require('lodash');
const DashbotAnalytics = require('dashbot');
// const debug = require('debug')('voxa:voicelabs');

const defaultConfig = {
  ignoreUsers: [],
};

module.exports = register;

function register(skill, config) {
  const pluginConfig = _.merge({}, defaultConfig, config);

  const Dashbot = DashbotAnalytics(pluginConfig.api_key).alexa;

  skill.onRequestStarted((request) => {
    request.voiceLabsTrack = track;
    request.dashbotTrack = track;
    Dashbot.logIncoming(request);
  });

  skill.onAfterStateChanged((request, reply, trans) => {
    if (!trans.reply) return;
    reply.paths = reply.paths || [];
    reply.paths.push(trans.reply);
  });

  skill.onSessionEnded((request, reply) => {
    if (request.request.type === 'SessionEndedRequest') {
      return logSessionEnd(request);
    }
  });

  function logSessionEnd(request) {
    if (request.request.reason === 'ERROR') {
      debug('Session Error logged');
      return track(request, 'Error', null, request.request.error);
    }
    debug('Session Ended logged');
    return track(request, 'Session ended', null);
  }

  skill.onBeforeReplySent((request, reply) => {
    const msg = _.get(reply.toJSON(), 'response.outputSpeech.ssml', null);

    if (_.last(reply.paths)) {
      debug('Tracking ', _.last(reply.paths));
      return track(request, _.last(reply.paths), request.intent.slots, msg);
    }

    debug('Tracking ', request.intent.name);
    return track(request, request.intent.name, request.intent.slots, msg);
  });

  function track(request, ...args) {
    if (_.includes(pluginConfig.ignoreUsers, request.user.userId)) return Promise.resolve(null);
    if (pluginConfig.suppressSending) return Promise.resolve(null);

    debug('Sending to dashbot');
    return Dashbot.logOutgoing(request, ...args);
  }
}
