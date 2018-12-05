const assert = require('chai').assert;
const pows = require('./pow');

describe('Pow', () => {
  it('return hello', () => {
    assert.equal(pows(), 'hello');
  });
});
