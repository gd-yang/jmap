;(function(ME){
    ME.Map = L.Map.extend({
        initialize : function(id, options, draw_options){
            var config = ME.Config,
            // 绘图工具
                tileLayerTemplate = config.map.tileUrlTemplate,
                tileLayer = new L.TileLayer(tileLayerTemplate, {maxZoom: 20});
            // 初始化地图
            options.layers || (options.layers = [tileLayer]);
            L.Map.prototype.initialize.call(this,id, options);
            this.changes = new ME.Changes();
            this.openedGroup = new ME.Hash();
            this.defaultGroup = new ME.Group();
            this.addControl(L.control.scale());

            this.on('dragend zoomend', function(){
                this.openedGroup.each(function(group){
                    if (group.geotype !== 'undefined'){
                        group.loadLayers.call(group);
                    }
                });
            });
        },
        addGroup : function(group){
            L.Map.prototype.addLayer.call(this, group);
            this.openedGroup.add(group._group_id, group);
        },
        removeGroup : function(group){
            L.Map.prototype.removeLayer.call(this, group);
            this.openedGroup.remove(group._group_id);
        }
    });
})(MapEditor);