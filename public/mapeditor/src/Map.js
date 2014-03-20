;(function(ME){
    ME.Map = L.Map.extend({
        initialize : function(id, options, tileOptions){
            tileOptions = tileOptions || {};
            options = options || {};
            tileOptions = L.extend({
                minZoom: 1,
                maxZoom: 18,
                subdomains: '123'
            }, tileOptions);

            var config = ME.Config, _this = this,
            // 绘图工具
                tileLayerTemplate = config.map.tileUrlTemplate,
                tileLayer = new L.TileLayer(tileLayerTemplate,tileOptions);
            // 初始化地图
            options.layers || (options.layers = [tileLayer]);
            L.Map.prototype.initialize.call(this,id, options);
            this.changes = new ME.Changes();
            this.toolbars = new ME.Hash();
            this.openedGroup = new ME.Hash();
            
            this.addControl(L.control.scale());

            this.on('dragend zoomend', function(){
                _this.openedGroup.each(function(group){
                    if (group.openning){
                        group.loadLayers.call(group);
                    }
                });
            });
        },
        addGroup : function(group){
            L.Map.prototype.addLayer.call(this, group);
            if (group instanceof ME.Group){
                this.openedGroup.add(group._leaflet_id, group);
            }
            this.fire('groupadd', {group : group});
        },
        removeGroup : function(group){
            if (group instanceof ME.Group){
                this.openedGroup.remove(group._leaflet_id);
            }
            this.fire('groupremove', {group : group});
            L.Map.prototype.removeLayer.call(this, group);
        },
        removeAllGroups : function(){
            var _this = this;
            this.openedGroup.each(function(group, id){
                group.editDisable();
                _this.removeGroup(group);
                _this.openedGroup.remove(id);
            });
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
            return this;
        },

        getMarkerByLatLng : function(latlng){
            var rst = [];
            this.eachLayer(function(layer){
                if (layer.type === 'marker' && layer._latlng.equals(latlng)){
                    rst.push(layer);
                }
            });
            return rst[0];
        }
    });
})(MapEditor);