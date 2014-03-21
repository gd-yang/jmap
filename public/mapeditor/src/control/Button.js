
ME.Control = L.extend({},L.Control,ME.Control);
ME.Control.Button = L.Class.extend({
	options:{
		tagName: "a",
		className: "",
		attributes: ["title","innerHTML"]
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

	onAdd: function(map){
    	var options = this.options;

    	if(!map) return;

    	this._map = map;

		if(!this.mode && options.mode)
        {
        	this.mode = new options.mode(map);
			this.mode.on("enabled", this.activated, this);
			this.mode.on("disabled", this.deactivated, this);
        }
    	this._bindEvent();
    },

	onRemove: function(){
		this._removeEvent();
		this._map = null;
		if(this.mode) {
			this.mode.disable();
		}
        this.el.parentNode.removeChild(this.el);
	},

	_createButton: function(options){
		var button = L.DomUtil.create(options.tagName, options.className || "");		
		L.DomUtil.addClass(button,"toolbar-button");

		for(var i=0,attribute; attribute = this.options.attributes[i++];){
			button[attribute] = options[attribute]?options[attribute]:"";
		}

		this.el = button;
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

ME.Control.Button.hollowPolygon = new ME.Control.Button({
		name: "hollowPolygon",
		title: "生成镂空面",
		className: "mapeditor-toolbar-draw-hollowpolygon",
		mode: ME.Mode.HollowPolygon
	});


ME.Control.Button.hollowPolygon2 = new ME.Control.Button({
		name: "hollowPolygon2",
		title: "选面生成镂空面",
		className: "mapeditor-toolbar-draw-hollowpolygon",
		handler: function(){
			var map = this._map;
			var group = map.editingGroup;
			var polygons = [];
			group.selectedLayers.forEach(function(layerid){
				var layer = group.getLayer(layerid), type;
				if(!layer) return;
                type = layer.type;
                if (type == 'polygon' && polygons.length!=2){
                    polygons.push(layer);
                }
			});
			var donut = new ME.Donut([[polygons[0].getLatLngs(),polygons[1].getLatLngs()]]);
			group.addLayer(donut);
			polygons.forEach(function(layer){
				group.removeLayer(layer);
			});
		}
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
		className: "mapeditor-toolbar-draw-assistline",
		mode: ME.Mode.DrawAssistLine
	});

ME.Control.Button.drawAssistPolygon = new ME.Control.Button({
    name: "drawAssistPolygon",
    title: "画辅助面",
    className: "mapeditor-toolbar-draw-assistpolygon",
    mode: ME.Mode.DrawAssistPolygon
});

ME.Control.Button.drawAssistMarker = new ME.Control.Button({
    name: "drawAssistMarker",
    title: "画辅助点",
    className: "mapeditor-toolbar-draw-assistmarker",
    mode: ME.Mode.DrawAssistMarker
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
			var url = ME.Config.data.getPolygonFromRoadsUrl;
			var latlngs=[];
			var map = this._map;
			var group = map.editingGroup;
			group.selectedLayers.forEach(function(layerid){
				var layer = group.getLayer(layerid), type;
				if(!layer) return;
                type = layer.type;
				var ll = layer.getLatLngs();
				var arr = [];
				ll.forEach(function(latlng){
					arr.push(latlng.lng + "," +latlng.lat);
				});
                if (type == 'polygon' || type == 'assistpolygon'
                    || ((type == 'polyline' || type == 'assistline') && layer.closed === true)){
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
			if(ME.Mode._activeMode){
                ME.Mode._activeMode.disable();
            }
		}
	});

ME.Control.Button.save = new ME.Control.Button({
		name: "save",
		title: "保存编辑",
		className: "mapeditor-toolbar-actions-save",
		handler: function(){
			var map = this._map, group = map.editingGroup;
            group.saveLayers.call(group);
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

ME.Control.Button.deleteShape = new ME.Control.Button({
		name: "deleteShape",
		title: "删除选中图形",
		className: "mapeditor-toolbar-actions-delete",
		handler: function(){
			var map = this._map, group = map.editingGroup;
                group.clearSelectedLayers({remove : true});

            //     var hollow = new ME.Donut([[[[31.208727306088207,121.4232587814331],[31.210122080671784,121.44338607788085],[31.19767849645092,121.44514560699463],[31.197751914727228,121.42261505126953]],
            //                             [[31.205754165294366,121.42823696136473],[31.207075572741214,121.43845081329346],[31.201569586589738,121.44081115722655],[31.20094555460659,121.42866611480713]],
            //                             [[31.200468350900838,121.43497467041014],[31.20094555460659,121.44244194030762],[31.198596220810302,121.44218444824217],[31.198596220810302,121.4349317550659]]],
            //                             [[[31.207626153728697,121.44784927368164],[31.20733251093423,121.4591360092163],[31.199550644701127,121.45677566528322],[31.200688599064133,121.44832134246826],[31.203735312714606,121.4462184906006]],
            //                             [[31.205790871306046,121.45072460174559],[31.205827577303502,121.45630359649658],[31.201386048198486,121.45437240600586]]]]);
            // map.addLayer(hollow);
            //hollow.editing.enable();
		}
	});
