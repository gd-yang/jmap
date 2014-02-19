ME.Polyline = L.Polyline.extend({
    initialize : function(options){
        var id, latlngs, styleOptions,tags,nd,markers,version,changeset;
        if (options) {
            id = options.id;
            latlngs = options.latlngs;
            styleOptions = options.options;
            tags = options.tags;
            version = options.version;
            changeset = options.changeset;
            nd = options.nd;
        }
        L.Polyline.prototype.initialize.call(this, latlngs, styleOptions);
        this.nd = nd || [];
        this._leaflet_id = id || L.stamp(this);
        this.tags = tags||[];
        this.type = 'line';
        this.version = version||'1';
        this.changeset = changeset||'1';
    },
    editEnable : function(){
        this.editing.enable();
        this.dragging.enable();
    },
    editDisable : function(){
        this.editing.disable();
        this.dragging.disable();
    },
    toXML : function(){
        var _line, nds = this.nd,  tags = this.tags, tagstr;
            _line = '<way';
            _line += ' id="' + this._leaflet_id + '"';
            _line += ' version="' + this.version + '"';
            _line += ' changeset="' + this.changeset + '">';
        nds = nds.map(function(nd){
             return '<nd ref="' + nd.ref +'" />'
        });
        _line += nds.join('');
        tagstr = tags.map(function(tag){
            var v = tag.v||'', k =tag.k;
            return '<tag k="'+k+'" v="'+v+'"/>';
        });
        _line += tagstr.join('');
        return _line + '</way>';
    }
});