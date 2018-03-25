const expect = require('expect');

var {genMsg} = require('./messaging');

describe('genMsg', () => {
  it('should generate the correct message object', () => {
    var from = 'Raghav';
    var text = 'Test message';
    var message = genMsg(from, text);

    expect(typeof message.createdAt).toBe('number');
    expect(message).toInclude({from,text});
  })
});
