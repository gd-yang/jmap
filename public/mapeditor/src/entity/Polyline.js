ME.Polyline = L.Polyline.extend({
    initialize: function (options) {
        var id, latlngs, styleOptions, data;
        if (options) {
            id = options.id;
            latlngs = options.latlngs;
            styleOptions = options.options;
            data = options.data;
        }
        L.Polyline.prototype.initialize.call(this, latlngs, styleOptions);
        this._leaflet_id = id || L.stamp(this);
        this.data = data;
        this.type = 'line';
    },
    editEnable: function () {
        this.editing.enable();
        this.dragging.enable();
    },
    editDisable: function () {
        this.editing.disable();
        this.dragging.disable();
    },
    setData : function(data){
       this.data = data;
    },
    getData : function(){
        return this.data;
    },
    toXML: function () {
        var data = this.data, _line,
            nds = data.nd, tags = data.tag, tagstr;

        _line = '<way';
        _line += ' id="' + this._leaflet_id + '"';
        _line += ' version="' + data.version + '"';
        _line += ' changeset="' + data.changeset + '">';

        nds = nds.map(function (nd) {
            return '<nd ref="' + nd.ref + '" />'
        });

        _line += nds.join('');
        tagstr = tags.map(function (tag) {
            var v = tag.v || '', k = tag.k;
            return '<tag k="' + k + '" v="' + v + '"/>';
        });
        _line += tagstr.join('');
        return _line + '</way>';
    },

    _getPathPartStr: function(points){
        var str = L.Polyline.prototype._getPathPartStr.call(this,points);

        if(this.options.closable === true)
            str  = str + (L.Browser.svg ? 'z' : 'x');

        return str;
    }
});