define(["dojo/_base/declare",
		"dojo/text!./templates/RegisterType.html",
		"dojo/on",
		"dojo/parser",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/dom-style",
		"dojo/dom-construct",
  	    "ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/app/SelectGuestType",
		"ah/app/RegisterKiosk",
		"ah/app/GuestList",
		"dojo/i18n!i18n/app/nls/RegisterType"
		], function(declare, template, on, parser, lang, array, domStyle, domConstruct, ModuleBase, M, SelectGuestType, RegisterKiosk, GuestList, messages) {

	return declare("ah/app/RegisterType", [ ModuleBase ], {
			templateString : template,
			i18n: messages,

			events : [
				['logOut', 'click', '_handleLogOut'],
				['guest', 'click', '_gotoSelectType'],
				['group', 'click', '_gotoSelectType'],
				['kiosk', 'click', '_gotoSelectType'],
				['viewGuest', 'click', '_gotoGuestList']
			],

			postMixInProperties: function() {
				this.inherited(arguments);
			},

			startup: function(){
				this.inherited(arguments);
				this.getType();
			},

			getType: function(){
				var url = GDATA.ctx + "/services/proxy/registration";

				this.$get(url, function(rsp){
						var arr = [],
								guest  = rsp.data && rsp.data.enableSingle,
								group = rsp.data && rsp.data.enableGroup,
								kiosk = rsp.data && rsp.data.enableKiosk;

						if(guest){
							domStyle.set(this.guest, 'display', '');
							arr.push(guest);
						}
						if(group){
							domStyle.set(this.group, 'display', '');
							arr.push(guest);
						}
						if(kiosk){
							this.keepTime = rsp.data.keepTime;
							domStyle.set(this.kiosk, 'display', '');
							arr.push(guest);
						}

						if(arr.length == 1){
							domStyle.set(this.box, 'width', '175px');
						}else if(arr.length == 2){
							domStyle.set(this.box, 'width', '370px');
						}else if(arr.length == 3){
							domStyle.set(this.box, 'width', '530px');
						}

						var value = localStorage.getItem("kiosk");

						if(value){
							var obj = new SelectGuestType({guestType: 'kiosk', keepTime: this.keepTime});
							obj.startup();
							M.next(obj);
						}

				});
			},

			_gotoSelectType : function(e){
				var type = e.target.getAttribute("data-type");
				M.next(new SelectGuestType({guestType: type, keepTime: this.keepTime}));
			},

			_gotoSelectGuest : function(){
				M.next(new RegisterKiosk({guestType: 'kiosk'}));
			},

			_handleLogOut : function(){
				var url = GDATA.ctx + "/oauth/logout";
				window.location.href = url;

		  //   if (GDATA.webappProps.oauthLoginIsAd == true || GDATA.webappProps.oauthLoginIsAd == 'true') {
		  //     apolloUrl = GDATA.webappProps.oauthLoginAdUrl + '?';
				// 	apolloUrl += 'PartnerIdpId=' + GDATA.webappProps.oauthLoginIdpUrl + '&';
				// 	apolloUrl += 'TargetResource=' + GDATA.webappProps.oauthLoginTargetResourceUrl;
		  //   } else {
				// 	apolloUrl = GDATA.webappProps.apolloUrlBase + GDATA.webappProps.apolloUrlThirdPartyLogin + '?';
		  //     apolloUrl += 'client_id=' + GDATA.webappProps.apolloClientId + '&';
		  //     apolloUrl += 'redirect_uri=' + GDATA.webappProps.apolloRedirectUri;
				// }

				// if(this.parent.parent.apolloLoginFrame){
				// 	this.parent.parent.apolloLoginDiv.style.display = '';
				// 	this.parent.parent.apolloLoginFrame.src = apolloUrl;
				// }

				// M.backTo(0);
			},

			_gotoGuestList: function(){
				M.next(new GuestList({guestType: 'viewGuest'}));
			},

	});
});
