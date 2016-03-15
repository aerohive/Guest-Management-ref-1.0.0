define([
	"dojo/_base/lang",
	"dojo/string",
	"dojo/query",
	"dojo/dom-class"
], function (
	lang, string, query, domClas
) {

	var structure = {};

	// Helps
	var add = function(name,cfg){
		lang.setObject(
			name,
			cfg,
			structure
		);
	};

	add('idm.registerInformation',[
			{
				label : "Name",
				field : "name",
				width : 'auto'
			},{
				label : "Contact Information (telephone or email)",
				field : "contact",
				auto : 'auto'
			}
		]);

	add('idm.guestList',[
			{
				label : "Name",
				field : "userName",
				width : 'auto'
			},{
				label : "Expires",
				field : "expireTime",
				auto : 'auto'
			}
		]);

	return structure;
});
