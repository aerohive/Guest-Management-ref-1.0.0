define(["dojo/_base/declare",
		"dojo/text!./templates/LogOutDialog.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
	  	"ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		//"dojo/i18n!i18n/app/nls/LogOutDialog"
		], function(declare, template, on, lang, array, ModuleBase, M) {

	return declare("ah/app/LogOutDialog", [ ModuleBase ], {

			templateString : template,

			//i18n : messages,

			events : [
				["loginBtn", "click", "_handleLogin"],
				["close", "click", "_handleBack"]
			],

			postMixInProperties: function(){
				this.inherited(arguments);
			},

			startup: function(){
				this.inherited(arguments);
				//this.restoreData();
			},

			restoreData: function(){
				// this.userName.innerHTML = "This guest("+ this.completeVal[1] +") already has credentials.";
				// this.name.innerHTML = "Name: "+this.valArr[0]+' '+this.valArr[1];
				// this.createTime.innerHTML = 'Create time : ' + this.completeVal[2];
			},

			_handleLogin: function(){
				var url = GDATA.ctx + "/services/proxy/logout",
						data = { 'password': this.password.value };
				this.$post(url, data, function(rsp){
					if(rsp){
						localStorage.removeItem("kiosk");
						M.prev();
						this._handleBack();
					}else{
						this.errorMsg.innerHTML = 'The password is not correct.';
					}
				});
			},

			_handleBack: function(){
				this.dialog.destroy();
			}
	});

});
