define([
	"dojo/_base/declare",
	"dojo/text!./templates/LanguageDialog.html",
	"dojo/dom-class",
	"ah/util/common/ModuleBase"
], function(declare, template, domClass, ModuleBase) {
	return declare("ah/app/LanguageDialog", [ModuleBase], {
		templateString : template,

		events: [
			['selectLanguage', 'click', '_selectLanguage'],
			['close', 'click', function() {
				this.dialog.destroy();
			}]
		],

		_selectLanguage: function(e) {
			var curEl = e.target;
			if(curEl.nodeName.toLowerCase() !== 'ul') {
				while(curEl.nodeName.toLowerCase() !== 'li') {
					curEl = curEl.parentNode;
				}
			}
			if(domClass.contains(curEl, 'language-select-item')) {
				this.onDealData(curEl.getAttribute('data-val'));
				this.dialog.destroy();
			}
		},

		onDealData: function() {}
	});

});
