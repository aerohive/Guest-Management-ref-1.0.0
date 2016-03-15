define(["dojo/_base/declare",
		"dojo/text!./templates/GuestList.html",
		"dojo/on",
		"dojo/_base/lang",
		"dojo/_base/array",
	  	"ah/util/common/ModuleBase",
	  	"ah/config/gridStructure",
		"ah/app/ModuleManager",
		"ah/app/PromptOperation",
		"dojo/i18n!i18n/app/nls/GuestList"
		], function(declare, template, on, lang, array, ModuleBase, Structure, M, PromptOperation,messages) {

	return declare("ah/app/GuestList", [ ModuleBase ], {

			templateString : template,

			i18n : messages,

			events : [
				["back", "click", "_handleBack"],
				["guestList", "afterRend", "_rendGridView"],
				["guestList", "resend", "_resendConfirm"],
				['filterText', 'input', '_searchGridData'],
				['guestList', 'speRemove', '_handleRemove']
			],

			postMixInProperties: function(){
				this.inherited(arguments);
				this._target = GDATA.ctx + "/services/proxy/apollo?resource=/identity/credentials";
				this.__structure = Structure.idm.guestList;
			},

			startup: function(){
				this.inherited(arguments);
			},

			_handleBack: function(){
				M.prev();
			},

			_rendGridView: function(right){
				right.appendChild(this.searchArea);
			},

			_resendConfirm: function(item){
				this.cfmMsg(lang.hitch(this,function(){
					var completeVal = [item.email?item.email: ''];
					M.next(new PromptOperation({guestType: 'viewGuest', sendId: item.id, completeVal: completeVal}));
				}),'The access key will be reset. Do you want to continue?');
			},

			_searchGridData: function(){
				clearTimeout(this._searchTime);
				this._searchTime = setTimeout(lang.hitch(this, '_handleSearch'), 400);
			},

			_handleSearch: function() {
				var value = this.filterText.value.trim(),
						apiUrl = '/identity/credentials',
						url = GDATA.ctx + "/services/proxy/apollo?resource=" + apiUrl;
				if(value){
					value = encodeURIComponent(value);
					url += '?loginName=' + value;
				}
				this.$get(url, lang.hitch(this, this._refreshGrid));
			},

			_handleRemove : function(selected, fnConfirm, fnRemove){
				fnConfirm(lang.hitch(this, function () {
					var ids = array.map(selected, function (item) {
						return item.id;
					});

					var delUrl = GDATA.ctx + "/services/proxy/apollo?resource=/identity/credentials?ids=" + ids.join(',');

					this.$del(delUrl, function () {
						fnRemove(selected);
						this.msgSucc('The guest' + (ids.length > 1 ? 's were' : ' was') + ' successfully deleted.');
					});
				}));
			},

			_refreshGrid: function(resp){
				var data = resp.data;
				this.guestList.refresh(data);
			}
	});

});
