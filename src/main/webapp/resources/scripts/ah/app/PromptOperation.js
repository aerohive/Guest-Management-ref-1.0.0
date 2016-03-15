define(["dojo/_base/declare",
		"dojo/text!./templates/PromptOperation.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/dom-class",
		"dojo/dom-style",
	  	"ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/app/OperationDialog",
		"dojo/i18n!i18n/app/nls/PromptOperation"
		], function(declare, template, on, lang, array, domClass, domStyle, ModuleBase, M, OperationDialog, messages) {

	return declare("ah/app/PromptOperation", [ ModuleBase ], {

			templateString : template,

			i18n : messages,

			events : [
				["test", ".J-type:click", "_handleOperation"],
				['domNode', 'keydown, mousemove, click', '_handleOverdue'],
				['back', 'click', '_handleBack']
			],

			postMixInProperties: function(){
				this.inherited(arguments);
			},

			startup: function(){
				this.inherited(arguments);
				clearTimeout(window['timer']);

				this.restoreData();

				//this.getSendModel();

				if(this.guestType == 'kiosk'){
					window['timer'] = setTimeout(function(){
							M.backTo(2);
					}, this.keepTime);
				}
			},

			_handleOverdue:function(e){
				var self = this;
				clearTimeout(window['timer']);

				if(this.guestType == 'kiosk'){
					window['timer'] = setTimeout(function(){
							M.backTo(2);
					}, this.keepTime);
				}
			},

			getSendModel: function(){
				var url = '';
				this.$get(url, function(rsp){
					var data = rsp.data;

					this.telphone.style.display = this.twitter.style.display = (this.guestType == "kiosk") ? 'none' : '';
				});
			},

		 	restoreData: function(){
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
	        	domStyle.set(this.head, 'width', '280px');
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

			_handleOperation: function(e){
				var type = e.target.getAttribute("data-type");
					if(type !== 'print'){
						this.$pop({
							style: "width: 600px, border-radius: 10px",
							},new OperationDialog({guestType: this.guestType, dataType: type, sendId: this.sendId, repeat: this.repeat, keepTime: this.keepTime, completeVal: this.completeVal}),function(dialog){
								dojo.destroy(dialog.titleBar);
						});
				}else{
					//print todo
				}
			},

			_handleBack: function(){
				(this.guestType == "kiosk") ? M.complete(2) : M.complete(0);
			}
	});

});
