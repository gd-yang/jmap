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

            this.defaultGroup = new ME.Group();
            this.changes = new ME.Changes();
            this.editingGroup = this.defaultGroup;
            this.openedGroup = new ME.Hash();
            this.addLayer(this.defaultGroup);
            this._drawPolylineMode = new ME.Mode.DrawPolyline(this);
            this._drawPolygonMode = new ME.Mode.DrawPolygon(this);
            this._drawMarkerMode = new ME.Mode.DrawMark(this);
            this._selectRoadMode = new ME.Mode.SelectRoad(this);
            this._areaSelectRoadMode = new ME.Mode.AreaSelectRoad(this);

            // draw_options = draw_options || config.options.draw;
            // draw_options.edit = draw_options.edit || {};
            // draw_options.edit.featureGroup = this.editingGroup;
            // this.drawControl = new L.Control.Draw(draw_options);
            this//.addControl(this.drawControl)
                .addControl(L.control.scale());

            // 绘制到哪个Group里面
            // this.on('draw:created', function (e) {
            //     var type = e.layerType,
            //         layer = e.layer;

            //     if (type === 'marker') {
            //         layer.bindPopup('A popup!');
            //     }
            //     this.editingGroup.addLayer(layer);
            // });

            this.on('dragend zoomend', function(){
                this.openedGroup.each(function(group){
                    group.loadLayers.call(group);
                });
            });
        }
    });
})(MapEditor);