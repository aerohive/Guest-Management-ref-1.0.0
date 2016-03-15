define(["dojo/_base/declare",
		"dojo/text!./templates/RegisterInformation.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
	  	"ah/util/common/ModuleBase",
	  	"ah/config/gridStructure",
	  "ah/config/validateRules",
		"ah/app/ModuleManager",
		"dojo/i18n!i18n/app/nls/RegisterInformation"
		], function(declare, template, on, lang, array, ModuleBase, Structure, rules, M, messages) {

	return declare("ah/app/RegisterInformation", [ ModuleBase ], {
			templateString : template,
			validateRules: rules.registerInformation,

			i18n : messages,

			events : [
				["cancelBtn", "click", "_handelCancel"],
				["saveBtn", "click", "handleSave"]
			],

			postMixInProperties: function(){
				this.inherited(arguments);
			},

			startup: function(){
				this.inherited(arguments);
				this._renderView(this.data);
			},

			_renderView: function(data){
				if(!data){
					return;
				}
				this.preData = data;
				this.name.value = data.name;
				this.contact.value = data.contact;
			},

			_handelCancel: function(){
				M.prev();
			},

			handleSave: function(){
				if (!this.validator.form()) {
					return;
				}

				var gridData = this.parent.getStoreData();

				for(var i=0; i<gridData.length; i++){
					if (gridData[i].contact === this.contact.value){
						this.msgErr("The guest already exists.");
						return false;
					}
				}

				var data = this._getData();

				M.prev();
				this.onDealData(data);
				//this.msgSucc("The guest was saved successfully.");
			},

			_getData: function(){
				var data = this.data,
				result = {
							id: lang.exists('id', data) ? data.id : new Date().getTime(),
							ownerId: 102, //DataMgr.ownerId,
							name: this.name.value,
							contact: this.contact.value
						};

				return result;
			},

			onDealData : function(){}
	});

});
