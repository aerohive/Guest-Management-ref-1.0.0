define(["dojo/_base/declare",
		"dojo/text!./templates/RepeatDialog.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
	  	"ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/app/RegisterGuestComplete",
		"dojo/i18n!i18n/app/nls/RepeatDialog"
		], function(declare, template, on, lang, array, ModuleBase, M, RegisterGuestComplete,messages) {

	return declare("ah/app/RepeatDialog", [ ModuleBase ], {

			templateString : template,

			i18n : messages,

			events : [
				["back", "click", "_handleBack"],
				// ["continue", "click", "_handleContinue"],
				['domNode', 'keydown, mousemove, click', '_handleOverdue']
			],

			postMixInProperties: function(){
				this.inherited(arguments);
			},

			startup: function(){
				var self = this;
				this.inherited(arguments);
				clearTimeout(window['timer']);  //ok

				this.restoreData();

				if(this.guestType == 'kiosk'){
					window['timer'] = setTimeout(function(){
							self.dialog.destroy();
							M.backTo(3);
					}, 3000);
				}
			},

			_handleOverdue:function(e){
				var self = this;
				clearTimeout(window['timer']);

				if(this.guestType == 'kiosk'){
					window['timer'] = setTimeout(function(){
							self.dialog.destroy();
							M.backTo(3);
					}, 3000);
				}
			},

			restoreData: function(){
				this.userName.innerHTML = "This guest("+ this.completeVal[1] +") already has credentials.";
				this.name.innerHTML = "Name: "+this.valArr[0]+' '+this.valArr[1];
				this.createTime.innerHTML = 'Create time : ' + this.completeVal[2];
			},

			_handleBack: function(){
				this.dialog.destroy();
			},

			getData: function(){
				var json = {
					'firstName': this.valArr[0],
					'lastName': this.valArr[1],
					'organization': this.valArr[2],
					'purpose': this.valArr[3],
					'email': this.valArr[4],
					'phone': this.valArr[5]+this.valArr[6]
				};

				return json;
			},

			_handleContinue: function(){
				var data = this.getData(),
						url = '/hm-webapp/services/idm/credentials/'+this.sendId+'?ownerId=102&memberOf=abc';

				this.$put(url, data, function(rsp){
					var obj = new RegisterGuestComplete({repeat: true, completeVal: this.completeVal, guestType: this.guestType, sendId: this.sendId});

					M.next(obj);
					this._handleBack();
				});
			}
	});

});
