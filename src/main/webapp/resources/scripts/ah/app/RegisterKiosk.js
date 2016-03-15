define(["dojo/_base/declare",
		"dojo/text!./templates/RegisterKiosk.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/dom-class",
		"dojo/query",
	    "ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/app/RegisterGuest",
		"ah/app/LanguageDialog",
		"ah/app/LogOutDialog",
		"ah/util/LanguageBase",
		"dojo/i18n!i18n/app/nls/RegisterKiosk"
		], function(declare, template, on, lang, array, domClass, query, ModuleBase, M, RegisterGuest, LanguageDialog, LogOutDialog, LanguageBase, messages) {

	return declare("ah/app/RegisterKiosk", [ ModuleBase, LanguageBase], {

			templateString : template,
			i18n : messages,

			events : [
				['logOut', 'click', '_handleLogOut'],
				['guest', 'click', '_goRisterGuest'],
				['international', 'click', '_goInternational']
			],

			postMixInProperties: function() {
				this.inherited(arguments);
			},

			startup: function () {
				var value = localStorage.getItem("kiosk");

				if(!value){
					localStorage.setItem("kiosk",this.groupId);
				}

				clearTimeout(window['timer']);
				this.restoreData();
			},

			restoreData: function(){
				this.country ? domClass.replace(this.international, 'img_'+this.country) : domClass.replace(this.international, 'img_en-us');
			},

			_handleLogOut: function(){
				this.$pop({
					style: "border-radius: 5px",
					},new LogOutDialog({}),function(dialog){
					dojo.destroy(dialog.titleBar);
				});

				//M.prev();
			},

			_goInternational: function(){
				var langObj = new LanguageDialog();

				langObj.on('dealData', lang.hitch(this, function(data) {
					GDATA.lang = data;
					M.prev();
					M.next(new this.constructor({country: data}));
				}));

				this.$pop({
					// style: "width:540px, height:200px",
					}, langObj, function(dialog){
					dojo.destroy(dialog.titleBar);
				});
			},

			_goRisterGuest: function(){
				M.next(new RegisterGuest({groupId: this.groupId, guestType: this.guestType, keepTime: this.keepTime, enableEmailApproval: this.enableEmailApproval}));
			}

	});

});
