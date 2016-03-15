define(["dojo/_base/declare",
		"dojo/text!./templates/GuestInformationList.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
	  	"ah/util/common/ModuleBase",
	  	"ah/config/gridStructure",
		"ah/app/ModuleManager",
		"ah/app/RegisterInformation",
		"ah/app/PromptOperation",
		"dojo/i18n!i18n/app/nls/GuestInformationList"
		], function(declare, template, on, lang, array, ModuleBase, Structure, M, RegisterInformation, PromptOperation, messages) {

	return declare("ah/app/GuestInformationList", [ ModuleBase ], {

			templateString : template,

			i18n : messages,

			events : [
				["back", "click", "_handleBack"],
				["confirm", "click", "_handleComplete"],
				["guestList", "add", "createGuest"],
				["guestList", "edit", "createGuest"]
			],

			postMixInProperties: function(){
				this.inherited(arguments);
				this.__structure = Structure.idm.registerInformation;
				this.__datas = this.data || [];
			},

			startup: function(){
				this.inherited(arguments);
			},

			_handleBack: function(){
				M.prev();
			},

			getData:function(){
				var groupArr = this.guestList.getStoreData(),
						obj = {},
						newArr = [];

				for(var i=0; i<groupArr.length; i++){
					obj.deliverMethod = 'NO_DELIVERY';
					//obj.creator = 'admin01';
					obj.groupId = this.groupId;
					obj.policy = 'GUEST';

					obj.firstName = groupArr[i].name;
					obj.email = (/@/g).test(groupArr[i].contact) ? groupArr[i].contact: '';
 					obj.phone = !((/@/g).test(groupArr[i].contact)) ? groupArr[i].contact.replace(/[^0-9]+/g, '') : '';
					newArr.push(obj);	
					obj = {};
				}

				return newArr;
			},

			_handleComplete: function(){
				var	apiUrl = '/identity/credentials',
						url = GDATA.ctx + "/services/proxy/apollo?resource=" + apiUrl,
						data = this.getData(),
						sendId = [];

				if (data.length == 0) {
					this.msgErr("Please input at least one guest.");
					return false;
				}

				if (data.length > 20) {
					this.msgErr("Please add no more than 20 guests.");
					return false;
				}

				for(var i=0; i<data.length; i++){
						this.$post(url, data[i], function(rsp){
							var data = rsp && rsp.data;
							sendId.push(data.id);
							M.next(new PromptOperation({guestType: this.guestType, sendId: sendId}));
						});
				}
			},
			createGuest: function(item){
				var obj = new RegisterInformation({
					data : item,
					parent: this.guestList,
					pageTitle : item ? item.name : 'New Guest Information'
				});
				on(obj, 'DealData', lang.hitch(this, function(data) {
					this.guestList[obj.data ? 'edit' : 'add'](data);
			}));
				M.next(obj);
			},

	});

});
