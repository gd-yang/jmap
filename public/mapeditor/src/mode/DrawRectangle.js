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
        var handler = new L.Draw.Rectangle(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);

        this._map.on('draw:created',this._finish,this);
    },

    _finish: function(data){
        var layerType = data.layerType,
            layer = data.layer;
            
        if(layerType != "rectangle") return;

        L.setOptions(layer,{moveable:true,rotateable:true});
        this.group.addLayer(layer);

        layer.editing.enable();
        layer.dragging.enable();

    }
});