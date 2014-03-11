ME.Draw.AssistPolygon = L.Draw.Polygon.extend({
    initialize : function(map, options){
        L.Draw.Polygon.prototype.initialize.call(this, map, options);
        this.type = 'assistpolygon'
    },
    addHooks : function(){
        L.Draw.Polygon.prototype.addHooks.call(this);
        this._poly = new ME.Entity.AssistPolygon([], this.options.shapeOptions);
    },
    _fireCreatedEvent: function () {
        var poly = new ME.Entity.AssistPolygon(this._poly.getLatLngs(), this.options.shapeOptions);
        L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);
    }
});