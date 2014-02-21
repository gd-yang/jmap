ME.Control = ME.Control || {};
/**
 *
 * toolbar control
 * @memberOf  ME.Control
 * @constructor
 * @name ME/Control/Toolbar
 * @class
 */
ME.Control.Toolbar = L.Control.extend(
/**
 * @lends ME/Control/Toolbar.prototype
 */
{

	options: {
		className:"",
		toolbarClassName: "mapeditor-toolbar-bar",
		attributes: ["title"],
		direction: "v",

		all:[
				{
					name: "drawPolyline",
					//innerHTML: "画线",
					title: "画线",
					className: "mapeditor-toolbar-draw-polyline",
					handler: function(){
						var map = this._map;
						map._drawPolylineMode.enable();
					}
				},
				{
					name: "drawPolygon",
					//innerHTML: "画面",
					title: "画面",
					className: "mapeditor-toolbar-draw-polygon",
					handler: function(){
						var map = this._map;
						map._drawPolygonMode.enable();
					}
				},
				{
					name: "drawCircle",
					//innerHTML: "画园",
					title: "画园",
					className: "mapeditor-toolbar-draw-circle",
					mode: ME.Mode.DrawCircle
				},
				{
					name: "drawRectangle",
					//innerHTML: "画方",
					title: "画方",
					className: "mapeditor-toolbar-draw-rectangle",
					mode: ME.Mode.DrawRectangle
				},
				{
					name: "drawMarker",
					//innerHTML: "标注",
					title: "标注",
					className: "mapeditor-toolbar-draw-marker",
					handler: function(){
						var map = this._map;
						map._drawMarkerMode.enable();
					}
				},
				{
					name: "pointSelectRoad",
					title: "点选路",
					className: "mapeditor-toolbar-road-pointroad",
					handler: function(){
						var map = this._map;
						map._selectRoadMode.enable();
					}
				},
				{
					name: "areaSelectRoad",
					//innerHTML: "画面",
					title: "区域选路",
					className: "mapeditor-toolbar-road-arearoad",
					handler: function(){
						var map = this._map;
						map._areaSelectRoadMode.enable();
					}
				},
				{
					name: "getPolygonFromRoads",
					title: "生成区域",
					className: "mapeditor-toolbar-road-roadstoarea",
					handler: function(){
						var url = "http://119.90.32.30/gbox/gate?sid=8002";
						var latlngs=[];
						var map = this._map;
						map._drawPolylineMode.group.eachLayer(function(layer){
							var ll = layer.getLatLngs();
							var arr = [];
							ll.forEach(function(latlng){
								arr.push(latlng.lng + "," +latlng.lat);
							});
							latlngs.push(arr.join(";"));
						});
						ME.roadsToArea({url:url,line:latlngs.join("-")},function(data){
							data = JSON.parse(data);
							var latlngs = data.data[0].split(";");
							var coor = [];
							latlngs.forEach(function(latlng){
								var arr = latlng.split(",");
								var ll = new L.LatLng(arr[1],arr[0]);
								coor.push(ll);
							})
							map.addLayer(new ME.Polygon({latlngs:coor}));
						});
					}
				},
				{
					name: "save",
					title: "保存",
					className: "mapeditor-toolbar-actions-save",
					handler: function(){
						var map = this._map;
						var layer = map._currentpath;
						if(layer){
							layer.dragging.disable();
							layer.editing.disable();
							layer._originalCoord =  L.LatLngUtil.cloneLatLngs(layer.getLatLngs());
						}
					}
				},
				{
					name: "cancel",
					title: "取消",
					className: "mapeditor-toolbar-actions-cancel",
					handler: function(){
						var map = this._map;
						var layer = map._currentpath;
						if(layer){
							layer.dragging.disable();
							layer.editing.disable();
							layer.setLatLngs(layer._originalCoord);
						}
					}
				},
				{
					name: "delete",
					title: "删除",
					className: "mapeditor-toolbar-actions-delete",
					handler: function(){
						var map = this._map;
						var layer = map._currentpath;
						if(layer){
							layer.dragging.disable();
							layer.editing.disable();
							map.removeLayer(layer);
						}
					}
				}
			]
	},

	initialize:function(options){
		L.Control.prototype.initialize.apply(this, [options]);

		var container = this._container = L.DomUtil.create('div', this.options.toolbarClassName);
		L.DomUtil.addClass(container,this.options.direction);
		if(this.options.className)
			L.DomUtil.addClass(container,this.options.className);

		this._buttons = {};
	},

	onAdd: function(map){
		this._map = map;
		var buttons = this.options.buttons,
			that = this;

		if(buttons)
			buttons.forEach(function(button){
				that.addButton(button);
			});
		return this._container;
	},

	onRemove: function(){
		for(var key in this._buttons){
			if(this._buttons.hasOwnProperty(key)){
				this._disposeButton(this._buttons[key]);
			}
		}
		this._buttons = {};
	},

	/**
	 * add buttons
	 * @param {array} buttons   [description]
	 * @param {[element]} container [description]
	 */
	addButtons: function(buttons){
		for(var i=0, button; button=buttons[i++];){
			this.addButton(button);
		}
	},

	/**
	 * add button
	 * @param {[type]} options [description]
	 */
	addButton: function(options){		
		if(typeof options == "string")
			options = this._getConfigByName(options);

		if(!options) return;

		this._createButton(options);
	},

	/**
	 * get button by name
	 * @param  {String} name [description]
	 * @return {Object}      [description]
	 */
	getButton: function(name){
		return this._buttons[name];
	},

	disableButton: function(name){
		var button = this._buttons[name];

		this._offEvent(button);
	},

	enableButton: function(name){
		var button = this._buttons[name];

		this._bindEvent(button);
	},

	/**
	 * remove button from toolbar 
	 * @param  {String} name [description]
	 */
	removeButton: function(name){
		var button = this._buttons[name];
		if(!button) return;

		delete this._buttons[name];

		this._disposeButton(button);
	},

	_createButton: function(options){
		if(this._buttons[options.name])
			return;

		var container = this._container;
		var buttons = this._buttons;
		var isfirst = !Object.keys(buttons).length;
		var button = L.DomUtil.create('a', options.className || "", container);

		for(var i=0,attribute; attribute = this.options.attributes[i++];){
			button[attribute] = options[attribute]?options[attribute]:"";
		}

		if(isfirst)
			L.DomUtil.addClass(button,"first");

		Object.keys(buttons).forEach(function(key){
			L.DomUtil.removeClass(buttons[key],"last");
		});
		L.DomUtil.addClass(button,"last");


		if(options.handler){
			button._handler = options.handler.bind(this);
		}

		this._bindEvent(button);

		this._buttons[options.name] = button;
	},

	_bindEvent: function(button){
		var handler = button._handler;

		L.DomEvent
			.on(button, 'click', L.DomEvent.stopPropagation)
			.on(button, 'mousedown', L.DomEvent.stopPropagation)
			.on(button, 'dblclick', L.DomEvent.stopPropagation)
			.on(button, 'click', L.DomEvent.preventDefault);

		if(handler){
			L.DomEvent.on(button, 'click', handler);	
		}
	},

	_offEvent: function(button){		
		var handler = button._handler;

		L.DomEvent
			.off(button, 'click', L.DomEvent.stopPropagation)
			.off(button, 'mousedown', L.DomEvent.stopPropagation)
			.off(button, 'dblclick', L.DomEvent.stopPropagation)
			.off(button, 'click', L.DomEvent.preventDefault);

		if(handler){
			L.DomEvent.off(button, 'click', handler);	
		}
	},

	_disposeButton: function(button){
		this._offEvent(button);
		button._handler = null;
		button.remove();
	},

	_getConfigByName: function(name){
		var btn;

		this.options.all.forEach(function(button){
			if(button.name == name)
				btn = button;
		});

		return btn;
	}
});
