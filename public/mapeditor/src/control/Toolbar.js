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
            className: "mapeditor-toolbar",
            groupClassName: "mapeditor-toolbar-group",
            attributes: ["title"],
            direction: "v",

            group: "all",
            groups: {
                draw: [{
                        name: "drawPolyline",
                        //innerHTML: "画线",
                        title: "画线",
                        className: "mapeditor-toolbar-draw-polyline",
                        mode: ME.Mode.DrawPolyline
                    },
                    {
                        name: "drawPolygon",
                        //innerHTML: "画面",
                        title: "画面",
                        className: "mapeditor-toolbar-draw-polygon",
                        mode: ME.Mode.DrawPolygon
                    },
                    // {
                    // 	name: "drawCircle",
                    // 	//innerHTML: "画园",
                    // 	title: "画园",
                    // 	className: "mapeditor-toolbar-draw-circle",
                    // 	mode: ME.Mode.DrawCircle
                    // },
                    // {
                    // 	name: "drawRectangle",
                    // 	//innerHTML: "画方",
                    // 	title: "画方",
                    // 	className : "mapeditor-toolbar-draw-rectangle",
                    // 	mode: ME.Mode.DrawRectangle
                    // },
                    {
                        name: "drawMarker",
                        //innerHTML: "标注",
                        title: "标注",
                        className: "mapeditor-toolbar-draw-marker",
                        mode: ME.Mode.DrawMark
                    }
                ],
                selectRoad: [
                    {
                        name: "pointSelectRoad",
                        title: "点选路",
                        className: "mapeditor-toolbar-road-pointroad",
                        mode: ME.Mode.SelectRoad
                    },
                    {
                        name: "areaSelectRoad",
                        //innerHTML: "画面",
                        title: "区域选路",
                        className: "mapeditor-toolbar-road-arearoad",
                        mode: ME.Mode.AreaSelectRoad
                    },
                    {
                        name: "getPolygonFromRoads",
                        title: "生成区域",
                        className: "mapeditor-toolbar-road-roadstoarea",
                        handler: function () {
                            var url = "http://119.90.32.30/gbox/gate?sid=8002";
                            var latlngs = [];
                            map._drawPolylineMode.group.eachLayer(function (layer) {
                                var ll = layer.getLatLngs();
                                var arr = [];
                                ll.forEach(function (latlng) {
                                    arr.push(latlng.lng + "," + latlng.lat);
                                });
                                latlngs.push(arr.join(";"));
                            });
                            ME.roadsToArea({url: url, line: latlngs.join("-")}, function (data) {
                                data = JSON.parse(data);
                                var latlngs = data.data[0].split(";");
                                var coor = [];
                                latlngs.forEach(function (latlng) {
                                    var arr = latlng.split(",");
                                    var ll = new L.LatLng(arr[1], arr[0]);
                                    coor.push(ll);
                                })
                                map.addLayer(new ME.Polygon({latlngs: coor}));
                            });
                        }
                    }
                ]
            }
        },

        initialize: function (options) {
            L.Control.prototype.initialize.apply(this, [options]);

            var container = this._container = L.DomUtil.create('div', this.options.className);
            L.DomUtil.addClass(container, this.options.direction);

            this._buttons = {};
            this._groups = {};
        },

        onAdd: function (map) {
            this._map = map;

            var group = this.options.group;
            var buttons = this.options.groups[group];

            if (buttons)
                this.addGroup(group, buttons, this._container);
            else if (group == "all") {
                this.addGroup("draw");
                this.addGroup("selectRoad");
            }

            this.addGroup("default");

            return this._container;
        },

        onRemove: function () {
            for (var key in this._buttons) {
                if (this._buttons.hasOwnProperty(key)) {
                    this._disposeButton(this._buttons[key]);
                }
            }
            this._buttons = {};
            this._groups = {};
        },

        addGroup: function (name, buttons, container) {
            var element,
                tostr = Object.prototype.toString;

            if (this._groups[name]) return;

            element = this._createGroupContainer();


            if (tostr.call(buttons) != "[object Array]") {
                container = buttons;
                buttons = this._getGroupByName(name);
            }

            container = container || this._container;
            container.appendChild(element);

            this._groups[name] = {el: element, buttons: {}};

            if (buttons)
                this.addButtons(buttons, name);

        },

        /**
         * add buttons
         * @param {array} buttons   [description]
         * @param {[element]} container [description]
         */
        addButtons: function (buttons, group) {
            for (var i = 0, button; button = buttons[i++];) {
                this.addButton(button, group);
            }
        },

        /**
         * add button
         * @param {[type]} options [description]
         */
        addButton: function (options, group) {
            if (!group) {
                group = "default"
            }

            if (typeof options == "string")
                options = this._getConfigByName(options);

            if (!options) return;

            this._createButton(options, group);
        },

        /**
         * remove button from toolbar
         * @param  {String} name [description]
         */
        removeButton: function (name) {
            var button = this._buttons[name];
            var group = this._groups[button._group];
            if (!button) return;

            delete this._buttons[name];
            delete group.buttons[name];

            this._disposeButton(button);
        },

        _createGroupContainer: function () {
            var element = L.DomUtil.create('div', this.options.groupClassName),
                isfirst = !Object.keys(this._groups).length;

            if (isfirst)
                L.DomUtil.addClass(element, "first");

            return element;
        },

        _createButton: function (options, group) {
            if (this._buttons[options.name])
                return;

            var groupButtons = this._groups[group].buttons;
            var container = this._groups[group].el;
            var isfirst = !Object.keys(groupButtons).length;
            var button = L.DomUtil.create('a', options.className || "", container);
            var map = this._map;
            var mode;
            var that = this;

            if (options.mode)
                mode = new options.mode(map);

            for (var i = 0, attribute; attribute = this.options.attributes[i++];) {
                button[attribute] = options[attribute] ? options[attribute] : "";
            }

            if (isfirst)
                L.DomUtil.addClass(button, "first");

            Object.keys(groupButtons).forEach(function (key) {
                L.DomUtil.removeClass(groupButtons[key], "last");
            });
            L.DomUtil.addClass(button, "last");

            button._group = group;

            L.DomEvent
                .on(button, 'click', L.DomEvent.stopPropagation)
                .on(button, 'mousedown', L.DomEvent.stopPropagation)
                .on(button, 'dblclick', L.DomEvent.stopPropagation)
                .on(button, 'click', L.DomEvent.preventDefault);

            if (options.handler) {
                button._handler = options.handler;
                L.DomEvent.on(button, 'click', options.handler);
            }
            else {
                button._mode = mode;
                L.DomEvent.on(button, 'click', mode.enable, mode);
            }

            this._buttons[options.name] = button;
            this._groups[group].buttons[options.name] = button;
        },

        _disposeButton: function (button) {
            var mode = button._mode;
            L.DomEvent
                .off(button, 'click', L.DomEvent.stopPropagation)
                .off(button, 'mousedown', L.DomEvent.stopPropagation)
                .off(button, 'dblclick', L.DomEvent.stopPropagation)
                .off(button, 'click', L.DomEvent.preventDefault);

            if (options.handler) {
                L.DomEvent.off(button, 'click', options.handler);
            }
            else {
                L.DomEvent.off(button, 'click', mode.enable);
            }

            button._mode = null;
        },

        _getConfigByName: function (name) {
            var all = Object.keys(this.options.groups),
                bth;

            if (!this._defaultbuttons) {
                this._defaultbuttons = [];
                all.forEach(function (group) {
                    this._defaultbuttons = this._defaultbuttons.concat(this.options.groups[group]);
                })
            }

            this._defaultbuttons.forEach(function (button) {
                if (button.name == name)
                    btn = button;
            });


            return btn;
        },

        _getGroupByName: function (name) {
            var all = Object.keys(this.options.groups),
                that = this,
                buttons;

            all.forEach(function (group) {
                if (group == name)
                    buttons = that.options.groups[group];
            });

            return buttons;
        }
    });