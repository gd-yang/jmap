ME.Draw.AssistLine = L.Draw.Polyline.extend({
    statics: {
        TYPE: 'assistline'
    },
    initialize : function(map, options){
        L.Draw.Polyline.prototype.initialize.call(this, map, options);
        this.type = 'assistline'
    },
    addHooks : function(){
        L.Draw.Polyline.prototype.addHooks.call(this);
        this._poly = new ME.Entity.AssistLine([], this.options.shapeOptions);
    },
    _fireCreatedEvent: function () {
        var poly = new ME.Entity.AssistLine(this._poly.getLatLngs(), this.options.shapeOptions);
        L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);
    }
});