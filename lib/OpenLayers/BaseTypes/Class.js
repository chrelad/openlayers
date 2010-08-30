/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * Constructor: OpenLayers.Class
 * Base class used to construct all other classes. Includes support for 
 *     multiple inheritance. 
 * 
 * To create a new OpenLayers-style class, use the following syntax:
 * > var MyClass = OpenLayers.Class(prototype);
 *
 * To create a new OpenLayers-style class with multiple inheritance, use the
 *     following syntax:
 * > var MyClass = OpenLayers.Class(Class1, Class2, prototype);
 * Note that instanceof reflection will only reveil Class1 as superclass.
 * Class2 ff are mixins.
 *
 */
OpenLayers.Class = function() {
    var Class = function() {
        this.initialize.apply(this, arguments);
    };
    var extended = {};
    var parent, initialize, Type;
    for(var i=0, len=arguments.length; i<len; ++i) {
        Type = arguments[i];
        if(typeof Type == "function") {
            // make the class passed as the first argument the superclass
            if(i == 0 && len > 1) {
                initialize = Type.prototype.initialize;
                // replace the initialize method with an empty function,
                // because we do not want to create a real instance here
                Type.prototype.initialize = function() {};
                // the line below makes sure that the new class has a
                // superclass
                extended = new Type();
                // restore the original initialize method
                if(initialize === undefined) {
                    delete Type.prototype.initialize;
                } else {
                    Type.prototype.initialize = initialize;
                }
            }
            // get the prototype of the superclass
            parent = Type.prototype;
        } else {
            // in this case we're extending with the prototype
            parent = Type;
        }
        OpenLayers.Util.extend(extended, parent);
    }
    Class.prototype = extended;
    return Class;
};
