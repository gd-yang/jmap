;(function(ME){
    ME.Map = L.Map.extend({
        initialize : function(id, options, draw_options, data_control_options){
            var config = ME.Config, cloudmadeUrl = config.map.tileUrlTemplate,
                cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 20});
            options.layers || (options.layers = [cloudmade]);
            L.Map.prototype.initialize.call(this,id, options);

            this.defaultGroup = new ME.Group();
            this.changes = new ME.Changes();
            this.connect = new ME.Connect({
                map : this,
                loadDataUrl : config.data.loadDataUrl
            });
            this.addLayer(this.defaultGroup);
            this.editingGroup = this.defaultGroup;
            this.openedGroup = new ME.Hash();
            draw_options = draw_options || {
                position: 'topright',
                draw: {
                    polyline: {
                        metric: true
                    },
                    polygon: {
                        allowIntersection: false,
                        showArea: true,
                        drawError: {
                            color: '#b00b00',
                            timeout: 1000
                        },
                        shapeOptions: {
                            color: '#bada55'
                        }
                    },
                    circle: {
                        shapeOptions: {
                            color: '#662d91'
                        }
                    },
                    marker: true
                },
                edit: {
                    featureGroup: this.editingGroup
                }
            }
            // 绘图工具
            this.drawControl = new L.Control.Draw(draw_options);
            this.addControl(this.drawControl);
            // 绘制到哪个Group里面
            this.on('draw:created', function (e) {
                var type = e.layerType,
                    layer = e.layer;

                if (type === 'marker') {
                    layer.bindPopup('A popup!');
                }
                this.editingGroup.addLayer(layer);
            });

            this.addControl(new ME.DataControl());

            L.control.scale().addTo(this);

            this.on('dragend zoomend', function(){
                this.openedGroup.each(function(group){
                    group.renderLayer.call(group);
                });
            });
        },
        showDrowControl : function(){
            this.addControl(this.drawControl);
        },
        closeDrowControl : function(){
            this.addControl(this.drawControl);
        }
    });
})(MapEditor);