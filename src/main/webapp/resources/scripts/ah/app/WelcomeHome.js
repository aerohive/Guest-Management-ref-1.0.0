define(["dojo/_base/declare",
	//"dojo/text!./templates/RegisterHome.html",
	"dojo/on",
	"dojo/_base/lang",
	"dojo/_base/array",
	"ah/util/common/ModuleBase",
	"ah/app/ModuleManager",
	"ah/config/preload",
	"ah/app/WelcomeContent"], function(declare, /*template,*/ on, lang, array, ModuleBase, M) {

	return declare("ah/app/WelcomeHome", [ ModuleBase ], {

		templateString :  "<div>"+
		"<div class='rg-header rg-mc0 rg-w750'></div>"+
		"<div class='rg-bg rg-mc0' data-dojo-attach-point='area'>"+
		"<div class='rg-content' data-dojo-attach-point='loginObj' data-dojo-type='ah/app/WelcomeContent' data-dojo-props='parent: this'></div>"+
		"</div>"+

		"<div class='rg-mc0 rg-w750'>"+
		"<div class='img-bottom rg-h70 fn-right'></div>"+
		"</div>"+
		"</div>",

		postMixInProperties: function() {
			this.inherited(arguments);
		},

		postCreate : function(){
			this.inherited(arguments);
			this._initBg();
			this._initM();
			this._initWelcomeContent();
		},

		_initBg: function(){
			document.body.style.backgroundColor = "#070707";
		},

		_initM : function(){
			M.add(this.loginObj);
			M.on('next', lang.hitch(this, this._addChild));
			M.on('remove', lang.hitch(this, this._removeChild));
		},

		_initWelcomeContent: function() {
			if (GDATA.kiosk == 'true') {
				document.getElementById("autoRedirectMsg").innerHTML = 'Submit Passcode to begin using Kiosk';
				var authError = GDATA.authError;
				if (authError != '') {
					console.log("authError: " + authError);
					document.getElementById("authErrorMsg").innerHTML = authError;
					document.getElementById("authErrorMsg").className = 'displayMsg';
				}
			} else {
				document.getElementById("autoRedirectMsg").innerHTML = 'You will be redirected to the login page...';
				document.getElementById("autoRedirectMsgDiv").className = 'center';
				var oauthLoginUrl = GDATA.oauthLoginUrl;
				setTimeout(function () {
					window.location.href = oauthLoginUrl;
				}, 1000);
				document.getElementById("kioskForm").className = 'hiddenMsg';
			}
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
