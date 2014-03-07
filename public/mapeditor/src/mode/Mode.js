/**
 *
 * @memberOf  ME
 * @constructor
 * @namespace Mode
 */
ME.Mode = L.Class.extend(
/**
 * @lends ME.Mode.prototype
 */
{
    includes: L.Mixin.Events,

    initialize: function(map, handler){
        this._map = map;
        this._handler = handler;
        this._enabled = false;
        this.group = this._map.editingGroup;

        if (this._handler.on){
            this._handler.on("disabled", this._disable, this);
            this._handler.on("enabled", this._enable, this);
        }
    },

    /**
     * enable Mode, will disable other modes
     */
    enable: function(){
        if(this._enabled) {
            return;
        }else if(ME.Mode._activeMode){
            ME.Mode._activeMode.disable();
        }

        ME.Mode._activeMode = this;
        this._enabled = true;

        this._handler.enable();
        this.group = this._map.editingGroup;
        this.fire("enabled");
        this._map.on('draw:created', this._finish, this);
    },

    /**
     * disable mode
     */
    disable: function(){
        if(!this._enabled) {
            return;
        }
        this._enabled = false;
        this._handler.disable();
        delete this.group;
        this.fire("disabled");
        this._map.off('draw:created',this._finish,this);
    },

    _disable: function(){
        if(!this._enabled) {
            return;
        }
        this._enabled = false;
        this.fire("disabled");
        this._map.off('draw:created',this._finish,this);
    },

    _enable: function(){
        if(this._enabled) {
            return;
        }
        this._enabled = true;
        this.fire("enabled");
        this._map.on('draw:created',this._finish,this);
    },

    /**
     * is mode enabled or disabled
     * @return {Boolen}
     */
    enabled: function(){
        return this._enabled;
    }
});