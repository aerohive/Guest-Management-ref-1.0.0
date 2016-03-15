define([
		'dojo/_base/declare',"ah/util/AHGrid",'ah/util/common/ModuleBase',"dojo/Evented",
		'dojo/on','dojo/_base/lang',"dojo/store/Memory","dojo/data/ObjectStore","dojo/Deferred","dojo/when","ah/util/common/LocalStorage",
		"dojo/_base/array", "dojo/dom-construct", "dojo/dom-class", "ah/util/dojocover/AHDialog",
		//"dojo/i18n!i18n/common/nls/status_msg" //for registerUI
		],function(declare, AHGrid, ModuleBase, Evented, on, lang, Memory, ObjectStore, Deferred, When, LocalStorage, array, domCon, domClass, Dialog, StaMsg){

		return declare('ah/util/form/Grid',[ModuleBase, Evented],{

			// remote url for grid data
			target : '',

			delTarget : '',

			delParam : 'id',

			delFlag: false,

			//delUrlFn : null,

			// local data for grid data
			datas : null,

			wipeArea : null,
			funnelArea : null,


			//fnNoData : function(){},


			// for reusable object
			objectType : 'userGroup',
			//objectAttr : '',


			bNoDataText : false,
			noDataMessage : 'No records found.',


			// for ajax sort by click head
			bAjaxSort : false,

			/**
			 *@The max item you can add
			 */
			// itemLimit : 100,

			// @For drapAdd menu widget
			// dropItems : [],
			// dropTheme : '',

			bPage : true,

			bPageNum : true,

			pagination : [10, 20, 50],

			pageSize : 10,

			curPage : 0,

			pageThrold : 5,

			_setBPageNumAttr : function(f){
				this.pageNumWrap.style.display = f ? '' : 'none';
			},
			_setCurPageAttr: function(num){
				this.pageInput.value = '';
				this._set('curPage', num);
			},

			_actionMap : {
				'wipeAdd' : 'add',
				'bulkEdit' : 'edit',
				'reusable' : 'select',
				'dropAdd' : 'drop-add',
				'speRemove' : 'remove'
			},

			actionArea : 'add,edit,remove',
			_setActionAreaAttr : function(v){
				if(!v) {
					this.actionWrap.style.display = 'none';
					return;
				}

				var ret = v.split('|'),
					leftArr = ret[0].split(','),
					rightArr = ret[1] ? ret[1].split(',') : [],
					makeSpan = function(item, t){
						var span = domCon.toDom('<span></span>'),
							icon = t._actionMap[item] || item;

						span.className = 'table-action-icons table-' + icon;

						return span;
					};

				array.forEach(leftArr, function(item){
					var span = makeSpan(lang.trim(item), this);

					this.actionLeft.appendChild(span);

					if(item == 'wipeAdd' && this.wipeArea){
						domCon.place(this.wipeArea, this.actionWrap, 'after');
					}

					//for registerUI
					// if(item == 'dropAdd' && this.dropItems){
					// 	this.menu = new Menu({items : this.dropItems, bReplace : false, theme : this.dropTheme || ''}, span);
					// }

					this.own(on(span, 'click', lang.hitch(this, this._handleActions, item)));
				}, this);


				array.forEach(rightArr, function(item){
					var span = makeSpan(lang.trim(item), this);

					this.actionRight.appendChild(span);

					this.own(on(span, 'click', lang.hitch(this, this._handleActions, item)));
				}, this);

			},


			_setFunnelAreaAttr : function(dom){
				if(!dom) return;

				this.funnelEl.style.display = '';
				this.funnelWrap.style.display = '';

				domCon.place(this.funnelArea, this.funnelWrap, 'last');

				this.actionWrap.style.padding = '0';
				this.actionLeft.style.marginTop =
					this.actionRight.style.marginTop = '10px';
			},


			//selectedItems : [{} or id],
			_setSelectedItemsAttr : function(arr){
				if(!arr || !arr.length) return;

				var ret = [];

				array.forEach(arr, function(item){
					ret.push('object' == typeof item ? item.id : item);
				});

				this.addToSelection(ret);
			},

			messages : {
				oneItem : 'You must select at least one item.',
				onlyOne : 'Please select a single item.',
				overLimit : function(num){ return 'You may not add more than the following number of items: ' + num; }
			},


			templateString : '<div>'+
								'<div class="ui-grid-action clearfix" data-dojo-attach-point="actionWrap">'+
									'<div class="ui-grid-action-funnel fn-left" data-dojo-attach-point="funnelEl" style="display:none"></div>'+
									'<div data-dojo-attach-point="actionLeft" class="fn-left"></div>'+
									'<div class="fn-right" data-dojo-attach-point="actionRight"></div>'+
								'</div>'+
								'<div class="ui-grid-funnel-area" data-dojo-attach-point="funnelWrap" style="display:none"></div>'+
								'<div data-dojo-attach-point="gridContent"></div>'+
								'<div data-dojo-attach-point="gridBottom" class="ui-grid-bottom clearfix" style="display:none">'+
									'<div class="ui-grid-bottom-left fn-left" data-dojo-attach-point="gridBottomLeft"></div>'+
									'<div class="ui-grid-bottom-right fn-right" data-dojo-attach-point="gridBottomRight">'+
										'<ul class="ui-grid-pages">'+
											'<li data-dojo-attach-point="pagePrev" class="ui-page-item-nav">'+
												'<a href="#" class="J-page-first ui-page-item-first" data-dojo-attach-point="prev-item1"></a>'+
												'<a href="#" class="J-page-prev ui-page-item-prev" data-dojo-attach-point="prev-item2"></a>'+
											'</li>'+
											'<li data-dojo-attach-point="pagesWrap"></li>'+
											'<li data-dojo-attach-point="pageNext" class="ui-page-item-nav">'+
												'<a href="#" class="J-page-next ui-page-item-next" data-dojo-attach-point="next-item1"></a>'+
												'<a href="#" class="J-page-last ui-page-item-last" data-dojo-attach-point="next-item2"></a>'+
											'</li>'+
											'<li data-dojo-attach-point="pageNumWrap">'+
												'<input type="text" name="pagenum" class="ui-page-num" data-dojo-attach-point="pageInput" />'+
												'<span class="ui-page-num-go" data-dojo-attach-point="pageGo">Go</span>'+
											'</li>'+
										'</ul>'+
									'</div>'+
								'</div>'+
							'</div>',


			buildRendering : function(){
				this.inherited(arguments);

				this._createLoading();
				this._deferred = new Deferred();
			},

			postCreate : function(){
				this.inherited(arguments);

				this._rendUI();
				this._bindUI();
			},

			startup : function(){
				this.inherited(arguments);

				this.emit('afterRend', this.actionRight, this.actionLeft);
			},

			_rendUI : function(){

				this._createGrid([]);

				if(this.target){
					//this._createGrid([]);
					this.refresh();
				}else if(this.datas){
					//this._createGrid(this.datas);
					this.refresh(this.datas);
				}

			},

			_bindUI : function(){
				this.own(
					on(this.domNode, '.J-page-item:click', lang.hitch(this, this._handleClickPageItem)),
					on(this.domNode, '.J-page-first:click', lang.hitch(this, this._handlePageAction, 'first')),
					on(this.domNode, '.J-page-prev:click', lang.hitch(this, this._handlePageAction, 'prev')),
					on(this.domNode, '.J-page-next:click', lang.hitch(this, this._handlePageAction, 'next')),
					on(this.domNode, '.J-page-last:click', lang.hitch(this, this._handlePageAction, 'last')),
					on(this.domNode, '.J-page-size:click', lang.hitch(this, this._handleClickSizeItem)),
					on(this.pageInput, 'keyup', lang.hitch(this, this._handlePageNum)),
					on(this.pageGo, 'click', lang.hitch(this, function(){this._doPageGo(this.pageInput.value)}))
				);
			},

			_bindGridInnerEvents : function(){
				var pageSizeKey = location.hash.replace('#','').replace('/', '_') + '_'+ this.dojoAttachPoint + '_pageSize',
					val = LocalStorage.get(pageSizeKey) || this.pageSize;

				this.pageSize = val;

				this.own(
					on(this.grid.messagesNode,'click',lang.hitch(this,function(e){
						if(e.target.tagName != 'A') return;

						if(this.fnNoData){
							this.fnNoData();
						}else{
							!this.wipeArea ? this.emit('add') : this.emit('wipeAdd');
						}

					}))
				);

				this.grid.on('RowClick', lang.hitch(this, function(e){

					if(domClass.contains(e.target, 'J-item-edit')){
						e.preventDefault();
						this.emit('edit', e.grid.getItem(e.rowIndex));
					}

				}));

		/*		this.grid.on('MouseOver',lang.hitch(this, function(e){
					if(domClass.contains(e.target, 'J-item-over')){
						e.preventDefault();
						this.emit('over',e.grid.getItem(e.rowIndex));
					}
				}));*/

			},

			_createGrid : function(data){
				var params = this.params,
					data = lang.isArray(data) ? data : data.data,
					plugins = {
						indirectSelection : {
							headerSelector:true
						},
						dnd : {
							dndConfig : {
								col : false,
								cell : false
							}
						}
					},
					plugMap = {
						select : 'indirectSelection',
						dnd : 'dnd'
					},
					opts = {
						query : {
							id : "*"
						}
					},
					json = {data : data}, store, dt,i, dd, key, v, f;


				if(params.identifier){
					json = {
						data : {
							items  : data,
							identifier : params.identifier
						}
					};

					delete params.identifier;
				}


				if(params.plugins){
					dt = lang.clone(params.plugins);
					opts.plugins || (opts.plugins = {});
					for( i in dt){
						dd = dt[i];
						key = 'object' === typeof dd ? i : plugMap[i];
						v = 'object' === typeof dd ? dd : plugins[plugMap[i]];
						opts.plugins[key] = v;
					}

					delete params.plugins;
				}

				opts.store = new ObjectStore({
					objectStore : new Memory(json)
				});


				opts = lang.mixin(opts, params);

				// TODO just for now, need remove later after we delete autoHeight in the template
				opts.autoHeight = 10;

				if(params.isNeedAutoHeight){
					opts.autoHeight = params.autoHeight;
				}

				if(params.bNoDataText){
					opts.noDataMessage = this.noDataMessage;
				}

				if(params.bAjaxSort){
					opts.sort = lang.hitch(this, this._doRemoteSort);
				}

				this.grid = new AHGrid(opts);
				this.gridContent.appendChild(this.grid.domNode);

				this._bindGridInnerEvents();

				this.grid.startup();
				this._rendHeight();

			},

			_handleActions : function(type, e){
				var selected = this.getSelected(),
					len = selected.length,
					args;

				if(type == 'edit' || type == 'restore'){
					if(!this.checkSelected(['needOne', 'moreOne'])){
						return;
					}
				}

				if(type == 'bulkEdit'){
					if(!this.checkSelected('needOne')){
						return;
					}
				}

				if(type == 'remove' || type == 'email' || type == 'speRemove'){
					if(!this.checkSelected('needOne')){
						return;
					}
				}

				switch(type){
					case 'add':
						args = null;
						break;
					case 'edit':
					case 'restore':
						args = selected[0];
						break;
					case 'remove':
					case 'speRemove':
					case 'email':
					case 'bulkEdit':
						args = selected;
						break;
					default:
						break;
				}

				type == 'remove' && this._remove();
				type == 'wipeAdd' && this._wipeAdd();

				//for registerUI
				//type == 'reusable' && this._resuableUp();

				if(type == 'speRemove'){
					this.emit(type, args, this.cfmMsg, lang.hitch(this,this.remove));
				}else{
					this.emit(type, args);
				}
			},




			_handleClickPageItem : function(e){
				e.preventDefault();

				var t = e.target,
					num = t.getAttribute('data-page');

				if(this.get('curPage') == +num) return;

				this.set('curPage', +num);
				this.refresh();

			},

			_handleClickSizeItem : function(e){
				e.preventDefault();

				var t = e.target,
					size = t.getAttribute('data-size'),
					pageSizeKey = location.hash.replace('#','').replace('/', '_') + '_'+this.dojoAttachPoint + '_pageSize';

				size = size == 'all' ? this.totalCount : +size;

				this.set('pageSize', size);
				this.set('curPage', 0);
				LocalStorage.set(pageSizeKey, this.pageSize);
				this.refresh();
			},

			_handlePageAction : function(type, e){
				e.preventDefault();

				var t = e.target,
					curPage;

				if(t.className.indexOf('disable') !== -1) return;

				switch(type){
					case 'first':
						curPage = 0;
						break;
					case 'prev':
						curPage = this.get('curPage') - 1;
						break;
					case 'last':
						curPage = this.pageCount;
						break;
					case 'next':
						curPage = this.get('curPage') + 1;
						break;
					default:
						break;
				}

				this.set('curPage', +curPage);
				this.refresh();

			},

			_handlePageNum : function(e){
				var v = e.target.value,
					keyCode = e.keyCode || e.which;

				if(keyCode === 13){
					this._doPageGo(v);
				}
			},

			_doPageGo : function(v){
				var reg = /^\d+$/;

				v = lang.trim(v);

				if(!reg.test(v)) return;

				v = +v;
				if(v == 0) return;
				if(v-1 === this.get('curPage')) return;
				if(v-1 > this.pageCount) return;

				this.set('curPage', v-1);
				this.refresh();
			},

			_updatePageSize: function(){
				var pageSizeKey = location.hash.replace('#','').replace(/\//g, '_') + '_'+this.dojoAttachPoint + '_pageSize',
					pageSize = LocalStorage.get(pageSizeKey);

				if(pageSize)this.param['page.size'] = pageSize;
			},


			/**
			 *@For public
			 *@summary
			 */

			getGrid : function(){
				return this.grid;
			},

			getSelected : function(){
				var selectedItems = this.grid.selection.getSelected();

				// eliminate falsy items
				return array.filter(selectedItems, function (v) { return v; });
			},

			getStoreData : function(){
				return this.grid.store.objectStore.data;
			},

			getGridData : function(){
				var data = this.grid.store.objectStore.data,
					d;

				d = array.map(data, function(item){
					if('object' == typeof item){
						return lang.mixin({}, item);
					}else{
						return item;
					}
				});

				return array.map(d,function(item){
					if(item.__isDirty) delete item.__isDirty;
					return item;
				});
			},

			getPureData : function(){
				var data = this.getGridData(),
					reg = /\./;

				return array.map(data, function(item){
					reg.test(item.id) && (item.id = null);
					return item;
				});

			},

			getDataIds : function(){
				return array.map(this.getStoreData(), function(item){ return item.id });
			},

			setValue : function(item, key, value){
				this.grid.store.setValue(item, key, value);
			},

			resize : function(){
				this.grid && this.grid.resize();
			},

			refresh : function(data){
				var deferred = this._deferred,
					promiser;

				if(data/* && !this.target*/){

					// @Check like select some items to grid
					if(!this._checkLimit(data, true)) return;

					this.loadEl.style.display = '';
					this.defer(function(){deferred.resolve();},0);
					//this._deferred = deferred;

					return deferred.then(lang.hitch(this,function(){
						this.refreshStore(data);
						this.loadEl.style.display = 'none';
					}));

				}else{
					this._updatePageSize();
					promiser = this.$tgGet(this.loadEl)(this._toGetUrl(), this.refreshStore);

					return promiser.then(lang.hitch(this, this._rendPagination)).then(deferred.resolve, deferred.reject);
				}

			},


			/*fetch : function(){

				var promiser = this.$tgGet(this.loadEl)(this._toGetUrl(), this.refresh);

				return promiser.then(lang.hitch(this, this._rendPagination));

			},*/


			refreshStore : function(data){
				var data = lang.isArray(data) ? data : data.data;

				this.set('__data', data);

				this.beforeRefresh(data, lang.hitch(this, this._setNewStore));

			},

			beforeRefresh : function(data, callback){

				callback(data);
			},

			_setNewStore : function(data){
				this.emit('beforeRefresh', data);

				var newStore = new ObjectStore({
					objectStore : new Memory({
						data : data
					})
				});

				this.grid.setStore(newStore);
				this._rendHeight();

				this.emit('afterRefresh', data);

			},


			/**
			 * @Param selected {Array} [id , id, id, id]
			 */
			addToSelection : function(selected){
				When(this._deferred, lang.hitch(this, function(){
					array.forEach(this.get('__data'), function(item, i){
						if(selected.indexOf(item.id) !== -1){
							this.grid.selection.addToSelection(i);
						}
					}, this);
				}));

			},

			changeParam : function(obj){
				var i, dd;
				for(i in obj){
					this.param[i] = obj[i];
				}

				this.refresh();
			},

			// do we need replace new param ?
			replaceParam : function(obj){
				var i, dd, vo = this.param.vocoLevel, pageSort = this.param['page.sort'];

				this.param = {};

				for(i in obj){
					this.param[i] = obj[i];
				}

				if(vo){
					this.param.vocoLevel = vo;
				}

				if(pageSort) {
					this.param['page.sort'] = pageSort;
				}

				this.refresh();

			},

			remove : function(data){
				this._modifyGrid('remove', data);
			},

			add : function(data){

				if(!this._checkLimit(data)) return;

				this._when(function(){
					this._modifyGrid('add', data);
				})
			},

			edit : function(data){
				this._modifyGrid('edit', data);
			},

			// for delete one item in public
			del : function(data){
				this._cfmDel(data);
			},

			checkSelected : function(type){
				var len = this.getSelected().length,
					messages = this.messages,
					maps = {
						needOne : [!len, messages.oneItem],
						moreOne : [len > 1, messages.onlyOne]
					}, d, i, n;

				if(Array.isArray(type)){
					n = type.length;

					for(i = 0; i < n; i++){
						if(!this.checkSelected(type[i])){
							return false;
						}
					}

					return true;

				}

				if(!(d = maps[type])){
					return true;
				}

				if(d[0]){
					this.msgErr(d[1]);
					return false;
				}

				return true;

			},



			/**
			 *@For ajax sort
			 *@rewrite one method
			 */

			_doRemoteSort : function(){
				var sortProps = this.grid.getSortProps()[0],
					sortAttribute = sortProps.attribute;

				this.changeParam({
					'page.sort' : sortAttribute + ','+ (sortProps.descending ? "DESC" : "ASC")
				});
			},


			_checkLimit : function(data, flag){
				var n = Array.isArray(data) ? data.length : 1,
					f = true, currentNum;

				if(this.itemLimit){
					currentNum = flag ? 0 : this.target ? this.totalCount : this.getStoreData().length;

					if(n + currentNum > this.itemLimit){
						this.defer(function(){this.msgErr(this.messages.overLimit(this.itemLimit))},10);
						return f = false;
					}
				}

				return f;
			},

			_when : function(fn){
				When(this._deferred, lang.hitch(this, fn));
			},

			_remove : function(){
				if(this.target){
					this._cfmDel();

				}else if(this.datas){
					this.remove();
				}
			},

			_wipeAdd : function(){
				this.$toggleWipe(this.wipeArea);
			},


			//for registerUI
			// _resuableUp : function(){
			// 	var dialog, obj;

			// 	dialog = this._reusableDialog = new Dialog({style : 'width : 600px', title : ''});

			// 	obj = this._reusableObj = new ReusableObject({
			// 		dialog : dialog,
			// 		policyId : this.policyId,
			// 		deviceId : this.deviceId,
			// 		objectType : this.objectType,
			// 		objectAttr : this.objectAttr,
			// 		ids : array.map(this.getGridData(), function(item){ return item.id; }),
			// 		datas : this.getGridData()
			// 	});

			// 	obj.on('addItem', lang.hitch(this, this.add));

			// 	obj.on('linkItems', lang.hitch(this, this.refresh));

			// 	obj.on('delItems', lang.hitch(this, this.remove));

			// 	dialog.set('content', obj.domNode);
			// 	dialog.show();
			// },

			_rendHeight : function(){
				//this.grid.changeHeight();
				//this.autoHeight && this.grid.setAutoHeight();
			},

			_cfmDel : function(data){
				this.cfmMsg(lang.hitch(this, function(){
					var promise = this.$del(
						this._toDelUrl(data),
						this.remove,
						data
					);

					if(this.target){
						promise.then(lang.hitch(this, this.refresh, false));
					}

					return promise;

				}));

			},


			_modifyGrid : function(method, data){
				var data = lang.isArray(data) ? data : !data ? null : [data],
					store = this.grid.store,
					exitIds = this.getDataIds(),
					deletedItems;

				switch(method){
					case 'add':
						array.forEach(data, function(item){
							if(exitIds.indexOf(item.id) === -1){
								store.newItem(item);
								store.objectStore.add(item);
							}
						});

						this.emit('afterAdd', data);
						break;

					case 'edit':
						array.forEach(data, function(item){
							store.objectStore.put(item);
						});

						this.grid.setStore(store);
						break;

					case 'remove':
						deletedItems = data || this.getSelected();

						array.forEach(deletedItems, function(item){
							store.deleteItem(item);
							store.objectStore.remove(item.id);
						});

						this.emit('afterRemove', deletedItems);
						break;

					default:
						break;
				}

				this._rendHeight();
			},



			_rendPagination : function(data){
				// @want to clear select
				this.grid.selection.clear();

				if(!this.bPage) return;

				var len = data.data.length,
					total = len && data.pagination ? data.pagination.totalCount : 0,
					pages = Math.ceil(total / this.pageSize),
					f = this.pageSize === this.pagination[0];

				if(!len || (pages <= 1 && f)) {
					this.gridBottom.style.display = 'none';
					return;
				}else{
					this.gridBottom.style.display = '';
				}

				this._rendPageSize(data);
				this._rendPages(data);
			},

			_rendPageSize : function(data){
				var str = '';

				// Required from backend, remove 'all' paganation first.
				array.forEach(this.pagination/*.concat('all')*/, function(size){
					var f = this.pageSize == size;

					str += '<a href="#" class="J-page-size ui-page-size'+(f ? ' ui-page-size-cur' : '')+'" data-size="'+ size +'">'+size+'</a>';
				}, this);

				this.gridBottomLeft.innerHTML = str;
			},

			_rendPages : function(data){
				var total = data.pagination.totalCount,
					pages = Math.ceil(total / this.pageSize),
					pageThrold = this.pageThrold,
					curPage = this.curPage, i = 1, j, arr = [];

				this.totalCount = total;
				this.pageCount = pages - 1;

				this._rendPageStatus(curPage, pages);


				// TODO make method more abstract later
				if(pages <= pageThrold){
					while(i < pages + 1){
						arr.push(i);
						i++;
					}
				}else{
					if(curPage >= 3 && curPage <= pages-3){
						//arr = [curPage-2, curPage-1, curPage, curPage+1, curPage+2];
						arr = [curPage-1, curPage, curPage+1, curPage+2, curPage + 3];
					}else{
						if(curPage < 3){
							while(i < pageThrold + 1){
								arr.push(i);
								i++;
							}
						}

						if(curPage > pages - 3){
							while(i < pageThrold + 1){
								arr.push(pages - pageThrold + i);
								i++;
							}
						}

					}
				}


				this.pagesWrap.innerHTML = this.__makePages(arr);

			},

			_rendPageStatus : function(curPage, pages){
				/*
				this.pagePrev.style.display = curPage == 0 ? 'none' : '';
				this.pageNext.style.display = curPage == pages-1 ? 'none' : '';
				*/

				var cla = 'ui-page-item-disable';

				this.prevQys[curPage == 0 ? 'addClass' : 'removeClass'](cla);
				this.nextQys[curPage == pages-1 ? 'addClass' : 'removeClass'](cla);
			},

			__makePages : function(arr){
				var str = '';

				array.forEach(arr, function(num){
					var f = this.curPage == num - 1;

					str += '<a href="#" class="J-page-item ui-page-item'+(f ? ' ui-page-item-cur' : '')+'" data-page="'+(num - 1)+'">'+num+'</a>';
				},this);

				return str;
			},


			_toDelUrl : function(data){
				var selected = !data ? this.grid.selection.getSelected() : lang.isArray(data) ? data : [data],
					len = selected.length,
					param = this.delParam,
					target = this.delTarget || this.target,
					ret = [],ids;

				if(this.delUrlFn){
					return this.delUrlFn(selected);
				}

				array.forEach(selected,function(item){
					ret.push(item[param] || item.id);
				});

				ids = ret.join(',');

				return target + (this.delFlag ? '?' + param + 's=' + ids : (len > 1 ? '?'+param + 's' + '='+ids : '/'+ids));

			},

			_toGetUrl : function(){
				var str = '', arr = [], reg = /\?/,
					f = reg.test(this.target),
					param, i;

				if(param = this.param){
					for(i in param){
						arr.push(i+'='+param[i]);
					}

					str += arr.join('&');
					str = f ? '&' + str : '?' + str;
				}

				if(this.pagination && this.bPage){
					str += (f || reg.test(str) ? '&': '?') + 'page.page=' + this.curPage;
					str += '&page.size=' + this.pageSize;
				}

				return this.target + str;
			},


			// choosen what store for Grid
			_createStore : function(){

			},

			_createLoading : function(){
				var div = document.createElement('div');
				div.className = 'grid-mark';
				div.style.display = 'none';

				this.loadEl = div;

				this.domNode.style.position = 'relative';
				this.domNode.style.minHeight = '150px';
				this.domNode.appendChild(div);
			},

			destroy : function(){
				this.grid.destroy();
				this.inherited(arguments);
				this._reusableDialog && this._reusableDialog.destroy();
				this._reusableObj && this._reusableObj.destroy();
			}

		});

});
