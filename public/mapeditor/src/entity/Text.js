ME.Text = L.Class.extend({
    includes: [L.Mixin.Events],
    initialize: function (text, options) {
        if (typeof text === 'object'){
            options = text;
            text = '';
        }
        this._text = document.createTextNode(text);
        L.setOptions(this, options);
    },
    onAdd: function (map) {
        this._map = map;
        if (!this._container) {
            this._initElements();
        }
        if (this._container) {
            this._map._pathRoot.appendChild(this._container);
        }
        if (this._text){
            this._textNode.appendChild(this._text);
        }
        this.fire('add');

        map.on({
            'viewreset': this.projectLatlngs,
            'zoomend': this._redraw
        }, this);
    },
    onRemove: function (map) {
        map._pathRoot.removeChild(this._container);

        // Need to fire remove event before we set _map to null as the event hooks might need the object
        this.fire('remove');
        this._map = null;

        map.off({
            'viewreset': this.projectLatlngs,
            'zoomend': this._redraw
        }, this);
    },
    addTo: function (map) {
        map.addLayer(this);
        return this;
    },
    projectLatlngs: function () {
        this._point = this._map.latLngToLayerPoint(this._latlng);
    },
    _createElement: function (name) {
        return L.Path.prototype._createElement.call(this, name);
    },
    _initElements : function () {
        this._container = this._createElement(L.Path.SVG ? 'g' : 'shape');
        this._textNode = this._createElement(L.Path.SVG ? 'text':'textbox');

        if (this.options.className) {
            L.DomUtil.addClass(this._path, this.options.className);
        }

        this._container.appendChild(this._textNode);
    },
    setPosition : function(latlng){
        var point = this._map.latLngToLayerPoint(latlng);
        this._latlng = latlng;
        this._point = point;
        this._updatePosition();
    },
    setStyle: function (style) {
        L.setOptions(this, style);

        if (this._container) {
            this._updateStyle();
        }

        return this;
    },
    _updatePosition :function(){
        if (L.Path.SVG){
            this._textNode.setAttribute('x', this._point.x);
            this._textNode.setAttribute('y', this._point.y);
            console.dir(this._container)
        } else{
            this._textNode.style.cssText = '';
            this._container.style.cssText = 'width:300px;position:relative;top:'+this._point.y+'px;left:'+this._point.x+'px;';
        }
    },
    _updateStyle : function(){

    },
    setText : function(text){
        this._text = text;
    },
    _redraw : function(){
        this._updatePosition()
    }
});