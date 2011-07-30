var Guid = require('../guid');
var vows = require('vows'),
    assert = require('assert');


module.exports = tests = {}


tests.suite1 = vows.describe('guid tests').addBatch({
"test1": {
    "raw interface": function() {
        var g = Guid.raw();
        assert.ok(g);
        assert.equal(typeof(g), 'string')
        assert.equal(g.length, 36)
        return
    },

    "object interface": function() {
        var tar = [109, 210, 117, 221, 229, 152, 237, 212, 77, 119, 59, 248, 68, 107, 97, 183];

        var g = Guid.create("6dd275dd-e598-edd4-4d77-3bf8446b61b7");
        'm\xd2u\xdd\xe5\x98\xed\xd4Mw;\xf8Dka\xb7'
        assert.ok(g.equals("6dd275dd-e598-edd4-4d77-3bf8446b61b7"), "not equal to string");

        assert.equal(g.toHex(), '6dd275dde598edd44d773bf8446b61b7');
        assert.equal(g.value, new Guid.create('6dd275dde598edd44d773bf8446b61b7').value);
        assert.deepEqual(g.toArray(),
                         tar,
                         "array is not equal");

        buf = g.toBytes();
        assert.ok(buf instanceof Buffer, "buffer");
        for(var i = 0; i < tar.length; i++)
            assert.equal(buf[i], tar[i], "buffer differs");

        var g2 = Guid.create(buf);
        assert.equal(g.value, g2.value, "copy over buffer failed");
    }
},
});

console.log(vows)
