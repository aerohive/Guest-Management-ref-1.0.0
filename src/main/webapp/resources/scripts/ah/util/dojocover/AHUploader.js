define(['dojo/_base/declare',
		'dojo/on',
		'dojo/query',
		"dojo/dom-style",
		"dojo/dom-construct",
		"dojo/dom-attr",
		"dojo/_base/lang",
		"dojo/_base/array",
		"ah/app/DataMgr",
		"dojox/form/Uploader"],function(declare, on, query, domStyle, domConstruct, domAttr,lang, array, DataMgr, Uploader){
	
		return declare('ah/util/dojocover/AHUploader',[Uploader],{

			
			startup : function(){
				this.inherited(arguments);
				this._initOtherAttr();
			},
			
			upload: function(/*Object?*/ formData){				
				// summary:
				//		When called, begins file upload. Only supported with plugins.
				formData = formData || {};
				formData.uploadType = this.uploadType;
				this.onBegin(this.getFileList());
				this.uploadWithFormData(formData);
			},
			
			uploadWithFormData: function(/*Object*/ data){
				// summary:
				//		Used with WebKit and Firefox 4+
				//		Upload files using the much friendlier FormData browser object.
				// tags:
				//		private
		
				if(!this.getUrl()){
					console.error("No upload url found.", this); return;
				}
				var fd = new FormData(), fieldName=this._getFileFieldName();
				array.forEach(this._files, function(f, i){
					fd.append(fieldName, f);
				}, this);
		
				if(data){
					data.uploadType = this.uploadType;
					for(var nm in data){
						fd.append(nm, data[nm]);
					}
				}
		
				var xhr = this.createXhr();
				xhr.setRequestHeader("X-CSRF-TOKEN", DataMgr.csrfToken);
				xhr.send(fd);
			},

            _initOtherAttr : function() {
            	if(!this.otherAttr || typeof this.otherAttr !=="object") return;

            	var inputNode = query("input[type=file]", this.domNode)[0];

                for(var k in this.otherAttr) {
            	   domAttr.set(inputNode, k, this.otherAttr[k]);
            	}

            },

            checkFile: function(type,limit) {
            	var file = this.getFileList()[0],
            	    name = file.name,
            	    size = file.size,
            	    f;
                //only support one type first
            	f= (type == this.getFileType(name)) && (this.convertBytes(size).mb <= limit);

                var errorMessage = "Please choose a ." +type.toLowerCase()+ " file and size less than 5MB";

                var errorNode = domConstruct.create("span", { 
                	innerHTML: errorMessage,
                	'class':'form-error',
                	'style':'margin-left:15px'
                 });

                if(!f) {

                	this.reset();
                	!this.errorNodeList ? this.errorNodeList = domConstruct.place(errorNode, this.domNode, "after") : this.errorNodeList.style.display = '';
                	return false;
                }
                this.errorNodeList && (this.errorNodeList.style.display = 'none');
                return true;

            }

		});
});
