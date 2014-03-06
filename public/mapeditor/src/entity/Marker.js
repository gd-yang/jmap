/**
 * 标记
 * @type {*}
 */
ME.Marker = L.Marker.extend({
    includes: ME.Entity.DataEditBind,
    options: {
        icon: new L.Icon({
            iconUrl: '/mapeditor/images/2.png',
            iconRetinaUrl: '',
            iconSize: [22, 32],
            iconAnchor: [24, 30],
            popupAnchor: [-3, -76],
            shadowUrl: '',
            shadowRetinaUrl: ''
        }),
        title: '',
        alt: '',
        clickable: true,
        draggable: false,
        keyboard: true,
        zIndexOffset: 0,
        opacity: 1,
        riseOnHover: false,
        riseOffset: 250
    },
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
        this.states = new ME.State({
            common: {
                icon: new L.Icon({
                    iconUrl: '/mapeditor/images/4.png'
                })
            },
            hover: {
                icon: new L.Icon({
                    iconUrl: '/mapeditor/images/5.png'
                })
            },
            select: {
                icon: new L.Icon({
                    iconUrl: '/mapeditor/images/5.png'
                })
            }
        });
        this.selected = false;
        this.data = data || {
            id: this._leaflet_id,
            lat: latlng.lat,
            lon: latlng.lng,
            version: '1',
            changeset: '1',
            tag: []
        };
        this.type = 'marker';
    },
    setStyle: function (options) {
        options = L.Util.extend({}, this.options, options);
        this.setIcon(options.icon);
        this.setOpacity(options.opacity);
    },
    _fireDragEnd: function () {
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