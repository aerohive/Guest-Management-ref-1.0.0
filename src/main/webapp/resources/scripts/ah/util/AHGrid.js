define([
		'dojo/_base/declare',"dojox/grid/EnhancedGrid",
		'dojo/on','dojo/_base/lang',"dojo/store/Memory","dojo/data/ObjectStore", "dojo/query"
		],function(declare, EnhancedGrid, on, lang, Memory, ObjectStore, query){

		return declare('ah/util/AHGrid',[EnhancedGrid],{

			noDataMessage : 'No records found. Click <a href="javascript:void(0)">here</a> to add a new record.',

			//bReorder : false,

			autoHeight : 10,

			postCreate : function(){
				this.inherited(arguments);
				this.bindOrder();
			},

			startup : function(){
				//this.changeHeight();
				this.inherited(arguments);
				this._bindGridHeaderCellHoverEvents();

			},

			bindOrder : function(){
				if(!this.bReorder) return;

				dojo.connect(this,'onCellClick',lang.hitch(this,this._handleOrder));
			},

			_bindGridHeaderCellHoverEvents : function() {
				this.on('headerCellMouseOver', lang.hitch(this, function(e){
					this._columnHandler(e,true);
				}));
				this.on('headerCellMouseOut', lang.hitch(this, function(e){
					this._columnHandler(e,false);
				}));
			},
			_columnHandler : function(e,isActive){
				var colIndex = e.cellIndex + 1;
				var cells = query('.dojoxGridCell:nth-child('+colIndex+')', e.grid.domNode);

				cells[isActive?'addClass':'removeClass']('ah-grid-column-hover');
			},

			_handleOrder : function(e){
				var rowIndex = e.rowIndex,
					t = e.target,
					isOrder = dojo.hasClass(t,'ui-order'),
					isUp = dojo.hasClass(t,'ui-order-up'),
					isDown = dojo.hasClass(t,'ui-order-down'),
					data = this.store.objectStore.data,
					ret = lang.clone(data),i,newStore;

				if(!isOrder) return;
				if(isUp && rowIndex == 0) return;
				if(isDown && rowIndex == data.length) return;

				isUp && (i = rowIndex-1);
				isDown && (i = rowIndex+1);

				// action start
				data.splice(i,0,data.splice(rowIndex,1)[0]);

				newStore = new ObjectStore({
					objectStore : new Memory({
						data : data
					})
				});

				this.store.close();
				this.setStore(newStore);
			},

			changeHeight : function(){
				/*var dataNum = this.store.objectStore.data.length,
					maxHeight = this.maxHeight = this.maxChangeHeight || 400,
					titleHeight = this.titleHeight = this.headerChangeHeight || 36,
					rowHeight = this.rowChangeHeight || 36,
					extraHeight = 0,
				    noData = dataNum == 0 && this.noDataMessage,
					p;

				if(this.pagination){
					dataNum = this.pagination.defaultPageSize > dataNum ? dataNum : this.pagination.defaultPageSize;
					extraHeight = 24;
				}

				var realHeight = rowHeight * dataNum + titleHeight,
					lastHeight = realHeight > maxHeight ? maxHeight : realHeight;

				if(noData){
					lastHeight = lastHeight + 46;
				}
				lastHeight = lastHeight + extraHeight;

				this.domNode.style.height = lastHeight + 'px';

				if((p = this.domNode.parentNode) && p.children.length == 1){
					p.style.height = lastHeight + 'px';
				}

				this.defer(this.render,0);*/
			},

			setAutoHeight : function() {

			        this.autoHeight && this.render();

				    this.set('autoHeight',10);

				    this.resize();
			}

		});

});
