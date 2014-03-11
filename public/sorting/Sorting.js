define(function (require, exports, module) {
    var Connect = require('/sorting/data/Connect.js');
    var buttons = ["browserMap","drawPolymarker","drawPolyline","drawPolygon","pointSelectRoad","areaSelectRoad","getPolygonFromRoads","delete"],
        toolbar = new ME.Control.Toolbar();
/* 测试代码  ------start--------*/
    var cityring = new ME.Polygon({latlngs:[]});
    var ringfn = function(name){
        var map = this._map,
            group = map.editingGroup,
            config = {
                url: "http://192.168.1.210:8090/sorting_web/gate?sid=2010",
                city: "上海",
                name: name
            };
        var cb = function(data){
            var nds = data.data.dataSet.node,
                latlngs = [];

            nds.map(function(nd,i){
                latlngs.push(L.latLng(nd.lat,nd.lon));
            });

            cityring.setLatLngs(latlngs);

            map.addLayer(cityring);

        };

        ME.Util.getCityRing(config,cb);
    }
    var cityringtoolbar = new ME.Control.Toolbar({position:"topright",direction:"h"});
    cityringtoolbar.addButton({name:"innerring",innerHTML:"内环",tagName:"span",handler:function(){
        ringfn.call(this,"内环");
    }});
     cityringtoolbar.addButton({name:"middlering",innerHTML:"中环",tagName:"span",handler:function(){
        ringfn.call(this,"中环");
    }});
      cityringtoolbar.addButton({name:"outerring",innerHTML:"外环",tagName:"span",handler:function(){
        ringfn.call(this,"外环");
    }});
/* 测试代码  ------end--------*/
        buttons.forEach(function(button){
            toolbar.addButton(ME.Control.Button[button]);
        });

    var Sorting = L.Class.extend({
        initialize: function () {
            var _this = this;
            this.map = new ME.Map('map', {
                center: new L.LatLng(31.20410238002499, 121.43068313598633),
                zoom: 15
            });

            this.connect = new Connect(this.map);
            // 测试代码
            this.map.addControl(cityringtoolbar);

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