define(function (require, exports, module) {
    var Connect = require('/sorting/data/Connect.js');
    var Sorting = L.Class.extend({
        initialize: function () {
            this.map = new ME.Map('map', {
                center: new L.LatLng(31.20410238002499, 121.43068313598633),
                zoom: 15
            });
            this.connect = new Connect(map);
        },
        editOneData: function () {
            var map = this.map;
            var polygonCode = $.trim($('.polygonCode').text());
            if (polygonCode === '') {
                return;
            }

            if (!!this.group) {
                this.group.close().editDisable();
                map.removeGroup(group);
                this.group = null;
            }

            this.group = new ME.Group({
                _group_id: polygonCode
            });

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

            this.group = new ME.Group();
            map.addGroup(this.group);
            this.group.setConnect(this.connect).editAble();
        },
        saveData : function(){
            this.group.saveLayers();
        }
    });

    return Sorting;
});