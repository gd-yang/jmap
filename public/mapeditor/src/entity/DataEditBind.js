/**
 * 产生数据交互的绑定事件
 * @type {*}
 */
ME.Entity.DataEditBind = L.extend({}, ME.Entity.EditBind, {
    setData: function (data) {
        this.data = data;
    },
    getData: function () {
        return this.data;
    },
    editEnable: function () {
        if (this.edited){
            return;
        }
        this.edited = true;
        this.on('click', function () {
            console.log(111)
        });
        if (this.editing) {
            this.editing.enable();
        }
        this.dragging.enable();
        this.on('selectIn', this._fireSelect, this)
            .on('mouseover', this._fireOver, this)
            .on('mouseout', this._fireOut, this)
            .on('selectOut', this._fireSelectOut, this)
            .on('edit', this._fireChanges, this);
        // 暂时，以后转移到菜单触发
        if (this.dragging.on) {
            this.dragging.on('dragend', this._fireDragEnd, this);
        } else {
            this.on('dragend', this._fireDragEnd, this);
        }
    },
    editDisable: function () {
        if (!this.edited){
            return;
        }
        this.edited = false;
        if (this.editing) {
            this.editing.disable();
        }
        this.dragging.disable();
        this.off('selectIn', this._fireSelect, this)
            .off('mouseover', this._fireOver, this)
            .off('mouseout', this._fireOut, this)
            .off('selectOut', this._fireSelectOut, this)
            .off('edit', this._fireChanges, this);
        // 暂时，以后转移到菜单触发
        if (this.dragging.off) {
            this.dragging.off('dragend', this._fireDragEnd, this);
        } else {
            this.off('dragend', this._fireDragEnd, this);
        }
    },
    _fireChanges: function (e) {
        var _this = this;
        this._map.changes.fire(/^-\d+$/.test(this._leaflet_id)
            ? 'created'
            : 'modified', {layer: _this});
    },
    _fireDragEnd: function () {
        var _this = this,
            editing = this.editing, markers;
        //this.fire('edit');
        markers = editing._markers;
        markers.forEach(function (marker) {
            _this._map.changes.fire(/^-\d+$/.test(marker._leaflet_id)
                ? 'created'
                : 'modified', {layer: marker});
        });
    }
});