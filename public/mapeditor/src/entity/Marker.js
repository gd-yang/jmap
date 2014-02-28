ME.Marker = L.Marker.extend({
    includes : ME.Entity.CommonShape,
    initialize: function (options) {
        var id, latlng, styleOptions, data;
        if (options) {
            id = options.id;
            latlng = options.latlng;
            styleOptions = options.options;
            data = options.data;
        }
        L.Marker.prototype.initialize.call(this, latlng, styleOptions);

        this._leaflet_id = id || L.stamp(this);
        this.states = new ME.State();
        this.selected = false;
        this.editing = false;
        this.data = data || {
            id : this._leaflet_id,
            lat : latlng.lat,
            lon : latlng.lng,
            version: '1',
            changeset: '1',
            tag : []
        };
        this.type = 'marker';
    },
    _fireDragEnd : function(){
        this._map.changes.fire(/^-\d+$/.test(this._leaflet_id)
            ? 'created'
            : 'modified', {layer: this});
    },
    toXML: function () {
        var data = this.data,
            tags = data.tag || [],
            tagstr, _node = '<node';
        _node += ' id="' + this._leaflet_id + '"';
        _node += ' lat="' + this._latlng.lat + '"';
        _node += ' lon="' + this._latlng.lng + '"';
        _node += ' version="' + data.version + '"';
        _node += ' changeset="' + data.changeset + '" >';
        tagstr = tags.map(function (tag) {
            var v = tag.v || '', k = tag.k;
            return '<tag k="' + k + '" v="' + v + '"/>';
        });
        _node += tagstr.join('');

        _node += '</node>';
        return _node;
    }
});