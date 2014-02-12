ME.DeleteControl = L.Handler.extend({
    initialize : function(map){
        L.Handler.prototype.initialize.call(this, map);
    },
    addHooks : function(){
        alert('可删除！');
        var _this = this;
        this._map.editingGroup.eachLayer(function(layer){
             layer.on('contextmenu', _this._removeLayerAction, _this);
        });
    },
    removeHooks : function(){
        alert('不可删除！')
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
        ME.changes.fire('deleted', {layer:layer});
    }
});