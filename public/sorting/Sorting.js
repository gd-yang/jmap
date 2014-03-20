var Sorting = {};
(function (ST) {
    var buttons = ["browserMap", "drawAssistLine", "drawMarker", "drawPolygon",
                   "pointSelectRoad","areaSelectRoad", "getPolygonFromRoads", "deleteShape", "save"],
        toolbar = new ME.Control.Toolbar();
        buttons.forEach(function (button) {
            toolbar.addButton(ME.Control.Button[button]);
        });
    ST.map = function(){
        return new ME.Map('map', {
            center: new L.LatLng(31.20410238002499, 121.43068313598633),
            zoom: 15
        });
    };

    ST.editOneData = function (map, polygonCode, clientKey) {
        var connect = new ME.Connect(map), group;
        connect.on('dataload:success', function () {});
        polygonCode = polygonCode || $('.polygonCode').text();
        clientKey = clientKey || $('.clientKey').text();

        if (polygonCode === '') {
            alert('请输入要编辑的区域码！');
            return;
        }
        map.removeAllGroups();
        connect.createLoad('http://192.168.1.210:8090/sorting_web/gate', {
            sid: '2005',
            polygonCode: polygonCode,
            clientKey: clientKey,
            now: (new Date()).getTime()
        });

        connect.createSave('http://192.168.1.210:8090/sorting_web/gate', {
            sid: '2004',
            polygonCode: polygonCode,
            clientKey: clientKey,
            xml: map.changes.toXML()
        });

        group = new ME.Group({
            opening: true
        });
        group.setConnect(connect);
        map.addGroup(group);
        group.on('editEnable', _fireEdit).on('editDisable', _offEdit);
        group.editEnable();
    };

    ST.createOneData = function (map, clientKey) {
        var connect = new ME.Connect(map), group;
        connect.on('dataload:success', function () {});
        clientKey = clientKey || $('.clientKey').text();
        map.removeAllGroups();
        connect.createSave('http://192.168.1.210:8090/sorting_web/gate', {
            sid: '2004',
            polygonCode: '',
            clientKey: clientKey,
            xml: map.changes.toXML()
        });

        connect.on('datasave:success', function (result) {
            var polygonCode = result.data.polygonCode;
            if (!connect.loadData){
                connect.createLoad('http://192.168.1.210:8090/sorting_web/gate', {
                    sid: '2005',
                    polygonCode: polygonCode,
                    clientKey: clientKey,
                    now: (new Date()).getTime()
                });
            }
        });

        group = new ME.Group();
        group.setConnect(connect);
        map.addGroup(group);
        group.on('editEnable', _fireEdit).on('editDisable', _offEdit);
        group.editEnable();
    };

    ST.saveData = function (map) {
        map.editingGroup.saveLayers.call(this.group);
    };

    function _fireEdit(e) {
        var group = e.group;
        group._map.addToolbar('EditToolbar', toolbar);
    }
    function _offEdit(e) {
        var group = e.group;
        group._map.removeToolbar('EditToolbar');
    }

})(Sorting || (Sorting = {}));