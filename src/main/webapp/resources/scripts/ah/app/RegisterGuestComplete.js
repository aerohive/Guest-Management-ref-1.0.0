define(["dojo/_base/declare",
		"dojo/text!./templates/RegisterGuestComplete.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/dom-construct",
	  	"ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/app/PromptOperation",
		"ah/util/LanguageBase",
		"dojo/i18n!i18n/app/nls/RegisterGuestComplete"
		], function(declare, template, on, lang, array, domConstruct, ModuleBase, M, PromptOperation, LanguageBase, messages) {

	return declare("ah/app/RegisterGuestComplete", [ ModuleBase,LanguageBase ], {

			templateString : template,

			i18n : messages,

			events : [
				['sendInfo', 'click', '_goToSendInfo'],
				['complete', 'click', '_handleComplete'],
				['domNode', 'keydown, mousemove, click', '_handleOverdue']
			],

			startup: function () {
				this.inherited(arguments);
				clearTimeout(window['timer']);

				this.initData();

				if(this.guestType == 'kiosk'){
					window['timer'] = setTimeout(function(){
							M.backTo(2);
					}, this.keepTime);
				}
			},

			_handleOverdue:function(e){
				clearTimeout(window['timer']);

				if(this.guestType == 'kiosk'){
					window['timer'] = setTimeout(function(){
							M.backTo(2);
					}, this.keepTime);
				}
			},

			initData: function(){
				var url = '';
				//this.$get(url, this.restoreData(resp));
				this.restoreData();
			},

			restoreData: function(data){
				if(this.completeVal[0].length){
					array.forEach(this.completeVal[0], function(el){
						this.wifiNet.innerHTML += el + ' ';
					}, this);
				}else{
					this.wifi.style.display = 'none';
				}

				this.loginName.innerHTML = this.completeVal[1];

				if(this.guestType == "kiosk" && this.completeVal[7] != "802.1x"){
					domConstruct.place(this.pwd, this.login, 'before');
					this.login.style.visibility = "hidden";
				}

				this.password.innerHTML = this.completeVal[2];
				this.note.innerHTML = this.completeVal[3] ? 'ExpireTime : ' + this.completeVal[3] : 'ExpireTime : Never Expire';
			},

			_handleComplete: function(){
				(this.guestType == "kiosk") ? M.complete(2) : M.complete(0);
			},

			_goToSendInfo: function(){
				var obj = new PromptOperation({sendId:this.sendId, guestType: this.guestType, repeat: this.repeat, keepTime: this.keepTime, completeVal: this.completeVal});

				M.next(obj);
			}
	});

});
