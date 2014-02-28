/**
 *  
 * @memberOf  ME.Mode
 * @constructor
 * @name ME/Mode/DrawMark
 * @alias ME/Mode/DrawMark
 */
ME.Mode.DrawMark = ME.Mode.extend(
/**
 * @lends ME.Mode.ME/Mode/DrawMark.prototype
 */
{
    /**
     * init function
     * @param  {Map} map
     */
    initialize: function(map){
        var handler = new ME.Draw.Marker(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);
    },
    _finish: function(data){
        var layerType = data.layerType;
        if(layerType != "marker") return;
        this.group.addLayer(data.layer);
    }
});