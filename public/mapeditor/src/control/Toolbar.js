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
		var container;
		L.Control.prototype.initialize.call(this, options);
		container = this._container = L.DomUtil.create('div', this.options.toolbarClassName);
		L.DomUtil.addClass(container,this.options.direction);
		if(this.options.className){
            L.DomUtil.addClass(container,this.options.className);
        }
		this._buttons = {};
	},

    onAdd: function (map) {
        var buttons = this.options.buttons || [],
            _this = this;
        this._map = map;
        buttons.forEach(function (button) {
            _this.addButton(button);
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

		if(options instanceof ME.Control.Button){
            button = options;
        }else{
            button = new ME.Control.Button(options);
        }

		if(!button.el) {
            return;
        }

		if(!this._map) {
			this.options.buttons = this.options.buttons || [];
			this.options.buttons.push(button);
			return;
		}
		if(this._buttons[button.name]){
			return;
		}

		if(isfirst){
            L.DomUtil.addClass(button.el,"first");
        }

		Object.keys(buttons).forEach(function(key){
			L.DomUtil.removeClass(buttons[key].el,"last");
		});
		L.DomUtil.addClass(button.el,"last");

		container.appendChild(button.el);

		this._buttons[button.name] = button;
		button.onAdd(this._map);
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
		if(!button) return;
		button.disable();
	},

	enableButton: function(name){
		var button = this._buttons[name];
		if(!button) return;
		button.enable();
	},

	/**
	 * remove button from toolbar
	 * @param  {String} name [description]
	 */
	removeButton: function(name){
		var button = this._buttons[name];
		if(!button) {
            return;
        }

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

	initialize: function(options){
        if(!options) return;
        if(!options.name) return;
        if(!options.handler && !options.mode) return;
        if(options.mode) options.handler = this._handlerForMode;

        this.name = options.name;
        this.enabled = true;

        L.setOptions(this,options);
        this._createButton(this.options);
    },

    onAdd: function(map){
    	var options = this.options;

    	if(!map || this.mode) return;

    	this._map = map;

		if(options.mode)
        {
        	this.mode = new options.mode(map);
			this.mode.on("enabled", this.activated, this);
			this.mode.on("disabled", this.deactivated, this);
        }
    },

    disable: function(){
    	if(!this.enabled){
            return;
        }
    	this.enabled = false;
    	this._removeEvent();
    	L.DomUtil.addClass(this.el, "disabled");
    	L.DomUtil.removeClass(this.el, "activated");
    },

    enable: function(){
    	if(this.enabled) {
            return;
        }

    	this.enabled = true;
    	this._bindEvent();
    	L.DomUtil.removeClass(this.el, "disabled");
    },

    activated: function(){
		this.enabled = false;
    	this._removeEvent();
    	L.DomUtil.addClass(this.el, "activated");
    },

    deactivated: function(){
		this.enabled = true;
    	this._bindEvent();
    	L.DomUtil.removeClass(this.el, "activated");
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
			L.DomEvent.on(button, 'click', handler, this);
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
			L.DomEvent.off(button, 'click', handler, this);
		}
	},

	dispose: function(){
		this._removeEvent();
		this._map = null;
		if(this.mode) {
			this.mode.off("enabled", this.enable, this);
			this.mode.off("disabled", this.disable, this);
			this.mode = null;
		}
        this.el.parentNode.removeChild(this.el);
        this.el = null;
	},

	_createButton: function(options){
		var button = L.DomUtil.create(options.tagName, options.className || "");
		for(var i=0,attribute; attribute = this.options.attributes[i++];){
			button[attribute] = options[attribute]?options[attribute]:"";
		}

		this.el = button;

		this._bindEvent();
	},

	_handlerForMode: function(){
		if(this.mode)
		{
			this.mode.enable();
		}
	}
});

ME.Control.Button.browserMap = new ME.Control.Button({
		name: "browserMap",
		title: "移动地图",
		className: "mapeditor-toolbar-pan-map",
		mode: ME.Mode.BrowserMap
	});

ME.Control.Button.drawPolyline = new ME.Control.Button({
		name: "drawPolyline",
		title: "画线",
		className: "mapeditor-toolbar-draw-polyline",
		mode: ME.Mode.DrawPolyline
	});

ME.Control.Button.drawPolygon = new ME.Control.Button({
		name: "drawPolygon",
		title: "画面",
		className: "mapeditor-toolbar-draw-polygon",
		mode: ME.Mode.DrawPolygon
	});

ME.Control.Button.drawAssistLine = new ME.Control.Button({
		name: "drawAssistLine",
		title: "画辅助线",
		className: "mapeditor-toolbar-draw-polyline",
		mode: ME.Mode.DrawAssistLine
	});

ME.Control.Button.drawCircle = new ME.Control.Button({
		name: "drawCircle",
		title: "画园",
		className: "mapeditor-toolbar-draw-circle",
		mode: ME.Mode.DrawCircle
	});

ME.Control.Button.drawRectangle = new ME.Control.Button({
		name: "drawRectangle",
		title: "画方",
		className: "mapeditor-toolbar-draw-rectangle",
		mode: ME.Mode.DrawRectangle
	});

ME.Control.Button.drawMarker = new ME.Control.Button({
		name: "drawMarker",
		title: "标注",
		className: "mapeditor-toolbar-draw-marker",
		mode: ME.Mode.DrawMark
	});

ME.Control.Button.pointSelectRoad = new ME.Control.Button({
		name: "pointSelectRoad",
		title: "点选路",
		className: "mapeditor-toolbar-road-pointroad",
		mode: ME.Mode.SelectRoad
	});

ME.Control.Button.areaSelectRoad = new ME.Control.Button({
		name: "areaSelectRoad",
		title: "区域选路",
		className: "mapeditor-toolbar-road-arearoad",
		mode: ME.Mode.AreaSelectRoad
	});

ME.Control.Button.getPolygonFromRoads = new ME.Control.Button({
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

                if (layer.type == 'polygon' || layer.type == 'polyline' && layer.closed === true){
                    arr.push(arr[0]);
                }
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
			if(ME.Mode._activeMode)
            	ME.Mode._activeMode.disable();
		}
	});

ME.Control.Button.save = new ME.Control.Button({
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
	});

ME.Control.Button.cancel = new ME.Control.Button({
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
	});

ME.Control.Button.delete = new ME.Control.Button({
		name: "delete",
		title: "删除",
		className: "mapeditor-toolbar-actions-delete",
		handler: function(){
			var map = this._map, group = map.editingGroup;
                group.clearSelectedLayers({remove : true});
		}
	});
