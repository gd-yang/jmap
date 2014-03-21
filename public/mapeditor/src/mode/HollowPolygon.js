/**
 *  
 * @memberOf  ME.Mode
 * @constructor
 * @name ME/Mode/HollowPolygon
 * @alias ME/Mode/HollowPolygon
 */
ME.Mode.HollowPolygon = ME.Mode.extend(
/**
 * @lends ME.Mode.ME/Mode/HollowPolygon.prototype
 */
{
    options:{
        deleteOrigins: true// delete origins after generate hollow polygon
    },
    /**
     * init function
     * @param  {Map} map
     */
    initialize: function(map){
        var handler;
        L.setOptions(this);
        handler = new L.Draw.Polygon(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);
    },

    _finish: function(data){
        var layer = data.layer,
            layerType = data.layerType,
            latlngs,
            flatlatlngs = [],
            targetLayer,
            donut;

        if(layerType != "polygon") return;

        latlngs = layer.getLatLngs();
        if(!this.group.selectedLayers.length) return;
        targetLayer = this.group.getLayer(this.group.selectedLayers[0]);

        donut = new ME.Donut([[targetLayer.getLatLngs(),latlngs]]);
        this.group.addLayer(donut);
        if(this.options.deleteOrigins)
            this.group.removeLayer(targetLayer);
    }
});