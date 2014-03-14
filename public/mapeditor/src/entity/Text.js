ME.Text = L.Class.extend({
    includes: [L.Mixin.Events],
    options : {
        color : 'red',
        fontSize : '14px',
        fontFamily : 'microsoft yahei',
        width : '350px'
    },
    initialize: function (text, options) {
        if (typeof text === 'object'){
            options = text;
            text = '';
        }
        this._text = document.createTextNode(text);
        L.setOptions(this, options);
    },
    onAdd: function (poly) {
        this._poly = poly;
        var map = this._poly._map;
        if (!this._container) {
            this._initElements();
        }
        this._textNode.appendChild(this._text);
        this._updatePosition();
        this.fire('add');
        map.on({
            'viewreset': this._redraw,
            'zoomend': this._updatePosition
        }, this);
    },
    onRemove: function (poly) {
        this.fire('remove');
        this._textNode.removeChild(this._text);
        poly._map.off({
            'viewreset': this._redraw,
            'zoomend': this._updatePosition
        }, this);
        this._poly = null;
    },
    addTo: function (poly) {
        poly.addText(this);
        return this;
    },
    _createElement: function (name) {
        return L.Path.prototype._createElement.call(this, name);
    },
    _initElements : function () {
        var _svg = L.Path.SVG;
        this._container = _svg ? this._poly._container : this._poly._path;
        this._textNode = this._createElement(_svg ? 'text' : 'textbox');
        if (this.options.className) {
            L.DomUtil.addClass(this._path, this.options.className);
        }
        this._updateStyle();
        this._container.appendChild(this._textNode);
    },
    setPosition : function(){
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
        var poly = this._poly,
            bounds = poly.getBounds(),
            map = poly._map,
            point = map.latLngToLayerPoint(bounds.getCenter());
        var p1 = map.latLngToLayerPoint(bounds._northEast),
            p2 = map.latLngToLayerPoint(bounds._southWest);
        if (L.Path.SVG){
            this._textNode.setAttribute('x', point.x);
            this._textNode.setAttribute('y', point.y);
        } else{
            this._textNode.style.position = 'relative';
            this._textNode.style.top = (Math.abs(p1.y - p2.y))*0.5 + 'px';
            this._textNode.style.left = (Math.abs(p1.x - p2.x))*0.5 + 'px';
        }
    },
    _updateStyle : function(){
        this._textNode.style.color = this.options.color;
        this._textNode.style.fontSize = this.options.fontSize;
        this._textNode.style.fontFamily = this.options.fontFamily;
    },
    _updateText : function(){
        var firstChild;
        while(firstChild=this._textNode.firstChild){
            this._textNode.removeChild(firstChild);
        }
        this._textNode.appendChild(this._text);
    },
    setText : function(text){
        this._text = document.createTextNode(text);
        this._updateText();
        this._updateStyle();
    },
    _redraw : function(){
        this._updateText();
        this._updatePosition();
    }
});