/**
 * Class: OpenLayers.Location
 * Representation of a point location on a 2-dimensional plane.
 */
OpenLayers.Location = OpenLayers.Class({
    
    /** 
     * APIProperty: x 
     * {Number} The coordinate value in the x-axis direction (read-only).
     */

    /** 
     * APIProperty: y 
     * {Number} The coordinate value in the y-axis direction (read-only).
     */
    
    /**
     * APIProperty: projection
     * {<OpenLayers.Projection>} Optional projection for the point (read-only).
     *     No default projection is assumed.
     */

    /**
     * Constructor: OpenLayers.Location
     * Create a new point location.
     *
     * Parameters:
     * config - {Object}
     */
    initialize: function(config) {
        config = config || {};
        if (config instanceof Array) {
            config = {
                x: config[0],
                y: config[1]
            };
        }
        var projection = config.projection;
        if (projection) {
            if (!(projection instanceof OpenLayers.Projection)) {
                projection = new OpenLayers.Projection(projection);
            }
            this.projection = projection;
        }
        this.x = parseFloat(config.x);
        this.y = parseFloat(config.y);
    },
    
    /**
     * APIMethod: transform
     * Transform this location to a new projection.  Returns a new location
     *     instead of modifying this one.  Throws an error if this location
     *     doesn't have a <projection> set.
     *
     * Parameters:
     * projection - {<OpenLayers.Projection> | String} A projection or 
     *     identifier for a projection.
     *
     * Returns:
     * {<OpenLayers.Location>} A new location that represents this location
     *     transformed to the given projection.
     */
    transform: function(projection) {
        if (!this.projection) {
            throw new Error("Location must have projection set before it can be transformed");
        }
        if (!(projection instanceof OpenLayers.Projection)) {
            projection = new OpenLayers.Projection(projection);
        }
        var config = OpenLayers.Projection.transform(this, this.projection, projection);
        config.projection = projection;
        return new OpenLayers.Location(config);
    },
    
    /**
     * APIMethod: clone
     * Create a clone of this location.
     *
     * Parameters:
     * config - {Object} Optional configuration object with properties to be
     *     set on the clone.
     *
     * Returns:
     * {<OpenLayers.Location>} A location with the same properties as this one.
     */
    clone: function(config) {
        return new OpenLayers.Location(
            OpenLayers.Util.extend(
                {x: this.x, y: this.y, projection: this.projection},
                config
            )
        );
    },
    
    CLASS_NAME: "OpenLayers.Location"
});
