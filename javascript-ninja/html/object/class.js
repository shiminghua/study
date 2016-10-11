/**
 * class
 */
(function() {
  var initializing = false;
  // Determine if functions can be serialized
  var superPattern = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;

  // Creates a new Class that inherits from this class
  Object.subClass = function(properties) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var proto = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in properties) {
      // Check if we're overwriting an existing function
      proto[name] = typeof properties[name] === 'function' && 
        typeof _super[name] === 'function' && 
        superPattern.test(properties[name]) ? 
        (function(name, fn) {
          return function() {
            var tmp = this._super;
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
          }
        })(name, properties[name]) : 
        properties[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if (!initializing && this.init) {
        this.init.apply(this, arguments);
      }
    }
    // Populate our constructed prototype object
    Class.prototype = proto;
    // Enforce the constructor to be what we expect
    Class.constructor = Class;
    Class.subClass = arguments.callee;
    // Class.subClass = Class;
    return Class;
    
  };
})();