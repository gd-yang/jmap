ME.SelectLayers = L.Class.extend({
    includes: L.Mixin.Events,
    initialize : function(group){
        this._group = group;
        this._layers = [];
    },
    add : function(layerId){
        this._layers.push(layerId);
    },
    remove : function(layerId){
        var layers = this._layers, len=layers.length, i=0;
        for (; i<len; i++){
            if (layers[i] === layerId){
                layers.splice(i,1);
                break;
            }
        }
    },
    has : function(layerId){
        var layers = this._layers, len=layers.length, i=0;
        for (; i<len; i++){
            if (layers[i] === layerId){
               return true
            }
        }
        return false;
    },
    clear : function(){
        this._layers = [];
    },
    editAble : function(){
        this.eachLayer(function(layer){
            layer.editing.able();
        });
    },
    editDisable : function(){
        this.eachLayer(function(layer){
            layer.editing.disable();
        });
    },
    size : function(){
        return this._layers.length;
    },
    eachLayer : function(fn){
        var layers = this._layers, len=layers.length, i=0;
        if (typeof fn !== 'function'){
            return;
        }
        for (; i<len; i++){
            fn.call(this, this._group.getLayer(layers[i]), layers[i], layers, this);
        }
    }
});