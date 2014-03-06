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
        //url:"http://119.90.32.30/gbox/gate?sid=3001&encode=utf-8"
        url:"http://192.168.1.210:8090/sorting_web/gate?sid=3001&encode=utf-8"//&region=
    },
    /**
     * init function
     * @param  {Map} map
     */
    initialize: function(map){
        if(map._areaSelectRoadMode) return;
        map._areaSelectRoadMode = this;
        var handler = new L.Draw.Polygon(map);
        ME.Mode.prototype.initialize.apply(this,[map,handler]);
    },

    _finish: function(data){
        var layer = data.layer,
            layerType = data.layerType;

        if(layerType != "polygon") return;

        var latlngs = layer.getLatLngs(),
            flatlatlngs = [];
        latlngs.forEach(function(latlng){
            flatlatlngs.push(latlng.lng+","+latlng.lat);
        });

        //make sure the first point same with the last point, so backend api can recognize it as a polygon
        flatlatlngs.push(flatlatlngs[0]);

        ME.Util.areaSelectRoad({
            url:this.options.url,
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