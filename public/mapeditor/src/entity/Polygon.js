/**
 * 多边形
 * @type {*}
 */
ME.Polygon = L.Polygon.extend({
    includes: ME.Entity.DataEditBind,
    options: {
        weight: 3,
        fill: true,
        contextmenu: true,
        contextmenuWidth: 140
    },
    initialize: function (options) {
        var id, latlngs, styleOptions, data, nd = [], latlngLen, isFireEdit, text,_this=this;
        if (!!options) {
            id = options.id;
            latlngs = options.latlngs || [];
            styleOptions = options.options||{};
            data = options.data;
            isFireEdit = options.isFireEdit;
            text = options.text;
        }
        styleOptions = L.extend({}, this.options, styleOptions);
        L.Polygon.prototype.initialize.call(this, latlngs, styleOptions);
        this._initContextMenuItems();
        this._leaflet_id = id || L.stamp(this);
        this.states = new ME.State();
        this.selected = false;
        this.edited = false;
        this.isFireEdit = isFireEdit !== false;
        this.textNode = new ME.Text('测试名称');
        
        if (!!text){
            this.textNode.setText(text);
        }
        // 初始化数据,如果无数据，则初始化
        if (!!data) {
            this.data = data;
            nd = data.nd[0][0];
        } else {
            // latlngLen = latlngs.length;
            // if (latlngLen > 0 && latlngs[0].equals(latlngs[latlngLen - 1])) {
            //     latlngs.pop();
            // }
            if (this._latlngs.length > 0 && this._latlngs[0].equals(this._latlngs[this._latlngs.length - 1])) {
                latlngs.pop();
            }

            this.data = {
                id: this._leaflet_id,
                version: '1',
                changeset: '1',
                nd: nd,
                tag: [
                    {k: 'area', v: 'yes'}
                ]
            }
        }
        // 闭合点的处理
        if (nd.length > 0) {
            var len = nd.length;
            if (nd[0].ref === nd[len - 1].ref) {
                nd.pop();
            }
        }
        this.type = 'polygon';
    },

    onAdd : function(map){
        var _this = this;
        L.Polygon.prototype.onAdd.call(this, map);
        this.addText();
        if (L.Path.SVG){
            this.on('dragstart', this.removeText, this);
            this.on('dragend', this.addText, this);
        }
        this.on('edit', function(e){
            _this.textNode.setPosition();
        })
    },

    onRemove : function(map){
        this.removeText();
        if (L.Path.SVG){
            this.off('dragstart', this.removeText, this);
            this.off('dragend', this.addText, this);
        }
        L.Polygon.prototype.onRemove.call(this, map);
    },

    removeText : function(){
        this.textNode.onRemove(this);
        return this;
    },
    addText : function(){
        this.textNode.onAdd(this);
        return this;
    },

    _onMouseClick: function (e) {
        var wasDragged = this.dragging && this.dragging.moved(),
            wasRotated = this.rotating && this.rotating.moved();
        if (wasDragged || wasRotated) {
            return;
        }

        if (this._map.dragging && this._map.dragging.moved()) {
            return;
        }

        this._fireMouseEvent(e);
    },

    toXML: function () {
        var data = this.data, _line, nds = data.nd[0][0] || [],
            tags = data.tag || [], tagstr;
        _line = '<way';
        _line += ' id="' + this._leaflet_id + '"';
        _line += ' version="' + data.version + '"';
        _line += ' changeset="' + data.changeset + '">';
        nds = nds.map(function (nd) {
            return '<nd ref="' + nd.ref + '" />'
        });
        // 提交数据要处理闭合点
        if (nds.length > 0) {
            nds.push(nds[0]);
        }
        _line += nds.join('');
        tagstr = tags.map(function (tag) {
            var v = tag.v || '', k = tag.k;
            return '<tag k="' + k + '" v="' + v + '"/>';
        });
        _line += tagstr.join('');
        return _line + '</way>';
    },
    setText : function(text){
        this.textNode.setText(text);
        return this;
    },
    _initContextMenuItems: function(){
        var contextmenuItems = [
            {
                text: "置于顶端",
                callback: this.bringToFront,
                context: this
            },
            {
                text: "置于底端",
                callback: this.bringToBack,
                context: this
            }
        ];
        L.setOptions(this, {contextmenuItems: contextmenuItems});
    }
});