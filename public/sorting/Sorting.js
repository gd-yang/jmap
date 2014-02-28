define(function (require, exports, module) {
    var Connect = require('/sorting/data/Connect.js');

    var buttons = ["drawPolyline","drawPolygon","pointSelectRoad","areaSelectRoad","getPolygonFromRoads","delete"],
        toolbar = new ME.Control.Toolbar({buttons : buttons});

    var Sorting = L.Class.extend({
        initialize: function () {
            var _this = this;
            this.map = new ME.Map('map', {
                center: new L.LatLng(31.20410238002499, 121.43068313598633),
                zoom: 15
            });

            this.connect = new Connect(this.map);
            this.connect.on('datasave:success', function(e){
                var data = e.data;
                $('.polygonCode').text(data.polygonCode);
                console.log('保存成功！')
            });
            this.connect.on('dataload:error', function(){
                console.log('加载失败！')
            });

            this.connect.on('dataload:success', function(){
                console.log('加载成功！')
            });
        },
        editOneData: function () {
            var map = this.map;
            var polygonCode = $.trim($('.polygonCode').text());
            if (polygonCode === '') {
                alert('请输入要编辑的区域码！');
                return;
            }

            if (!!this.group) {
                this.clearOldGroup.call(this);
            }
            this.connect.polygonCode = polygonCode;
            this.createNewGroup.call(this);
            this.group.loadLayers()
        },
        createOneData: function () {
            console.log(this)
            if (!!this.group) {
                this.clearOldGroup.call(this);
            }
            this.connect.polygonCode = '';
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

    module.exports = Sorting;
});