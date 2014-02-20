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
        url:"http://192.168.1.210:8090/sorting_web/gate?sid=3001&encode=utf-8"//&region=
    },
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
        // this.group.addLayer(layer);

        // layer.editing.enable();

        // layer.rotating.enable();
        var latlngs = layer.getLatLngs(),
            flatlatlngs = [];
        latlngs.forEach(function(latlng){
            flatlatlngs.push(latlng.lng+","+latlng.lat);
        });

        ME.areaSelectRoad({url:this.options.url,latlngs:flatlatlngs.join(";")},function(data){console.log(data);},this);
        
    }
});