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
				this._buttons[key].onRemove();
			}
		}
		this._buttons = {};
		this._map = null;
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

		this.options.buttons = this.options.buttons || [];
		this.options.buttons.push(button);
		if(!this._map) {
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
		button.onRemove();
	}
});

