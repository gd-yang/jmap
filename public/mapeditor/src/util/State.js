ME.State = L.Class.extend({
      initialize : function(options){
          this.common = options && options.common || {color:'blue', weight:3}
          this.hover = options && options.hover || {color:'green', weight:5}
          this.select = options && options.selected || {color:'red', weight:3}
      },
      set : function(prop, val){
          this[prop] = val;
      }
});