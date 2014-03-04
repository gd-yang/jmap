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
		direction: "v"
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
				this._buttons[key].dispose();
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
		var button;
		var container = this._container;
		var buttons = this._buttons;
		var isfirst = !Object.keys(buttons).length;

		if(options instanceof ME.Control.Button)
			button = options;
		else
			button = new ME.Control.Button(this._map,options);

		if(!button.el) return;

		if(isfirst)
			L.DomUtil.addClass(button.el,"first");

		Object.keys(buttons).forEach(function(key){
			L.DomUtil.removeClass(buttons[key].el,"last");
		});
		L.DomUtil.addClass(button.el,"last");

		container.appendChild(button.el);

		this._buttons[button.name] = button;
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

		button.disable();
	},

	enableButton: function(name){
		var button = this._buttons[name];

		button.enable();
	},

	/**
	 * remove button from toolbar 
	 * @param  {String} name [description]
	 */
	removeButton: function(name){
		var button = this._buttons[name];
		if(!button) return;

		delete this._buttons[name];

		button.dispose();
	}
});

ME.Control.Button = L.Class.extend({
	options:{
		tagName: "a",
		className: "",
		attributes: ["title"]
	},

	initialize: function(map,options){
        var temp = {};
        if(typeof options == "string")
            options = this._getFromPresetByName(options);
        if(!options) return;
        if(!options.name) return;
        if(!options.handler && !options.mode) return;

        L.extend(temp,options);

        temp.handler = options.handler.bind(this);

        this.name = temp.name;
        this._map = map;

        L.setOptions(this,temp);
        this._createButton(this.options);

    },

    disable: function(){
    	this._removeEvent();
    	L.DomUtil.addClass(this.el, "disabled");
    },

    enable: function(){
    	this._bindEvent();
    	L.DomUtil.removeClass(this.el, "disabled");
    },

	_bindEvent: function(){
		var handler = this.options.handler;
		var button = this.el;

		L.DomEvent
			.on(button, 'click', L.DomEvent.stopPropagation)
			.on(button, 'mousedown', L.DomEvent.stopPropagation)
			.on(button, 'dblclick', L.DomEvent.stopPropagation)
			.on(button, 'click', L.DomEvent.preventDefault);

		if(handler){
			L.DomEvent.on(button, 'click', handler);	
		}
	},

	_removeEvent: function(){
		var handler = this.options.handler;
		var button = this.el;

		L.DomEvent
			.off(button, 'click', L.DomEvent.stopPropagation)
			.off(button, 'mousedown', L.DomEvent.stopPropagation)
			.off(button, 'dblclick', L.DomEvent.stopPropagation)
			.off(button, 'click', L.DomEvent.preventDefault);

		if(handler){
			L.DomEvent.off(button, 'click', handler);
		}
	},

	dispose: function(){
		this._removeEvent();
		this._map = null;
		//this.el.remove();
        this.el.parentNode.removeChild(this.el);
	},

	_createButton: function(options){
		var button = L.DomUtil.create(options.tagName, options.className || "");
		for(var i=0,attribute; attribute = this.options.attributes[i++];){
			button[attribute] = options[attribute]?options[attribute]:"";
		}

		this.el = button;

		this._bindEvent();
	},

	_getFromPresetByName: function(name){
		var btn;

		ME.Control.Button.presets.forEach(function(button){
			if(button.name == name)
				btn = button;
		});

		return btn;
	}
});

ME.Control.Button.presets = [
	{
		name: "panMap",
		//innerHTML: "画线",
		title: "移动地图",
		className: "mapeditor-toolbar-pan-map",
		handler: function(){
			if(ME.Mode._activeMode)
            	ME.Mode._activeMode.disable();
		}
	},
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
		handler: function(){
			var map = this._map;
			map._drawCircleMode.enable();
		}
	},
	{
		name: "drawRectangle",
		//innerHTML: "画方",
		title: "画方",
		className: "mapeditor-toolbar-draw-rectangle",
		handler: function(){
			var map = this._map;
			map._drawRectangleMode.enable();
		}
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
			var group = map.editingGroup;
			group.selectedLayers.forEach(function(layerid){
				var layer = group.getLayer(layerid);
				if(!layer) return;
				var ll = layer.getLatLngs();
				var arr = [];
				ll.forEach(function(latlng){
					arr.push(latlng.lng + "," +latlng.lat);
				});
				latlngs.push(arr.join(";"));
			});
			ME.Util.roadsToArea({url:url,line:latlngs.join("-")},function(data){
				data = JSON.parse(data);
                data.data.forEach(function(road){
                    var latlngs = road.split(";");
                    var coor = [];
                    latlngs.forEach(function(latlng){
                        var arr = latlng.split(",");
                        var ll = new L.LatLng(arr[1],arr[0]);
                        coor.push(ll);
                    });

                    var layer = new ME.Polygon({latlngs:coor});
                    group.clearSelectedLayers({remove : true});
                    group.addDataLayer(layer);
                });
			});
		}
	},
	// {
	// 	name: "areaSelectLayers",
	// 	title: "区域选图层",
	// 	className: "mapeditor-toolbar-draw-rectangle",
	// 	handler: function(){
	// 		var map = this._map;
	// 		map._areaSelectLayersMode.enable();
	// 	}
	// },
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
			var map = this._map, group = map.editingGroup;
                group.clearSelectedLayers({remove : true});
		}
	}
];
