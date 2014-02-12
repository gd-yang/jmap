ME.DataControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    initialize:function(options){
        //L.Control.prototype.initialize.call(this, options);
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
    },
    onAdd: function () {
        this.container.appendChild(this.menu_btn);
        this.container.appendChild(this.save_btn);
        this.container.appendChild(this.delete_btn);
        this.container.appendChild(this.menu_list);
        this.deleteControl = new ME.DeleteControl(this._map);
        //console.log(this._map)
        L.DomEvent.addListener(this.menu_btn, 'click', this.toggleShow, this);
        L.DomEvent.addListener(this.save_btn, 'click', this.saveData, this);
        L.DomEvent.addListener(this.delete_btn, 'click', this.toggleDel, this);
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
        console.log('toggleDel')
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        var mt = this.deleteControl.enabled() ? 'disable' : 'enable';
        this.deleteControl[mt]();
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
        var url ="http://119.90.32.30/gbox/gate",
            xhr = new XHR(true);
            xhr.post(url, {
                    paras : {
                        sid : '8001',
                        uid : '1080',
                        eid : '134',
                        gbox_validate :"{eid:'134',uid:'1080',userid:'1080',uidString:'fa2985264a1645bdb7f3693e25df1e67',eidString:'b9ead9582b764605a3f30c1cea072133',userType:'1',userName:'ali',password:'KFQFDFACABKHAHDHHH',endTag: 'endTag'}",
                        encode : 'utf-8',
                        dataSetId : map.editingGroup.dataSetId,
                        xml : ME.changes.toXML()
                    }
                }, function(rst){
                    ME.changes.clear();
                    console.log('rst:', rst);
                }
            );
    }
});