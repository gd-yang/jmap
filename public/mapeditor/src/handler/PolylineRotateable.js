/**
 * 	
 * rotate path
 * @memberOf  ME.Handler
 * @constructor
 * @name ME/Handler/PolylineRotateable
 * @class
 */
ME.Handler.PolylineRotateable = ME.Handler.PathDraggable.extend(
	/**
	 * @lends ME.Handler.ME/Handler/PolylineRotateable.prototype
	 */
	{
		/**
		 * enable handler, will add a circle on the center of the bounds
		 * @return {[type]} [description]
		 */
		enable: function(){
			ME.Handler.PathDraggable.prototype.enable.apply(this);

			var latlngBounds = this.path.getBounds();
			var dragMarker = this._centerMarker = L.circleMarker(latlngBounds.getCenter(),{radius:5});
			this.path._map.addLayer(dragMarker);


			this.on("dragend",this._updateCenter,this);
		},

		/**
		 * disable handler
		 * @return {[type]} [description]
		 */
		disalbe: function(){
			ME.Handler.PathDraggable.prototype.disable.apply(this);
			this.path._map.removeLayer(this._centerMarker);


			this.off("dragend",this._updateCenter,this);
		},

		_updateCenter: function(){			
			var latlngBounds = this.path.getBounds();
			this._centerMarker.setLatLng(latlngBounds.getCenter());
		},

		_getOriginalPoints: function(){
			this.path.projectLatlngs();
			return this.path._originalPoints.slice(0);
		},

		_transform: function(s,e){
			var v,
				map = this.path._map,
				originalPoints = this._originalPoints,
				$m,
				latlngs = [];
			s = map.containerPointToLayerPoint(s);
			e = map.containerPointToLayerPoint(e);
			$m = this._getMatrix(s,e);

			for(var i = 0, l = originalPoints.length; i<l; i++){
				v = $m.x($V([originalPoints[i].x,originalPoints[i].y,1]));
				latlngs.push(map.layerPointToLatLng(L.point(v.elements[0],v.elements[1])));
			}

			return latlngs;
		},

		/**
		 * get transform matrix
		 * @param  {Leaflet.Point} s
		 * @param  {Leaflet.Point} e
		 * @return {sylvester.Matrix}
		 */
		_getMatrix:function(s,e){
			var pathCenter = this.pathCenter,
				$m,$s,$e;

			$m = $M([[1,0,-pathCenter.x],
					[0,1,-pathCenter.y],
					[0,0,1]]);
			$s = $m.x($V([s.x,s.y,1]));
			$e = $m.x($V([e.x,e.y,1]));
			$m = $M([[1,0,pathCenter.x],
					[0,1,pathCenter.y],
					[0,0,1]]).x(Matrix.RotationZ(this._getAngle($s,$e))).x($m);
			return $m;
		},

		/**
		 * get radial angle between to points
		 * @param  {sylvester.Vector} p1
		 * @param  {sylvester.Vector} p2
		 * @return {Number}
		 */
		_getAngle: function(p1,p2){
			var sAngle = Math.atan2(p1.elements[1],p1.elements[0]);
	   		var pAngle = Math.atan2(p2.elements[1],p2.elements[0]);

	    	return (pAngle - sAngle);
		}
	}
);

L.Polyline.addInitHook(function () {
	this.on("add", function(){
		// Check to see if handler has already been initialized. This is to support versions of Leaflet that still have L.Handler.PolyEdit
		if (this.rotating) {
			return;
		}

		if (ME.Handler.PolylineRotateable && this.options.rotateable !== false) {
			this.rotating = new ME.Handler.PolylineRotateable(this);
		}

	},this);
});