var validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
var hex_validator = new RegExp("^[a-z0-9]{32}$", "i");

function gen(count) {
  var out = "";
  for (var i=0; i<count; i++) {
    out += (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  return out;
}

var _bin2hex = [
    '0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
];

var _hex2bin = [
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0, // 0-9
     0,10,11,12,13,14,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, // A-F
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0,10,11,12,13,14,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, // a-f
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

function bin2hex(str) {
    var len = str.length;
    var rv = '';
    var i = 0;
    var c;
    
    while (len-- > 0) {
        if(str instanceof Buffer)
          c = str[i++];
        else
          c = str.charCodeAt(i++);

        rv += _bin2hex[(c & 0xf0) >> 4];
        rv += _bin2hex[(c & 0x0f)];
    }
    return rv;
}

function hex2bin(str) {
    var len = str.length;
    var rv = [];
    var i = 0;

    var c1;
    var c2;

    while (len > 1) {
        h1 = str.charAt(i++);
        c1 = h1.charCodeAt(0);
        h2 = str.charAt(i++);
        c2 = h2.charCodeAt(0);

        rv.push((_hex2bin[c1] << 4) + _hex2bin[c2]);
        len -= 2;
    }

    return rv;
}

function hex2uuid(hex) {
    return hex.substr(0, 8) + "-" +
           hex.substr(8, 4) + "-" +
           hex.substr(12, 4) + "-" +
           hex.substr(16, 4) + "-" +
           hex.substr(20);
}


function Guid(guid) {
  if (!guid) throw new TypeError("Invalid argument; `value` has no value.");
    
  var value = Guid.EMPTY;
  var bin = null;
  
  if (guid && guid instanceof Guid) {
    // Guid instances
    value = Guid.toString();
  } else if (guid && guid instanceof Buffer) {
    // binary buffer
    value = hex2uuid(bin2hex(guid));
  } else if (guid && Object.prototype.toString.call(guid) === "[object String]" && Guid.isGuid(guid, true)) {
    if(guid.length == 32) // value is a pure hex string
      value = hex2uuid(guid)
    else
      value = guid;
  }

  this.equals = function(other) {
    // Comparing string `value` against provided `guid` will auto-call
    // toString on `guid` for comparison
    if (typeof(other) == 'string') {
        return (other === this.toString());
    }
    return Guid.isGuid(other) && value == other;
  };

  this.isEmpty = function() {
    return value === Guid.EMPTY;
  };
  
  this.toString = function() {
    return value;
  };
  
  this.toJSON = function() {
    return value;
  };

  this.toHex = function() {
    return value.split("-").join("")
  }

  this.toArray = function() {
    return hex2bin(this.toHex())
  }

  this.toBytes = function() {
    if(bin) return bin
    return bin = new Buffer(this.toArray());
  }
  
  Object.defineProperty(this, "value", {
    get: function() { return value; },
    enumerable: true
  });

  Object.defineProperty(this, "bytes", {
    get: function() { return this.toBytes(); },
    enumerable: true
  });
};

Object.defineProperty(Guid, "EMPTY", {
  value: "00000000-0000-0000-0000-000000000000"
});

Guid.isGuid = function(value, loose) {
  return value && (value instanceof Guid || validator.test(value.toString()) ||
                   loose && hex_validator.test(value.toString()));
};

Guid.create = function(value) {
  if(value)
    return new Guid(value);
  return new Guid([gen(2), gen(1), gen(1), gen(1), gen(3)].join("-"));
};

Guid.raw = function() {
  return [gen(2), gen(1), gen(1), gen(1), gen(3)].join("-");
};

module.exports = Guid;
