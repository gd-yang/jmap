MapEditor = {};
MapEditor.Map = L.Map.extend({
   initialize : function(id, options, draw_options, data_control_options){
       var cloudmadeUrl = 'http://emap{s}.mapabc.com/mapabc/maptile?x={x}&y={y}&z={z}',
           cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 20}),
           defaultGroup, drawControl, _this = this;
       this.geturl = "http://119.90.32.30/gbox/gate?sid=2006&encode=utf-8" +
           "&key=b0a7db0b3a30f944a21c3682064dc70ef5b738b062f6479a5eca39725798b1ee300bd8d5de3a4ae3" +
           "&gbox_validate={eid:'134',uid:'1080',userid:'1080',uidString:'fa2985264a1645bdb7f3693e25df1e67',eidString:'b9ead9582b764605a3f30c1cea072133',userType:'1',userName:'ali',password:'KFQFDFACABKHAHDHHH',endTag: 'endTag'}" +
           "&resType=json&uid=1080&eid=134";
       options.layers || (options.layers = [cloudmade]);
       MapEditor.Map.__super__.initialize.call(this,id, options);

       this.defaultGroup = new ME.Group();
       this.changes = new ME.Changes();
       this.addLayer(this.defaultGroup);
       this.editingGroup = this.defaultGroup;
       this.openedGroup = {};
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
           for (var groupId in this.openedGroup){
               if (this.openedGroup.hasOwnProperty(groupId)){
                   var group = this.openedGroup[groupId];
                   group.renderLayer.call(group);
               }
           }
       });
   },
   showDrowControl : function(){
      this.addControl(this.drawControl);
   },
   closeDrowControl : function(){
      this.addControl(this.drawControl);
   }
});
ME = MapEditor;