var Canopy = {};

Canopy.extend = function(destination, source) {
    if (!destination || !source) return destination;
    for (var key in source) {
      if (destination[key] !== source[key])
        destination[key] = source[key];
    }
    return destination;
  };

Canopy.extend(Canopy, {
  compile: function(grammar) {
    var compiler = new this.Compiler(grammar),
        source   = compiler.toSource();

    eval(source);
    return source;
  },

  find: function(root, objectName) {
    var parts = objectName.split('.'),
        part;

    while (part = parts.shift()) {
      root = root[part];
      if (root === undefined)
        throw new Error('Cannot find object named ' + objectName);
    }
    return root;
  },

  forEach: function(list, block, context) {
    for (var i = 0, n = list.length; i < n; i++)
      block.call(context, list[i], i);
  },

  formatError: function(error) {
    var lines  = error.input.split(/\n/g),
        lineNo = 0,
        offset = 0;

    while (offset < error.offset + 1) {
      offset += lines[lineNo].length + 1;
      lineNo += 1;
    }
    var message = 'Line ' + lineNo + ': expected ' + error.expected + '\n',
        line    = lines[lineNo - 1];

    message += line + '\n';
    offset  -= line.length + 1;

    while (offset < error.offset) {
      message += ' ';
      offset  += 1;
    }
    return message + '^';
  }
});

