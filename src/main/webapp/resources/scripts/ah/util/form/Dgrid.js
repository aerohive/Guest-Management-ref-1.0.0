define([
		'dojo/_base/declare','ah/util/common/ModuleBase',"dojo/Evented",'ah/util/layout/Menu',
		'dojo/on','dojo/_base/lang',"dojo/Deferred","dojo/when", "dojo/_base/array",
		'dgrid/OnDemandGrid','dgrid/Selector','dgrid/Tree', 'dgrid/extensions/ColumnHider',
		'dstore/Memory','dstore/Trackable','dstore/Tree',
		"dojo/dom-construct", "dojo/dom-class", "ah/util/dojocover/AHDialog",
        "ah/util/common/LocalStorage"
		],function(
			declare, ModuleBase, Evented, Menu, on, lang, Deferred, When, array,
			OnDemandGrid, Selector, Tree, ColumnHider, Memory, Trackable, TreeStore,
			domCon, domClass, Dialog, LocalStorage
		){

		return declare('ah/util/form/Dgrid',[ModuleBase, Evented],{

			/*
			 *@remote url for grid data
			 *@ String/Deferred
			 */
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



			//bNoDataText : false,
			noDataMessage : 'No records found.',

			autoHeight : true,

			allowTextSelection: true,


			/**
			 *@
			 */
			//mixin : 'tree,dnd',



			// for ajax sort by click head
			bAjaxSort : false,

			// for treeGrid's children has the checkbox or not
			bChildCheck: true,
            bChildRelatedCheck : false,


            // for columm hider
            //colhiderId : '',


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



			//pageInfo and totalCount is used for startKey pagination api
			pageInfo: {},
			totalCount: 0,
			sData: [],
			startKey: '',

            dataType : 'data',
            sPage : false,
			allowColumnDrag : false,//this one has confliction with rowExpando
            _setSPageAttr : function(f){
                this.set('dataType', !f ? 'data' : 'data.content');

                this._set('sPage', f);
            },

			_setBPageNumAttr : function(f){
				this.pageNumWrap.style.display = f ? '' : 'none';
			},
			_setCurPageAttr: function(num){
				this.pageInput.value = '';
				this._set('curPage', num);
			},

			_setAsynPageAttr : function(num){
				this.set('curPage', num);
				if(this.sPage && this.curPage <= Math.ceil(this.sData.length/this.pageSize)){
					this.refresh(this.sData);
				}else if(this.localPagination) {
					this.refresh(this._originAllData);
				}else{
					this.changeParam({'page': num});
				}

			},

			_setParamAttr : function(obj){
				var p = {};

				if(!obj || 'object' !== typeof obj) return;

				if(this.bPage){
					p['page'] = this.curPage;
				}

				if(this.pagination){
					p['pageSize'] = this.pageSize;
				}

				for(var i in obj){
					p[i] = obj[i];
				}

				this._set('param', p);
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

					if(item == 'dropAdd' && this.dropItems){
						this.menu = new Menu({items : this.dropItems, bReplace : false, theme : this.dropTheme || ''}, span);
					}

					this.own(on(span, 'click', lang.hitch(this, this._handleActions, item)));
				}, this);


				array.forEach(rightArr, function(item){
					var span = makeSpan(lang.trim(item), this);

					this.actionRight.appendChild(span);

					this.own(on(span, 'click', lang.hitch(this, this._handleActions, item)));
				}, this);

				if(this.colhiderId)this.actionRight.style.marginRight = '35px';

			},


			_setFunnelAreaAttr : function(dom){
				if(!dom) return;

				this.funnelEl.style.display = '';
				this.funnelWrap.style.display = '';

				domCon.place(this.funnelArea || dom, this.funnelWrap, 'last');

				this.actionWrap.style.padding = '0';
				this.actionLeft.style.marginTop =
					this.actionRight.style.marginTop = '10px';
			},


			/*
			 *@ selectedItems : [{} or id],
			 * This for back compact, if you want to init some row to be selected,
			 * Just use   selection : {id : true, id : true}
			 */
			_setSelectedItemsAttr : function(arr){
				if(!arr || !arr.length) return;

				this.selection = {};

				array.forEach(arr, function(item){
					this.selection['object' == typeof item ? item.id : item] = true;
				}, this);

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
					if('string' === typeof this.target){
						this.refresh();
					}

					if(this.target.toString() === '[object Deferred]'){
						this.loadEl.style.display = '';
						this.target.then(lang.hitch(this, function(url){
							this.target = url;
							this.refresh();
						}));
					}
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
				var pageSizeKey = location.hash.replace('#','').replace(/\//g, '_') + '_'+ this.dojoAttachPoint + '_pageSize',
					val = LocalStorage.get(pageSizeKey) || this.pageSize;

				this.pageSize = val;

				this.own(
					/*
					on(this.grid.messagesNode,'click',lang.hitch(this,function(e){
						if(e.target.tagName != 'A') return;

						if(this.fnNoData){
							this.fnNoData();
						}else{
							!this.wipeArea ? this.emit('add') : this.emit('wipeAdd');
						}

					}))

					*/

					this.grid.on('.dgrid-content .dgrid-cell:click', lang.hitch(this, function(e){
						var d = this.grid.cell(e).row.data;

						if(domClass.contains(e.target, 'J-item-edit')){
							e.preventDefault();
							//this.emit('add', d);
							// @Actually, we can use 'add' for it
							this.emit('edit', d);
						}
						if(this.bReorder){
							this._handleOrder(e);
						}

					}))

				);

                if(this.colhiderId){

                    this.own(
                        this.grid.on('dgrid-columnstatechange', lang.hitch(this,function(opt){
                            var col = opt.column, key = this.colhiderId+'_colhider',
                                name = col.label || col.name, val = LocalStorage.get(key) || {};

                            val[name] = opt.hidden;
                            LocalStorage.set(key, val);

                        }))
                    );
                }

                if(this.bChildRelatedCheck){
                    this.own(
                        this.grid.on('.dgrid-selector:click', lang.hitch(this, function(e){
                            if(e.target.parentNode.tagName == 'TH') return;

                            var treeMap = this.get('treeRelated'), grid = this.grid,
			                    cell = grid.cell(e), row = cell.row, d = row.data, id = d.id,
			                    isParent = !d.parent,isLeaf = d.parent && !d.hasChildren,
			                    parentId, childSelected, childNotSelected;

			                if(isParent){
			                    array.forEach(treeMap[id], function(childId, i){
			                        this.select(grid.row(childId), null, this.isSelected(id));
			                    }, grid);
			                    return;
			                }

			                if(isLeaf){
			                    parentId = d.parent;
			                    childSelected = array.every(treeMap[parentId], function(childId, i){
			                        return this.isSelected(childId);
			                    }, grid);

			                   grid.select(grid.row(parentId), null, childSelected);
			                   return;
			                }
                        }))
                    );
                }

				//column drage local storage
				// if(this.allowColumnDrag){
				// 	this.own(
				// 		this.grid.on('dgrid-columnreorder', lang.hitch(this,function(obj){
				// 			var columnOrderKey = location.hash.replace('#','').replace(/\//g, '_') + '_'+this.dojoAttachPoint + '_columnOrder';
				// 			var subRows = obj.grid.subRows[0];
				// 			var fieldArray, columnOrderArray;

				// 			fieldArray = subRows.filter(function(item){
				// 				return item && item.field;
				// 			});

				// 			columnOrderArray = fieldArray.map(function(item){
				// 				return item.field;
				// 			});
				// 			LocalStorage.set(columnOrderKey, columnOrderArray);
				// 		}))
				// 	);
				// }


			},

			_createGrid : function(data){
				var data = lang.isArray(data) ? data : data.data;

				/*
				if(params.identifier){
					json = {
						data : {
							items  : data,
							identifier : params.identifier
						}
					};

					delete params.identifier;
				}
				*/

				var cfg = this._makeGridOptions(this.params),
                    autoHeightFn;

				cfg.collection = this._createStoreClass(data);

                if(cfg.autoHeightFn){
                    autoHeightFn = cfg.autoHeightFn;

                    delete cfg.autoHeightFn;
                }


				if(cfg.bAjaxSort){
					cfg._setSort = lang.hitch(this,this._doRemoteSort);
				}
				if(cfg.sPage) {
					cfg._setSort = lang.hitch(this,this._doSDataSort);
				}


				this.grid = this._createGridClass(cfg);
				this.gridContent.appendChild(this.grid.domNode);

				this._bindGridInnerEvents();

				this.grid.startup();

				this.defer(function(){
                    this.grid.resize();
                    autoHeightFn && autoHeightFn(this.grid.bodyNode);
                },1e2);

			},

			_makeGridOptions : function(params){
				var opts = {
					//className: "dgrid-autoheight",
					noDataMessage : this.noDataMessage,
					allowTextSelection: this.allowTextSelection
				}, autoHeight;

				if(params.structure){
					params.columns = params.structure;

					delete params.structure;
				}

				if(params.plugins){
					if(params.plugins.select){
						params.selectorType = 'checkbox';
					}

					delete params.plugins;
				}

				if(autoHeight = params.autoHeight || this.autoHeight){
					if(autoHeight === true){
						opts.className = 'dgrid-autoheight';
					}

					if('number' === typeof autoHeight){

					}

					if(!isNaN(parseInt(autoHeight))){
						opts.className = 'dgrid-autoheight';
						//this.gridContent.style.height = autoHeight;
                        opts.autoHeightFn = function(scroller){
                            scroller.style.maxHeight = autoHeight;
                            scroller.style['overflow-y'] = 'auto';
                        }
					}
				}

				if(this.selection){
					params.selection = this.selection;
				}

				var columns = lang.clone(params.columns),
					selectorType;

				if((selectorType = params.selectorType) && Array.isArray(columns)){
					columns.unshift({
						//selector : params.selectorType,
						selector : lang.hitch(this, function(column, selected, cell, object){
							var grid = column.grid, input;

							var span = document.createElement('span');
							span.className = 'lbl';

							domClass.add(cell, 'dgrid-selector');

							input = cell.input || (cell.input = domCon.create('input', {
								'aria-checked': selected,
								checked: selected,
								disabled: !grid.allowSelect(grid.row(object)),
								tabIndex: isNaN(column.tabIndex) ? -1 : column.tabIndex,
								type: selectorType
							}));

							if(this.bChildCheck || !object.parent) {
								cell.appendChild(input);
								cell.appendChild(span);
							}
							return input;
						}),
						className : 'w30',
                        unhidable : true
					});

                    array.forEach(columns, function(col){
                        var name = col.name;

                        name && (col.label = name);

                        delete col.name;
                    });

					delete params.selectorType;
				}

				// restore localstorage for col hider
				if(this.colhiderId){
					var colOpts = LocalStorage.get(this.colhiderId+'_colhider');

					colOpts &&
					array.forEach(columns, function(col){
						var label = col.label || col.name, field = col.field,
							hidden;

						if('undefined' !== typeof (hidden = colOpts[label])){
							col.hidden = hidden;
						}
					});
				}

				//restore localstorage for column order
				if(this.allowColumnDrag){
					var columnOrderKey = location.hash.replace('#','').replace(/\//g, '_') + '_'+this.dojoAttachPoint + '_columnOrder';
					var columnOrderArray = LocalStorage.get(columnOrderKey);
					var len = columns.length;

					columnOrderArray && columns.sort(function(a, b){
						var aIndex = !a? len : !a.field ? -1 : columnOrderArray.indexOf(a.field);
						var bIndex = !b? len : !b.field ? -1 : columnOrderArray.indexOf(b.field);

						return  aIndex - bIndex;
					});
				}
				params.columns = columns;

				delete params.target;
				delete params.param;
				delete params.actionArea;

				return lang.mixin(opts, params);
			},

			_handleActions : function(type, e){
				var selected = this.getSelected(),
					len = selected.length,
					args;

				if(type == 'edit' || type == 'resend' || type == 'clone'){
					if(!this.checkSelected(['needOne', 'moreOne'])){
						return;
					}
				}

				if(type == 'bulkEdit'){
					if(!this.checkSelected('needOne')){
						return;
					}
				}

				if(type == 'remove' || type == 'email' || type == 'speRemove' || type == 'renew'){
					if(!this.checkSelected('needOne')){
						return;
					}
				}

				switch(type){
					case 'add':
						args = null;
						break;
					case 'edit':
					case 'resend':
					case 'clone':
						args = selected[0];
						break;
					case 'remove':
					case 'speRemove':
					case 'email':
					case 'bulkEdit':
					case 'renew':
						args = selected;
						break;
					default:
						break;
				}

				type == 'remove' && this._remove();
				type == 'wipeAdd' && this._wipeAdd();
				type == 'reusable' && this._resuableUp();

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

				/*
				this.set('curPage', +num);
				this.refresh();
				*/
				this.set('asynPage', +num);

			},

			_handleClickSizeItem : function(e){
				e.preventDefault();

				var t = e.target,
					size = t.getAttribute('data-size'),
					pageSizeKey = location.hash.replace('#','').replace(/\//g, '_') + '_'+this.dojoAttachPoint + '_pageSize';

				size = size == 'all' ? this.totalCount : +size;

				this.set('pageSize', size);
				this.set('curPage', 0);
				LocalStorage.set(pageSizeKey, this.pageSize);
				//this.refresh();
				this.changeParam({'page' : 0, 'pageSize' : size});
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

				/*
				this.set('curPage', +curPage);
				this.refresh();
				*/
				this.set('asynPage', +curPage);

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

				/*
				this.set('curPage', v-1);
				this.refresh();
				*/
				this.set('asynPage', v-1);
			},


			/**
			 *@For public
			 *@summary
			 */

			getGrid : function(){
				return this.grid;
			},

			getCollection : function(){
				return this.grid.collection;
			},

			getSelected : function(){
				var selectedObj = this.grid.selection,
					selectedItems = [];

				for(var i in selectedObj){
					if(!selectedObj[i]) continue;
					selectedItems.push(this.getCollection().getSync(i));
				}

				// eliminate falsy items
				return array.filter(selectedItems, function (v) { return v; });
			},

			getStoreData : function(){
				return this.getCollection().data;
			},

			getGridData : function(){
				var data = this.getStoreData(),
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
				//this.grid.store.setValue(item, key, value);
				item[key] = value;

				this._modifyGrid('edit', item);
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
						if(this.showAllRows)this.grid.minRowsPerPage = data.length;

						if(this.localPagination){
							this.param = this.param || {};
							var paginationData  = {};
							this._originAllData = data;
							data = data.slice(this.curPage * this.pageSize,(this.curPage + 1) * this.pageSize );
							paginationData.data = data;
							paginationData.pagination = {
								"totalCount": this._originAllData.length
							};
							this._rendPagination(paginationData);
							this.refreshStore(data);
							this.loadEl.style.display = 'none';
						}else {
							this.refreshStore(data);
							this.loadEl.style.display = 'none';
						}
					}));

				}else{
					this._updatePageSize();
					promiser = this.$tgGet(this.loadEl)(this._toGetUrl(), this.refreshStore);

					return promiser.then(lang.hitch(this, this._rendPagination)).then(deferred.resolve, deferred.reject);
				}

			},



			refreshStore : function(data){
				var copyData = data,
                    data = lang.isArray(data) ? data : lang.getObject(this.get('dataType'), false, data);

				//create item.id if it is not exist in original data
				var data = array.map(data, function(item, index){
					'undefined' == typeof item.id && (item.id =  index)
					return item;
				});

				this.set('__data', data);

			    this.beforeRefresh(data, lang.hitch(this, this._setNewStore));

                return !this.sPage ? copyData : {data : {size : 500, content : data, startKey : this.startKey}};
			},

			beforeRefresh : function(data, callback){

				callback(data);
			},

			_handleOrder : function(e){
				var rowIndex = this.grid.row(e).element.rowIndex,
					t = e.target,
					isOrder = dojo.hasClass(t,'ui-order'),
					isUp = dojo.hasClass(t,'ui-order-up'),
					isDown = dojo.hasClass(t,'ui-order-down'),
					data = this.getStoreData(),
					ret = lang.clone(data),i,newStore;

				if(!isOrder) return;
				if(isUp && rowIndex == 0) return;
				if(isDown && rowIndex == data.length) return;

				isUp && (i = rowIndex-1);
				isDown && (i = rowIndex+1);

				// action start
				data.splice(i,0,data.splice(rowIndex,1)[0]);

				this._setNewStore(data);
			},


			_setNewStore : function(data){
				this.emit('beforeRefresh', data);
                if(this.sPage){
                    this.sData = this.sData? this.sData.concat(data) : this.sData;
					data = this.sData.slice(this.curPage * this.pageSize, this.pageSize*(this.curPage+1));
                }

                if(this.bChildRelatedCheck){
                    var arr = {};
                    array.forEach(data, function(item, i){
                        if('undefined' === typeof item.parent){
                            arr[item.id] = [];
                        }else{
                            (arr[item.parent] || (arr[item.parent] = [])).push(item.id);
                        }
                    });

                    this.set('treeRelated', arr);
                }

				var newStore = this._createStoreClass(data);

				this.grid.set('collection', newStore);

				this.emit('afterRefresh', data);
			},



			changeParam : function(obj){
				var i, dd, obj = obj || {},
					p = 'page';

				for(i in obj){
					this.param[i] = obj[i];
				}

				if('undefined' === typeof obj[p]){
					this.set('curPage', 0);
					this.param[p] = 0;
				}else{
					this.set('curPage', obj[p]);
				}

				if(this.localPagination) {
					this.refresh(this._originAllData);
					return;
				}
				this.refresh();
			},

			// do we need replace new param ?
			replaceParam : function(obj){
				var i, dd, left = ['vocoLevel', 'page.sort'],
					o = {};

				for(i in this.param){
					left.indexOf(i) !== -1 && (o[i] = this.param[i]);
				}

				for(i in obj){
					o[i] = obj[i];
				}

				this.param = o;

				this.refresh();

			},

			remove : function(data){
				this._modifyGrid('remove', data);
			},

			add : function(data){

				if(!this._checkLimit(data)) return;

				//this._when(function(){
					this._modifyGrid('add', data);
				//});
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

			_doRemoteSort : function(property, descending){

				var sort;

				sort = this.grid.sort = typeof property !== 'string' ? property :
				[{property: property, descending: descending}];

				if(sort.length){
					this.changeParam({
						'page.sort' : sort[0].property + ','+ (sort[0].descending ? "DESC" : "ASC")
					});
				}

				this.grid.updateSortArrow(sort);
			},

			_doSDataSort : function(property, descending){
				//Todo: add data fetch with page.sort params when back-end api support it.
				var sort;

				sort = this.grid.sort = typeof property !== 'string' ? property :
					[{property: property, descending: descending}];

                /*
                 * @TODO I don`t think it still needed, please check it.
				if(sort.length){
					this.changeParam({
						'page.sort' : sort[0].property + ','+ (sort[0].descending ? "DESC" : "ASC")
					});
				}
                */

				this.sData = this.sData.sort(function(a,b){
					return 	sort[0].descending ? a[property] - b[property] : b[property] - a[property];
				});
				this.grid.updateSortArrow(sort);
				this.grid.refresh(this.sData);
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

			// _clone: function(args){
			// 	var dialog, obj;

			// 	dialog = this._cloneDialog = new Dialog({style : 'width : 500px', title : 'Rename the item'});

			// 	obj = this._cloneObj = new CloneObject({
			// 		dialog : dialog,
			// 		objectType : this.objectType,
			// 		data: args
			// 	});

			// 	obj.on('addItem', lang.hitch(this, this.add));

			// 	dialog.set('content', obj.domNode);
			// 	dialog.show();

			// },


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
					store = this.getCollection(),
					exitIds = this.getDataIds(),
					deletedItems;

				switch(method){
					case 'add':
						array.forEach(data, function(item){
							if(exitIds.indexOf(item.id) === -1){
								store.add(item);
							}
						});

						this.emit('afterAdd', data);
						break;

					case 'edit':
						array.forEach(data, function(item){
							store.put(item);
						});

						break;

					case 'remove':
						deletedItems = data || this.getSelected();

						array.forEach(deletedItems, function(item){
							store.remove(item.id);
						});

						this.emit('afterRemove', deletedItems);
						break;

					default:
						break;
				}

			},



			_rendPagination : function(data){
				if(!this.bPage) return;

				if(this.sPage){
					this.pageNumWrap.style.display = 'none';
					this['prev-item1'].style.display = 'none';
					this['next-item2'].style.display = 'none';
					//this._startKeyPagination(data);
					//return;
				}

                var len = lang.getObject(this.get('dataType'), false, data).length,
					total = !this.sPage ? (len && data.pagination ? data.pagination.totalCount : 0) : this.sData.length,
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
				var total = !this.sPage ? data.pagination.totalCount : data.data.content.length + this.totalCount,
					pages = Math.ceil(total / this.pageSize),
					pageThrold = this.pageThrold,
					curPage = this.curPage, i = 1, j, arr = [];

				this.totalCount = total;
				this.pageCount = pages - 1;
                this.startKey = data.startKey || '';

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
				var selected = !data ? this.getSelected() : lang.isArray(data) ? data : [data],
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
				var str = '', arr = [], reg = /\?/, speReg = /resource=\/identity\/credentials/g,
					f = reg.test(this.target),
					speFlag = speReg.test(this.target),
					param, i;

				if(param = this.param){
					for(i in param){
						arr.push(i+'='+param[i]);
					}

					str += arr.join('%26');
					//str = f &&!speFlag ? '&' + str : '?' + str;
					str = f &&!speFlag ? '%26' + str : '?' + str;
				}

                /*
				if(this.pagination && this.bPage){
					str += (f || reg.test(str) ? '&': '?') + 'page.page=' + this.curPage;
					str += '&page.size=' + this.pageSize;
				}
                */


				return this.target + str;
			},

			// choosen what store for Grid
			_createStoreClass : function(data){
				var arr = [Memory, Trackable],klass, store,
					isTree = this._getMixinKlass().indexOf('tree') !== -1;

				if(isTree){
					arr.push(TreeStore);
				}

				klass = declare(arr);
				store = new klass({data : data});

				if(isTree){
					store.getRootCollection = function () {
						return this.root.filter({ parent: undefined });
					};

					store = store.getRootCollection();
				}

				return store;
			},

			_createGridClass : function(opts){
				var arr = [OnDemandGrid, Selector],
					maps = {
						'tree' : [Tree],
                        'colHider' : [ColumnHider]
					}, klass;

				array.forEach(this._getMixinKlass(), function(kla, i){
					arr = arr.concat(maps[kla]);
				});

				klass = declare(arr);

				return new klass(opts);
			},

			_getMixinKlass : function(){
				return this.mixin ? this.mixin.split(',') : [];
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

			_updatePageSize: function(){
				var pageSizeKey = location.hash.replace('#','').replace(/\//g, '_') + '_'+this.dojoAttachPoint + '_pageSize',
					pageSize = LocalStorage.get(pageSizeKey);

				if(pageSize)this.param['pageSize'] = pageSize;
			},

			destroy : function(){
				this.grid.destroy();
				this.inherited(arguments);
				this._reusableDialog && this._reusableDialog.destroy();
				this._reusableObj && this._reusableObj.destroy();
			}

		});


		/**
		 *@ Need take this later
		 *@ For select parent need select all children
		 */

		/*
			dgrid.on('dgrid-select', function(e){
				var d = e.rows[0].data,
					grid = e.grid,
					isParent = !d.parent,
					isLeaf = d.parent && !d.hasChildren,
					id = d.id, parendId;

				if(isParent){
					array.forEach(treeMap[id], function(childId, i){
						grid.select(grid.row(childId), null, true);
					});
					return;
				}

				if(isLeaf){
					parentId = d.parent;
					if( array.every( treeMap[parentId], function(childId){return grid.isSelected(childId);} ) && !grid.isSelected(parentId) ){
						grid.select(grid.row(parentId), null, true);
					}
					return;
				}
			});
			dgrid.on('dgrid-deselect', function(e){

				var d = e.rows[0].data,
					grid = e.grid,
					isParent = !d.parent,
					isLeaf = d.parent && !d.hasChildren,
					id = d.id, parentId;

				if(isParent){
					array.forEach(treeMap[id], function(childId, i){
						grid.select(grid.row(childId), null, false);
					});
					return;
				}

				//if(isLeaf){
				//	parentId = d.parent;
				//	if( grid.isSelected(parentId) ){
				//		grid._select(grid.row(parentId), null, false);
				//		grid._changeSelectorInput(false, {rows:[grid.row(parentId)]});
				//	}
				//	return;
				//}

			});

		 */

		/**
		 *@ Example
		 *@ Tree data or structure
		 */

		/*
		this.__treeStructure = [
			    {
			        field: 'first',
			        label: 'First Name',
			        renderExpando: true
			    },
			    {
			        field: 'last',
			        label: 'Last Name'
			    },
			    {
			        field: 'age',
			        label: 'Age'
			    }
			];

			this.__treeDatas = [
				{ first: 'Bob', last: 'Barker', age: 89, id:1 },
				{ first: 'B', last: 'Barr', age: 34, id:2, parent:1, hasChildren : false  },
				{ first: 'ob', last: 'Baer', age: 8, id:3 , parent:1, hasChildren : false },
				{ first: 'b', last: 'Brker', age: 9, id:4 , parent:1, hasChildren : false },
				{ first: 'vBob', last: 'Waa', age: 77, id:5, parent:1, hasChildren : false  },
        		{ first: 'Vanna', last: 'White', age: 55, id:6 },
        		{ first: 'Va', last: 'Gray', age: 50, id:7 , parent:6, hasChildren : false },
        		{ first: 'Vna', last: 'Golden', age: 45, id:8, parent:6, hasChildren : false  },
        		{ first: 'Vnna', last: 'Green', age: 35, id:9, parent:6, hasChildren : false  },
        		{ first: 'Vaa', last: 'Yellow', age: 15, id:10, parent:6, hasChildren : false  }
			];

		*/

		/**
		 *@Example template in template
		 */

		/*
		<div data-dojo-attach-point="dgridWrap" data-dojo-type="ah/util/form/Dgrid"
			data-dojo-props="target : 'services/config/policy/networkpolicies', selectorType:'checkbox', columns : this.__structure, param : {'vocoLevel' : 1}, allowSelectAll : true, selectionMode: 'none',actionArea : 'add,edit,remove'">
		</div>

		<div data-dojo-attach-point="dgridWrap2" data-dojo-type="ah/util/form/Dgrid"
			data-dojo-props="datas : this.__treeDatas, selectorType:'checkbox', mixin:'tree', columns : this.__treeStructure, allowSelectAll : true, selectionMode: 'none',actionArea : 'add,edit,remove'">
		</div>
		*/
});
