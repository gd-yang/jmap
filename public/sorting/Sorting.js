var Sorting={};
(function(ST) {
    var buttons = ["browserMap","drawAssistLine","drawMarker",
            "drawPolygon","pointSelectRoad",
            "areaSelectRoad","getPolygonFromRoads","deleteShape","save"],
        toolbar = new ME.Control.Toolbar();
        buttons.forEach(function(button){
            toolbar.addButton(ME.Control.Button[button]);
        });

    ST.Main = L.Class.extend({
        initialize: function () {
            console.log(ST);
            var _this = this;
            this.map = new ME.Map('map', {
                center: new L.LatLng(31.20410238002499, 121.43068313598633),
                zoom: 15,
                contextmenu: true,
                contextmenuWidth: 100
            });

            this.connect = new ST.Connect(this.map);
        },
        editOneData: function (polygonCode, clientKey) {
            console.log(polygonCode)
            var map = this.map;
            polygonCode = polygonCode || $('.polygonCode').text();
            clientKey = clientKey || $('.clientKey').text();
            console.log(polygonCode)
            if (polygonCode === '') {
                alert('请输入要编辑的区域码！');
                return;
            }

            if (!!this.group) {
                this.clearOldGroup.call(this);
            }
            this.connect.polygonCode = polygonCode;
            this.connect.clientKey = clientKey;
            this.createNewGroup.call(this);
            this.group.loadLayers()
        },
        createOneData: function (clientKey) {
            console.log(this)
            clientKey = clientKey || $('.clientKey').text();
            if (!!this.group) {
                this.clearOldGroup.call(this);
            }
            this.connect.polygonCode = '';
            this.connect.clientKey = clientKey;
            this.createNewGroup.call(this);
        },
        saveData : function(){
            this.group.saveLayers.call(this.group);
        },
        clearOldGroup : function(){
            this.group.close();
            this.group.off('editAble', this._fireEdit, this)
                .off('editDisable', this._offEdit, this);
            delete this.group;
        },
        createNewGroup : function(){
            var map = this.map;
            this.group = new ME.Group();
            this.group.on('editAble', this._fireEdit, this)
                .on('editDisable', this._offEdit, this);
            map.editingGroup = this.group;
            map.addDataGroup(this.group);
            this.group.setConnect(this.connect).open().editAble();
        },
        _fireEdit : function(){
            this.map.addToolbar('EditToolbar', toolbar);
        },
        _offEdit : function(){
            this.map.removeToolbar('EditToolbar');
        }
    });
})(Sorting || (Sorting={}));