define(["dojo/_base/declare",
		"dojo/text!./templates/RegisterGuestConfirm.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/dom-class",
	  	"ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/app/RegisterGuestComplete",
		"ah/util/LanguageBase",
		"dojo/i18n!i18n/app/nls/RegisterGuestConfirm"
		], function(declare, template, on, lang, array, domClass, ModuleBase, M, RegisterGuestComplete, LanguageBase, messages) {

	return declare("ah/app/RegisterGuestConfirm", [ ModuleBase,LanguageBase ], {

			templateString : template,

			i18n : messages,

			events : [
				['back', 'click', '_handleBack'],
				['next', 'click', '_handleConfirm'],
				['domNode', 'keydown, mousemove, click', '_handleOverdue']
			],

			startup: function () {
				this.inherited(arguments);
				clearTimeout(window['timer']);

				this.restoreData(this.valArr);
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

			restoreData: function(data){
				var lastTwo = data.length-2,
						lastOne = data.length-1;

				if(data && lang.isArray(data)){
					for(var i=0; i<data.length-2; i++){
						this.valEls[i].innerHTML = data[i];
					}

					this.phoneNum.innerHTML = data[lastTwo] + data[lastOne];
				}

			},

			getData: function(){
				var json = {
          'deliverMethod': 'NO_DELIVERY',
          //'creator': 'admin01',  //login page offer
          'firstName': this.valArr[0],
          'lastName': this.valArr[1],
          'organization': this.valArr[2],
          'purpose': this.valArr[3],
          'email': this.valArr[4],
          'phone': this.valArr[6] ? this.valArr[5] + this.valArr[6] : ''
        };

        this.guestType == "guest" ? lang.mixin(json, {policy: 'PERSONAL'}) : lang.mixin(json, {policy: 'GUEST'});

        //this.guestType != "kiosk" && lang.mixin(json, {'groupId': this.groupId});
        lang.mixin(json, {'groupId': this.groupId});
				return json;
			},

			_handleConfirm: function(){
				var data = this.getData(),
						apiUrl = '/identity/credentials',
						url = GDATA.ctx + "/services/proxy/apollo?resource=" + apiUrl;

				//this.$dPost(this.next)(url, data, this._handleData);
				this.$post(url, data, this._handleData);
			},

			_handleData: function(rsp){
				var data = rsp && rsp.data,
						wifiNetWork = data.ssid,
						loginName = data.loginName,
						password =  data.password,
						expireTime = data.expireTime,
						email = this.valArr[4],
						phoneHead = this.valArr[5],
						phoneNum = this.valArr[6],
						authType = data.authType,
						completeVal = [wifiNetWork, loginName, password, expireTime, email, phoneHead, phoneNum, authType];
				var	obj = new RegisterGuestComplete({completeVal: completeVal, sendId:data.id, guestType: this.guestType, keepTime: this.keepTime});

				M.next(obj);
			},

			// _handleErr: function(rsp){
			// 	var errMsg = rsp && rsp.message;
			// 	this.msgErr('This guest has already exist. Please input again.');
			// 	this.msgErr(rsp.data.messages);
			// },

			_handleBack: function(){
				M.prev();
			}
	});

});
