ME.Draw.AssistMarker = L.Draw.Marker.extend({
    initialize : function(map, options){
        L.Draw.Marker.prototype.initialize.call(this, map, options);
        this.type = 'assistmarker'
    },
    addHooks : function(){
        L.Draw.Marker.prototype.addHooks.call(this);
    },
    _fireCreatedEvent: function () {
        var marker = new ME.Entity.AssistMarker(this._marker.getLatLng(), { icon: this.options.icon });
        L.Draw.Feature.prototype._fireCreatedEvent.call(this, marker);
    }
});