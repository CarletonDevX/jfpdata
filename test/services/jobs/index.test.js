'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('jobs service', function() {
  it('registered the jobs service', () => {
    assert.ok(app.service('jobs'));
  });
});
