/**
 * 触发可编辑
 * @type {{editEnable: Function, editDisable: Function,
 * setState: Function, _fireOut: Function, _fireOver: Function,
 * _fireSelect: Function, _fireSelectOut: Function}}
 */
ME.Entity.EditBind = {
    editEnable: function () {
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
            .on('selectOut', this._fireSelectOut, this);
    },
    editDisable: function () {
        if (this.editing) {
            this.editing.disable();
        }
        this.dragging.disable();
        this.off('selectIn', this._fireSelect, this)
            .off('mouseover', this._fireOver, this)
            .off('mouseout', this._fireOut, this)
            .off('selectOut', this._fireSelectOut, this);
    },
    setState: function (stateName) {
        if (this.setStyle) {
            this.setStyle(this.states[stateName]);
        }
    },
    _fireOut: function () {
        if (!this.selected) {
            this.setState('common');
        }
    },
    _fireOver: function () {
        if (!this.selected) {
            this.setState('hover');
        }
    },
    _fireSelect: function () {
        this.setState('select');
        this.selected = true;
    },
    _fireSelectOut: function () {
        this.setState('common');
        this.selected = false;
    }
};