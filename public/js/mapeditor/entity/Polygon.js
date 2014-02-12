ME.Polygon = L.Polygon.extend({
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
        if (!!nd && nd.length > 0){
            nd.pop();
        }
        this.nd = nd || [];
        L.Polygon.prototype.initialize.call(this, latlngs, styleOptions);
        this._leaflet_id = id || L.stamp(this);
        this.tags = tags||[];
        this.type = 'area';
        this.version = version||'1';
        this.changeset = changeset||'1';
    },
    toXML : function(){
        var _line, nds = this.nd.slice(),  tags = this.tags, tagstr;
        _line = '<way';
        _line += ' id="' + this._leaflet_id + '"';
        _line += ' version="' + this.version + '"';
        _line += ' changeset="' + this.changeset + '">';
        if (nds.length > 0){
            nds.push(nds[0]);
        }
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