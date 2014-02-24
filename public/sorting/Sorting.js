define(function (require, exports, module) {
    var Connect = require('/sorting/data/Connect.js');
    var Sorting = L.Class.extend({
        initialize: function () {
            var _this = this;
            this.map = new ME.Map('map', {
                center: new L.LatLng(31.20410238002499, 121.43068313598633),
                zoom: 15
            });
            this.map.addControl(new ME.Control.Toolbar({buttons:["drawPolyline","drawPolygon","drawMarker"]}));
            //this.map.addToolbar('draw', new ME.Control.Toolbar({buttons:["drawPolygon"]}));
            this.map.addToolbar('road', new ME.Control.Toolbar({buttons:["pointSelectRoad","areaSelectRoad","getPolygonFromRoads"]}));
            //this.map.addControl(new ME.Control.Toolbar({buttons:["save","cancel","delete"]}));
            this.map.addToolbar('operater', new ME.Control.Toolbar({buttons:["delete"]}));
            this.connect = new Connect(this.map);
            this.connect.on('datasave:success', function(){
                _this.map.changes.clear();
                console.log('_this.map.changes')
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
                return;
            }

            if (!!this.group) {
                this.group.close().editDisable();
                map.removeGroup(this.group);
                delete this.group;
            }
            this.connect.polygonCode = polygonCode;
            this.group = new ME.Group();
            map.editingGroup = this.group;
            map.addGroup(this.group);
            this.group.setConnect(this.connect).open().editAble();
        },
        createOneData: function () {
            var map = this.map;

            if (!!this.group) {
                this.group.close().editDisable();
                map.removeGroup(this.group);
                delete this.group;
            }
            this.connect.polygonCode = '';
            this.group = new ME.Group();
            map.addGroup(this.group);
            this.group.setConnect(this.connect).editAble();
            alert('创建编辑层成功！');
        },
        saveData : function(){
            this.group.saveLayers();
        }
    });

    return Sorting;
});