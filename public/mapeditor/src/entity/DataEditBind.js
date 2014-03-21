/**
 * 产生数据交互的绑定事件
 * @type {*}
 */
ME.Entity.DataEditBind = L.extend({}, ME.Entity.EditBind, {
    setData: function (data) {
        this.data = data;
        return this;
    },
    getData: function () {
        return this.data;
    },
    editEnable: function () {
        if (this.edited){
            return this;
        }
        this.edited = true;

        if (this.editing) {
            this.editing.enable();
        }

        this.on('selectin', this._fireSelect, this)
            .on('mouseover', this._fireOver, this)
            .on('mouseout', this._fireOut, this)
            .on('selectout', this._fireSelectOut, this)
            .on('edit', this._fireChanges, this);
        this.dragging.enable();
        // 暂时，以后转移到菜单触发
        this.on('dragend', this._fireDragEnd, this);
        return this;
    },
    editDisable: function () {
        if (!this.edited){
            return this;
        }
        this.edited = false;
        if (this.editing) {
            this.editing.disable();
        }

        this.off('selectin', this._fireSelect, this)
            .off('mouseover', this._fireOver, this)
            .off('mouseout', this._fireOut, this)
            .off('selectout', this._fireSelectOut, this)
            .off('edit', this._fireChanges, this);
        this.dragging.disable();
        // 暂时，以后转移到菜单触发
        this.off('dragend', this._fireDragEnd, this);
        return this;
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