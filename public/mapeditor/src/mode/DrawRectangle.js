/**
 *  
 * @memberOf  ME.Mode
 * @constructor
 * @name ME/Mode/DrawRectangle
 * @alias ME/Mode/DrawRectangle
 */
ME.Mode.DrawRectangle = ME.Mode.extend(
/**
 * @lends ME.Mode.ME/Mode/DrawRectangle.prototype
 */
{
    /**
     * init function
     * @param  {Map} map
     */
    initialize: function(map){
        if(map._drawRectangleMode) return;
        map._drawRectangleMode = this;
        var handler = new L.Draw.Rectangle(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);
    },

    _finish: function(data){
        var layerType = data.layerType,
            layer = data.layer;
            
        if(layerType != "rectangle") return;

        L.setOptions(layer,{moveable:true,rotateable:true});
        this.group.addLayer(layer);

        layer.editing.enable();
        layer.dragging.enable();

        // var hollow = new L.Polygon([[[31.208727306088207,121.4232587814331],[31.210122080671784,121.44338607788085],[31.19767849645092,121.44514560699463],[31.197751914727228,121.42261505126953]],
        //                                 [[31.205754165294366,121.42823696136473],[31.207075572741214,121.43845081329346],[31.201569586589738,121.44081115722655],[31.20094555460659,121.42866611480713]]]);
        //     this.group.addLayer(hollow);
        //     hollow.dragging.enable();

    }
});