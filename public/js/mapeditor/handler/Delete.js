ME.Handler.DeleteControl = L.Handler.extend({
    initialize : function(map){
        L.Handler.prototype.initialize.call(this, map);
    },
    addHooks : function(){
        var _this = this;
        this._map.editingGroup.eachLayer(function(layer){
            layer.on('contextmenu', _this._removeLayerAction, _this);
        });
    },
    removeHooks : function(){
        var _this = this;
        this._map.editingGroup.eachLayer(function(layer){
            layer.off('contextmenu', _this._removeLayerAction, _this);
        });
    },
    _removeLayerAction : function(e){
        var layer = e.target;
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this._map.editingGroup.removeLayer(layer);
        this._map.changes.fire('deleted', {layer:layer});
    }
});