Voxa Voicelabs
===========

[![Build Status](https://travis-ci.org/mediarain/voxa-voicelabs.svg?branch=master)](https://travis-ci.org/mediarain/voxa-voicelabs)
[![Coverage Status](https://coveralls.io/repos/github/mediarain/voxa-voicelabs/badge.svg?branch=master)](https://coveralls.io/github/mediarain/voxa-voicelabs?branch=master)

A [Voicelabs](https://www.npmjs.com/package/voicelabs) plugin for [voxa](https://mediarain.github.io/voxa/)

Installation
-------------

Just install from [npm](https://www.npmjs.com/package/voxa-voicelabs)

```bash
npm install --save voxa-voicelabs
```

Usage
------

```javascript

const voxaVoicelabs = require('voxa-voicelabs');

const voicelabsConfig = {
  token: '<voicelabs token>',
  ignoreUsers: [], // a list of users to ignore
  suppressSending: false, // A flag to supress sending hits. 
};

voxaVoicelabs(skill, voicelabsConfig);
```
