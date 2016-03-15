define([
	'dojo/_base/declare',
	'ah/util/common/ModuleBase',
	'dojo/i18n'
], function(declare, ModuleBase, messages) {
	return declare('ah/util/LanguageBase', [ModuleBase], {
		postMixInProperties: function() {
			this.inherited(arguments);
			var obj = this._getModuleName();
			this.i18n = messages.getLocalization(obj.moduleName, obj.bundleName, GDATA.lang);
		},

		_getModuleName: function() {
			var o = this.declaredClass;
			o = o.split('/');
			o.splice(0, 1, 'i18n');
			var s = o.pop();
			return {
				moduleName: o.join('.'),
				bundleName: s
			}
		}
	});
});
