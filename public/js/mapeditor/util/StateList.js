ME.StateList = L.Class.extend({
    includes: L.Mixin.Events,
    initialize: function (states, df) {
        this.sates = states || {};
        this._default = df;
    },
    to: function (stateName) {
        if (typeof stateName !== 'string' || !(stateName in this.sates)) {
            return;
        }
        this._default = stateName;
        this.fire(stateName);
    },
    cur: function () {
        return this._default;
    },
    getState: function (statename) {
        return this.states[statename] === undefined
            ? this.states[this._default] : this.states[statename];
    },
    removeState: function (statename) {
        delete this.states[statename];
    }
});