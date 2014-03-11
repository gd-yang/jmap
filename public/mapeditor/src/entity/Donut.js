/**
 * 镂空环
 */
ME.Donut = L.Polyline.extend({
	options: {
		fill: true
	},

	initialize: function (latlngs, options) {
		L.Polyline.prototype.initialize.call(this, latlngs, options);
		this._initDonut(latlngs);
	},

	_initDonut: function (latlngs) {
		this._latlngs = this._convertLatLngs(latlngs[0].concat(latlngs[1]));
		this._outerLatlngs = this._convertLatLngs(latlngs[0]);
		this._innerLatlngs = this._convertLatLngs(latlngs[1]);
	},

	projectLatlngs: function () {
		L.Polyline.prototype.projectLatlngs.call(this);

		this._outerPoints = [];
		this._innerPoints = [];

		var  i, len;

		for (i = 0, len = this._outerLatlngs.length; i < len; i++) {
			 this._outerPoints[i] = this._map.latLngToLayerPoint( this._outerLatlngs[i]);
		}

		for (i = 0, len = this._innerLatlngs.length; i < len; i++) {
			 this._innerPoints[i] = this._map.latLngToLayerPoint( this._innerLatlngs[i]);
		}
	},

	setLatLngs: function (latlngs) {
		this._initDonut(latlngs);
		return this.redraw();
	},

	_clipPoints: function () {
		var newParts = [];

		this._parts = [this._innerPoints].concat([this._outerPoints]);

		if (this.options.noClip) { return; }

		for (var i = 0, len = this._parts.length; i < len; i++) {
			var clipped = L.PolyUtil.clipPolygon(this._parts[i], this._map._pathViewport);
			if (clipped.length) {
				newParts.push(clipped);
			}
		}

		this._parts = newParts;
	},

	_getPathPartStr: function (points) {
		var str = L.Polyline.prototype._getPathPartStr.call(this, points);
		return str + (L.Browser.svg ? 'z' : 'x');
	}
});