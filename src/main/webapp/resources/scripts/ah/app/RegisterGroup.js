define(["dojo/_base/declare",
		"dojo/text!./templates/RegisterGroup.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/dom-style",
	  	"ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/util/dojocover/Uploader",
		"ah/app/GuestInformationList",
		"ah/config/validateRules",
		"dojo/i18n!i18n/app/nls/RegisterGroup"
		], function(declare, template, on, lang, array, domStyle, ModuleBase, M, Uploader, GuestInformationList, rules, messages) {

	return declare("ah/app/RegisterGroup", [ ModuleBase ], {
			templateString : template,
			validateRules: rules.registerGroup,
			i18n : messages,

			events : [
				["back", "click", "_handleBack"],
				["next", "click", "_handleNext"],
				//["uploadFile", "click", "_handleUpload"],
				//["uploadFile", "change", "_fillFile"],
				["manual", "click", "_handleNext"]
			],

			postMixInProperties: function(){
				this.inherited(arguments);
			},

			startup: function(){
				this.inherited(arguments);
			},

			_handleBack: function(){
				M.prev();
			},

			_handleNext: function(){
				if (!this.validator.form()) {
					return;
				}

				var value = this.purpose.value;
				M.next(new GuestInformationList({groupId: this.groupId, data: this.data, purpose:value, guestType: this.guestType}));
			},

			_handleUpload: function(){
				this.uploader = new Uploader({
					label: 'Upload a file',
					allowExtension: ['xls'],
					uploadOnSelect: true,
					url: "/hm-webapp/services/config/auth/registration/parsefile",
					extraParams: {ownerId : 102}
				});

				on(this.uploader, "change", lang.hitch(this, this._onChange));
				on(this.uploader, "complete", lang.hitch(this, this._onComplete));

				domStyle.set(this.uploadtest, 'fontSize', '20px');
				this.upload.style.display = "none";
				this.manual.style.display = "none";
				this.test.style.display = '';
				this.uploader.placeAt(this.uploadtest,"first");
			},

			_onComplete:function(rsp){
				this.data = rsp.data && rsp.data[0] && rsp;
			},

			_onChange: function(obj){
				this.fileName = obj && obj[0].name;
				if(obj.error){
					this.msgErr(obj.error.message);
				}else{
					this.$text(this.file, this.fileName);
				}
			},
	});

});
