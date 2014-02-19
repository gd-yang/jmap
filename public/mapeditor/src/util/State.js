ME.State = L.Class.extend({
      initialize : function(options){
          this.common = options && options.common || {color:'green'}
          this.over = options && options.over || {color:'blue'}
          this.edit = options && options.edit || {color:'red',dashArray:'5,5', weight : 3}
      },
      set : function(prop, val){
          this[prop] = val;
      }
});