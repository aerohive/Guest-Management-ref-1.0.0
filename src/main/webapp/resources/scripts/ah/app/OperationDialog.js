define(["dojo/_base/declare",
		"dojo/text!./templates/OperationDialog.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
	  	"ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/app/RegisterComplete",
		"ah/config/validateRules",
		"dojo/i18n!i18n/app/nls/OperationDialog"
		], function(declare, template, on, lang, array, ModuleBase, M, RegisterComplete, rules, messages) {

	return declare("ah/app/OperationDialog", [ ModuleBase ], {
			templateString : template,
			validateRules: rules.operationDialog,
			i18n : messages,

			_setDataTypeAttr : function(type){
				// var emailVal = (this.guestType !== 'viewGuest') ? this.completeVal[4] : this.completeVal[0];
				switch (type){
					case 'telphone':
						(this.guestType !== 'viewGuest' && this.guestType !== 'group') && (this.numArea.value =  this.completeVal[5] ? '+' + this.completeVal[5] : '+1');
						(this.guestType !== 'viewGuest' && this.guestType !== 'group') && (this.telphone.value = this.completeVal[6] ? this.completeVal[6] : '');
						this.ema.style.display = 'none';
						this.twi.style.display = 'none';
						break;
					case 'email':
						(this.guestType !== 'group') && (this.email.value = ((this.guestType !== 'viewGuest') ? this.completeVal[4] : this.completeVal[0]));
						this.tel.style.display = 'none';
						this.twi.style.display = 'none';
						break;
					case 'twitter':
						this.tel.style.display = 'none';
						this.ema.style.display = 'none';
						break;
					default:
						break;
				}
			},

			events : [
				["closeDialog", "click", "_handleClose"],
				["send", "click", "_handleSend"],
				['numQys', 'click', '_rendNumType'],
				['numArea', 'click', '_showNumList'],
				['domNode', 'keydown, mousemove, click', '_handleOverdue']
			],

			postMixInProperties: function(){
				this.inherited(arguments);
			},

			startup: function(){
				this.inherited(arguments);
				clearTimeout(window['timer']);

				window['timer'] = setTimeout(function(){
							M.backTo(2);
							self.dialog.destroy();
				}, this.keepTime);
			},

			_handleOverdue:function(e){
				var self = this;
				clearTimeout(window['timer']);

				if(this.guestType == 'kiosk'){
					window['timer'] = setTimeout(function(){
							M.backTo(2);
							self.dialog.destroy();
					}, this.keepTime);
				}
			},

			_rendNumType: function(e){
				e.preventDefault();
				var value = e.target && e.target.innerHTML;
				var arr = value.split('-');

				this.numArea.value = lang.trim(arr[0]) ? lang.trim(arr[0]) :'+';
				this.numArea.readOnly = lang.trim(arr[0]) ? true : false;
				this.numList.style.display = 'none';
			},

			_showNumList: function(){
				this.numList.style.display =  this.numList.style.display ? '' : 'none';
			},

			_handleClose: function(){
				this.dialog.destroy();
			},

			_handleSend: function(){
				if (!this.validator.form()) {
					return;
				}

				var dataType = this.get("dataType"),
						id = '',
						data;

				if(dataType == 'telphone'){
					var aera = this.numArea == "+" ? "" : this.numArea.value.substring(1),
							phone = aera + this.telphone.value,
							apiUrl = '/identity/credentials/deliver',
							phoneUrl = GDATA.ctx + "/services/proxy/apollo?resource=" + apiUrl;
					data = {
						"deliverMethod": "SMS", //EMAIL
						"phone": phone
					};

					if(lang.isArray(this.sendId)){   //group
						for(var i=0; i<this.sendId.length; i++){
							lang.mixin(data, {"credentialId": this.sendId[i]});
							this.$post(phoneUrl, data, function(rsp){
								M.next(new RegisterComplete({guestType: this.guestType, dataType: dataType, sentTarget: phone/*this[dataType].value*/, repeat: this.repeat, keepTime: this.keepTime}));
								this._handleClose();
							},function(){
								M.next(new RegisterComplete({guestType: this.guestType, dataType: dataType, sentTarget: phone/*this[dataType].value*/, repeat: this.repeat, keepTime: this.keepTime, failed: true}));
								this._handleClose();
						});
						}
					}else{   //guest kiosk
						lang.mixin(data, {"credentialId": this.sendId});
						this.$post(phoneUrl, data, function(rsp){
							M.next(new RegisterComplete({guestType: this.guestType, dataType: dataType, sentTarget: phone/*this[dataType].value*/, repeat: this.repeat, keepTime: this.keepTime}));
							this._handleClose();
						},function(){
							M.next(new RegisterComplete({guestType: this.guestType, dataType: dataType, sentTarget: phone/*this[dataType].value*/, repeat: this.repeat, keepTime: this.keepTime, failed: true}));
							this._handleClose();
						});
					}
				}
				else if(dataType == 'email'){
					var email = this.email.value,
							apiUrl = '/identity/credentials/deliver',
							emailUrl = GDATA.ctx + "/services/proxy/apollo?resource=" + apiUrl;
					data = {
						"deliverMethod": "EMAIL", //SMS
						"email": email
					};

					if(lang.isArray(this.sendId)){   //group
						for(var i=0; i<this.sendId.length; i++){
							lang.mixin(data, {"credentialId": this.sendId[i]});
							this.$post(emailUrl, data, function(rsp){
								M.next(new RegisterComplete({guestType: this.guestType, dataType: dataType, sentTarget: phone/*this[dataType].value*/, repeat: this.repeat, keepTime: this.keepTime}));
								this._handleClose();
							},function(){
								M.next(new RegisterComplete({guestType: this.guestType, dataType: dataType, sentTarget: phone/*this[dataType].value*/, repeat: this.repeat, keepTime: this.keepTime, failed: true}));
								this._handleClose();
						});
						}
					}else{   //guest kiosk
						lang.mixin(data, {"credentialId": this.sendId});
						this.$post(emailUrl, data, function(rsp){
							M.next(new RegisterComplete({guestType: this.guestType, dataType: dataType, sentTarget: phone/*this[dataType].value*/, repeat: this.repeat, keepTime: this.keepTime}));
							this._handleClose();
						},function(){
							M.next(new RegisterComplete({guestType: this.guestType, dataType: dataType, sentTarget: phone/*this[dataType].value*/, repeat: this.repeat, keepTime: this.keepTime, failed: true}));
							this._handleClose();
						});
					}
				}
			}
	});

});
