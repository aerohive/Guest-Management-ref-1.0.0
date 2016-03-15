define(["dojo/_base/declare",
		"dojo/text!./templates/Login.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
	  	"ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/app/RegisterType"
		], function(declare, template, on, lang, array, ModuleBase, M, RegisterType) {

	return declare("ah/app/Login", [ ModuleBase], {

		templateString : template,

		events : [
			['loginBtn', 'click', '_handleSubmit']
		],

		getData : function(){
			var json = {};
			json.name = this.username.value;
			json.password = this.password.value;
			return json;
		},

		_handleSubmit : function(e){
			//this.$post('', this.getData(), lang.hitch(this, this._handleData));
			this._handleData();
		},

		_handleData : function(resp){
			var obj = new RegisterType();

			M.next(obj);
		}

	});
});
