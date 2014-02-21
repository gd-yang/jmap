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

        map._selectRoadMode = this;
    },

    _finish: function(e){
        var roads = e.roads, _this = this;
        if(e.pathtype != "pointSelectRoad") return;
        roads.forEach(function(road){
            var path = new ME.Polyline({
                latlngs : road
            });
            _this.group.addLayer(path);
            path.editing.updateMarkers();
        });
    }
});