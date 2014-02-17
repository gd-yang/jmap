/**
 * 	
 * move path
 * @memberOf  ME.Handler
 * @constructor
 * @name ME/Handler/CircleMoveable
 * @class 
 */
ME.Handler.CircleMoveable = ME.Handler.PathDraggable.extend(
/**
 * @lends ME.Handler.ME/Handler/CircleMoveable.prototype
 */
{
	/**
	 * transform 
	 * @param  {Leaflet.Point} s start point
	 * @param  {Leaflet.Point} e end point
	 * @return {Array} latlngs array after transform
	 */
	_transform: function(s,e){
		var offset = e.subtract(s);
			map = this.path._map;
			originalPoints = this._originalPoints,
			latlngs = [];
		for(var i = 0, l = originalPoints.length; i<l; i++){
			latlngs.push(map.layerPointToLatLng(originalPoints[i].add(offset)));
		}

		return latlngs;
	},

	_getOriginalPoints: function(){
		this.path.projectLatlngs();
		return [this.path._point];
	},

	_updatePosition: function () {
		this.fire('predrag');
		this.path.setLatLng(this._latlngs[0]);
		this.fire('drag');
	}
});

L.Circle.addInitHook(function () {
	this.on("add",function(){
		// Check to see if handler has already been initialized. This is to support versions of Leaflet that still have L.Handler.PolyEdit
		if (this.dragging) {
			return;
		}

		if (ME.Handler.CircleMoveable) {
			this.dragging = new ME.Handler.CircleMoveable(this);
		}
	},this);
});