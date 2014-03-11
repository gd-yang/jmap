/**
 * 镂空环
 */
ME.DonutPolygon = L.Polyline.extend({
	options: {
		fill: true,
		stroke: false
	},

	initialize: function (latlngs, options) {
		L.Polyline.prototype.initialize.call(this, latlngs, options);
		this._initDonut(latlngs);
	},

	_initDonut: function (latlngs) {
		this._latlngs = this._convertLatLngs(latlngs[0].concat(latlngs[1]));
		this._outerLatlngs = this._convertLatLngs(latlngs[0]);
		this._innerLatlngs = this._convertLatLngs(latlngs[1]);
		if(!this.outerPolyline){
			this.outerPolyline = new ME.Polyline({latlngs:this._outerLatlngs,options:{closed:true}});
			this.outerPolyline.on("editing edit",this._editing, this);
		}
		else{
			this.outerPolyline.setLatLngs(this._outerLatlngs);
		}
		if(!this.innerPolyline){
			this.innerPolyline = new ME.Polyline({latlngs:this._innerLatlngs,options:{closed:true}});
			this.innerPolyline.on("editing edit",this._editing, this);
		}
		else{
			this.innerPolyline.setLatLngs(this._innerLatlngs);
		}
	},

	_editing: function(){
		this.setLatLngs([this.outerPolyline.getLatLngs(),this.innerPolyline.getLatLngs()]);
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

ME.Donut = L.FeatureGroup.extend({
	initialize: function(layer,options){
		var editing, _this = this;
		if(layer instanceof ME.DonutPolygon ==  false){
            return;
        }
		this.polygon = layer;
		this.outerPolyline = layer.outerPolyline;
		this.innerPolyline = layer.innerPolyline;
		L.FeatureGroup.prototype.initialize.call(this, [layer, layer.outerPolyline, layer.innerPolyline]);
		editing = this.editing = {};

		editing.enable = function(){
			_this.outerPolyline.editing.enable();
			_this.innerPolyline.editing.enable();
		};
		editing.disable = function(){
			_this.outerPolyline.editing.disable();
			_this.innerPolyline.editing.disable();
		};

		L.setOptions(this,options);
	},

	onAdd: function(map){
		L.FeatureGroup.prototype.onAdd.call(this,map);
		if(this.options.editable){
			this.editing.enable();
		}
	}
});