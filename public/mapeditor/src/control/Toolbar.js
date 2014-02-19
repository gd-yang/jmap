ME.Control = ME.Control || {};
ME.Control.Toolbar = L.Control.extend({

	options: {
		className: "mapeditor-toolbar-draw",
		attributes: ["title"],
		direction: "h",

		group: "all",
		groups:{
			all:[{
				name: "drawPolyline",
				//innerHTML: "画线",
				title: "画线",
				className: "mapeditor-toolbar-draw-polyline",
				mode: ME.Mode.DrawPolyline
			}
			,
			{
				name: "drawPolygon",
				//innerHTML: "画面",
				title: "画面",
				className: "mapeditor-toolbar-draw-polygon",
				mode: ME.Mode.DrawPolygon
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
				mode: ME.Mode.DrawMark
			},
			{
				name: "drawRoad",
				title: "选路",
				className: "mapeditor-toolbar-draw-polyline",
				mode: ME.Mode.SelectRoad
			}
			]
		}
	},

	onAdd: function(){
		var container = L.DomUtil.create('div', this.options.className);
		L.DomUtil.addClass(container,this.options.direction);
		var group = this.options.group;
		var buttons = this.options.groups[group];

		this._buttons = {};

		if(buttons)
			this.addButtons(buttons, container);

		return container;
	},

	onRemove: function(){
		for(var key in this._buttons){
			if(this._buttons.hasOwnProperty(key)){
				this._disposeButton(this._buttons[key]);
			}
		}
		this._buttons = {};
	},

	addButtons: function(buttons, container){
		container = container || this._container;
		for(var i=0, button; button=buttons[i++];){
			if(typeof button == "string")
				button = this._getConfigByName(button);

			if(!button) continue;

			this._createButton(button, container);
		}
	},

	addButton: function(options){
		var container = this._container;
		if(!container) return;

		
		if(typeof options == "string")
			options = this._getConfigByName(options);

		if(!options) return;

		this._createButton(options, container);
	},

	removeButton: function(name){
		var button = this._buttons[name];
		if(!button) return;

		delete this._buttons[name];

		this._disposeButton(button);
	},

	_createButton: function(options, container){
		if(this._buttons[options.name])
			return;

		var button = L.DomUtil.create('a', options.className || "", container);
		var map = this._map;
		var mode = new options.mode(map);
		var isfirst = !Object.keys(this._buttons).length;
		var that = this;

		for(var i=0,attribute; attribute = this.options.attributes[i++];){
			button[attribute] = options[attribute]?options[attribute]:"";
		}

		if(isfirst)
			L.DomUtil.addClass(button,"first");

		Object.keys(this._buttons).forEach(function(key){
			L.DomUtil.removeClass(that._buttons[key],"last");
		});
		L.DomUtil.addClass(button,"last");



		button._mode = mode;

		L.DomEvent
			.on(button, 'click', L.DomEvent.stopPropagation)
			.on(button, 'mousedown', L.DomEvent.stopPropagation)
			.on(button, 'dblclick', L.DomEvent.stopPropagation)
			.on(button, 'click', L.DomEvent.preventDefault)
			.on(button, 'click', mode.enable, mode);

		this._buttons[options.name] = button;
	},

	_disposeButton: function(button){
		var mode = button._mode;
		L.DomEvent
			.off(button, 'click', L.DomEvent.stopPropagation)
			.off(button, 'mousedown', L.DomEvent.stopPropagation)
			.off(button, 'dblclick', L.DomEvent.stopPropagation)
			.off(button, 'click', L.DomEvent.preventDefault)
			.off(button, 'click', mode.enable);

		button._mode = null;
	},

	_getConfigByName: function(name){
		var all = this.options.groups.all,
			btn;
		all.forEach(function(option){
			if(option.name == name)
				btn = option;
		});

		return btn;
	}
});