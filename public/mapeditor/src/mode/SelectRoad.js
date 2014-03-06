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
        var handler;

        if(map._selectRoadMode) return;
        map._selectRoadMode = this;

        handler = new ME.Handler.SelectRoad(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);
    },

    _finish: function(e){
        var roads = e.roads,
            _this = this;

        if(e.pathtype != "pointSelectRoad") return;
        
        roads.forEach(function(road){
            var path = new ME.Entity.AssistLine(road);
            _this.group.addLayer(path);
        });
    }
});