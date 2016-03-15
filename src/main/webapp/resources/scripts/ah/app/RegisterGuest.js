define(["dojo/_base/declare",
		"dojo/text!./templates/RegisterGuest.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/dom-class",
		"dojo/query",
	    "ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/app/RegisterGuestConfirm",
		"ah/app/RepeatDialog",
		"ah/util/LanguageBase",
		"ah/config/validateRules",
		"dojo/i18n!i18n/app/nls/RegisterGuest"
		], function(declare, template, on, lang, array, domClass, query, ModuleBase, M, RegisterGuestConfirm, RepeatDialog, LanguageBase, rules, messages) {

	return declare("ah/app/RegisterGuest", [ ModuleBase, LanguageBase ], {
			templateString : template,
			validateRules: rules.registerGuest,
			i18n:messages,

			events : [
				['back', 'click', '_handleBack'],
				['next', 'click', '_handleNext'],
				['numQys', 'click', '_rendNumType'],
				['numArea', 'click', '_showNumList'],
				['numList', 'click', '_showNumList'],
				['domNode', 'keydown, mousemove, click', '_handleOverdue']
			],

			postMixInProperties: function() {
				this.inherited(arguments);
			},

			startup: function () {
				this.inherited(arguments);
				clearTimeout(window['timer']);

				if(this.guestType == 'kiosk'){
					window['timer'] = setTimeout(function(){
							M.backTo(2);
					}, this.keepTime);
				}

				this.restoreData();
			},

			restoreData: function(){
				if(this.enableEmailApproval){
					domClass.add(this.toVisit, 'label-rqe');
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

			_rendNumType: function(e){
				var value = e.target && e.target.innerHTML;
				var arr = value.split('-');

				this.numArea.value = lang.trim(arr[0]) ? lang.trim(arr[0]) :'+';
				this.numArea.readOnly = lang.trim(arr[0]) ? true : false;
			},

			_showNumList: function(){
				this.numList.style.display =  this.numList.style.display ? '' : 'none';
			},

			_handleBack: function(){
				M.prev();
			},

			_handleNext: function(){
				if (!this.validator.form()) {
					return;
				}

				var arr = [],
				    email = this.valEls[4].value,
						numArea = this.numArea == "+" ? "" : this.numArea.value.substring(1),
						phone = numArea + this.phoneNum.value,
						apiUrl = '/identity/credentials',
						url = GDATA.ctx + "/services/proxy/apollo?resource=" + apiUrl;
						//+ '&phone=' + phone

				if(!this.phoneNum.value && !email){
					this.msgErr('Please input email address or telephone number.');
					return;
				}

				this.valEls.forEach(lang.hitch(this, function(el, idx){
					arr.push(el.value);
				}));

				arr.push(numArea);
				arr.push(this.phoneNum.value);

				// this.$get(url, function(rsp){
				// 	var data = rsp && rsp.data;
				// 	if(lang.isArray(data) && data[0]){
				// 		var sendId = data[0].id,
				// 		    wifiNetWork = data[0].ssids[0],
				// 				loginName = data[0].userName,
				// 				createTime = data[0].createTime,
				// 				completeVal = [wifiNetWork, loginName, createTime];

				// 		//clearTimeout(window['timer']);

				// 		this.$pop({
				// 			style: "width: 600px, border-radius: 5px",
				// 			},new RepeatDialog({valArr: arr, completeVal: completeVal, sendId: sendId, guestType: this.guestType}),function(dialog){
				// 			dojo.destroy(dialog.titleBar);
				// 		});
				// 	}else{
				// 		var obj = new RegisterGuestConfirm({valArr: arr, groupId: this.groupId, guestType: this.guestType});
				// 		M.next(obj);
				// 	}
				// });
				var obj = new RegisterGuestConfirm({valArr: arr, groupId: this.groupId, guestType: this.guestType, keepTime: this.keepTime});
				M.next(obj);
			}
	});

});
