/**
 *  
 * @memberOf  ME.Mode
 * @constructor
 * @name ME/Mode/DrawCircle
 * @alias ME/Mode/DrawCircle
 */
ME.Mode.DrawCircle = ME.Mode.extend(
/**
 * @lends ME.Mode.ME/Mode/DrawCircle.prototype
 */
{
    /**
     * init function
     * @param  {Map} map
     */
    initialize: function(map){
        if(map._drawCircleMode) return;
        map._drawCircleMode = this;
        var handler = new L.Draw.Circle(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);
    },

    _finish: function(data){
        var layerType = data.layerType,
            layer = data.layer;
            
        if(layerType != "circle") return;

        L.setOptions(layer,{moveable:true});
        this.group.addLayer(layer);

        layer.editing.enable();
        layer.dragging.enable();
    }
});