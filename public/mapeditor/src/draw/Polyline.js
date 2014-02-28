ME.Draw = ME.Draw || {};

/**
 * 	
 * draw polyline, you can make it closable.
 * @memberOf  ME.Draw
 * @constructor
 * @name ME/Draw/Polyline
 * @class 
 */
ME.Draw.Polyline = L.Draw.Polyline.extend({

	options:{
		closable: true
	},

	_vertexChanged: function (latlng, added) {
		L.Draw.Polyline.prototype._vertexChanged.call(this, latlng, added);
		this._updateClosableHandler();
	},

	_updateClosableHandler: function(){
		var markerCount = this._markers.length;

		if (markerCount > 2) {
			this._markers[0].on('click', this._closePolyline, this);
		}
		else{
			this._markers[0].off('click', this._closePolyline, this);
			L.setOptions(this._poly,{closable: false});
			this.options.shapeOptions.closable = false;
		}
			
	},

	_closePolyline: function(){
		var latlng = this._markers[0].getLatLng();
		latlng = L.latLng(latlng.lat, latlng.lng);

		L.setOptions(this._poly,{closable: this.options.closable});
		this.options.shapeOptions.closable = true;

		this._poly.redraw();


		this._finishShape();
	},

	_cleanUpShape: function () {
		L.Draw.Polyline.prototype._cleanUpShape.call(this);

		this._markers[0].off('click', this._closePolyline, this);
	},
});