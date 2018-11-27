const pows = require('./pow');
const assert = require('chai').assert;

describe('Pow', () => {
  it('return hello', () => {
    assert.equal(pows(), 'hello');
  });
});
