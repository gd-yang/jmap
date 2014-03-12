/**
 * 镂空环
 */
ME.HollowPolygon = L.Polyline.extend({
	options: {
		fill: true,
		stroke: false,
		noClip:true
	},

	initialize: function (latlngs, options) {
		L.Polyline.prototype.initialize.call(this, latlngs, options);
		this._initDonut(latlngs);
	},

	onAdd: function(map){
		L.Polyline.prototype.onAdd.call(this, map);
		map.addLayer(this.outerPolyline);
		this.innerPolylines.forEach(function(line){
			map.addLayer(line);
		});
	},

	_initDonut: function (latlngs) {
		var innerLatlngs = latlngs.slice(1);

		this.innerPolylines = this.innerPolylines || [];
		this._innerLatlngs = [];
		this._latlngs = this._outerLatlngs = this._convertLatLngs(latlngs[0]);
		// outer polyline
		if(!this.outerPolyline){
			this.outerPolyline = new ME.Polyline({latlngs:this._outerLatlngs,options:{closed:true,noClip:true}});
			this.outerPolyline.on("editing edit",this._editing, this);
		}
		else{
			this.outerPolyline.setLatLngs(this._outerLatlngs);
		}
		// inner latlngs and inner polyline
		for(var i=0, len = innerLatlngs.length;i<len;i++){
			this._innerLatlngs.push(this._convertLatLngs(innerLatlngs[i]));
			if(!this.innerPolylines[i]){
				this.innerPolylines[i] = new ME.Polyline({latlngs:this._innerLatlngs[i],options:{closed:true,noClip:true}});
				this.innerPolylines[i].on("editing edit",this._editing, this);
			}
			else{
				this.innerPolylines[i].setLatLngs(this._innerLatlngs[i]);
			}
		}
	},

	_editing: function(){
		var latlngs = [];

		latlngs.push(this.outerPolyline.getLatLngs());
		this.innerPolylines.forEach(function(line){
			latlngs.push(line.getLatLngs());
		});
		this.setLatLngs(latlngs);
	},

	projectLatlngs: function () {
		L.Polyline.prototype.projectLatlngs.call(this);

		this._outerPoints = [];
		this._innerPoints = [];

		var  i, len, j, l;

		for (i = 0, len = this._outerLatlngs.length; i < len; i++) {
			 this._outerPoints[i] = this._map.latLngToLayerPoint( this._outerLatlngs[i]);
		}

		for (i = 0, len = this._innerLatlngs.length; i < len; i++) {
			this._innerPoints[i] = [];
			for (j = 0, l = this._innerLatlngs[i].length; j < l; j++) {
			 	this._innerPoints[i][j] = this._map.latLngToLayerPoint( this._innerLatlngs[i][j]);
			}
		}
	},

	setLatLngs: function (latlngs) {
		this._initDonut(latlngs);
		return this.redraw();
	},

	_clipPoints: function () {
		var newParts = [];

		this._parts = this._innerPoints.concat([this._outerPoints]);

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

ME.Donut = L.FeatureGroup.extend({
	initialize: function(latlngs,options){
		var editing, _this = this;

		this.hollowPolygons = [];
		for(var i=0, l = latlngs.length;i<l;i++){
			this.hollowPolygons.push( new ME.HollowPolygon(latlngs[i],options));
		}
		L.FeatureGroup.prototype.initialize.call(this, this.hollowPolygons);

		L.setOptions(this,options);
	},

	onAdd: function(map){
		L.FeatureGroup.prototype.onAdd.call(this,map);
	}
});