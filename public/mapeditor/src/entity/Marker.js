ME.Marker = L.Marker.extend({
    initialize: function (options) {
        var id, latlng, styleOptions, tags, changeset, version;
        if (options) {
            id = options.id;
            latlng = options.latlng;
            styleOptions = options.options;
            tags = options.tags;
            version = options.version;
            changeset = options.changeset;
        }
        L.Marker.prototype.initialize.call(this, latlng, styleOptions);

        this._leaflet_id = id || L.stamp(this);

        this.tags = tags || [];
        this.type = 'marker';
        this.version = version || '1';
        this.changeset = changeset || '1';
    },
    toXML: function () {
        var _node = '<node', tags = this.tags, tagstr;
        _node += ' id="' + this._leaflet_id + '"';
        _node += ' lat="' + this._latlng.lat + '"';
        _node += ' lon="' + this._latlng.lng + '"';
        _node += ' version="' + this.version + '"';
        _node += ' changeset="' + this.changeset + '" >';
        tagstr = tags.map(function (tag) {
            var v = tag.v || '', k = tag.k;
            return '<tag k="' + k + '" v="' + v + '"/>';
        });
        _node += tagstr.join('');
        _node += '</node>';
        return _node;
    },
    editAble: function () {

    },
    editDisable: function () {

    }
});