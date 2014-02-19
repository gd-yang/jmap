/**
 *  
 * @memberOf  ME.Mode
 * @constructor
 * @name ME/Mode/SelectRoad
 * @alias ME/Mode/SelectRoad
 */
ME.Mode.SelectRoad = ME.Mode.extend(
/**
 * @lends ME.Mode.ME/Mode/SelectRoad.prototype
 */
{
    /**
     * init function
     * @param  {Map} map
     */
    initialize: function(map){
        var handler = new ME.Handler.SelectRoad(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);

        this._handler.on('finish',this._finish,this);
    },

    _finish: function(data){
        var that = this;
        data.latlngs.forEach(function(latlng){
            var layer = new L.Polyline(latlng,{className: "autonavi-road"});
            that._map.addLayer(layer);
        });
    }
});