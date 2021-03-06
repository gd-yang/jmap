/**
 *  
 * @memberOf  ME.Mode
 * @constructor
 * @name ME/Mode/DrawPolygon
 * @alias ME/Mode/DrawPolygon
 */
ME.Mode.DrawPolygon = ME.Mode.extend(
/**
 * @lends ME.Mode.ME/Mode/DrawPolygon.prototype
 */
{
    /**
     * init function
     * @param  {Map} map
     */
    initialize: function(map){
        var handler;
        handler = new ME.Draw.Polygon(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);
    },

    _finish: function(data){
        var layer = data.layer, layerType = data.layerType;
        if(layerType != "polygon") {
            return;
        }
        L.setOptions(layer,{moveable : true, rotateable : true});
        this.group.addLayer(layer);
        layer.editEnable();
        console.log(layer.getLatLngs());
    }
});