/**
 *  
 * @memberOf  ME.Mode
 * @constructor
 * @name ME/Mode/DrawPolyline
 * @alias ME/Mode/DrawPolyline
 */
ME.Mode.DrawPolyline = ME.Mode.extend(
/**
 * @lends ME.Mode.ME/Mode/DrawPolyline.prototype
 */
{
    /**
     * init function
     * @param  {Map} map
     */
    initialize: function(map){
        var handler;
        if(map._drawPolylineMode) {
            return;
        }
        map._drawPolylineMode = this;
        handler = new ME.Draw.Polyline(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);
    },

    _finish: function(data){
        var layerType = data.layerType,
            layer = data.layer;
            
        if(layerType != "polyline") return;

        //L.setOptions(layer,{moveable:true,rotateable:true});
        this.group.addLayer(layer);

       // layer.editing.enable();
        //layer.dragging.enable();
    }
});