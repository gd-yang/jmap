/**
 * 曲线
 * @type {*}
 */
ME.Polyline = L.Polyline.extend({
    includes: ME.Entity.DataEditBind,
    options: {
        stroke: true,
        color: '#0033ff',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 3,
        opacity: 0.5,
        fill: false,
        fillColor: null, //same as color by default
        fillOpacity: 0.2,
        clickable: true,
        contextmenu: true
    },
    initialize: function (options) {
        var id, latlngs, styleOptions, data, nd = [], isFireEdit;
        if (options) {
            id = options.id;
            latlngs = options.latlngs;
            styleOptions = options.options || {};
            data = options.data;
            isFireEdit = options.isFireEdit;
        }
        styleOptions = L.extend({}, this.options, styleOptions);
        L.Polyline.prototype.initialize.call(this, latlngs, styleOptions);
        this._initContextMenuItems();
        this._leaflet_id = id || L.stamp(this);
        this.states = new ME.State();
        this.selected = false;
        this.edited = false;
        this.isFireEdit = isFireEdit !== false;
        this.closed = styleOptions.closed || false;

        if (!!data) {
            this.data = data;
        } else {
            this.data = {
                id: this._leaflet_id,
                version: '1',
                changeset: '1',
                nd: [],
                tag: []
            }
        }

        // 闭合点的处理
        if (nd.length > 0) {
            var len = nd.length;
            if (nd[0].ref === nd[len - 1].ref) {
                nd.pop();
            }
            this.closed = true;
        }

        this.type = 'polyline';
    },
    toXML: function () {
        var data = this.data, _line,
            nds = data.nd[0][0], tags = data.tag, tagstr;

        _line = '<way';
        _line += ' id="' + this._leaflet_id + '"';
        _line += ' version="' + data.version + '"';
        _line += ' changeset="' + data.changeset + '">';

        nds = nds.map(function (nd) {
            return '<nd ref="' + nd.ref + '" />'
        });

        if (this.closed) {
            nds.push(nds[0]);
        }
        _line += nds.join('');
        tagstr = tags.map(function (tag) {
            var v = tag.v || '', k = tag.k;
            return '<tag k="' + k + '" v="' + v + '"/>';
        });
        _line += tagstr.join('');
        return _line + '</way>';
    },

    _onMouseClick: function (e) {
        var wasDragged = this.dragging && this.dragging.moved();
        var wasRotated = this.rotating && this.rotating.moved();
        if (wasDragged || wasRotated) {
            return;
        }

        if (this._map.dragging && this._map.dragging.moved()) {
            return;
        }

        this._fireMouseEvent(e);
    },

    _getPathPartStr: function (points) {
        var str = L.Polyline.prototype._getPathPartStr.call(this, points);

        if (this.closed === true){
            str = str + (L.Browser.svg ? 'z' : 'x');
        }
        return str;
    },

    _initContextMenuItems: function(){
        var contextmenuItems = [
            {
                text: "置于顶端",
                callback: this.bringToFront,
                context: this
            },
            {
                text: "置于底端",
                callback: this.bringToBack,
                context: this
            }
        ];
        L.setOptions(this, {contextmenuItems: contextmenuItems});
    }
});