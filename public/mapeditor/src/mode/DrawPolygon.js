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
        var handler = new L.Draw.Polygon(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);
    },

    _finish: function(data){
        var layer = data.layer,
            layerType = data.layerType;

        if(layerType != "polygon") return;

        L.setOptions(layer,{moveable:true,rotateable:true});
        this.group.addLayer(layer);

        layer.editing.enable();

        layer.dragging.enable();

        var map = this._map;
        layer._originalCoord =  L.LatLngUtil.cloneLatLngs(layer.getLatLngs());
        var cb = function(){
            if(map._currentpath)
                map._currentpath._path.setAttribute("stroke",map._currentpath.options.color);
            map._currentpath = layer;layer._path.setAttribute("stroke","#0ff");
            layer.dragging.enable();
             layer.editing.enable();
        };

        layer.on("click",cb);
        layer.on("edit",cb);

        layer.on("dragend",cb);

    }


});