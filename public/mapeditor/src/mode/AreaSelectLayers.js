/**
 *  
 * @memberOf  ME.Mode
 * @constructor
 * @name ME/Mode/AreaSelectLayers
 * @alias ME/Mode/AreaSelectLayers
 */
ME.Mode.AreaSelectLayers = ME.Mode.extend(
/**
 * @lends ME.Mode.ME/Mode/AreaSelectLayers.prototype
 */
{
    /**
     * init function
     * @param  {Map} map
     */
    initialize: function(map){
        var handler = new ME.Handler.AreaSelectLayers(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);

        handler.on("selecting", this._selecting, this);

    },

    _selecting: function(e){
        var bounds = e.bounds;
        var that = this;
        var latlngBounds = L.latLngBounds(this._map.containerPointToLatLng(bounds.max),
            this._map.containerPointToLatLng(bounds.min));

        this.group.eachLayer(function(layer){
            var id = layer._leaflet_id;
            var layerBounds = layer.getBounds();
            if(layerBounds.intersects(latlngBounds)&&that.group.selectedLayers.indexOf(id)<0){
                that.group.selectedLayers.push(id);
                layer.setState('select');
            }
        });
    }
});