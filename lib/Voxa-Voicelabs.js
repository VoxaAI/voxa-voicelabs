'use strict';

const _ = require('lodash');
const VoicelabsAnalytics = require('voicelabs');
const debug = require('debug')('voxa:voicelabs');

const defaultConfig = {
  ignoreUsers: [],
};

module.exports = register;

function register(skill, config) {
  const pluginConfig = _.merge({}, defaultConfig, config);

  const VoiceLabs = VoicelabsAnalytics(pluginConfig.token);

  skill.onRequestStarted((request) => {
    request.voiceLabsTrack = track;
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
    const msg = _.get(reply.render(), 'say.speech', null);

    if (_.last(reply.paths)) {
      debug('Tracking ', _.last(reply.paths));
      return track(request, _.last(reply.paths), request.intent.slots, msg);
    }

    debug('Tracking ', request.intent.name);
    return track(request, request.intent.name, request.intent.slots, msg);
  });

  function track(request, ...args) {
    if (_.includes(pluginConfig.ignoreUsers, request.user.userId)) {
      return Promise.resolve(null);
    }

    debug('Sending to voicelabs');
    return VoiceLabs.track(request.session, ...args);
  }
}
