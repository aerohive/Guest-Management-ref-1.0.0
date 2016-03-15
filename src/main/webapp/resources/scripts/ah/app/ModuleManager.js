define([
		"dojo/on",
		"dojo/_base/lang",
		"dojo/Evented",
		"dojo/_base/array"
		], function(on, lang, Evented, array) {

	return lang.mixin({

		_mds : [],

		add : function(obj){
			this._mds.push(obj);
		},

		remove : function(i, j){
			var obj,
				f = 'undefined' === typeof i;

			if(f){
				obj = this._mds.pop();
				obj.destroy && obj.destroy();
				this.emit('remove');
				return;
			}

			if(!f && 'undefined' === typeof j){
				obj = this._mds.splice(i);
				array.forEach(obj, function(item){item.destroy && item.destroy()});
				this.emit('remove');
				return;
			}

			obj = this._mds.splice(i,j);
			array.forEach(obj, function(item){item.destroy && item.destroy()});

			this.emit('remove');
		},

		next : function(obj){
			this.add(obj);

			this.emit('next', obj);
		},

		prev : function(){
			this.remove();

			this.emit('prev');
		},

		backTo : function(i){
			this.remove(i+1);

			this.emit('backTo');
		},

		complete : function(i){
			this.remove(i+1);

			this.emit('complete');
		}

	}, Evented.prototype);

});
