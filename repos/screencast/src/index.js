#!/usr/bin/env node
require('../resolveRoot')

module.exports = {
  ...require('./libs'),
  ...require('./screencast'),
}

