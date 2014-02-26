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
            this.toolbars = new ME.Hash();
            this.openedGroup = new ME.Hash();
            this.defaultGroup = new ME.Group();
            this.addLayer(this.defaultGroup);

            this._drawPolylineMode = new ME.Mode.DrawPolyline(this);
            this._drawPolygonMode = new ME.Mode.DrawPolygon(this);
            this._drawMarkerMode = new ME.Mode.DrawMark(this);
            this._selectRoadMode = new ME.Mode.SelectRoad(this);
            this._areaSelectRoadMode = new ME.Mode.AreaSelectRoad(this);
            
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
        },
        addToolbar : function(name, control){
            L.Map.prototype.addControl.call(this, control);
            this.toolbars.add(name, control);
        },
        removeToolbar : function(name){
            if (!name){
                return;
            }
            var control = this.getToolbar(name);
            if (!control){
                return;
            }
            L.Map.prototype.removeControl.call(this, control);
            this.toolbars.remove(name);
        },
        getToolbar : function(name){
            return this.toolbars.find(name);
        },
        getChanges : function(){
            return this.changes;
        },
        clearChanges : function(){
            this.changes.clear();
        }
    });
})(MapEditor);