define(["dojo/_base/declare",
		"dojo/text!./templates/RegisterComplete.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/dom-class",
		"dojo/dom-style",
	  "ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/util/LanguageBase",
		"dojo/i18n!i18n/app/nls/RegisterComplete"
		], function(declare, template, on, lang, array, domClass, domStyle, ModuleBase, M,  LanguageBase, messages) {

	return declare("ah/app/RegisterComplete", [ ModuleBase, LanguageBase], {

			templateString : template,

			i18n : messages,

			_setDataTypeAttr : function(type){
				var sendTarget = this.sendTarget;
				switch (type){
					case 'telphone':
						domClass.add(sendTarget, "phone");
						break;
					case 'email':
						domClass.add(sendTarget, "laptop");
						break;
					case 'twitter':
						domClass.add(sendTarget, "twitter");
						break;
					default:
						break;
				}
			},

			events : [
				["sendAgain", "click", "_sendAgain"],
				["done", "click", "_handleDone"],
				['domNode', 'keydown, mousemove, click', '_handleOverdue']
			],

			postMixInProperties: function(){
				this.inherited(arguments);
			},

			startup: function(){
				this.inherited(arguments);
				this.restoreData();

				clearTimeout(window['timer']);
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

			restoreData: function(){
				this.state.innerHTML = this.failed ? 'Failed' : 'Success';
				this.msg.innerHTML = this.failed ? 'Access key was not sent' : 'Access key sent to';
				if(this.failed){
					this.sendAim.style.display = 'none';
				}else{
					this._renderView();
				}


				switch(this.guestType){
		 			case "group":
		 				this.title.innerHTML = "Register a Group";
	        	domClass.add(this.titleImg, "img-groupTitle");
	        	domStyle.set(this.head, 'width', '245px');
	        	break;
	        case "guest":
	        case "kiosk":
	        	this.title.innerHTML = "Register a Guest";
	        	domClass.add(this.titleImg, "img-guestTitle");
	        	domStyle.set(this.head, 'width', '255px');
	        	break;
	        case "viewGuest":
	        	this.title.innerHTML = "Guest List";
	        	domClass.add(this.titleImg, "img-guestTitle");
	        	domStyle.set(this.head, 'width', '180px');
	        	break;
	        default:
	        	break;
		 		}
			},

			_renderView: function(){
				this.$text(this.sendAim, this.sentTarget);
			},

			_sendAgain: function(){
				switch(this.guestType){
		 			case "group":
		 				M.backTo(4);
	        	break;
	        case "guest":
	        	this.repeat ? M.backTo(4) : M.backTo(5);
	        	break;
	       	case "kiosk":
	        	this.repeat ? M.backTo(5) : M.backTo(6);
	        	break;
	        case "viewGuest":
	        	M.backTo(2);
	        	break;
	        default:
	        	break;
		 		}
			},

			_handleDone: function(){
				if(this.guestType == "kiosk"){
					M.backTo(2);
				}else{
					M.backTo(0);
				}

			},

	});

});
