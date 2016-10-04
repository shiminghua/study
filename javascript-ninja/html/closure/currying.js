/**
 * 函数柯里化
 */
Function.prototype.curry = function() {
  var fn = this, args = Array.prototype.slice.call(arguments);
  return function() {
    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
  }
};

Function.prototype.partial = function() {
  var fn = this, args = Array.prototype.slice.call(arguments);
  return function() {
    var arg = 0;
    for (var i = 0; i < args.length && arg < arguments.length; i++) {
      if (args[i] === undefined) {
        args[i] = arguments[arg++];
      }
    }
    return fn.apply(this, args);
  }
};

String.prototype.csv = String.prototype.split.partial(/,\s*/);
var results = ('Mugan, Jin, Fuu').csv();
assert(results[0] === 'Mugan' && results[1] === 'Jin' && results[2] === 'Fuu', 'The text values were split properly');

var delay = setTimeout.partial(undefined, 10);
delay(function() {
  assert(true, 'A call to this function will be delayed 10 ms');
});

var bindClick = document.body.addEventListener.partial('click', undefined, false);
bindClick(function() {
  assert(true, 'Click event bound via curried function.');
});
