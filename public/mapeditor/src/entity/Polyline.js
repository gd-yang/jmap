ME.Polyline = L.Polyline.extend({
    includes : ME.Entity.CommonShape,
    initialize: function (options) {
        var id, latlngs, styleOptions, data, nd=[];
        if (options) {
            id = options.id;
            latlngs = options.latlngs;
            styleOptions = options.options;
            data = options.data;
        }
        L.Polyline.prototype.initialize.call(this, latlngs, styleOptions);
        this._leaflet_id = id || L.stamp(this);
        this.states = new ME.State();
        this.selected = false;
        this.editing = false;
        if (!!data){
            this.data = data;
        }else{
            latlngs.forEach(function(latlng){
                nd.push({
                    ref : new ME.Marker({latlng:latlng})._leaflet_id
                })
            });
            this.data = {
                id : this._leaflet_id,
                version : '1',
                changeset : '1',
                nd : nd,
                tag : []
            }
        }

        this.type = 'line';
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
    }
});