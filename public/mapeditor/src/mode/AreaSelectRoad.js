/**
 *  
 * @memberOf  ME.Mode
 * @constructor
 * @name ME/Mode/AreaSelectRoad
 * @alias ME/Mode/AreaSelectRoad
 */
ME.Mode.AreaSelectRoad = ME.Mode.extend(
/**
 * @lends ME.Mode.ME/Mode/AreaSelectRoad.prototype
 */
{
    options:{
    },
    /**
     * init function
     * @param  {Map} map
     */
    initialize: function(map){
        var handler;

        handler = new L.Draw.Polygon(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);
    },

    _finish: function(data){
        var layer = data.layer,
            layerType = data.layerType,
            latlngs,
            flatlatlngs = [];

        if(layerType != "polygon") return;
        latlngs = layer.getLatLngs(),

        latlngs.forEach(function(latlng){
            flatlatlngs.push(latlng.lng+","+latlng.lat);
        });

        //make sure the first point same with the last point, so backend api can recognize it as a polygon
        flatlatlngs.push(flatlatlngs[0]);

        ME.Util.areaSelectRoad({
            url:ME.Config.data.areaSelectRoadNameUrl,
            latlngs:flatlatlngs.join(";")
        },function(data){
            if (!!data.data && data.data.length > 0){
                alert(data);
            } else{
                alert('没有可导出的路');
            }
        },this);
    }
});