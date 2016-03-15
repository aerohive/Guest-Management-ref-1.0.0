define(["dojo/_base/declare",
	"dojo/text!./templates/WelcomeContent.html",
	"dojo/on",
	"dojo/_base/lang",
	"dojo/_base/array",
	"ah/util/common/ModuleBase",
	"ah/app/ModuleManager"
], function(declare, template, on, lang, array, ModuleBase, M) {

	return declare("ah/app/WelcomeContent", [ ModuleBase], {

		templateString : template,

		events : [
			['loginBtn', 'click', '_handleSubmit']
		],

		getData : function(){
			var json = {};
			json.password = this.passcode.value;
			return json;
		},

		_handleSubmit : function(e){
			//this.$post('/guestmgmt-ref/oauth/login/kiosk', this.getData(), lang.hitch(this, this._handleData));
			//this._handleData();
			var form = document.createElement('form'),
				password_field = document.createElement('input');

			form.method = 'post';
			form.action = '/guestmgmt-ref/oauth/login/kiosk';

			password_field.name = 'password';
			password_field.type = 'hidden';
			password_field.value = this.passcode.value;
			form.appendChild(password_field);

			document.body.appendChild(form);
			form.submit();
		},

		_handleData : function(resp){
			console.log(resp);
		}

	});
});
