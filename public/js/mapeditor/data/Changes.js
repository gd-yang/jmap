ME.Changes = L.Class.extend({
    includes: L.Mixin.Events,
    initialize : function(){
        var _this = this;
        this.created = new ME.Hash();
        this.modified = new ME.Hash();
        this.deleted = new ME.Hash();

        this.on('created', function(e){
            var layer = e.layer, id = layer._leaflet_id;
            _this.created.update(id, layer);
            console.log(_this.toXML());
        });

        this.on('modified', function(e){
            var layer = e.layer, id = layer._leaflet_id;
            _this.modified.update(id, layer);
            console.log(_this.toXML());
        });

        this.on('deleted', function(e){
            var layer = e.layer,id = layer._leaflet_id;
            if (/^-\d+$/.test(id)){
                _this.created.remove(id);
            }else{
                _this.deleted.update(id, layer);
            }
            console.log(_this.toXML());
        });
    },
    clear : function(){
        this.created.clear();
        this.modified.clear();
        this.deleted.clear();
    },
    empty : function(){
        return this.created.empty() && this.modified.empty() && this.deleted.empty();
    },
    has : function(id){
        return this.created.has(id) || this.modified.has(id) || this.deleted.has(id);
    },
    toJSON : function(){
        return JSON.stringify({
            created : this.created,
            modified : this.modified,
            deleted : this.deleted
        });
    },
    toXML : function(){
        var xml = '<?xml version="1.0" encoding="UTF-8"?>',
            modified = this.modified,
            created = this.created,
            deleted = this.deleted;
        xml += '<osmChange>';

        xml += !created.empty() ? '<create>' + this.created.map(function(node){
            return node.toXML();
        }).join('') + '</create>' : '<create/>';

        xml += !modified.empty() ? '<modify>' + this.modified.map(function(node){
             return node.toXML();
        }).join('') + '</modify>' : '<modify/>';

        xml += !deleted.empty() ? '<delete>' + this.deleted.map(function(node){
            return node.toXML();
        }).join('') + '</delete>' : '<delete/>';

        xml += '</osmChange>';
        return xml;
    }
});