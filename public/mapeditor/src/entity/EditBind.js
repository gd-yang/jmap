/**
 * 触发可编辑
 * @type {{editEnable: Function, editDisable: Function,
 * setState: Function, _fireOut: Function, _fireOver: Function,
 * _fireSelect: Function, _fireSelectOut: Function}}
 */
ME.Entity.EditBind = {
    editEnable: function () {
        if (this.edited){
            return this;
        }
        this.edited = true;
        this.on('click', function () {
            console.log(111)
        });
        if (this.editing) {
            this.editing.enable();
        }
        this.dragging.enable();
        this.on('selectin', this._fireSelect, this)
            .on('mouseover', this._fireOver, this)
            .on('mouseout', this._fireOut, this)
            .on('selectout', this._fireSelectOut, this);
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
        this.dragging.disable();
        this.off('selectin', this._fireSelect, this)
            .off('mouseover', this._fireOver, this)
            .off('mouseout', this._fireOut, this)
            .off('selectout', this._fireSelectOut, this);

        return this;
    },
    setState: function (stateName) {
        this.setStyle(this.states[stateName]);
        return this;
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