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

        this.group.eachLayer(function(layer){
            var id = layer._leaflet_id;
            var intersect = that._intersect(bounds,layer);
            var index = that.group.selectedLayers.indexOf(id);
            if(intersect && index<0){
                that.group.selectedLayers.push(id);
                layer.setState('select');
            }
            else if (!intersect && index>=0){
                that.group.selectedLayers.splice(index,1);
                layer.setState('common');
            }
        });
    },

    _intersect: function(bounds, polyline){
        var points = [], segmentBounds, that = this;
        // just detect polyline now.
        if(polyline.type != "line") return false;

        polyline.getLatLngs().forEach(function(latlng,i){
            points.push(that._map.latLngToContainerPoint(latlng));
        });

        //points = L.LineUtil.simplify(points, 0);

        for(var i=0,l=points.length-1;i<l;i++){
            segmentBounds = L.bounds(points[i],points[i+1]);
            if(bounds.intersects(segmentBounds)) return true;
        }
        return false;
    }
});