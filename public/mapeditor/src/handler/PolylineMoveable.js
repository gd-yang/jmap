/**
 * 	
 * move path
 * @memberOf  ME.Handler
 * @constructor
 * @name ME/Handler/PolylineMoveable
 * @class 
 */
ME.Handler.PolylineMoveable = ME.Handler.PathDraggable.extend(
/**
 * @lends ME.Handler.ME/Handler/PolylineMoveable.prototype
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
		return this.path._originalPoints.slice(0);
	}
});

L.Polyline.addInitHook(function () {
    if (this.dragging) {
        return;
    }

	this.on("add",function(){
        if (ME.Handler.PolylineMoveable) {
            this.dragging = new ME.Handler.PolylineMoveable(this);
        }
	},this);

});