define(["dojo/_base/declare",
		"dojo/text!./templates/SelectGuestType.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/dom-class",
	  "ah/util/common/ModuleBase",
	  "dojo/dom-construct",
		"ah/app/ModuleManager",
		"ah/app/RegisterGuest",
		"ah/app/RegisterGroup",
		"ah/app/RegisterKiosk",
		"dojo/i18n!i18n/app/nls/SelectGuestType"
		], function(declare, template, on, lang, array, domClass, ModuleBase, domConstruct, M, RegisterGuest, RegisterGroup, RegisterKiosk, messages) {

	return declare("ah/app/SelectGuestType", [ ModuleBase ], {

			templateString : template,

			i18n : messages,

			events : [
				['back', 'click', '_handleBack'],
				["test", ".J-type:click", "_gotoRegisterGroup"]
			],

			postMixInProperties: function() {
				this.inherited(arguments);
			},

			startup: function () {
				this.inherited(arguments);

				this.getData();

				this.resotreData();
			},

			getData: function(){
				var apiUrl = '/identity/userGroups',
						url = GDATA.ctx + "/services/proxy/apollo?resource=" + apiUrl;

				this.$get(url, function(rsp){
						this.enableEmailApproval = rsp.data && rsp.data.enableEmailApproval;
						this.emailApproval = rsp.data && rsp.data.enableEmailApproval ? true : false;
						this.userGroup = rsp.data && rsp.data.userGroups;
						this._fetchData();
				});
			},

			resotreData: function(){
				if(this.guestType && this.guestType == "group"){
					this.title.innerHTML = "Register a Group";
					domClass.add(this.titleImg, "img-groupTitle");
				}else{
					this.title.innerHTML = "Register a Guest";
					domClass.add(this.titleImg, "img-guestTitle");
				}
			},

			_fetchData: function(){
				var len = this.userGroup && this.userGroup.length;
				if(len){
					this.carouselMsg.innerHTML = '';
					this._createCarousel(this.userGroup, len);
				}else{
					this.carouselBox.display = 'none';
					this.carouselMsg.innerHTML = "There's no group available, please config group first.";
				}
			},

			_createCarousel: function(data, len){
				var arr = ['vendor', 'visitor', 'wired', 'wireless'],
						num, str;

				if(len <= 4){
					str = 'w' + len * 60;
				}else{
					str = 'w272';
				}

 				str += ' rg-mc0';
				domClass.replace(this.carousel, str);

				for(var i=0; i<len; i++){
						num = i%4;
						domConstruct.create('li', {
						innerHTML: "<span data-type='"+ data[i].id + "' class='carousel-type carousel-type-" + arr[num] + "'></span><p class='rg-lh0 rg-clear' data-dojo-attach-point='nameLi'>"+ data[i].name + "</p>",
						className : 'J-type carousel-img'
					}, this.test, "last");
				}

				this.carouselList.refresh(this.test);

				var value = localStorage.getItem("kiosk");
				if(value){
					M.next(new RegisterKiosk({groupId: value, guestType: 'kiosk', keepTime: this.keepTime, enableEmailApproval: this.enableEmailApproval}));
				}
			},

			_handleBack: function(){
				M.prev();
			},

			_gotoRegisterGroup: function(e){
				var id = e.target.getAttribute("data-type");

				if( this.guestType == "group" ){
					M.next(new RegisterGroup({groupId: id, guestType: this.guestType }));
				}else if( this.guestType == "guest" ){
					M.next(new RegisterGuest({groupId: id, guestType: this.guestType, enableEmailApproval: this.enableEmailApproval}));
				}else{
					M.next(new RegisterKiosk({groupId: id, guestType: this.guestType, enableEmailApproval: this.enableEmailApproval, keepTime: this.keepTime}));
				}
			}
	});

});
