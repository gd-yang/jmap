ME.Polygon = L.Polygon.extend({
    includes : ME.Entity.CommonShape,
    initialize : function(options){
        var id, latlngs, styleOptions,data, nd =[], latlngLen;
        if (!!options) {
            id = options.id;
            latlngs = options.latlngs||[];
            styleOptions = options.options;
            data = options.data;
        }

        L.Polygon.prototype.initialize.call(this, latlngs, styleOptions);
        this._leaflet_id = id || L.stamp(this);
        this.states = new ME.State();
        this.selected = false;
        // 初始化数据,如果无数据，则初始化
        if (!!data){
            this.data = data;
            nd = data.nd;
        } else{
            latlngLen = latlngs.length;
            if (latlngLen > 0 && latlngs[0].equals(latlngs[latlngLen-1])){
                latlngs.pop();
            }
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
                tag : [{k:'area', v:'yes'}]
            }
        }
        // 闭合点的处理
        if (nd.length > 0){
            var len = nd.length;
            if (nd[0].ref === nd[len-1].ref){
                data.nd.pop();
            }
        }
        this.type = 'area';
    },

    toXML : function(){
        var data = this.data, _line, nds = data.nd||[],
            tags = data.tag || [], tagstr;
        _line = '<way';
        _line += ' id="' + this._leaflet_id + '"';
        _line += ' version="' + data.version + '"';
        _line += ' changeset="' + data.changeset + '">';
        nds = nds.map(function(nd){
            return '<nd ref="' + nd.ref +'" />'
        });
        // 提交数据要处理闭合点
        if (nds.length > 0){
            nds.push(nds[0]);
        }
        _line += nds.join('');
        tagstr = tags.map(function(tag){
            var v = tag.v||'', k =tag.k;
            return '<tag k="'+k+'" v="'+v+'"/>';
        });
        _line += tagstr.join('');
        return _line + '</way>';
    }
});