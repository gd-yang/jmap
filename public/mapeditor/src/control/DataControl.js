ME.DataControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    initialize:function(options){
        L.Control.prototype.initialize.call(this, options);
        this.selectRoad = new ME.Handler.SelectRoad(map);
        this.container = L.DomUtil.create('div', 'leaflet-dataset-control leaflet-bar');
        this.menu_btn = L.DomUtil.create('a', 'leaflet-dataset-control-menu');
        this.menu_btn.innerHTML = "≡";
        this.menu_btn.href = '#';
        this.menu_btn.title = 'show dataset list';
        this.menu_list = L.DomUtil.create('div', 'leaflet-dataset-list');
        var str = '<ul>';
        str += '<li>全部数据</li>';
        str += '<li data-dataId="413" data-geotype="1" class="leaflet-dataset-list-marker"><span>点数据</span> ' +
            '<i class="view close">打开</i> <i class="edit disable">编辑</i></li>';
        str += '<li data-dataId="412" data-geotype="2" class="leaflet-dataset-list-line"><span>线数据</span> ' +
            '<i class="view close">打开</i> <i class="edit disable">编辑</i></li>';
        str += '<li data-dataId="414" data-geotype="3" class="leaflet-dataset-list-area"><span>面数据</span> ' +
            '<i class="view close">打开</i> <i class="edit disable">编辑</i></li>';
        str += '</ul>';
        this.menu_list.innerHTML = str;
        // 保存按钮
        this.save_btn = L.DomUtil.create('a', 'leaflet-dataset-save-menu');
        this.save_btn.innerHTML = '▤';
        this.save_btn.href = '#';
        this.save_btn.title = 'save dataset!';

        // 删除按钮
        this.delete_btn = L.DomUtil.create('a', 'leaflet-dataset-delete-menu');
        this.delete_btn.innerHTML = 'x';
        this.delete_btn.href = 'javascirpt:void(0)';
        this.delete_btn.title = 'delete dataset!';

        // 选路按钮
        this.road_btn = L.DomUtil.create('a', 'leaflet-select-road-menu');
        this.road_btn.innerHTML = '∝';
        this.road_btn.href = 'javascirpt:void(0)';
        this.road_btn.title = 'start select roads!';
    },
    onAdd: function () {
        this.container.appendChild(this.menu_btn);
        this.container.appendChild(this.save_btn);
        this.container.appendChild(this.delete_btn);
        this.container.appendChild(this.road_btn);
        this.container.appendChild(this.menu_list);
        this.deleteControl = new ME.Handler.Delete(this._map);
        //console.log(this._map)
        L.DomEvent.addListener(this.menu_btn, 'click', this.toggleShow, this);
        L.DomEvent.addListener(this.save_btn, 'click', this.saveData, this);
        L.DomEvent.addListener(this.delete_btn, 'click', this.toggleDel, this);
        L.DomEvent.addListener(this.road_btn, 'click', this.toggleSelect, this);
        return this.container;
    },
    onRemove : function(map){

    },
    toggleShow : function(e){
        var method = this.menu_list.style.display == 'none' || this.menu_list.style.display == ''
            ? 'showDataMenu' : 'closeDataMenu';
        this[method](e);
    },
    toggleDel : function(e){
        console.log('toggleDel');
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        var mt = this.deleteControl.enabled() ? 'disable' : 'enable';
        this.deleteControl[mt]();
    },
    toggleSelect : function(e){
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        var mt = this.selectRoad.enabled() ? 'disable' : 'enable';
        console.log(mt)
        this.selectRoad[mt]();
    },
    showDataMenu : function(e){
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this.menu_list.style.display = 'block';
    },
    closeDataMenu : function(e){
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this.menu_list.style.display = 'none';
    },
    saveData : function(){
        map.connect.saveData();
    }
});