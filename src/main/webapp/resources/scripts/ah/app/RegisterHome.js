define(["dojo/_base/declare",
		//"dojo/text!./templates/RegisterHome.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
	  	"ah/util/common/ModuleBase",
		"ah/app/ModuleManager",
		"ah/config/preload",
		"ah/app/Login"], function(declare, /*template,*/ on, lang, array, ModuleBase, M) {

	return declare("ah/app/RegisterHome", [ ModuleBase ], {

		templateString :  "<div>"+
												"<div class='rg-header rg-mc0 rg-w750'></div>"+
												"<div class='rg-bg rg-mc0' data-dojo-attach-point='area'>"+
													"<div class='rg-content' data-dojo-attach-point='loginObj' data-dojo-type='ah/app/RegisterType' data-dojo-props='parent: this'></div>"+
												"</div>"+

												"<div class='rg-mc0 rg-w750'>"+
													"<div class='img-bottom rg-h70 fn-right'></div>"+
												"</div>"+
											"</div>",

		postMixInProperties: function() {
			this.inherited(arguments);

			var name,
				  content,
				  arrCookie = document.cookie.split(';');

				for(var i=0; i<arrCookie.length; i++){
					var arr = arrCookie[i].split('=');
					if(lang.trim(arr[0]) == 'kiosk'){
					}
				}
		},

		postCreate : function(){
			this.inherited(arguments);
			this._initBg();
			this._initM();
		},

		_initBg: function(){
			//document.getElementsByTagName("body")[0].style.backgroundColor = "#070707";
			document.body.style.backgroundColor = "#070707";
		},

		_initM : function(){
			M.add(this.loginObj);

			M.on('next', lang.hitch(this, this._addChild));
			M.on('remove', lang.hitch(this, this._removeChild));
		},

		_addChild : function(obj){
			array.forEach(this.area.children, function(el){el.style.display = 'none'});

			/*
			this.area.appendChild(obj.domNode);
			obj.startup();
			*/

			obj.placeAt(this.area, 'last');
		},

		_removeChild : function(){

			this.area.children[this.area.children.length-1].style.display = '';
		}

	});
});
