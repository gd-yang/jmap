ME.Draw.Marker = L.Draw.Marker.extend({
	statics: {
		TYPE: 'marker'
	},

	options: {
		icon: new L.Icon.Default(),
		repeatMode: false,
        draggable : true,
		zIndexOffset: 2000 // This should be > than the highest z-index any markers
	},

	initialize: function (map, options) {
		L.Draw.Marker.prototype.initialize.call(this, map, options);
	},

	_fireCreatedEvent: function () {
		var _this = this,
            marker = new ME.Marker({
                latlng : this._marker.getLatLng(),
                options : {
                    icon : this.options.icon,
                    draggable : this.options.draggable
                }
            });

        this._map.changes.fire('created',{layer:marker});
        marker.on('dragend', function(){
            _this._map.changes.fire('created',{layer:marker});
        });
		L.Draw.Feature.prototype._fireCreatedEvent.call(this, marker);
	}
});
