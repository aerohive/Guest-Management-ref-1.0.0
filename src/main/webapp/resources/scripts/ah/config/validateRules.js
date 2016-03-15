define([
	"dojo/_base/lang",
	'dojo/_base/array',
	'dojo/dom-class',
	'ah/util/form/Validate',
	'dojo/dom-prop',
	'dojo/dom-attr',
	'dojo/dom-construct',
	"dojo/string",
	//"ah/comp/plan/MapConstant",
	//"ah/app/utils",
	"dojo/i18n!i18n/common/nls/validate_msg"
], function (
	lang, array, domClass, Validate, domProp, domAttr, domConstruct, string, Msg
) {
	var validMsg = Msg.def,
		speValidMsg = Msg.spe;

	/**
	 *@For all validate configs
	 *@
	 */
	var defaultOpts = {
		errorClass : 'form-error'
	};



	var add = function(name,cfg){
		lang.setObject(
			name,
			lang.mixin({},defaultOpts,cfg),
			obj
		);
	};




	/************************************Need think about and rebuild these method*************************************/

	var trim = function(s) {
		var i, returnString = "";

	    for (i = 0; i < s.length; i++)
	    {
	        var c = s.charAt(i);
	        if (c != " ") returnString += c;
	    }
	    return returnString;
	};

	/*
	 * Assumes a valid address string
	 */
	var stringToIntAddress = function(address) {
	    var tokens = trim(address).split(".");
	    var intAddress = parseInt(tokens[0]);
		for (var i=1; i<4; i++) {
			intAddress <<= 8;
			intAddress += parseInt(tokens[i]);
		}
		return intAddress;
	};

    /**
     * Testing invite key
     * Should have only alpha numeric characters with -
     * @param hostname
     * @returns {boolean}
     */

    var testInviteKey = function(key) {
        var rule = /^[a-zA-Z0-9]+[a-zA-Z0-9-]+[a-zA-Z0-9]+$/;

        return rule.test(key);
    };

	/**
	 * This is for testing password strength
     * 1.at least 8 chars long
     * 2.Should have Upper case letter
     * 3.Should have 1 number
	 */
    var testPassword = function(password) {
        return /^[\x00-\x7F]*$/.test(password) && password.length > 7 && (/[A-Z]/.test(password)) && (/\d+/.test(password));
    };

    var testMaxPasswordLength = function(password) {
    	return (password.length < 33);
    }

	var testMacOui = function(macOui) {
		if(macOui.length != 6) return false;
		var rule = /^[0-9a-fA-F]{6}$/;

		return rule.test(macOui);
	};

	var testMacAddress = function(mac) {
		if(mac.length != 12) return false;
		var rule = /^[0-9a-fA-F]{12}$/;

		return rule.test(mac);
	};

	var testName = function(name) {
		var testStr = " \"";
		return testStr.split("").every(function(item) {
			return name.indexOf(item) == -1;
		});
	};

	var testMulticastMac = function(mac) {
		if(mac.length != 12) return false;
		var rule = /^[0-9a-fA-F]{1}[13579BDFbdf]{1}[0-9a-fA-F]{10}$/;

		return rule.test(mac);
	};

	/**
	 * test a validate ip address
	 */
	var testIpAddress = function(ipAddress) {
		var reg = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-4]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
		return reg.test(ipAddress);
	};

	var testAllowedVlans = function(v) {
		v = v.toLowerCase();
		if(v == "all") return true;

		var reg = /^(\d{1,4},|\d{1,4}-\d{1,4},)*(\d{1,4}|\d{1,4}-\d{1,4})$/;
		if(!reg.test(v)) return false;

		var nums=[],flag=true;
		array.forEach(v.split(","), function(item){
			if(!flag || nums.length>255) return;

			if(item.indexOf("-") == -1) {
				if(item > 4094) {
					flag = false;
				}
				nums.some(function(n) {
					if(n == item) {
						flag = false;
					}
					return n == item;
				});
				nums.push(item);
			} else {
				var min=parseInt(item.split("-")[0]), max=parseInt(item.split("-")[1]);
				if(min > max || max-min>(255-nums.length)) {
					flag = false;
				} else {
					for(var i=min;i<max;i++) {
						if(!flag || nums.length>255) return;
						if(i > 4094) {
							flag = false;
							return;
						}
						nums.some(function(n) {
							if(n == i) {
								flag = false;
							}
							return n == i;
						});
						nums.push(i);
					}
				}
			}
		})

		return flag && nums.length<=255;

	};

	/**
	 * test a validate net mask
	 */
	var testNetMask = function(netmask) {
		var reg = /^(254|252|248|240|224|192|128)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(255|254|252|248|240|224|192|128|0))$/;
		if(!reg.test(netmask)) {
			return false;
		}

		var intMask = stringToIntAddress(netmask);
//		if(intMask == 0 || intMask == -1) {
		//2014-10-8 for fix 255.255.255.255 is a valid netmask
		if(intMask == 0) {
			return false;
		}

		var bit = 1 << 31;
		for (var i=0; i<32; i++) {
			if (intMask & bit) {
				intMask <<= 1;
			} else {
				break;
			}
		}
		return intMask == 0;
	};

	/**
	 * transfer a string ip to a interger value
	 */
	var getIpAddressValue = function(ipAddress){
		ipAddress = ipAddress || "";
		var fragement = ipAddress.split(".");
		var v1 = (fragement[0]||"")*Math.pow(2,24);
		var v2 = (fragement[1]||"")*Math.pow(2,16);
		var v3 = (fragement[2]||"")*Math.pow(2,8);
		var v4 = (fragement[3]||"")*Math.pow(2,0);
		return v1 + v2 + v3 + v4;
	};




	/*************************************************************************/





	/***********************************Rebuild these method as below**************************************/
	/* difference with max is this can support function */
	Validate.addMethod("maxSF", function(value, element, param){
		var param = 'function' === typeof param ? param.call(this.context) : param;
		return this.optional(element) || value <= param;
	}, validMsg.max);

	Validate.addMethod("multicastMac", function(value, element, param){
		return this.optional(element) || testMulticastMac(value);
	}, speValidMsg.multicastMac);

	Validate.addMethod("notMulticastMac", function(value, element, param){
		return this.optional(element) || !testMulticastMac(value);
	}, speValidMsg.notMulticastMac);

    Validate.addMethod("inviteKey", function(value, element, param){
        var params = 'function' === typeof param ? param.call(this.context) : param;
        if(!params) return true;
        return this.optional(element) || (testInviteKey(value));
    }, speValidMsg.inviteKey);

    /*
    For password strength validation
     */
    Validate.addMethod("validatePassword", function(value, element, param){
        var params = 'function' === typeof param ? param.call(this.context) : param;
        if(!params) return true;
        return this.optional(element) || testPassword(value);
    }, speValidMsg.validatePassword);

    Validate.addMethod("maxPasswordLength", function(value, element, param){
        var params = 'function' === typeof param ? param.call(this.context) : param;
        if(!params) return true;
        return this.optional(element) || testMaxPasswordLength(value);
    }, speValidMsg.maxPasswordLength);

	Validate.addMethod("allowedVlans", function(value, element, param){
		return this.optional(element) || testAllowedVlans(value);
	}, speValidMsg.allowedVlans);

	/**
	 * two ip in a same subnet
	 * param : ["192.168.1.101", "Static IP Address", "192.168.1.1", "Default Gateway", "255.255.0.0"]
	 */
	Validate.addMethod("ipInSubnet", function(value, element, param){
		var params = 'function' === typeof param ? param.call(this.context) : param;
		if(!params) return true;
		if(params.length <5) return true;
		if(params[0] == "" || params[2] == "" || params[4] == "") return true;
		if(!testIpAddress(params[0]) || !testIpAddress(params[2]) || !testNetMask(params[4])) return true;

		var ipValue1 = getIpAddressValue(params[0]);
		var ipValue2 = getIpAddressValue(params[2]);

		var maxValue = Math.max(ipValue1, ipValue2);
		var minValue = Math.min(ipValue1, ipValue2);

		var maskValue = getIpAddressValue(params[4]);
		var s = minValue & maskValue;
		var startIpValue = s < 0 ? Math.pow(2,32)+s : s;

		var ipCount = Math.pow(2,32) - maskValue;

		if ( maxValue >= (startIpValue + ipCount) ){
			return false;
		}

		return true;
	}, function(param) {
		var params = 'function' === typeof param ? param.call(this.validator.context) : param;
		if(!params) return "";
		return lang.replace(speValidMsg.ipInSubnet, [params[1], params[3]]);
	});

	Validate.addMethod("specRange", function(value, element, param){
		var params = 'function' === typeof param ? param.call(this.context) : param;
		var type = params.unit,
			minValue = params.minValue,
			maxValue = params.maxValue;
		switch (type){
			case "SEC":
			value = value;
			break;
			case "MINUTE":
			value = value * 60;
			break;
			case "HOUR":
			value = value * 3600;
			break;
			case "DAY":
			value = value * 3600 * 24;
			break;
		}
		return this.optional(element) || (value>=minValue && value<=maxValue);
	}, "");

	Validate.addMethod("multicastIp", function(ipAddress, element, param){
		var params = 'function' === typeof param ? param.call(this.context) : param;
		if(!params) return true;

		if(this.optional(element)) {
			return true;
		}

		if(!testIpAddress(params.value)) {
			return false;
		}

		var intIpAddress = stringToIntAddress(params.value);
		if(intIpAddress < -536870656 || intIpAddress>-268435457) {
			return false;
		}
		return true;
	}, speValidMsg.multicastIp);


	Validate.addMethod("ipObjectSaved", function(ipObject, element, param){
		if (this.optional(element)) return true;
		var params = 'function' === typeof param ? param.call(this.context) : this.context[param].isSaved();
		return params;
	}, speValidMsg.ipObjectSaved);

	Validate.addMethod("childLength", function(val, element, param){
		var params = 'function' === typeof param ? param.call(this.context) : param;
		return params;
	}, speValidMsg.childLength);




	/*************************************************************************/










	/********************************Standard way*****************************************/

	Validate.addMethod("permission", function(value, element, param){
		return value == 'true';
	}, speValidMsg.permission);

	Validate.addMethod("nameChar", function(value, element, param){
		var reg = /[^\da-zA-Z@\-_\.]/;
		return this.optional(element) || !reg.test(value);
	}, speValidMsg.nameChar);


	Validate.addMethod("hmChar", function(value, element, param){
		var allowKey = [32,33,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,
                      51,52,53,54,55,56,57,58,59,60,61,62,64,65,66,67,68,69,
                      70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,
                      89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,
                      106,107,108,109,110,111,112,113,114,115,116,117,118,119,
                      120,121,122,123,124,125,126],
			i, len, dd;

		for(i = 0, len = value.length; i < len; i++){
			if(allowKey.indexOf((dd = value[i]).charCodeAt()) === -1){
				return [dd];
			};
		}

		return true;

	}, speValidMsg.hmChar);


	Validate.addMethod('snLength', function(value, element, param){
		return this.optional(element) || (function () {
			var sNos = value.trim().split(/\s*,\s*/),
				reg = new RegExp('(^[a-zA-Z0-9]{'+param+'}$)');
			return array.every(sNos, function (item) {
				return item.length === param && reg.test(item);
			});
		})();
	}, Validate.format(speValidMsg.snLength));

	Validate.addMethod("integer", function(value, element, param){
		var reg = /^[1-9]\d*$/;
		return this.optional(element) || reg.test(value);
	}, speValidMsg.integer);

	Validate.addMethod("positive", function(value, element, param){
		var params = 'function' === typeof param ? param.call(this.context) : param;
		if(!params) return true;
		var reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
		return this.optional(element) || reg.test(value);
	}, speValidMsg.positive);

	Validate.addMethod("positiveAnd0", function(value, element, param){
		var params = 'function' === typeof param ? param.call(this.context) : param;
		if(!params) return true;
		var reg = /^\d+(\.\d+)?$/;
		return this.optional(element) || reg.test(value);
	}, speValidMsg.positiveAnd0);

	Validate.addMethod('positiveInt', function(value, element, param) {
		var params = 'function' === typeof param ? param.call(this.context) : param;
		if (!params) return true;
		var reg = /^[1-9]\d*$/;
		return this.optional(element) || reg.test(value);
	}, speValidMsg.positiveInt);

	Validate.addMethod("wordChar", function(value, element, param){
		return this.optional(element) || /^[A-Za-z]{1}[\w\-]*$/g.test(value);
	}, speValidMsg.wordChar);


	Validate.addMethod("multipleEmail", function(val, element, param){
		var params = 'function' === typeof param ? param.call(this.context) : param;
		if(!params) return true;
		var emails = val.split(';'),
        reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		return this.optional(element) || array.every(emails,function(item){
											return reg.test(item);
										});

	}, speValidMsg.multipleEmail);

	Validate.addMethod('ip', function(val, element, param){
		return this.optional(element) || /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-4]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/.test(val);
	}, speValidMsg.ip);

	Validate.addMethod('domain', function(val, element, param){
		return this.optional(element) || /^([a-zA-Z0-9]{0,61}|[a-zA-Z0-9][-a-zA-Z0-9]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][-a-zA-Z0-9]{0,61}[a-zA-Z0-9]))*$/.test(val);
	}, speValidMsg.domain);

	Validate.addMethod('wildcardHostName', function (val, element) {
		// host.name.com || *.host.name.com || host.name.com.*
		return this.optional(element) || /^(?:\*\.)?\w+(?:\.\w+)+$/.test(val) || /^(?:\w+)(?:\.\w+)+(?:\.\*)?$/.test(val);
	}, speValidMsg.wildcardHostName);

	Validate.addMethod('ipOrIpRange', function (val, element) {
		return this.optional(element) || (function () {
			if (testIpAddress(val)) {
				return true;
			}

			var parts = val.split('-');
			var low = parts[0];
			var high = parts[1];

			if (!testIpAddress(low) || !testIpAddress(high)) {
				return false;
			}

			var lowParts = low.split('.').map(Number);
			var highParts = high.split('.').map(Number);

			return lowParts.reduce(function (ret, lowVal, index) {
				var flag = (index === lowParts.length - 1) ? (lowVal < highParts[index]) : (lowVal === highParts[index])
				return ret && flag;
			}, true);
		})();
	}, speValidMsg.ipOrIpRange);

	Validate.addMethod('netmask', function(val, element, param){
		return this.optional(element) || testNetMask(val);
	}, speValidMsg.netmask);

	Validate.addMethod("macAddress", function(value, element, param){
		return this.optional(element) || testMacAddress(value);
	}, speValidMsg.macAddress);

	Validate.addMethod("name", function(value, element, param){
		return this.optional(element) || testName(value);
	}, speValidMsg.name);

	Validate.addMethod("macoui", function(value, element, param){
		return this.optional(element) || testMacOui(value);
	}, speValidMsg.macoui);

	Validate.addMethod("fn", function(value, element, param){
		var flag = param.call(this.context);

		return this.optional(element) || flag;

	}, speValidMsg.fn);


	// for user account password complicate validate
	Validate.addMethod('accountPassword',function(v, element, param){

		var regMap = {
			bLen : /[a-zA-Z]/,
			bNum : /\d/,
			bSpe : /[!|`'@#$%&*()~\^\[\]{}+,\-.\/:;<=>]/
		};

		return this.optional(element) || lang.hitch(this.context,function(){

											var map = {
													bLen : this.bLen,
			   										bNum : this.bNumber,
			   										bSpe : this.bSpecial
												},
			   									charType = this.charType,
			   									o = [], arr = [], i, dd, f, d, n = 0;

											for(i in map){
												if(map[i]){
													o.push(regMap[i]);
												}else{
													arr.push(regMap[i]);
												}
											}

											d = array.some(arr,function(reg){
													return reg.test(v);
												});

											if(d){
												return false;
											}

											switch(this.charType){
												case 'ALL_SELECTED_CHARACTER_TYPES' :
													f = array.every(o,function(reg){ return reg.test(v); });
													break;
												case 'ANY_SELECTED_CHARACTER_TYPES' :
													f = array.some(o,function(reg){
														return reg.test(v);
													});
													break;
												case 'ONLY_ONE_CHARACTER_TYPE':
													array.forEach(o,function(reg){
														if(reg.test(v)) n++;
													});

													f = n == 1;
													break;
												default:
													break;
											}

											return f;

											})();

	}, speValidMsg.accountPassword);


	Validate.addMethod('vlanrange', function (value, element) {
		return this.optional(element) || lang.hitch(this.context, function () {
			var parts = ('' + value).split(',');
			var part_pattern = /^\d+(-\d+)?$/;

			var isValid = parts.every(function (part) {
				if (part_pattern.test(part)) {
					var p = part.split('-');
					return p.length <= 1 || +p[0] < +p[1];
				} else {
					return false;
				}
			});

			// individual number value or
			// number range values(end value must be greater than begin value)
			if (!isValid) { return false; }

			var numbers = parts.sort(function (a, b) {
				return +a.split('-')[0] - b.split('-')[0];
			}).reduce(function (ret, val) {
				ret.push.apply(ret, val.split('-').map(Number));
				return ret;
			}, []);

			// inject boundary values
			numbers.unshift(0);
			numbers.push(4095);

			// rear value must be greater than prior value
			// and the whole range must be within 0~4095, exclusively
			return numbers.every(function (num, idx, nums) {
				return idx === 0 || num > nums[idx - 1];
			});
		})();
	}, speValidMsg.vlanrange);

	Validate.addMethod('paramRequestList', function (value, element) {
		return this.optional(element) || lang.hitch(this.context, function () {
			if (domProp.get(element, 'readonly') && value === 'Default') {
				return true;
			}

			var sameEntryExists = /,(\d+,).*\1/.test(',' + value + ',');
			if (sameEntryExists) {
				return false;
			}

			var parts = value.split(',');
			var numpattern = /^\d+$/;

			var isValid = array.every(parts, function (part) {
				return numpattern.test(part) && +part >= 1 && +part <= 256;
			});

			return isValid;
		})();
	}, speValidMsg.paramRequestList);

	Validate.addMethod('stdRadAttrRange', function (value, element, range) {
		if (this.optional(element)) { return true; }
		if (element.disabled) { return true; }

		// eliminate all white spaces
		value = ('' + value).replace(/\s+/g, '');

		var parts = value.split(',');
		var part_pattern = /^\d+(-\d+)?$/;

		var isValid = parts.every(function (part) {
			if (part_pattern.test(part)) {
				var p = part.split('-');
				return p.length <= 1 || +p[0] < +p[1];
			} else {
				return false;
			}
		});

		if (!isValid) { return false; }

		parts = parts.sort(function (a, b) {
			return +a.split('-')[0] - b.split('-')[0];
		});

		var first = +parts[0].split('-')[0];
		var last = +parts.pop().split('-').pop();
		return first >= range[0] && last <= range[1];
	}, Validate.format(speValidMsg.stdRadAttrRange));

	Validate.addMethod('forbiddenWords', function (value, element, words) {
		return this.optional(element) || array.indexOf(words, value.toLowerCase()) === -1;
	}, Validate.format(speValidMsg.forbiddenWords));

	//for ssid ASCII key
	Validate.addMethod('asciikey', function(value){
		var reg = /\s|\:/g;
		return !reg.test(value);
	}, speValidMsg.asciikey);

	//for user group cycle compare
	Validate.addMethod('shorterTo', function(value, element, param) {
		var params = param.call(this.context);

		if(!params) {
			return true;
		}

		return this.optional(element) || (value - 0 < params.value);
	}, speValidMsg.shorter);

	/*for idm user password valid*/
	Validate.addMethod('authPassword', function(value, element, param) {
		var params = (typeof param === 'function') ? param.call(this.context) : param;
		/* please return the follow data
		return {
			bNum: boolean,
			bLetter: boolean,
			bSpecial: boolean,
			length: number
		}*/
		if (!params) {
			return true;
		}
		return this.optional(element) || lang.hitch(this, function() {
			var regMap = {
					bLetter: /[a-zA-Z]/,
					bNum: /\d/,
					bSpecial: /[!|`'@#$%&*()~\^\[\]{}+,\-.\/:;<=>]/
				},
				f = true;
			if (typeof params === 'object') {
				f = params.bNum || !regMap.bNum.test(value);
				f = f && (params.bLetter || !regMap.bLetter.test(value));
				f = f && (params.bSpecial || !regMap.bSpecial.test(value));
				f = f && (params.length <= value.length);
			}
			return f;
		})();
	}, function(param) {
		var params = (typeof param === 'function') ? param.call(this.validator.context) : param,
			str = '';
		if (!params.bNum) {
			str += speValidMsg.authPwd.num;
		}
		if (!params.bLetter) {
			str = str + (str.length ? speValidMsg.authPwd.andLetter : speValidMsg.authPwd.letter);
		}
		if (!params.bSpecial) {
			str = str + (str.length ? speValidMsg.authPwd.andSpeChar : speValidMsg.authPwd.specChar);
		}
		if (str.length) {
			return lang.replace(speValidMsg.authPwd.msg, [str, params.length]);
		}
		return lang.replace(speValidMsg.authPwdLen, [params.length]);
	});

	//for notification template url validate
	Validate.addMethod('validURL', function(value, element, param){
		var reg = /^((https?|ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
		return this.optional(element) ||  reg.test(value);
	}, speValidMsg.validURL);

	/*** for registerUI phoneValidate ***/
	Validate.addMethod('phone', function(value, element, param){
		var countCode = element.children[0].value.substring(1),
		    phoneNum = element.children[1].value,
				result = false;

		if(countCode.length > 4){
			return false;
		}

		if(countCode.length > 31){
			return false;
		}

		if(!countCode){
			return phoneNum ? false : true;
		}

		if(countCode && !phoneNum){
			return true;
		}

		try{
			var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance();
			for(var i=0;i<allData.length;i++){
				if(countCode == allData[i].value){
				 	var number = phoneUtil.parseAndKeepRawInput(phoneNum, allData[i].sname);
				 	result = phoneUtil.isValidNumberForRegion(number,allData[i].sname);
				 	if(result){
				 		break;
				 	}
				}
			}
			}catch(e){
				return false;
			}
		return result;
	}, speValidMsg.validTelephoneNum);

	Validate.addMethod('emailAndPhone', function(value, element, param){
		var reg = /@/g,
				regTel = /^[\d-+#*()\s\.]+$/,
				regNum = /[^0-9]+/g,
				regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if(reg.test(value)){
			return regEmail.test(value);
		}

		if(regTel.test(value)){
			var len = value.replace(regNum,'').length;
			return (len >= 7 && len <=32);        
		}

		// var len = value.match(regTel) && value.match(regTel).length;

		// if(len == 1){
		// 	var arr = value.split('-'),
		// 			a1 = arr[0].match(regNum) && true,
		// 			a2 = arr[1].match(regNum) && true;
		// 	return a1 && a2;
		// }

		return false;
	}, speValidMsg.telephoneAndEmail);

	var allData = [
		{'sname':'AF','name':'Afghanistan','value':'93'},
		{'sname':'AX','name':'Aland Islands','value':'358'},
		{'sname':'AL','name':'Albania','value':'355'},
		{'sname':'DZ','name':'Algeria','value':'213'},
		{'sname':'AS','name':'American Samoa','value':'684'},
		{'sname':'AD','name':'Andorra','value':'376'},
		{'sname':'AO','name':'Angola','value':'244'},
		{'sname':'AI','name':'Anguilla','value':'1264'},
		{'sname':'AQ','name':'Antarctica','value':'672'},
		{'sname':'AG','name':'Antigua And Barbuda','value':'1268'},
		{'sname':'AR','name':'Argentina','value':'54'},
		{'sname':'AM','name':'Armenia','value':'374'},
		{'sname':'AW','name':'Aruba','value':'297'},
		{'sname':'AU','name':'Australia','value':'61'},
		{'sname':'AT','name':'Austria','value':'43'},
		{'sname':'AZ','name':'Azerbaijan','value':'994'},
		{'sname':'BS','name':'Bahamas','value':'1242'},
		{'sname':'BH','name':'Bahrain','value':'973'},
		{'sname':'BD','name':'Bangladesh','value':'880'},
		{'sname':'BB','name':'Barbados','value':'1246'},
		{'sname':'BY','name':'Belarus','value':'375'},
		{'sname':'BE','name':'Belgium','value':'32'},
		{'sname':'BZ','name':'Belize','value':'501'},
		{'sname':'BJ','name':'Benin','value':'229'},
		{'sname':'BM','name':'Bermuda','value':'1441'},
		{'sname':'BT','name':'Bhutan','value':'975'},
		{'sname':'BO','name':'Bolivia','value':'591'},
		{'sname':'BA','name':'Bosnia And Herzegovina','value':'387'},
		{'sname':'BW','name':'Botswana','value':'267'},
		{'sname':'BR','name':'Brazil','value':'55'},
		{'sname':'IO','name':'British Indian Ocean Territory','value':'246'},
		{'sname':'BN','name':'Brunei Darussalam','value':'673'},
		{'sname':'BG','name':'Bulgaria','value':'359'},
		{'sname':'BF','name':'Burkina Faso','value':'226'},
		{'sname':'BI','name':'Burundi','value':'257'},
		{'sname':'KH','name':'Cambodia','value':'855'},
		{'sname':'CM','name':'Cameroon','value':'237'},
		{'sname':'CA','name':'Canada','value':'1'},
		{'sname':'CV','name':'Cape Verde','value':'238'},
		{'sname':'KY','name':'Cayman Islands','value':'1345'},
		{'sname':'CF','name':'Central African Republic','value':'236'},
		{'sname':'TD','name':'Chad','value':'235'},
		{'sname':'CL','name':'Chile','value':'56'},
		{'sname':'CN','name':'China','value':'86'},
		{'sname':'CX','name':'Christmas Island','value':'61'},
		{'sname':'CC','name':'Cocos (keeling) Islands','value':'61'},
		{'sname':'CO','name':'Colombia','value':'57'},
		{'sname':'KM','name':'Comoros','value':'269'},
		{'sname':'CG','name':'Congo','value':'242'},
		{'sname':'CD','name':'Congo, The Democratic Republic Of The','value':'243'},
		{'sname':'CK','name':'Cook Islands','value':'682'},
		{'sname':'CR','name':'Costa Rica','value':'506'},
		{'sname':'CI','name':'Cote D\'ivoire','value':'225'},
		{'sname':'HR','name':'Croatia','value':'385'},
		{'sname':'CU','name':'Cuba','value':'53'},
		{'sname':'CY','name':'Cyprus','value':'357'},
		{'sname':'CZ','name':'Czech Republic','value':'420'},
		{'sname':'DK','name':'Denmark','value':'45'},
		{'sname':'DJ','name':'Djibouti','value':'253'},
		{'sname':'DM','name':'Dominica','value':'1767'},
		{'sname':'DO','name':'Dominican Republic','value':'1809'},
		{'sname':'EC','name':'Ecuador','value':'593'},
		{'sname':'EG','name':'Egypt','value':'20'},
		{'sname':'SV','name':'El Salvador','value':'503'},
		{'sname':'GQ','name':'Equatorial Guinea','value':'240'},
		{'sname':'ER','name':'Eritrea','value':'291'},
		{'sname':'EE','name':'Estonia','value':'372'},
		{'sname':'ET','name':'Ethiopia','value':'251'},
		{'sname':'FK','name':'Falkland Islands (malvinas)','value':'500'},
		{'sname':'FO','name':'Faroe Islands','value':'298'},
		{'sname':'FJ','name':'Fiji','value':'679'},
		{'sname':'FI','name':'Finland','value':'358'},
		{'sname':'FR','name':'France','value':'33'},
		{'sname':'GF','name':'French Guiana','value':'594'},
		{'sname':'PF','name':'French Polynesia','value':'689'},
		{'sname':'GA','name':'Gabon','value':'241'},
		{'sname':'GM','name':'Gambia','value':'220'},
		{'sname':'GE','name':'Georgia','value':'995'},
		{'sname':'DE','name':'Germany','value':'49'},
		{'sname':'GH','name':'Ghana','value':'233'},
		{'sname':'GI','name':'Gibraltar','value':'350'},
		{'sname':'GR','name':'Greece','value':'30'},
		{'sname':'GL','name':'Greenland','value':'299'},
		{'sname':'GD','name':'Grenada','value':'1473'},
		{'sname':'GP','name':'Guadeloupe','value':'590'},
		{'sname':'GU','name':'Guam','value':'1671'},
		{'sname':'GT','name':'Guatemala','value':'502'},
		{'sname':'GG','name':'Guernsey','value':'44'},
		{'sname':'GN','name':'Guinea','value':'224'},
		{'sname':'GW','name':'Guinea-bissau','value':'245'},
		{'sname':'GY','name':'Guyana','value':'592'},
		{'sname':'HT','name':'Haiti','value':'509'},
		{'sname':'HN','name':'Honduras','value':'504'},
		{'sname':'HK','name':'Hong Kong','value':'852'},
		{'sname':'HU','name':'Hungary','value':'36'},
		{'sname':'IS','name':'Iceland','value':'354'},
		{'sname':'IN','name':'India','value':'91'},
		{'sname':'ID','name':'Indonesia','value':'62'},
		{'sname':'IR','name':'Iran, Islamic Republic Of','value':'98'},
		{'sname':'IQ','name':'Iraq','value':'964'},
		{'sname':'IE','name':'Ireland','value':'353'},
		{'sname':'IM','name':'Isle Of Man','value':'44'},
		{'sname':'IL','name':'Israel','value':'972'},
		{'sname':'IT','name':'Italy','value':'39'},
		{'sname':'JM','name':'Jamaica','value':'1876'},
		{'sname':'JP','name':'Japan','value':'81'},
		{'sname':'JE','name':'Jersey','value':'44'},
		{'sname':'JO','name':'Jordan','value':'962'},
		{'sname':'KZ','name':'Kazakhstan','value':'7'},
		{'sname':'KE','name':'Kenya','value':'254'},
		{'sname':'KI','name':'Kiribati','value':'686'},
		{'sname':'KP','name':'Korea, Democratic People\'s Republic Of','value':'850'},
		{'sname':'KR','name':'Korea, Republic Of','value':'82'},
		{'sname':'KW','name':'Kuwait','value':'965'},
		{'sname':'KG','name':'Kyrgyzstan','value':'996'},
		{'sname':'LA','name':'Lao People\'s Democratic Republic','value':'856'},
		{'sname':'LV','name':'Latvia','value':'371'},
		{'sname':'LB','name':'Lebanon','value':'961'},
		{'sname':'LS','name':'Lesotho','value':'266'},
		{'sname':'LR','name':'Liberia','value':'231'},
		{'sname':'LY','name':'Libyan Arab Jamahiriya','value':'218'},
		{'sname':'LI','name':'Liechtenstein','value':'423'},
		{'sname':'LT','name':'Lithuania','value':'370'},
		{'sname':'LU','name':'Luxembourg','value':'352'},
		{'sname':'MO','name':'Macao','value':'853'},
		{'sname':'MK','name':'Macedonia, The Former Yugoslav Republic Of','value':'389'},
		{'sname':'MG','name':'Madagascar','value':'261'},
		{'sname':'MW','name':'Malawi','value':'265'},
		{'sname':'MY','name':'Malaysia','value':'60'},
		{'sname':'MV','name':'Maldives','value':'960'},
		{'sname':'ML','name':'Mali','value':'223'},
		{'sname':'MT','name':'Malta','value':'356'},
		{'sname':'MH','name':'Marshall Islands','value':'692'},
		{'sname':'MQ','name':'Martinique','value':'596'},
		{'sname':'MR','name':'Mauritania','value':'222'},
		{'sname':'MU','name':'Mauritius','value':'230'},
		{'sname':'YT','name':'Mayotte','value':'262'},
		{'sname':'MX','name':'Mexico','value':'52'},
		{'sname':'FM','name':'Micronesia, Federated States Of','value':'691'},
		{'sname':'MD','name':'Moldova','value':'373'},
		{'sname':'MC','name':'Monaco','value':'377'},
		{'sname':'MN','name':'Mongolia','value':'976'},
		{'sname':'ME','name':'Montenegro','value':'382'},
		{'sname':'MS','name':'Montserrat','value':'1664'},
		{'sname':'MA','name':'Morocco','value':'212'},
		{'sname':'MZ','name':'Mozambique','value':'258'},
		{'sname':'MM','name':'Myanmar','value':'95'},
		{'sname':'NA','name':'Namibia','value':'264'},
		{'sname':'NR','name':'Nauru','value':'674'},
		{'sname':'NP','name':'Nepal','value':'977'},
		{'sname':'NL','name':'Netherlands','value':'31'},
		{'sname':'AN','name':'Netherlands Antilles','value':'599'},
		{'sname':'NC','name':'New Caledonia','value':'687'},
		{'sname':'NZ','name':'New Zealand','value':'64'},
		{'sname':'NI','name':'Nicaragua','value':'505'},
		{'sname':'NE','name':'Niger','value':'227'},
		{'sname':'NG','name':'Nigeria','value':'234'},
		{'sname':'NU','name':'Niue','value':'683'},
		{'sname':'NF','name':'Norfolk Island','value':'672'},
		{'sname':'MP','name':'Northern Mariana Islands','value':'1'},
		{'sname':'NO','name':'Norway','value':'47'},
		{'sname':'OM','name':'Oman','value':'968'},
		{'sname':'PK','name':'Pakistan','value':'92'},
		{'sname':'PW','name':'Palau','value':'680'},
		{'sname':'PS','name':'Palestinian Territory, Occupied','value':'970'},
		{'sname':'PA','name':'Panama','value':'507'},
		{'sname':'PG','name':'Papua New Guinea','value':'675'},
		{'sname':'PY','name':'Paraguay','value':'595'},
		{'sname':'PE','name':'Peru','value':'51'},
		{'sname':'PH','name':'Philippines','value':'63'},
		{'sname':'PL','name':'Poland','value':'48'},
		{'sname':'PT','name':'Portugal','value':'351'},
		{'sname':'PR','name':'Puerto Rico','value':'1809'},
		{'sname':'QA','name':'Qatar','value':'974'},
		{'sname':'RE','name':'Reunion','value':'262'},
		{'sname':'RO','name':'Romania','value':'40'},
		{'sname':'RU','name':'Russian Federation','value':'7'},
		{'sname':'RW','name':'Rwanda','value':'250'},
		{'sname':'BL','name':'Saint BarthElemy','value':'590'},
		{'sname':'SH','name':'Saint Helena','value':'290'},
		{'sname':'KN','name':'Saint Kitts And Nevis','value':'1869'},
		{'sname':'LC','name':'Saint Lucia','value':'1758'},
		{'sname':'MF','name':'Saint Martin','value':'590'},
		{'sname':'PM','name':'Saint Pierre And Miquelon','value':'508'},
		{'sname':'VC','name':'Saint Vincent And The Grenadines','value':'1784'},
		{'sname':'WS','name':'Samoa','value':'685'},
		{'sname':'SM','name':'San Marino','value':'378'},
		{'sname':'ST','name':'Sao Tome And Principe','value':'239'},
		{'sname':'SA','name':'Saudi Arabia','value':'966'},
		{'sname':'SN','name':'Senegal','value':'221'},
		{'sname':'RS','name':'Serbia','value':'381'},
		{'sname':'SC','name':'Seychelles','value':'248'},
		{'sname':'SL','name':'Sierra Leone','value':'232'},
		{'sname':'SG','name':'Singapore','value':'65'},
		{'sname':'SK','name':'Slovakia','value':'421'},
		{'sname':'SI','name':'Slovenia','value':'386'},
		{'sname':'SB','name':'Solomon Islands','value':'677'},
		{'sname':'SO','name':'Somalia','value':'252'},
		{'sname':'ZA','name':'South Africa','value':'27'},
		{'sname':'ES','name':'Spain','value':'34'},
		{'sname':'LK','name':'Sri Lanka','value':'94'},
		{'sname':'SD','name':'Sudan','value':'249'},
		{'sname':'SR','name':'Suriname','value':'597'},
		{'sname':'SJ','name':'Svalbard And Jan Mayen','value':'47'},
		{'sname':'SZ','name':'Swaziland','value':'268'},
		{'sname':'SE','name':'Sweden','value':'46'},
		{'sname':'CH','name':'Switzerland','value':'41'},
		{'sname':'SY','name':'Syrian Arab Republic','value':'963'},
		{'sname':'TW','name':'Taiwan, Province Of China','value':'886'},
		{'sname':'TJ','name':'Tajikistan','value':'992'},
		{'sname':'TZ','name':'Tanzania, United Republic Of','value':'255'},
		{'sname':'TH','name':'Thailand','value':'66'},
		{'sname':'TL','name':'Timor-leste','value':'670'},
		{'sname':'TG','name':'Togo','value':'228'},
		{'sname':'TK','name':'Tokelau','value':'690'},
		{'sname':'TO','name':'Tonga','value':'676'},
		{'sname':'TT','name':'Trinidad And Tobago','value':'1868'},
		{'sname':'TN','name':'Tunisia','value':'216'},
		{'sname':'TR','name':'Turkey','value':'90'},
		{'sname':'TM','name':'Turkmenistan','value':'993'},
		{'sname':'TC','name':'Turks And Caicos Islands','value':'1649'},
		{'sname':'TV','name':'Tuvalu','value':'688'},
		{'sname':'UG','name':'Uganda','value':'256'},
		{'sname':'UA','name':'Ukraine','value':'380'},
		{'sname':'AE','name':'United Arab Emirates','value':'971'},
		{'sname':'GB','name':'United Kingdom','value':'44'},
		{'sname':'US','name':'United States','value':'1'},
		{'sname':'UY','name':'Uruguay','value':'598'},
		{'sname':'UZ','name':'Uzbekistan','value':'998'},
		{'sname':'VU','name':'Vanuatu','value':'678'},
		{'sname':'VA','name':'Vatican City State','value':'379'},
		{'sname':'VE','name':'Venezuela','value':'58'},
		{'sname':'VN','name':'Viet Nam','value':'84'},
		{'sname':'VG','name':'Virgin Islands','value':'1340'},
		{'sname':'WF','name':'Wallis And Futuna','value':'681'},
		{'sname':'YE','name':'Yemen','value':'967'},
		{'sname':'ZM','name':'Zambia','value':'260'},
		{'sname':'ZW','name':'Zimbabwe','value':'263'}
  ];


	// for exports
	var obj = {

	};

	add('util.macObject',{
		rules : {
			'nameEl' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'macAddress' : {
				required : true,
				macAddress : true
			},
			'ipRange1' : {
				required : true,
				macAddress : true
			},
			'ipRange2' : {
				required : true,
				macAddress : true
			},
			'macOui' : {
				required : true,
				macoui : true
			}
		}
	});

	add('util.ipobject',{
		rules : {
			'nameEl' : {
				required : true,
				maxlength : 32
			},
			'ipAddress' : {
				required : true,
				ip : true
			},
			'hostName' : {
				required : true,
				domain : true
			},
			'subnetIp' : {
				required : true,
				ip : true
			},
			'subnetMask' : {
				required : true,
				netmask : true
			},
			'ipRange1' : {
				required : true,
				ip : true
			},
			'ipRange2' : {
				required : true,
				ip : true
			}
		},
		errorPlacement: function(label,element){
			var attr = element.getAttribute('data-dojo-attach-point');
			if(attr == 'subnetIp' || attr == 'subnetMask'){
				label.style.marginLeft = '0';
				var ctn = domConstruct.toDom('<div></div>');
				(attr == 'subnetIp') && (domClass.add(ctn, "fn-left"));
				(attr == 'subnetMask') && (ctn.style.marginLeft = "220px");
				ctn.appendChild(label);
				domConstruct.place(ctn, this.subnetMask.parentNode,'last');
			}else{
				domConstruct.place(label,element,'after');
			}
		}
	});

	add('util.bonjourService', {
		rules: {
			'nameNode': {
				required: true,
				maxlength: 32
			},
			'typeNode': {
				required: true,
				maxlength: 64
			}
		}
	});

	add('util.vlanGroup', {
		rules: {
			'nameNode': {
				required: true,
				forbiddenWords: ['any'],
				hmChar : true,
				maxlength: 32
			},
			'vlansNode': {
				required: true,
				maxlength: 255,
				hmChar : true,
				vlanrange: true
			},
			'descriptionNode': {
				maxlength: 64
			}
		}
	});

	add('util.applicationGroup', {
		rules: {
			'txtGroupNameNode': {
				required: true,
				maxlength: 32
			}
		},
		errorPlacement: function (label, element) {
			domConstruct.place(label, element.parentNode, 'last');
		}
	});

	add('config.policyDetail', {
		rules: {
			'policyName': {
				required: true,
				hmChar : true,
				maxlength: 32
			},
			'policyDesc': {
				maxlength: 64
			}
		}
	});

	add('config.captiveWebPortal', {
		rules : {
			'cwpName' : {
				required : true,
				nameChar : true,
				maxlength : 32
			},
			'leaseTimeDuration': {
				required: true,
				range: function(){
					var chargeValue = this.leaseTimeUnit.domNode.value == "seconds" ? 1 : this.leaseTimeUnit.domNode.value == "minutes" ? 60 : 3600,
						minValue = Math.ceil(5/chargeValue),
						maxValue = 36000/chargeValue;
					return [minValue, maxValue];
				}
			},
			'registrationTimeDuration': {
				required: true,
				range: function(){
					var maxValue = this.registrationTimeUnit.domNode.value == "minutes" ? 120960 : 2016;
					return [1, maxValue];
				}
			},
			'delayBeforeSuccessLogin' : {
				required: true,
				range: [5,60]
			},
			'delayBeforeFailureLogin': {
				required: true,
				range: [5,60]
			},
			'extLoginUrl': {
				required: true
			},
			'sharedSecret.norEl': {
				required: true
			},
			'sharedSecret.cfmEl' : {
				equalTo : 'sharedSecret.norEl'
			},

		},
		errorPlacement : function(label,element){
			var attr = element.getAttribute("data-dojo-attach-point");
			if(attr == "registrationTimeDuration" || attr == "leaseTimeDuration" || attr == "delayBeforeSuccessLogin" || attr == "delayBeforeFailureLogin"){
				label.style.marginLeft = '0';
				domConstruct.place(label,this[attr+"Error"],'first');
			} else {
				domConstruct.place(label,element,'after');
			}
		}
	});

	add('config.externalRadius',{
		rules : {
			'nameEl' : {
				required : true,
				hmChar : true,
				maxlength: 32
			},
			'desEl': {
				maxlength: 64
			},
			'ipAddress.ipEl' : {
				required : true,
				ipObjectSaved : 'ipAddress'
			},
			'sharedSecret.norEl' : {
				maxlength :64
			},
			'sharedSecret.cfmEl' : {
				equalTo : 'sharedSecret.norEl',
				maxlength: 64
			},
			'auth' : {
				required : function(el) {
					return !this.account.checked;
				}
			},
			'autPort' : {
				required : true,
				number : true,
				range: [1,65535]
			},
			'accountPort' : {
				required : true,
				number : true,
				range: [1,65535]
			}
		},
		messages : {
			'auth' : {
				required : speValidMsg.config.externalRadius.authRequired
			},
			'autPort' : {
				range : Validate.format(speValidMsg.config.externalRadius.autPortRange)
			},
			'accountPort' : {
				range : Validate.format(speValidMsg.config.externalRadius.accountPortRange)
			}
		},
		errorPlacement : function(label,element){
			if(element.getAttribute("data-dojo-attach-point") == "auth"){
				 label.style.marginLeft = '0';
				 domConstruct.place(label,this.serverTypeError,'after');
			} else {
			    domConstruct.place(label,element,'after');
			}
		}
	});

	add('idm.employGroups',{
		rules : {
			'name' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'number' : {
				range : [1, 1000]
			}
		},
		errorPlacement : function(label,element){
			label.style.marginLeft = '18px';
			domConstruct.place(label,element,'after');
		}
	});

	add('idm.printSettings',{
		rules : {
			'width' : {
				required : true,
				number : true,
				range: [0,99]
			},
			'height' : {
				required : true,
				number : true,
				range: [0,99]
			}
		}
	});

	add('config.wips',{
		rules : {
			'name' : {
				required : true,
				hmChar : true
			},
			'description' : {
				maxlength : 64
			},
			'macOui.ipEl' : {
				required : function(el) {
					return this.newMacOui.style.display != "none";
				},
				ipObjectSaved : 'macOui'
			},
			'ssidSelectList.domNode' : {
				required : function(el) {
					return this.newSsid.style.display != "none" && this.radioVal(this.ssidTypeEls) == "SSID_PROFILE";
				}
			},
			'ssid' : {
				required : function(el) {
					return this.newSsid.style.display != "none" && this.radioVal(this.ssidTypeEls) == "SSID";
				}
			},
			'disconnectedRogueClientReportDropPeriod' : {
				required : function(el) {
					return this.enableRogueClientReporting.checked;
				},
				number : true,
				range:[60,86400]
			},
			'clientDetectionAndMitigationPeriod' : {
				required : true,
				number : true,
				range: [1,600]
			},
			'consecutiveMitigationPeriods' : {
				required : true,
				number : true,
				range: [0,2592000]
			},
			'mitigationDuration' : {
				required : true,
				number : true,
				range: function() {
						if(this.mitigationDuration.value != "0") {
							var mitigationDurationUnit = this.mitigationDurationUnit.domNode.value;
							var maxRange = 2592000;
							var minRange = 60;
							if(mitigationDurationUnit == "MINUTE") {
								maxRange = 43200;
								minRange = 1;
							} else if(mitigationDurationUnit == "HOURS") {
								maxRange = 720;
								minRange = 1;
							}

							return [minRange,maxRange];
						} else {
							return [0,1];
						}
					}
			},
			'mitigationQuietPeriod' : {
				required : true,
				number : true,
				range: function() {
					if(this.mitigationQuietPeriod.value != "0") {
						var mitigationQuietPeriodUnit = this.mitigationQuietPeriodUnit.domNode.value;
						var maxRange = 2592000;
						var minRange = 60;
						if(mitigationQuietPeriodUnit == "MINUTE") {
							maxRange = 43200;
							minRange = 1;
						} else if(mitigationQuietPeriodUnit == "HOURS") {
							maxRange = 720;
							minRange = 1;
						}

						return [minRange,maxRange];
					} else {
						return [0,1];
					}
				}
			},
			'maxMitigatorAps' : {
				required : true,
				number : true,
				range: [0,1024]
			}
		},
		messages : {
			'macOui.ipEl' : {
				ipObjectSaved : speValidMsg.config.wips.macOuiIpElIpObjectSaved
			}
		},
		errorPlacement : function(label, element){
			var dataPoint = element.getAttribute('data-dojo-attach-point');
			if(this[dataPoint + "ErrorMsg"]){
				domConstruct.place(label, this[dataPoint + "ErrorMsg"], 'after');
            } else{
            	domConstruct.place(label,element,'after');
			}
		}
	});

	add('config.managementOptions',{
		rules : {
			'ipAddress' : {
				required : true,
				multicastIp : function(el) {
					return {"value":this.ipAddress.value};
				}
			},
			'netmask' : {
				required : true,
				netmask : true
			},
			'name' : {
				required : true
			},
			'limitMacSession' : {
				required : true,
				number : true,
				range : function() {
					var min = this.enableLimitMacSession.checked?1:0,max=8000;
					return [min, max];
				}
			},
			'limitIpSession' : {
				required : true,
				number : true,
				range : function() {
					var min = this.enableLimitIpSession.checked?1:0,max=8000;
					return [min, max];
				}
			},
			'tcpMaxSegment' : {
				required : true,
				number : true,
				range : function() {
					var min = !this.enableLimitIpSession.checked || this.tcpMaxSegment.value==0?0:64,max=1414;
					return [min, max];
				}
			},
			'temperatureAlarmThreshold' : {
				required : true,
				number : true,
				range : [50, 80]
			},
			'fanUnderSpeedAlarmThreshold' : {
				required : true,
				number : true,
				range : [1000, 3000]
			},
			'airtimePerSecond' : {
				required : true,
				number : true,
				range : [100, 1000]
			},
			'roamingClientGuaranteedAirtime' : {
				required : true,
				number : true,
				range : [0, 100]
			},
			'ppskServerAutoSaveInterval' : {
				required : true,
				number : true,
				range : [60, 3600]
			},
			'ledOnInterval': {
				required: true,
				number: true,
				range: [1, 100]
			},
			'ledOffInterval': {
				required: true,
				number: true,
				range: [1, 100]
			}
		},
		errorPlacement: function (label, element) {
			domConstruct.place(label, element.parentNode, 'last');
		}
	});

	add('config.firewallList',{
		ignore : false,
		rules : {
			'macFirewallDefaultAction.domNode' : {
				required : function(el) {
					if(!this.firewallSwitch.checked) return false;
					var b = this.macInFirewallGridStore && this.macInFirewallGridStore.objectStore.data.length>0;
					b = b || this.macOutFirewallGridStore && this.macOutFirewallGridStore.objectStore.data.length>0;

					return b;
				}
			},
			'ipFirewallDefaultAction.domNode' : {
				required : function(el) {
					if(!this.firewallSwitch.checked) return false;
					var b = this.ipInFirewallGridStore && this.ipInFirewallGridStore.objectStore.data.length>0;
					b = b || this.ipOutFirewallGridStore && this.ipOutFirewallGridStore.objectStore.data.length>0;

					return b;
				}
			}
		}
	});

	add('config.stormControl',{
		rules : {
			'rateLimitValue-access' : {
				required : true,
				number : true,
				range : function() {
					if(this.stormControlThresholdOption.domNode.value == "BYTE_BASED") {
						if(this["rateLimitType-access-byte_based"].domNode.value == "KBPS") {
							return [0,1000000];
						} else {
							return [0,100];
						}
					} else {
						return [0,100000000];
					}
				}
			},
			'rateLimitValue-trunk' : {
				required : true,
				number : true,
				range : function() {
					if(this.stormControlThresholdOption.domNode.value == "BYTE_BASED") {
						if(this["rateLimitType-trunk-byte_based"].domNode.value == "KBPS") {
							return [0,1000000];
						} else {
							return [0,100];
						}
					} else {
						return [0,100000000];
					}
				}
			}
		}
	});

	add('config.ppskUserGroup',{
		rules : {
			'groupName' : {
				required : true,
				hmChar : true
			},
			'countMin' : {
				number : true,
				range : [600, 86400]
			},
			'usernamePrefix' : {
				required : function(el) {
					return this.pskType.domNode.value == 'auto';
				},
				maxlength : 28
			},
			'genKey' : {
				required : function(el) {
					return  this.pskType.domNode.value == 'auto';
				}
			},
			'passwordLen' : {
				required : function(el) {
					return  this.pskType.domNode.value == 'auto';
				},
				number : true,
				range : [8, 63]
			},
			'psEls' : {
				required : true
			},

			'sDate.focusNode' : {
				required : function() {
					 return this.radioVal(this.expEls) == 'ONCE' &&
				 		this.sTime.focusNode.value != "";
				}
			},

			'sTime.focusNode' : {
				required : function() {
					return this.radioVal(this.expEls) == 'ONCE' &&
					   this.sDate.focusNode.value != "";
				}
			},

			'eDate.focusNode' : {
				required : function() {
					return this.radioVal(this.expEls) == 'ONCE' &&
						 		this.eTime.focusNode.value != "";
				}
			},

			'eTime.focusNode' : {
				required : function() {
					return this.radioVal(this.expEls) == 'ONCE' &&
						 		this.eDate.focusNode.value != "";
				}
			},

			'ppskStartDate.focusNode' : {
				required : function() {
					return this.ppskStartTime.attr('value') != null && this.ppskStartTime.attr('value') != "";
				}
			},

			'ppskStartTime.focusNode' : {
				required : true
			},

			'ppskLifetimeDays' : {
				required : true,
				number : true,
				range : [0, 365]
			},

			'ppskRotationDays' : {
				required : true,
				number : true,
				range : [0, 365]
			},

			'ppskRotationTimes' : {
				required : true,
				number : true,
				range : [1, 9999]
			},

			'ppskUsersPerRotation' : {
				required : true,
				number : true,
				range : [1, 9999]
			}

		},
		groups : {
			'psEls' : 'ps-char ps-num ps-letter'
		},
		errorPlacement : function(label, element){
			var point = element.getAttribute('data-dojo-attach-point');

			if(element.name == 'pskLevel'){
				label.style.marginLeft = '0';
				this.pskWrap.appendChild(label);
			}

			else if(element.getAttribute('data-validid') == "ppskStartDate.focusNode" || element.getAttribute('data-validid') == "ppskStartTime.focusNode"){
				domConstruct.place(label,this.ppskStartDateMsg,'after');
			}

			else if(element.getAttribute('data-validid')) {
				dojo.place(label,element.parentNode.parentNode,'after');
			}

			else if (
				point === 'countMin' ||
				point === 'passwordLen' ||
				point === 'genKey'
			) {
				element.parentNode.appendChild(label);
			}

			else{
				dojo.place(label,element,'after');
			}
		},
		messages : {
			'psEls' : {
				required : speValidMsg.config.ppskUserGroup.psElsRequired
			}
		}
	});

	add('config.localUserGroup',{
		rules : {
			'groupName' : {
				required : true,
				maxlength: 32
			},
			'countMin' : {
				required : true,
				number : true,
				range : [600, 86400]
			}

		},
		errorPlacement : function(label, element){
			var point = element.getAttribute('data-dojo-attach-point');

			if(point == 'countMin'){
				element.parentNode.appendChild(label);
			} else {
				dojo.place(label,element,'after');
			}
		}
	});

	add('config.advancedSecurity',{
		rules : {
			'gktTimeout' : {
				required : true,
				number : true,
				range: [100,8000]
			},
			'gktRetries' : {
				required : true,
				number : true,
				range: [1,10]
			},
			'ptkTimeout' : {
				required : true,
				number : true,
				range: [100,8000]
			},
			'ptkRetries' : {
				required : true,
				number : true,
				range: [1,10]
			},
			'replayWindow' : {
				required : true,
				number : true,
				range: [0,10]
			},
			'gmkInputEl' : {
				required : true,
				number : true,
				range: function() {
					if(this.enableGMK.checked) {
						var gmkUnit = this.gmkUnit.domNode.value;
						var maxRange = 50000000;
						var minRange = 600;
						if(gmkUnit == 1) {
							maxRange = 833333;
							minRange = 10;
						} else if(gmkUnit == 2) {
							maxRange = 13888;
							minRange = 1;
						} else if(gmkUnit == 3) {
							maxRange = 578;
							minRange = 1;
						}

						return [minRange,maxRange];
					} else {
						return [0,1];
					}
				}
			},
			'gtkInputEl' : {
				required : true,
				number : true,
				range: function() {
					if(this.enableGtk.checked) {
						var gtkUnit = this.gtkUnit.domNode.value;
						var maxRange = 50000000;
						var minRange = 600;
						if(gtkUnit == 1) {
							maxRange = 833333;
							minRange = 10;
						} else if(gtkUnit == 2) {
							maxRange = 13888;
							minRange = 1;
						} else if(gtkUnit == 3) {
							maxRange = 578;
							minRange = 1;
						}

						return [minRange,maxRange];
					} else {
						return [0,1];
					}
				}
			},
			'ptkInputEl' : {
				required : true,
				number : true,
				range: function() {
					if(this.enablePtk.checked) {
						return [10,50000000];
					} else {
						return [0,1];
					}
				}
			},
			'reauthInputEl' : {
				required : true,
				number : true,
				range: function() {
					if(this.enableReauth.checked) {
						var reauthUnit = this.reauthUnit.domNode.value;
						var maxRange = 86400;
						var minRange = 600;
						if(reauthUnit == 4) {
							maxRange = 86400000;
							minRange = 600000;
						}

						return [minRange,maxRange];
					} else {
						return [0,1];
					}
				}
			}
		},
		errorPlacement : function(label,element){
			if(element.getAttribute("class").indexOf("valid_area") != -1){
				 label.style.marginLeft = '0';
				 var msgNode = dojo.hasClass(this.$query(element).next()[0], "msg_area")?this.$query(element).next()[0]:this.$query(element).next().next().next()[0];
				 domConstruct.place(label,msgNode,'after');
			} else {
			    domConstruct.place(label,element,'after');
			}
		}
	});

	add('config.optionSettings',{
		rules : {
			'chaThreshold' : {
				required : function(el) {
					return this.ipUnicast.domNode.value == "AUTO";
				},
				number : true,
				range: [1,100]
			},
			'memThreshold' : {
				required : function(el) {
					return this.ipUnicast.domNode.value == "AUTO";
				},
				number : true,
				range: [1,30]
			},
			'maxClient' : {
				required : true,
				number : true,
				range: [1,100]
			},
			'eapTimeout' : {
				required : true,
				number : true,
				range: [5,300]
			},
			'rtsThreshold' : {
				required : true,
				number : true,
				range: [1,2346]
			},
			'fragThreshold' : {
				required : true,
				number : true,
				range: [256,2346]
			},
			'dtimSetting' : {
				required : true,
				number : true,
				range: [1,255]
			},
			'clientAgeout' : {
				required : true,
				number : true,
				range: [1,30]
			},
			'eapRetries' : {
				required : true,
				number : true,
				range: [1,5]
			},
			'cachUpInterval' : {
				required : true,
				number : true,
				range: [10,36000]
			},
			'cacheAgeout' : {
				required : true,
				number : true,
				range: [1,1000]
			},
			'cacheTimeout' : {
				required : true,
				number : true,
				range: [60,604800]
			}
		},
		errorPlacement : function(label,element){
			var labelContainer = domConstruct.create("div", {
				className: 'form-error-wrp',
			});
			labelContainer.appendChild(label);
			domConstruct.place(labelContainer, element.parentNode, 'last');
		}
	});

	add('config.macSSIDRuleConfig',{
		rules : {
			'probeRequestAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'probeRequestAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'probeResponseAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'probeResponseAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'assocRequestAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'assocRequestAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'assocResponseAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'assocResponseAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'disassocAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'disassocAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'authAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'authAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'deauthAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'deauthAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'eapolAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'eapolAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			}
		}
	});

	add('config.macClientRuleConfig',{
		rules : {
			'probeRequestAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'probeRequestAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'probeResponseAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'probeResponseAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'assocRequestAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'assocRequestAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'assocRequestBan' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'assocResponseAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'assocResponseAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'disassocAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'disassocAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'authAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'authAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'authBan' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'deauthAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'deauthAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'eapolAlarmThreshold' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'eapolAlarmInterval' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			},
			'eapolBan' : {
				required : true,
				number : true,
				integer: true,
				range: [0, 2000000000]
			}
		}
	});

	add('config.IPSSIDRuleConfig',{
		rules : {
			'icmpThreshold' : {
				required : true,
				number : true,
				range: [1, 100]
			},
			'icmpDuration' : {
				required : true,
				number : true,
				range: [1, 1024000]
			},
			'udpThreshold' : {
				required : true,
				number : true,
				range: [1, 100]
			},
			'udpDuration' : {
				required : true,
				number : true,
				range: [1, 1024000]
			},
			'synThreshold' : {
				required : true,
				number : true,
				range: [1, 1000000]
			},
			'synDuration' : {
				required : true,
				number : true,
				range: [1, 1024000]
			},
			'arpThreshold' : {
				required : true,
				number : true,
				range: [1, 1000000]
			},
			'arpDuration' : {
				required : true,
				number : true,
				range: [1, 1024000]
			},
			'sweepThreshold' : {
				required : true,
				number : true,
				range: [1, 10000]
			},
			'sweepDuration' : {
				required : true,
				number : true,
				range: [1, 1024000]
			},
			'portScanThreshold' : {
				required : true,
				number : true,
				range: [1, 10000]
			},
			'portScanDuration' : {
				required : true,
				number : true,
				range: [1, 1024000]
			},
			'ipSpoofThreshold' : {
				required : true,
				number : true,
				range: [2, 10]
			},
			'ipSpoofDuration' : {
				required : true,
				number : true,
				range: [1, 1024000]
			},
			'radiusAttackThreshold' : {
				required : true,
				number : true,
				range: [1, 3600]
			},
			'radiusAttackDuration' : {
				required : true,
				number : true,
				range: [1, 1024000]
			}
		}
	});

	add('config.userAccountAuto',{
		rules : {
			/*'userName' : {
				required : function(el) {
					return this.radioVal(this.pskEls) == 0;
				}
			},*/
			'email' : {
				//required : true,
				multipleEmail : true
			},
			'numAccount' : {
				required : function(el) {
					return this.radioVal(this.pskEls) == 1;
				},
				number: true,
				range : [1, 9999]
			}
		}
	});

	add('config.userAccountManual',{
		rules : {
			'userName' : {
				required : true,
				hmChar : true
			},
			'description' : {
				maxlength : 64
			},
			'email' : {
				multipleEmail : true
			},
			'passwordEl.norEl' : {
				required : true
			},
			'passwordEl.cfmEl' : {
				required : true,
				equalTo : 'passwordEl.norEl'
			}
		},
		messages: {
			'passwordEl.cfmEl':{
				equalTo: speValidMsg.passwordNotMatch
			}
		},
		errorPlacement : function(label,element){

			if(element.getAttribute('data-validid') == 'passwordEl.cfmEl'){
				domConstruct.place(label,element.parentNode,2);
			}else{
			    domConstruct.place(label,element,'after');
			}

		}
	});

	add('config.localUserAccount',{
		rules : {
			'userName' : {
				required : true
			},
			'passwordEl.norEl' : {
				required : true,
				minlength : 8,
				maxlength : 64
			},
			'passwordEl.cfmEl' : {
				required : true,
				equalTo : 'passwordEl.norEl'
			}
		},
		messages: {
			'passwordEl.cfmEl':{
				equalTo: speValidMsg.passwordNotMatch
			}
		},
		errorPlacement : function(label,element){

			if(element.getAttribute('data-validid') == 'passwordEl.cfmEl'){
				domConstruct.place(label,element.parentNode,2);
			}else{
			    domConstruct.place(label,element,'after');
			}

		}
	});

	/*
	 * Add Bootstrap config widget
	 */
	add('deviceupdates.bootstrapConfig', {
		rules : {
			'adminName' : {
				required : true,
				minlength : 3,
				maxlength : 20
			},
			'udpPort' : {
				number : true,
				range: [1024,65535]
			},
			'adminPwd.norEl' : {
				required : true,
				minlength : 8,
				maxlength : 32,
				validatePassword: true
			},
			'adminPwd.cfmEl' : {
				required : true,
				equalTo : 'adminPwd.norEl'
			},
			primaryCapwapServer : {
				maxlength : 32
			},
			backupCapwapServer : {
				maxlength : 32
			},
			vhmName : {
				maxlength : 64
			}
		},
		messages: {
			'adminPwd.cfmEl':{
				equalTo: speValidMsg.passwordNotMatch
			}
		}
	});

	//Rules for device onboarding steps

	/*
	 * Import serial numbers widget - basically checks if each serial number entered is of a 14 digit length
	 */
	add('deviceonboarding.InputSerialNumbers', {
		rules: {
			'txtSNNode': {
				required: function () {
					return this.manualEntry.checked;
				},
				snLength: 14
			}
		}
	});

	/*
	 * Add simulated devices widget - basically checks if a number is entered
	 */
	add('deviceonboarding.simulatedDevices', {
		rules : {
			'numOfDevices' : {
				required : true,
				number : true,
				range: [1,20]
			}
		},
		messages : {
			'numOfDevices': {
				range: Validate.format(speValidMsg.deviceonboarding.simulatedDevices.numOfDevicesRange)
			}
		}
	});

	/*
	 * Create default network policy
	 * TODO - add check for "device password"
	 */
	add('deviceonboarding.defaultNetworkPolicy', {
		rules : {
			'policyName' : {
				required : function(el) {
					return this.networkPolicyOption.checked;
				},
				hmChar : true,
				maxlength : 32
			},
			'ssidName' : {
				required : function(el) {
					return this.networkPolicyOption.checked;
				},
				hmChar : true,
				maxlength : 32
			},
			'pskPassword' : {
				required : function(el) {
					return (this.networkPolicyOption.checked && this.authOption.domNode.value == 'psk');
				},
				minlength: 8,
				maxlength: 63
			},
			'numberOfUsers' : {
				required : function(el) {
					return (this.networkPolicyOption.checked && this.authOption.domNode.value == 'ppsk');
				},
				number: true,
				range : [1, 9999]
			},
			'usernamePrefix' : {
				required : function(el) {
					return (this.networkPolicyOption.checked && this.authOption.domNode.value == 'ppsk');
				},
				maxlength: 28
			},
			'deliverAccountsEmail' : {
				required : function(el) {
					return (this.networkPolicyOption.checked && this.authOption.domNode.value == 'ppsk');
				},
				email: true
			}/*,
			'devicePwd.norEl' : {
				required : true,
				minlength: 8,
				maxlength: 32,
				validatePassword : true
			},
			'devicePwd.cfmEl' : {
				required : true,
				equalTo : 'devicePwd.norEl'
			}*/
		},
		messages : {
			'numOfDevices': {
				range: Validate.format(speValidMsg.deviceonboarding.defaultNetworkPolicy.numOfDevicesRange)
			}
		}
	});

	add('config.customerOnboarding',{
		rules : {
			'plannerEmail' : {
				required : false,
				email : false
			},
			'requestProductsEmail': {
				required: false,
				email: false
			}
		}
	});

	add('config.resetpassword',{
		rules : {
			'password.domNode' : {
				required : true,
                validatePassword:true
			},
			'confirmPassword': {
				required: true,
				equalTo: 'password.domNode'
			}
		},
		messages: {
			'confirmPassword':{
				equalTo: speValidMsg.passwordNotMatch
			}
		}
	});

	add('config.setupPassword',{
		rules : {
			'password.domNode' : {
				required : true,
                validatePassword:true
			},
			'confirmPassword': {
				required: true,
				equalTo: 'password.domNode'
			}
		},
		messages: {
			'confirmPassword':{
				equalTo: speValidMsg.passwordNotMatch
			}
		},
		errorPlacement : function(label, el){
			var className = '.error-message-' + el.getAttribute('data-dojo-attach-point');
			var errorNode = this.$query(className, el.parentNode)[0];
			domConstruct.place(label, errorNode, 'only');
		}
	});


	add('config.devicePassword',{
		rules : {
			'devicePassword.domNode' : {
				required : true,
                validatePassword:true
			},
			'confirmDevicePassword': {
				required: true,
				equalTo: 'devicePassword.domNode'
			}
		},
		messages: {
			'confirmDevicePassword':{
				equalTo: speValidMsg.passwordNotMatch
			}
		},
		errorPlacement : function(label, el){
			var className = '.error-message-' + el.getAttribute('data-dojo-attach-point');
			var errorNode = this.$query(className, el.parentNode)[0];
			domConstruct.place(label, errorNode, 'only');
		}
	});

	add('config.customerRegistrationPlan',{
		rules : {
			'firstName' : {
				required : true
			},
			'lastName' : {
				required : true
			},
			'userEmail' : {
				required : true,
				email : true
			},
			'password.domNode' : {
				required : true,
                validatePassword:true
			},
			'confirmPwd' : {
				required : true ,
				equalTo : 'password.domNode'
			},
			'companyName' : {
				required : true
            },
            'partnerEmail': {
                email: true
            },
            'partnerId': {
                number: true

			}
		},
		messages: {
			'confirmPwd':{
				equalTo: speValidMsg.passwordNotMatch
			}
		}
	});
    add('config.changePassword', {
        rules: {
            'currentPassword': {
                required: true
            },
            'newPassword.domNode': {
                required: true,
                validatePassword:true
            },
            'confirmNewPassword': {
                required: true,
                equalTo: 'newPassword.domNode'
            }
        },
		messages: {
			'confirmNewPassword':{
				equalTo: speValidMsg.passwordNotMatch
			}
		},
        errorPlacement: function (label, element) {
            domConstruct.place(label, element.parentNode.parentNode, 'last');

        }
    });

    add('config.setDefaultPassword', {
        rules: {
            'defaultPassword.domNode': {
                required: true,
                validatePassword:true,
                maxPasswordLength: true
            },
            'confirmDefaultPassword': {
                required: true,
                equalTo: 'defaultPassword.domNode'
            }
        },
		messages: {
			'confirmDefaultPassword':{
				equalTo: speValidMsg.passwordNotMatch
			}
		},
        errorPlacement: function (label, element) {
            domConstruct.place(label, element.parentNode.parentNode, 'last');

        }
    });

    add('config.upgradeFromNoDevices', {
        rules: {
            'password': {
                required: true
            }
        }
    });

    add('config.emailTrial', {
        rules: {
            'emailTrial': {
                required: true,
                email: true
            }
        }
    });

    add('config.inviteKey', {
        rules: {
            'keyInput': {
                required: true,
                inviteKey: true
            }
        }
    });

    add('config.forgotEmail', {
        rules: {
            'forgotEmail': {
                required: true,
                email: true
            }
        },errorPlacement: function (label, element) {

            domConstruct.place(label, element.parentNode, 'first');

        }
    });

    add('config.loginSubmit', {
		rules: {
			'username': {
				required: true
			},
			'password': {
				required: true
			}
		},errorPlacement: function (label, element) {
        }
	});

    add('config.inviteEmail', {
        rules: {
            'emailTrial': {
                required: true,
                email: true
            }
        }
    });
    add('config.customerRegistration', {
        rules: {
            'firstName': {
                required: true
            },
            'lastName': {
                required: true
            },
            'userEmail': {
                required: true,
                email: true
            },
            'password.domNode': {
                required: true,
                validatePassword:true
            },
            'confirmPwd': {
                required: true,
                equalTo: 'password.domNode'
            },
            'companyName': {
                required: true
            },
            'address': {
                required: true
            },
            'city': {
                required: true
            },
            'stateCombo.domNode': {
                required: function (el) {
                    return (this.stateCombo.domNode.value && this.stateCombo.domNode.value !== "Please Select");
                }
            },
            'country.domNode': {
                required: function (el) {
                    return (this.country.domNode.value && this.country.domNode.value !== "Please Select");
                }
            },
            'zipcode': {
                required: true
            },
            'phone': {
                required: true
            },
            'jobTitle': {
                required: true
            },
            'partnerEmail': {
                email: true
            },
            'partnerId': {
                number: true,
                minlength: 1,
                maxlength: 10
            },
            'termsCondition': {
                required: true
            }
        },
		messages: {
			'confirmPwd':{
				equalTo: speValidMsg.passwordNotMatch
			},
			'termsCondition': {
                required: speValidMsg.config.customerRegistration.termsConditionRequired
            }
		},
        errorPlacement: function (label, element) {

            if (element.getAttribute('data-name') === 'termsCondition') {
                domConstruct.place(label, element.parentNode, 'last');
            } else {
                domConstruct.place(label, element, 'after');
            }

        }
    });
    add('config.directBuy', {
		rules : {
			'firstName' : {
				required : true
			},
			'lastName' : {
				required : true
			},
			'userEmail' : {
				required : true,
				email : true
			},
            'password.domNode': {
				required : true,
                validatePassword:true
			},
			'confirmPwd' : {
                required: true,
                equalTo: 'password.domNode'
			},
			'companyName' : {
				required : true
			},
			'address'	: {
				required: true
			},
			'city'	: {
				required: true
			},
            'stateCombo.domNode': {
                required: function (el) {
                    return (this.stateCombo.domNode.value && this.stateCombo.domNode.value !== "Please Select");
                }
            },
            'country.domNode': {
                required: function (el) {
                    return (this.country.domNode.value && this.country.domNode.value !== "Please Select");
                }
            },
			'zipcode'	: {
				required: true
			},
			'phone'	: {
				required: true
			},
			'jobTitle'	: {
                required: true
            },
            'partnerEmail': {
                email: true
            },
            'partnerId': {
                number: true,
                minlength: 1,
                maxlength: 10
            },
            'termsCondition': {
                required: true
            }
        },
        messages: {
			'confirmPwd':{
				equalTo: speValidMsg.passwordNotMatch
			},
			'termsCondition': {
                required: speValidMsg.config.directBuy.termsConditionRequired
            }
		},
        errorPlacement: function (label, element) {

            if (element.getAttribute('data-name') === 'termsCondition') {
                domConstruct.place(label, element.parentNode, 'last');
            } else {
                domConstruct.place(label, element, 'after');
            }

        }
	});

    add('config.resendEmail', {
		rules : {
			'userEmail' : {
				required : true,
				email : true
			}
		}
    });



	add('config.approveRadiusClient',{
		rules : {
			'radiusClientIp.ipEl' : {
				required : true
			},
			'radiusClientSecret.norEl' : {
				required : true
			},
			'radiusClientSecret.cfmEl' : {
				required : true,
				equalTo : 'radiusClientSecret.norEl'
			}
		}
	});

	add('acct.adminGroup',{
		ignore: false,
		rules: {
			'groupName': {
				required: true,
				minlength: 1,
                maxlength: 32
			},
			'isPermission': {
				permission: true
			}
		}
	});
	add('acct.adminAccount',{
		rules: {
			'emailAddressInput': {
				required: true,
				email: true
			},
			'adminNameInput': {
				required: true,
				minlength: 1,
                maxlength: 64
			},
			'idleTimeoutInput': {
				required: true,
				number: true,
				range: [5, 240]
			}
		}
	});


	add('config.ssid', {
		rules: {
			'ssidName': {
				required: true,
				hmChar: true,
				maxlength: 32
			},
			'ssidBroadcastName': {
				required: true,
				maxlength: 32
			}
			// 'cwpPicker.ipEl' : {
			// 	ipObjectSaved : 'cwpPicker'
			// }
		}
		// messages : {
		// 	'cwpPicker.ipEl' : {
		// 		ipObjectSaved : speValidMsg.config.ssid.cwpPickerIpElIpObjectSaved
		// 	}
		// }
	});

	add('config.accessSecurity', {
		rules: {
			'maxClientsPerPpsk': {
				required: function() {
					return this.enableMaxClientsPerPpsk.checked;
				},
				number: true,
				range: [0, 15]
			},
			'keyVal.norEl': {
				required: function() {
					return this.get('securityValue') === 'psk';
				}
			},
			'keyVal.cfmEl': {
				equalTo: 'keyVal.norEl'
			},
			'keyValOne.cfmEl': {
				equalTo: 'keyValOne.norEl',
				asciikey: true
			},
			'keyValTwo.cfmEl': {
				equalTo: 'keyValTwo.norEl',
				asciikey: true
			},
			'keyValThree.cfmEl': {
				equalTo: 'keyValThree.norEl',
				asciikey: true
			},
			'keyValFour.cfmEl': {
				equalTo: 'keyValFour.norEl',
				asciikey: true
			}
		},
		errorPlacement: function(label, el) {
			if (el.getAttribute('data-dojo-attach-point') === 'norEl') {
				domConstruct.place(label, el.parentNode, 'last');
			} else {
				domConstruct.place(label, el, 'after');
			}
		}
	});

	add('config.userAccess', {
		rules: {
			'vendorId': {
				required: true,
				number: true,
				range: [1, 65535]
			},
			'radiusAttribute': {
				required: true,
				number: true,
				range: [1, 255]
			}
		}
	});

	add('config.AAAServerProfile', {
		rules: {
			'profileName': {
				required: true,
				hmChar : true,
				maxlength: 32
			},
			'profileDesc': {
				maxlength: 64
			}
		}
	});


	add('config.configureSIP',{
		rules : {
			'sipPolicyName' : {
				required : true
		    }
	    }
	});

	add('config.realm',{
		rules : {
			'realmName' : {
				required : true
			}
		}
	});

	add('config.trafficTunneling',{
		rules : {
			'timeInterval' : {
				required : true,
				number : true,
				range : [10,600]
			},
			'trafficThreshold' : {
				required : true,
				number : true,
				range : [0,2147483647]
			},
			'obscureWid.norEl' : {
				required : true
			},
			'obscureWid.cfmEl' : {
				equalTo : 'obscureWid.norEl'
			},

			'destinationIp.ipEl' : {
				required : true,
				ipObjectSaved : 'destinationIp'
			},

			'ipTextSelect' : {
               childLength : function(el) {
               	/*if(this.identityBased.checked) {
               	  if(!this.ipTextSelect.childElementCount) return false;
               	}
               	  return true;*/
				   return this.ipTextSelect.children.length;
               }
			},
			'tunnelingName' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'description' : {
				maxlength : 64
			}
		},
		errorPlacement : function(label, el){
			var name = el.getAttribute('data-dojo-attach-point');

			if(name == 'timeInterval' || name == 'trafficThreshold'){
				label.style.display = 'block';
				domConstruct.place(label, el.parentNode, 'last');
			}else if(name == 'ipTextSelect'){
				domConstruct.place(label, el.parentNode, 'after');
			}else{
				domConstruct.place(label, el, 'after');
			}
		}
	});

	add('config.createSchedule',{
		rules : {
			'scheduleName' : {
				required : function() {
					return this.src != "localUserGroup";
				},
				maxlength: 32,
				hmChar : true
			},

			'onetimeSD.focusNode' : {
				//required : true
				required : function() {
				     return this['ONE_TIME'].style.display == 'none' ? false : true;
				}
			},

			'onetimeED.focusNode' : {
				//required : true
				required : function() {
				     return this['ONE_TIME'].style.display == 'none' ? false : true;
				}
			},

			'onetimeST.focusNode' : {
				//required : true
				required : function() {
				     return this['ONE_TIME'].style.display == 'none' ? false : true;
				}
			},

			'onetimeET.focusNode' : {
				//required : true
				required : function() {
				     return this['ONE_TIME'].style.display == 'none' ? false : true;
				}
			},

			'recuringSD.focusNode' : {
				required : function() {
				     return !!((this['RECURRING'].style.display != 'none')*(this.limitedCheck.checked == true)) ? true : false;
				}
			},

			'recuringED.focusNode' : {
				required : function() {
				     return !!((this['RECURRING'].style.display != 'none')*(this.limitedCheck.checked == true)) ? true : false;
				}
			}


		},
		errorPlacement : function(label,element){

			if(!!element.getAttribute('data-validid')){
				//find(element).parent.after(label)
				domConstruct.place(label,element.parentNode,'after')
			}else{
			    domConstruct.place(label,element,'after');
			}


			}
	});

	add('config.ipFirewallProfile',{
		rules : {
			'name' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'description' : {
				maxlength : 64
			}
		}
	});

	add('config.createIPFirewall',{
		rules : {
			'sourceIp.ipEl' : {
				required : true,
				ipObjectSaved : 'sourceIp'
			},

            'destinationIp.ipEl' : {
                required : true,
				ipObjectSaved : 'destinationIp'
            }
		}
	});

	add('config.createMACFirewall',{
		rules : {
			'sourceMacIp.ipEl' : {
				required : true,
				ipObjectSaved : 'sourceMacIp'
			},

            'destinationMacIp.ipEl' : {
                required : true,
				ipObjectSaved : 'destinationMacIp'
            }
		},
		messages : {
			'sourceMacIp.ipEl' : {
				ipObjectSaved : speValidMsg.config.createMACFirewall.sourceMacIpIpElIpObjectSaved
			},

            'destinationMacIp.ipEl' : {
				ipObjectSaved : speValidMsg.config.createMACFirewall.destinationMacIpIpElIpObjectSaved
            }
		}
	});

	add('device.deviceConfiguration',{
		rules : {
			'hostName' : {
				required : true
			},
			'deviceFunction.domNode' : {
				required : true
			},
			'networkPolicy.domNode' : {
				required : true
			},
			'macAddress' : {
				required : true,
				length : 12
			},
			'SAipAddress' : {
				required : true,
				ip : true,
				ipInSubnet : function(el) {
					if(this.radioVal(this.mgtdEls) != "STATIC_IP") {
						return false;
					}
					return [this.SAipAddress.value, "Static IP Address", this.SAdefaultGateway.value, "Default Gateway", this.SAnetmask.value];
				}
			},
			'SAnetmask' : {
				required : true,
				netmask : true
			},
			'SAdefaultGateway' : {
				ip : true
			},
			'SAmgmtVLAN' : {
				number : true,
				range : [1,4094]
			},
			'SAnativeVLAN' : {
				number : true,
				range : [1,4094]
			},
			'DCWFipAddress' : {
				ip : true
			},
			'DCWFnetmask' : {
				netmask : true
			},
			'DCWFdefaultGateway' : {
				ip : true
			},
			'DCWFtimeout' : {
				number : function(el) {
					return this.radioVal(this.mgtdEls) == "DHCP_CLIENT_WITH_FALLBACK";
				},
				range : [0, 3600]
			},
			'DCWOFaddressPrefix' : {
				ip : true
			},
			'DCWOFnetmask' : {
				netmask : true
			},
			'DCWOFtimeout' : {
				number : function(el) {
					return this.radioVal(this.mgtdEls) == "DHCP_CLIENT_WITHOUT_FALLBACK";
				},
				range : [0, 3600]
			},
			'mgt0Mtu': {
				number: true,
				range: [100, 1500]
			},
			'vlanBlockStart': {
				number: true,
				range: [2, 3712]
			}
		},
		messages : {
			'mgt0Mtu' : {
				range : Validate.format(speValidMsg.device.deviceConfiguration.mgt0MtuRange)
			},
			'vlanBlockStart' : {
				range: Validate.format(speValidMsg.device.deviceConfiguration.vlanBlockStartRange)
			}
		},
		errorPlacement: function (label, element) {
			if (element.getAttribute('data-dojo-attach-point') === 'vlanBlockStart') {
				domConstruct.place(label, element.parentNode, 'last');
			} else {
				domConstruct.place(label, element, 'after');
			}
		}
	});


	add('config.choosePortType', {
		rules: {

		}
	});

	add('config.ntpServer',{
		rules : {
			'ntpName' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'ntpDescription' : {
				maxlength : 64
			},
			'syncInterval' : {
				required : true,
				integer : true,
				range : [60,10080]

			}
		},

		messages : {
			'syncInterval' : {
				range : Validate.format(speValidMsg.config.ntpServer.syncIntervalRange)
			}
		},
		errorPlacement : function(label,element){

				if(element.getAttribute('data-dojo-attach-point')=="syncInterval"){
					//find(element).parent.after(label)
					domConstruct.place(label,element.parentNode,'last');
				}else{
				    domConstruct.place(label,element,'after');
				}


		}
	});

	add('config.createNtpServer',{
		rules : {
			'ntpName' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'ntpDescription' : {
				maxlength : 64
			},
			'ipAddress.ipEl' : {
				//required : true,
				ipObjectSaved : 'ipAddress'
			}
		}
	});

		add('config.snmpProfile',{
		rules : {
			'snmpName' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'snmpDescription' : {
				maxlength : 64
			},
			'contact' : {
				maxlength : 32
			}
		}
	});

	add('config.createSNMPServer',{
		rules : {
			'ipAddress.ipEl' : {
				required :true,
				ipObjectSaved : 'ipAddress'
			},
			'community' : {
				required :true,
				hmChar : true,
				maxlength : 32,
				name: true
			},
			'admin' : {
				required :true,
				hmChar : true,
				maxlength : 32
			},
			'auth' : {
				required :true
			},
			'authPwd.norEl' : {
				required : true,
				minlength : 8,
				maxlength : 64
			},
			'authPwd.cfmEl' : {
				equalTo : 'authPwd.norEl'
			},
			'encryPwd.norEl' : {
				required : true,
				minlength : 8,
				maxlength : 64
			},
			'encryPwd.cfmEl' : {
				equalTo : 'encryPwd.norEl'
			}
		}
	});

	add('config.newClassifierMap',{
		rules : {
			'name' : {
				required : true,
				hmChar : true
			},
			'description' : {
				maxlength : 64
			}
		}
	});

	add('config.macFirewallProfile',{
		rules : {
			'name' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'description' : {
				maxlength : 64
			}
		}
	});

	add('config.lldpCdp',{
		rules : {
			'name' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'description' : {
				maxlength : 64
			},
			'maxCachedLldpEntries' : {
				required : true,
				number : true,
				range : [1, 128]
			},
			'lldpNeighborKeepAdvertisementPeriod' : {
				required : true,
				number : true,
				range : [0, 65535]
			},
			'lldpAdvertisementInterval' : {
				required : true,
				number : true,
				range : [5, 65534]
			},
			'lldpAdvertisementMaxPower' : {
				required : true,
				number : true,
				range : [1, 250]
			},
			'lldpInitializationDelayTime' : {
				required : true,
				number : true,
				range : [2, 5]
			},
			'lldpFastStartRepeatCount' : {
				required : true,
				number : true,
				range : [1, 10]
			},
			'maxCachedCdpEntries' : {
				number : true,
				range : [1, 128]
			}
		},
		errorPlacement: function(label, element) {
			domConstruct.place(label, element.parentNode, 'last');
		}
	});

	add('config.dnsServer',{
		rules : {
			'name' : {
				required : true,
				maxlength: 32,
				hmChar : true
			},
			'domainName': {
				maxlength: 32,
				domain: true
			},
			'description' : {
				maxlength : 64
			},
			'ipAddress': {
				required : true,
				ip : true
			}
		}
	});

	add('config.createDnsServer',{
		rules : {
			'name' : {
				required : true,
				hmChar : true
			},
			'description' : {
				maxlength : 64
			},
			'ipAddress.ipEl' : {
				required : true,
				ipObjectSaved : 'ipAddress'
			}
		}
	});

	add('config.markerMaps',{
		rules : {
			'name' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'description' : {
				maxlength : 64
			},
			'markersOne' : {
				required : true,
				number : true,
				range : [0, 7]
			},
			'markersTwo' : {
				required : true,
				number : true,
				range : [0, 7]
			},
			'markersThree' : {
				required : true,
				number : true,
				range : [0, 7]
			},
			'markersFour' : {
				required : true,
				number : true,
				range : [0, 7]
			},
			'markersFive' : {
				required : true,
				number : true,
				range : [0, 7]
			},
			'markersSix' : {
				required : true,
				number : true,
				range : [0, 7]
			},
			'markersSeven' : {
				required : true,
				number : true,
				range : [0, 7]
			},
			'markersEight' : {
				required : true,
				number : true,
				range : [0, 7]
			},
			'diffServOne' : {
				required : true,
				number : true,
				range : [0, 63]
			},
			'diffServTwo' : {
				required : true,
				number : true,
				range : [0, 63]
			},
			'diffServThree' : {
				required : true,
				number : true,
				range : [0, 63]
			},
			'diffServFour' : {
				required : true,
				number : true,
				range : [0, 63]
			},
			'diffServFive' : {
				required : true,
				number : true,
				range : [0, 63]
			},
			'diffServSix' : {
				required : true,
				number : true,
				range : [0, 63]
			},
			'diffServSeven' : {
				required : true,
				number : true,
				range : [0, 63]
			},
			'diffServEight' : {
				required : true,
				number : true,
				range : [0, 63]
			}
		}
	});

	add('config.portType', {
		rules: {
			'portTypeName': {
				required: true,
				hmChar : true,
				maxlength : 32
			},
			'portTypeDesc':{
				maxlength : 64
			},
			// 'cwpPicker.ipEl': {
			// 	required: true,
			// 	ipObjectSaved: 'cwpPicker'
			// },
			'vlan.ipEl': {
				required: function(){
					return this.radioVal(this.portEls) == "access" && !this.enable802DOT1X.checked && !this.enableMAC.checked;
				},
				ipObjectSaved: "vlan"
			},
			'voiceVlan.ipEl': {
				required: function(){
					return this.radioVal(this.portEls) == "phone-data";
				},
				ipObjectSaved: "voiceVlan"
			},
			'dataVlan.ipEl': {
				required: function(){
					return this.radioVal(this.portEls) == "phone-data";
				},
				ipObjectSaved: "dataVlan"
			},
			'vendorId': {
				required: true,
				number: true,
				range: [1, 65535]
			},
			'radiusAttribute': {
				required: true,
				number: true,
				range: [1, 255]
			}
		},
		messages : {
			'cwpPicker.ipEl': {
				ipObjectSaved: speValidMsg.config.portType.cwpPickerIpElIpObjectSaved
			},
			'vlan.ipEl' : {
				ipObjectSaved : speValidMsg.config.portType.vlanIpElIpObjectSaved
			},
			'voiceVlan.ipEl' : {
				ipObjectSaved : speValidMsg.config.portType.voiceVlanIpElIpObjectSaved
			},
			'dataVlan.ipEl' : {
				ipObjectSaved : speValidMsg.config.portType.dataVlanIpElIpObjectSaved
			}
		}
	});

	add('config.createRadioProfile', {
		rules: {
			'radioProfileName' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'radioProfileDesc' : {
				maxlength : 64
			},
			'beaconPeriod': {
				required: true,
				range: [40, 3500]
			},
			'bgScanInterval': {
				range: function(el) {
					var minRange = 1, maxRange = 1440;
					switch (this.bgScanIntervalUnit.domNode.value){
						case "HOUR":
							maxRange = 24;
						    break;
						case "DAY":
							maxRange = 1;
							break;
					}

					return [minRange, maxRange];
				}
			},
			'channelSwitchClientLimit': {
				range: [0,100]
			},
			'crcErrorThreshold': {
				range: [10,80]
			},
			'interferenceThreshold': {
				range: [10,80]
			},
			'reportChannelInterferenceThreshold': {
				range: [15,60]
			},
			'reportCrcErrorThreshold': {
				range: [15,60]
			},
			'radioRange': {
				required: true,
				range: [300, 10000]
			},
			'reportShortTermAverageInterval': {
				range: [5,30]
			},
			'lbAirtimeAnchorPeriod': {
				required: true,
				range: function(el){
					var unit = this.lbAirtimeAnchorPeriodUnit.domNode.value;
					var minRange = unit == "MINUTE" ? 1 : 10,
						maxRange = unit == "MINUTE" ? 10: 600;
					return [minRange,maxRange];
				}
			},
			'lbClientAirtime': {
				range: [1,5]
			},
			'lbClientNumberAnchorPeriod': {
				range: function(el) {
					var unit = this.lbClientNumberAnchorPeriodUnit.domNode.value;
					var minRange = unit == "MINUTE" ? 1 : 10,
						maxRange = unit == "MINUTE" ? 10: 600;
					return [minRange, maxRange];
				}
			},
			'lbCrcErrorRate': {
				range: [1,99]
			},
			'backhaulHoldTime': {
				required: true,
				range: function(){
					var unit = this.backhaulHoldTimeUnit.domNode.value;
					var minRange = 1,
						maxRange = unit == "MINUTE" ? 5: 300;
					return [minRange,maxRange];
				}
			},
			'ignoreInitialClientConnectionNumber': {
				range: [1,100]
			},
			'lbAirtimeNeighborQuery': {
				range: function(el) {
					var minRange = 1, maxRange = this.lbAirtimeNeighborQueryUnit.domNode.value=="MINUTE" ? 10 : 600;

					return [minRange, maxRange];
				},
				required: true
			},
			'lbClientNumberNeighborQuery': {
				range: function(el) {
					var minRange = 1, maxRange = this.lbClientNumberNeighborQueryUnit.domNode.value=="MINUTE" ? 10 : 600;
					return [minRange, maxRange];
				}
			},
			'lbRFInterference' : {
				range: [1,99]
			},
			'safetyNetPeriod': {
				required: true,
				range: function(el){
					var unit = this.safetyNetPeriodUnit.domNode.value,
						minRange = unit == "MINUTE" ? 1 : 5,
						maxRange = unit == "MINUTE" ? 5 : 300;
					return [minRange, maxRange];
				}
			},
			'backhaulTriggerTime': {
				range: [1,5]
			},
			'weakSnrThreshold': {
				range: [1,100]
			},
			'aifs_voice': {required: true,range: [0,15]}, 'maxcw_voice': {required: true,range: [1,15]}, 'mincw_voice': {required: true,range: [1,15]}, 'txoplimit_voice': {required: true,range: [0,8192]},
			'aifs_video': {required: true,range: [0,15]}, 'maxcw_video': {required: true,range: [1,15]}, 'mincw_video': {required: true,range: [1,15]}, 'txoplimit_video': {required: true,range: [0,8192]},
			'aifs_best_effort': {required: true,range: [0,15]}, 'maxcw_best_effort': {required: true,range: [1,15]}, 'mincw_best_effort': {required: true,range: [1,15]}, 'txoplimit_best_effort': {required: true,range: [0,8192]},
			'aifs_background': {required: true,range: [0,15]}, 'maxcw_background': {required: true,range: [1,15]}, 'mincw_background': {required: true,range: [1,15]}, 'txoplimit_background': {required: true,range: [0,8192]},

			'limitChannel_1' : {
				required: true,
				range: [1,14]
			},
			'limitChannel_2' : {
				required: true,
				range: [1,14]
			},
			'limitChannel_3' : {
				required: true,
				range: [1,14]
			},
			'limitChannel_4' : {
				required: function(el) {
					return this.limitChannel_4.style.display == "";
				},
				range: [1,14]
			},
			'trapInterval': {
				required: function(el) {
					return this.enablePresenceAnalytics.checked;
				},
				range: [15, 600]
			},
			'dwellTime' : {
				required: true,
				range: [250, 30000]
			}
		},
		messages: {
			'limitChannel_1': {
				range: Validate.format(speValidMsg.config.createRadioProfile.limitChannel_1Range)
			},
			'limitChannel_2': {
				range: Validate.format(speValidMsg.config.createRadioProfile.limitChannel_2Range)
			},
			'limitChannel_3': {
				range: Validate.format(speValidMsg.config.createRadioProfile.limitChannel_3Range)
			},
			'limitChannel_4': {
				range: Validate.format(speValidMsg.config.createRadioProfile.limitChannel_4Range)
			}
		},
		errorPlacement : function(label,element){
			if(element.getAttribute("data-dojo-attach-point").indexOf("limitChannel_") != -1){
				var el = element.parentNode;
				el.appendChild(label);
				domConstruct.place(label,this.limitChannel_4,'after');
			} else {
				domConstruct.place(label, element.parentNode, 'last');
			}
		}
	});

	add('config.hiveProfile', {
		rules: {
			'hiveName': {
				required: true,
				minlength: 1,
				hmChar : true,
				maxlength: 32
			},
			'description': {
				maxlength: 64
			},
			'trafficPort': {
				required: true,
				integer: true,
				number: true,
				range: [1500, 65000]
			},
			'passwordObs.norEl' : {
				minlength: 8,
				maxlength: 63
			},
			'passwordObs.cfmEl' : {
				minlength: 8,
				maxlength: 63,
				equalTo : 'passwordObs.norEl'
			},
			'rtsThreshold': {
				required: true,
				range: [1, 2346]
			},
			'fragThreshold':{
				required: true,
				range: [256, 2346]
			},
			'strengthPollInterval': {
				range: [1,60]
			},
			'sendBeats': {
				required: true,
				specRange: function(){
					var unit = this.BeatsUnit.domNode.value;
					return {unit: unit, minValue: 5, maxValue: 360000};
				}
			},
			'missBeats': {
				required: true,
				range: [2,1000]
			},
			'sendInfo': {
				required: true,
				specRange: function(){
					var unit = this.InfoUnit.domNode.value;
					return {unit: unit, minValue: 10, maxValue: 36000};
				}
			},
			'missUpdate': {
				required: true,
				range: [1,1000]
			},
			'enableMeshConnection': {
				required: function(){
					return this.enableMeshConnection.checked;
				}
			}
		},
		messages: {
			'hiveName':{
				minlength: Validate.format(speValidMsg.config.hiveProfile.hiveNameMinlength),
				maxlength: Validate.format(speValidMsg.config.hiveProfile.hiveNameMaxlength)
			},
			'trafficPort': {
				range: Validate.format(speValidMsg.config.hiveProfile.trafficPortRange)
			},
			'passwordObs.norEl': {
				minlength: Validate.format(speValidMsg.config.hiveProfile.passwordObsNorElMinlength),
				maxlength: Validate.format(speValidMsg.config.hiveProfile.passwordObsNorElMaxlength)
			},
			'passwordObs.cfmEl':{
				minlength: Validate.format(speValidMsg.config.hiveProfile.passwordObsCfgElMinlength),
				maxlength: Validate.format(speValidMsg.config.hiveProfile.passwordObsCfgElMaxlength),
				equalTo: speValidMsg.passwordNotMatch
			},
			'rtsThreshold': {
				range: Validate.format(speValidMsg.config.hiveProfile.rtsThresholdRange)
			},
			'fragThreshold': {
				range: Validate.format(speValidMsg.config.hiveProfile.fragThresholdRange)
			},
			'strengthPollInterval': {
				range: Validate.format(speValidMsg.config.hiveProfile.strengthPollIntervalRange)
			},
			'sendBeats': {
				specRange: speValidMsg.config.hiveProfile.sendBeatsSpecRange
			},
			'sendInfo': {
				specRange: speValidMsg.config.hiveProfile.sendInfoSpecRange
			}
		},
		errorPlacement : function(label,element){
			var arr = ["sendBeats", "sendInfo", "rtsThreshold", "fragThreshold"];
			if(arr.indexOf(element.getAttribute("data-dojo-attach-point")) > -1){
				var el = element.parentNode;
				el.appendChild(label);
				// domConstruct.place(label,this.serverTypeError,'after');
			} else {
			    domConstruct.place(label,element,'after');
			}
		}

	});

	add('device.mtuSetttings',{
		ignore: false,
		rules : {
			'ethernetMtu' : {
				required : true,
				number : true,
				range: [1500,9600]
			}
		},
		errorPlacement : function(label, element){
			var dataPoint = element.getAttribute('data-dojo-attach-point');
			if(this[dataPoint + "ErrorMsg"]){
				domConstruct.place(label, this[dataPoint + "ErrorMsg"], 'after');
            } else{
            	domConstruct.place(label,element,'after');
			}
		}
	});

	add('device.PortSettingsMultiEdit',{
		ignore: false,
		rules : {
			'debounceTimer' : {
				required : true,
				number : true,
				range: [0,5000]
			}
		},
		errorPlacement : function(label, element){
			var dataPoint = element.getAttribute('data-dojo-attach-point');
			if(this[dataPoint + "ErrorMsg"]){
				domConstruct.place(label, this[dataPoint + "ErrorMsg"], 'after');
            } else{
            	domConstruct.place(label,element,'after');
			}
		}
	});

	add('device.stpMultiEdit',{
		ignore: false,
		rules : {
			'pathCost' : {
				number : true,
				range: [0,200000000]
			}
		},
		errorPlacement : function(label, element){
			var dataPoint = element.getAttribute('data-dojo-attach-point');
			if(this[dataPoint + "ErrorMsg"]){
				domConstruct.place(label, this[dataPoint + "ErrorMsg"], 'after');
            } else{
            	domConstruct.place(label,element,'after');
			}
		}
	});

	add('device.stormControlMultiEdit',{
		ignore: false,
		rules : {
			'rateLimitValue' : {
				required : true,
				number : true,
				range : function() {
					if(this.stormControlThresholdOption.domNode.value == "BYTE_BASED") {
						if(this.rateLimitType.domNode.value == "KBPS") {
							return [0,1000000];
						} else if(this.rateLimitType.domNode.value == "PERCENTAGE"){
							return [0,100];
						}
					} else if(this.stormControlThresholdOption.domNode.value == "PACKET_BASED"){
						return [0,100000000];
					}

					return [0,100];
				}
			}
		},
		errorPlacement : function(label, element){
			var dataPoint = element.getAttribute('data-dojo-attach-point');
			if(this[dataPoint + "ErrorMsg"]){
				domConstruct.place(label, this[dataPoint + "ErrorMsg"], 'after');
            } else{
            	domConstruct.place(label,element,'after');
			}
		}
	});

	add('device.stormControlEntry',{
		ignore: false,
		rules : {
			'rateLimitValue' : {
				required : true,
				number : true,
				range : function() {
					if(this.rateLimitType.domNode.value == "KBPS") {
						if(this.obj.interfaceName.indexOf("sfp") != -1) {
							return [0,10000000];
						}
						return [0,1000000];
					} else if(this.rateLimitType.domNode.value == "PERCENTAGE"){
						return [0,100];
					} else if(this.rateLimitType.domNode.value == "PPS") {
						if(this.obj.interfaceName.indexOf("sfp") != -1) {
							return [0,1000000000];
						}
						return [0,100000000];
					}
					return [0,100];
				}
			}
		},
		errorPlacement : function(label, element){
			var dataPoint = element.getAttribute('data-dojo-attach-point');
			if(this[dataPoint + "ErrorMsg"]){
				domConstruct.place(label, this[dataPoint + "ErrorMsg"], 'after');
            } else{
            	domConstruct.place(label,element,'after');
			}
		}
	});

	add('device.PSEEntry',{
		ignore: false,
		rules : {
			'pseProfileObj.ipEl' : {
				required : true,
				ipObjectSaved : 'pseProfileObj'
			},
			'powerLimit' : {
				required : true,
				number : true,
				range : function() {
					if(this.powerMode.domNode.value == "_8023AF") {
						return [100, 16000];
					} else if(this.powerMode.domNode.value == "_8023AT") {
						return [100,32000];
					}

					return [100,32000];
				}
			}
		},
		messages : {
			'pseProfileObj.ipEl' : {
				ipObjectSaved : speValidMsg.device.pseProfile.pseObjIpElIpObjectSaved
			}
		},
		errorPlacement : function(label, element){
			var dataPoint = element.getAttribute('data-dojo-attach-point');
			if(this[dataPoint + "ErrorMsg"]){
				domConstruct.place(label, this[dataPoint + "ErrorMsg"], 'only');
            } else{
            	domConstruct.place(label,element,'after');
			}
		}
	});

	add('device.PSEMultiEdit',{
		ignore: false,
		rules : {
			'pseProfileObj.ipEl' : {
				required : true,
				ipObjectSaved : 'pseProfileObj'
			}
		},
		messages : {
			'pseProfileObj.ipEl' : {
				ipObjectSaved : speValidMsg.device.pseProfile.pseObjIpElIpObjectSaved
			}
		},
		errorPlacement : function(label, element){
			var dataPoint = element.getAttribute('data-dojo-attach-point');
			if(this[dataPoint + "ErrorMsg"]){
				domConstruct.place(label, this[dataPoint + "ErrorMsg"], 'only');
            } else{
            	domConstruct.place(label,element,'after');
			}
		}
	});

	add('device.PSESetttings',{
		ignore: false,
		rules : {
			'maxPowerBudget' : {
				required : true,
				number : true,
				range: function () {
					return this.powerBudgetRange.slice(0);
				}
			},
			'powerGuardBandValue' : {
				required : true,
				number : true,
				range: [2,25]
			}
		},
		errorPlacement : function(label, element){
			var dataPoint = element.getAttribute('data-dojo-attach-point');
			if(this[dataPoint + "ErrorMsg"]){
				domConstruct.place(label, this[dataPoint + "ErrorMsg"], 'after');
            } else{
            	domConstruct.place(label,element,'after');
			}
		}
	});

	add('device.igmpSetttings',{
		ignore: false,
		rules : {
			'vlan' : {
				required : true,
				number : true,
				range: [1,4094]
			},
			'delayInterval' : {
				required : true,
				number : true,
				range: [1,25]
			},
			'queryRetryNumber' : {
				required : true,
				number : true,
				range: [1,7]
			},
			'waitTime' : {
				required : true,
				number : true,
				range: [30,1000]
			},
			'robustnessCount' : {
				required : true,
				number : true,
				range: [1,3]
			}
		}
	});

	add('device.igmpEntry',{
		ignore: false,
		rules : {
			'delayInterval' : {
				required : true,
				number : true,
				range: [1,25]
			},
			'queryRetryNumber' : {
				required : true,
				number : true,
				range: [1,7]
			},
			'waitTime' : {
				required : true,
				number : true,
				range: [30,1000]
			},
			'robustnessCount' : {
				required : true,
				number : true,
				range: [1,3]
			}
		}
	});

	add('device.InterfaceSettingsForSwitch',{
		ignore: false,
		rules : {
			'delayInterval1' : {
				required : true,
				number : true,
				range: [1,25]
			},
			'queryRetryNumber1' : {
				required : true,
				number : true,
				range: [1,7]
			},
			'waitTime1' : {
				required : true,
				number : true,
				range: [30,1000]
			},
			'robustnessCount1' : {
				required : true,
				number : true,
				range: [1,3]
			},
			'certainVlan' : {
				maxlength: 255,
				allowedVlans: true
			},
			'idleTimeout' : {
				required : true,
				number : true,
				range: [0,650]
			}
		}
	});

	add('device.staticMac',{
		ignore: false,
		rules : {
			'staticMacVlan' : {
				required : true,
				number : true,
				range: [1,4094]
			},
			'staticMacAddress' : {
				required : true,
				macAddress : true,
				notMulticastMac : true
			}
		}
	});

	add('device.NewMulticastGroup',{
		ignore: false,
		rules : {
			'vlan' : {
				required : true,
				number : true,
				range: [1,4094]
			},
			'multicastIpAddress.ipEl' : {
				required : true,
				ipObjectSaved : 'multicastIpAddress',
				multicastIp : function(el) {
					return this.multicastIpAddress.attr('obj');
				}
			}
		}
	});

	add('device.deviceCredential',{
		ignore: false,
		rules : {
			'rootAdminName' : {
				minlength: 3,
				maxlength: 20,
				name: true
			},
			'rootAdminPassword.norEl' : {
				required : function(el) {
					return this.rootAdminName.value != "";
				},
				minlength: 8,
				maxlength: 32,
				name: true
			},
			'rootAdminPassword.cfmEl' : {
				equalTo : 'rootAdminPassword.norEl'
			},
			'readOnlyAdminName' : {
				minlength: 3,
				maxlength: 20,
				name: true
			},
			'readOnlyAdminPassword.norEl' : {
				required : function(el) {
					return this.readOnlyAdminName.value != "";
				},
				minlength: 8,
				maxlength: 32,
				name: true
			},
			'readOnlyAdminPassword.cfmEl' : {
				equalTo : 'readOnlyAdminPassword.norEl'
			},
			'passphrase.norEl' : {
				minlength: 16,
				maxlength: 32
			},
			'passphrase.cfmEl' : {
				equalTo : 'passphrase.norEl'
			},
            'primaryServer.ipEl' : {
				ipObjectSaved : function() {
					if(this.editInfo.deviceId == "multipleedit" && this.primaryServer.ipEl.value == '') {
						return true;
					}
					return 'primaryServer';
				}
            },
            'secServer.ipEl' : function() {
				if(this.editInfo.deviceId == "multipleedit" && this.secServer.ipEl.value == '') {
					return true;
				}
				ipObjectSaved : 'secServer'
            }
		},
        messages: {
			'readOnlyAdminPassword.cfmEl':{
				equalTo: speValidMsg.passwordNotMatch
			}
		}
	});

	add('device.wiredInterfacesEntry', {
		rules: {
			'nativeVlan': {
				number: true,
				range: [1, 4094]
			},
			'allowedVlans': {
				required: function(){
					return !this.allowedVlans.disabled
				},
				allowedVlans: true
			}
		},
		errorPlacement: function (label, element) {
			domConstruct.place(label, element.parentNode, 'last');
		}
	});

	add('device.radiusTest', {
		rules : {
			'serverEnter': {
				minlength: 1,
                required : function() {
                	return this['serverType-enter'].checked;
                }
			},
			'serverName':{
				minlength: 1,
				maxlength: 32,
				required : function() {
					return this['testServerType-auto'].checked;
				}
			},
			'serverpwd':{
				minlength: 1,
				maxlength: 32,
				required : function() {
					return this['testServerType-auto'].checked;
				}
			}
		}
	});

	// for maps module
	add('maps.folderPage', {
		rules: {
			'name': {
				required: true
			},
			'floorLoss': {
				number: true
			},
			'metricWidth': {
				number: true,
				required : function(el){
					if(this.folderType != mapConstant.FolderType.FLOOR){
						return false;
					}else{
						if(this.operation == "clone"){
							return false;
						}
						if(this.background.domNode.value != ''){
							return false;
						}
						return (this.metricWidth.value == "" || this.metricWidth.value <= 0);
					}
				}
			},
			'metricHeight': {
				number: true,
				required : function(el){
					if(this.operation == "clone"){
						return false;
					}
					if(this.folderType != mapConstant.FolderType.FLOOR){
						return false;
					}else{
						if(this.background.domNode.value != ''){
							return false;
						}
						return (this.metricHeight.value == "" || this.metricHeight.value <= 0)
						&& this.metricWidth.value != ""
						&& this.metricWidth.value >= 0;
					}
				}
			},
			'metricMapWidth': {
				number: true
			},
			'deviceElevation': {
				number: true
			}
		},
		errorPlacement : function(label,element){
			if(element.getAttribute("data-dojo-attach-point") == "floorLoss"
				|| element.getAttribute("data-dojo-attach-point") == "metricWidth"
				|| element.getAttribute("data-dojo-attach-point") == "metricHeight"
				|| element.getAttribute("data-dojo-attach-point") == "metricMapWidth"
				|| element.getAttribute("data-dojo-attach-point") == "deviceElevation"){
				domConstruct.place(label,element.parentNode,'last');
			} else {
			    domConstruct.place(label,element,'after');
			}
		}
	});

	add('maps.scalingTool', {
		rules : {
			'scaleActualLength': {
				number : true,
				maxlength: 16,
				required : function(el){
					if (this.scaleHorizontal.checked || this.scaleVertical.checked){
						return this.scaleActualLength.value == "" || this.scaleActualLength <= 0;
					}
					return false;
				}
			}
		},
		errorPlacement : function(label,element){
			 domConstruct.place(label,this.errorMessage,'after');
		}
	});

	add('maps.globalSettings',{
		rules: {
			'pollingInterval' : {
				required: true,
				number : true,
				range: [30,900]
			},
			'locationWindow' : {
				number : true,
				maxlength : 2,
				range: [1,99],
				required : function(el){
					return this.intervalReported.checked;
				}
			}
		},
		errorPlacement : function(label,element){
			if(element.getAttribute("data-dojo-attach-point") == "pollingInterval"){
				domConstruct.place(label,this.pollingIntervalError,'last');
			}
			if(element.getAttribute("data-dojo-attach-point") == "locationWindow"){
				domConstruct.place(label,this.locationWindowError,'last');
			}
		}
	});

	add('device.portSettings',{
		rules : {

		}
	});

	add('device.stp',{
		rules : {

		}
	});

	add('device.stormControl',{
		rules : {

		}
	});

	add('config.statisticsCollection',{
		rules:{
			'deviceCRC': {
				number: true,
				range: [1,100],
				required: true
			},
			'deviceTxDrop': {
				number: true,
				range: [1,100],
				required: true
			},
			'deviceRxDrop': {
				number: true,
				range: [1,100],
				required: true
			},
			'deviceTxRetry': {
				number: true,
				range: [1,100],
				required: true
			},
			'deviceAirTime': {
				number: true,
				range: [1,100],
				required: true
			},
			'clientTxDrop': {
				number: true,
				range: [1,100],
				required: true
			},
			'clientRxDrop': {
				number: true,
				range: [1,100],
				required: true
			},
			'clientTxRetry': {
				number: true,
				range: [1,100],
				required: true
			},
			'clientAirTime': {
				number: true,
				range: [1,100],
				required: true
			}
		},
		errorPlacement : function(label,element){
			domConstruct.place(label,element.parentNode,'last');
		}
	});


	add('config.userProfileMgt',{
		rules : {
			'profileName' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'vlanObj.ipEl' : {
				required : true,
				ipObjectSaved : 'vlanObj'
			}
		},
		messages : {
			'vlanObj.ipEl' : {
				ipObjectSaved : speValidMsg.config.userProfileMgt.vlanObjIpElIpObjectSaved
			}
		}
	});

	add('config.userProfileQoS',{
		ignore : false,
		rules : {
			/*
			'horizontalSlider1.valueNode' : {
				range: function(el) {
					if(this.qosSwitch.checked) {
						return [parseInt(this.qosRateControl.rateLimit11abg), 540001];
					}
					return [0, 540001];
				}
			},
			'horizontalSlider2.valueNode' : {
				range: function(el) {
					if(this.qosSwitch.checked) {
						return [parseInt(this.qosRateControl.rateLimit11n), 2000001];
					}
					return [0, 2000001];
				}
			},
			'horizontalSlider3.valueNode' : {
				range: function(el) {
					if(this.qosSwitch.checked) {
						return [parseInt(this.qosRateControl.rateLimit11ac), 2000001];
					}
					return [0, 2000001];
				}
			},
			*/
			'horizontalSlider0.valueNode' : {
				range: function(el) {
					if(this.qosSwitch.checked) {
						return [parseInt(this.qosRateControl.rateLimit11ac), 2000001];
					}
					return [0, 2000001];
				}
			},
			'diffServ0' : {
				required : true,
				range : [0, 63]
			},
			'diffServ1' : {
				required : true,
				range : [0, 63]
			},
			'diffServ2' : {
				required : true,
				range : [0, 63]
			},
			'diffServ3' : {
				required : true,
				range : [0, 63]
			},
			'diffServ4' : {
				required : true,
				range : [0, 63]
			},
			'diffServ5' : {
				required : true,
				range : [0, 63]
			},
			'diffServ6' : {
				required : true,
				range : [0, 63]
			},
			'diffServ7' : {
				required : true,
				range : [0, 63]
			},
			'dot1p0' : {
				required : true,
				range : [0, 7]
			},
			'dot1p1' : {
				required : true,
				range : [0, 7]
			},
			'dot1p2' : {
				required : true,
				range : [0, 7]
			},
			'dot1p3' : {
				required : true,
				range : [0, 7]
			},
			'dot1p4' : {
				required : true,
				range : [0, 7]
			},
			'dot1p5' : {
				required : true,
				range : [0, 7]
			},
			'dot1p6' : {
				required : true,
				range : [0, 7]
			},
			'dot1p7' : {
				required : true,
				range : [0, 7]
			}
		},
		messages : {
			/*
			'horizontalSlider1.valueNode' : {
				range : speValidMsg.config.userProfileQoS.horizontalSlider1Range
			},
			'horizontalSlider2.valueNode' : {
				range : speValidMsg.config.userProfileQoS.horizontalSlider2Range
			},
			'horizontalSlider3.valueNode' : {
				range : speValidMsg.config.userProfileQoS.horizontalSlider3Range
			}
			*/
			'horizontalSlider0.valueNode' : {
				range : speValidMsg.config.userProfileQoS.horizontalSlider3Range
			}
		},
		errorPlacement : function(label,element){
			var dataValidId = element.getAttribute("data-validid");
			if(dataValidId && dataValidId.indexOf(".valueNode") != -1){
				 label.style.marginLeft = '0';
				 domConstruct.place(label,this[dataValidId.replace(".valueNode", "Area")],'after');
			} else {
			    domConstruct.place(label,element,'after');
			}
		}
	});

	add('config.rateLimitDialog',{
		rules : {
			'name' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'schedulingWeight0' : {
				required : true,
				range: [0,1000]
			},
			'schedulingWeight1' : {
				required : true,
				range: [0,1000]
			},
			'schedulingWeight2' : {
				required : true,
				range: [0,1000]
			},
			'schedulingWeight3' : {
				required : true,
				range: [0,1000]
			},
			'schedulingWeight4' : {
				required : true,
				range: [0,1000]
			},
			'schedulingWeight5' : {
				required : true,
				range: [0,1000]
			},
			'schedulingWeight6' : {
				required : true,
				range: [0,1000]
			},
			'schedulingWeight7' : {
				required : true,
				range: [0,1000]
			}
		},
		messages : {

		},
		errorPlacement : function(label,element){
//			if(element.getAttribute("data-dojo-attach-point").indexOf("schedulingWeight") != -1){
//				 label.style.marginLeft = '0';
//				 domConstruct.place(label,this.tr0,'after');
//			} else {
			    domConstruct.place(label,element,'after');
//			}
		}
	});

	add('config.trunkSettings', {
		rules: {
			'sourceVlan.ipEl': {
				required: true,
				ipObjectSaved: 'sourceVlan'
			},
			'allowVlan': {
				required: true
			}
		},
		messages: {
			'sourceVlan.ipEl': {
				ipObjectSaved: speValidMsg.config.trunkSettings.sourceVlanIpElIpObjectSaved
			}
		}

	});

	add('config.mirrorSettings', {
		ignore: false,
		rules: {
			'vlan': {
				required: function(el){
					return this.radioVal(this.mirrorEls) == "vlan";
				}
			}
		}
	});

	add('config.aggConfig', {
		rules: {
			'aggChannel': {
				required: true,
				number: true,
				range: [1,30]
			}
		}
	});


	add('config.vlan', {
		rules : {
			'nameEl' : {
				required : true,
				maxlength : 32
			},
			'vlanId' : {
				number : true,
				required : true,
				range : [1, 4094]
			},
			'defaultVlanId' : {
				number : true,
				required : true,
				range : [1, 4094]
			}
		}
	});

	add('config.nativeVlan',{
		rules : {
			'mgtVlan.ipEl' : {
				required : true,
				ipObjectSaved : 'mgtVlan'
			},
			'naVlan.ipEl' : {
				required : true,
				ipObjectSaved : 'naVlan'
			}
		},
		messages : {
			'mgtVlan.ipEl' : {
				ipObjectSaved : speValidMsg.config.nativeVlan.mgtVlanIpElIpObjectSaved
			},
			'naVlan.ipEl' : {
				ipObjectSaved : speValidMsg.config.nativeVlan.naVlanIpElIpObjectSaved
			}
		}
	});

	add('config.deviceTemplate',{
		rules: {
			'tplName': {
				required: true,
				hmChar : true,
				maxlength: 32,
				minlength: 1
			}
		}
	});

	add('config.accessConsole',{
		rules : {
			'name' : {
				required : true,
				maxlength: 32
			},
			'description': {
				maxlength: 64
			},
			'maxClient' : {
				required : true,
				range: [1, 64]
			},
			'devicePwd.norEl' : {
				required : true,
				minlength : 8,
				maxlength : 63
			},
			'devicePwd.cfmEl' : {
				equalTo : 'devicePwd.norEl'
			},
			'macObj.ipEl' : {
				ipObjectSaved : 'macObj',
				required : true
			},
		},
		messages : {
			'devicePwd.cfmEl' : {
				equalTo : speValidMsg.passwordNotMatch
			},
			'macObj.ipEl' : {
				ipObjectSaved : speValidMsg.config.accessConsole.macObjIpElIpObjectSaved
			}
		}
	});

	add('config.locationServer', {
		rules: {
			'name' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'description' : {
				maxlength : 64
			},
			// AEROHIVE
			'rssiChangeThreshold': {
				required: true,
				number: true,
				range: [1, 5]
			},
			'rssiValidPeriod': {
				required: true,
				number: true,
				range: [15, 1200]
			},
			'rssiHoldCount': {
				required: true,
				number: true,
				range: [0, 10]
			},
			'locationReportInterval': {
				required: true,
				number: true,
				range: [15, 1200]
			},
			'reportSuppressionCount': {
				required: true,
				number: true,
				range: [0, 80]
			},

			// AEROSCOUT
			'aeroscoutServerIp.ipEl': {
				required: true,
				ipObjectSaved: 'aeroscoutServerIp'
			},
			'aeroscoutTagRateThreshold': {
				required: true,
				number: true,
				range: [1, 100000]
			},
			'stationRateThreshold': {
				required: true,
				number: true,
				range: [1, 100000]
			},
			'rogueApRateThreshold': {
				required: true,
				number: true,
				range: [1, 100000]
			},

			// TAZMEN SNIFFER PROTOCAL
			'tazmenServerIp.ipEl': {
				required: true,
				ipObjectSaved: 'tazmenServerIp'
			},
			'port': {
				required: true,
				number: true,
				range: [1, 65535]
			},
			'multicastMacAddress': {
				required: true,
				length: 12,
				multicastMac: true
			},
			'tazmenTagRateThreshold': {
				required: true,
				number: true,
				range: [1, 100000]
			}
		},
		errorPlacement: function (label, element) {
			domConstruct.place(label, element.parentNode, 'last');
		}
	});

	add('config.syslogServer', {
		rules: {
			'syslogIp.ipEl': {
				required: true,
				ipObjectSaved: 'syslogIp'
			},
			'syslogDescription': {
				maxlength: 64
			},
			'name' : {
				required : true,
				hmChar : true,
				maxlength : 32
			},
			'description' : {
				maxlength : 64
			}
		}
	});

	add('config.bonjourGatewaySettings', {
		rules: {
			'nameNode': {
				required: true,
				hmChar : true,
				maxlength: 32
			},
			'descriptionNode': {
				maxlength: 64
			},
			'scanVlansNode': {
				required: true,
				maxlength: 255,
				hmChar : true,
				vlanrange: true
			}
		}
	});

	add('device.bonjourGatewaySettings', {
		rules: {
			'priorityNode': {
				required: function () {
					return !this.isMultiEdit;
				},
				number: true,
				range: [0, 255]
			},
			'realmNameNode': {
				maxlength: 128,
				hmChar : true
			}
		}
	});

	add('config.addBonjourFilterRule', {
		rules: {
			'serviceNode.ipEl': {
				required: true,
				ipObjectSaved: 'serviceNode'
			},
			'fromVlanGroupNode.ipEl': {
				required: true,
				ipObjectSaved: 'fromVlanGroupNode'
			},
			'toVlanGroupNode.ipEl': {
				required: true,
				ipObjectSaved: 'toVlanGroupNode'
			},
			'maxWirelessHopNode': {
				range: [0, 100]
			},
			'realmNode': {
				required: true
			}
		},
		messages: {
			'serviceNode.ipEl': {
				ipObjectSaved: speValidMsg.config.addBonjourFilterRule.serviceNodeIpElIpObjectSaved
			},
			'fromVlanGroupNode.ipEl': {
				ipObjectSaved: speValidMsg.config.addBonjourFilterRule.fromVlanGroupNodeIpElIpObjectSaved
			},
			'toVlanGroupNode.ipEl': {
				ipObjectSaved: speValidMsg.config.addBonjourFilterRule.toVlanGroupNodeIpElIpObjectSaved
			}
		},
		errorPlacement: function (label, element) {
			var ddap = domAttr.get(element, 'data-dojo-attach-point');

			if (ddap === 'maxWirelessHopNode') {
				domConstruct.place(label, element, 'after');
			} else {
				var refNode = element.parentNode.parentNode.parentNode;
				domClass.add(label, 'mt5 fn-inline-block');
				domConstruct.place(label, refNode, 'after');
			}
		}
	});

	add('config.userAssignment', {
		rules: {
			'assignName': {
				required: true,
				hmChar : true,
				maxlength: 32
			},
			'assignDesc': {
				maxlength: 64
			}
		}
	});

	add('config.radiusAttribute', {
		rules: {
			'tunnelValue': {
				required: function () {
					return !this.tunnelValue.disabled;
				},
				maxlength: 32,
				stdRadAttrRange: [1, 4095]
			},
			'standardValue': {
				required: function () {
					return !this.standardValue.disabled;
				},
				maxlength: 32
			}
		},
		errorPlacement: function (label, element) {
			var errorContainerNode = element.parentNode.getElementsByTagName('p')[0];
			domConstruct.place(label, errorContainerNode, 'last');
		}
	});

	add('config.trafficFilter',{
		rules : {
			'name' : {
				required : true,
				hmChar : true
			}
		}
	});

	add('config.walledGarden', {
		rules: {
			'walledGardenIP.ipEl': {
				ipObjectSaved: 'walledGardenIP',
				required: true
			},
			'protocolNumber': {
				required: true,
				number: true,
				max: 255,
				min: 0
			},
			'PortNumber': {
				required: true,
				number: true,
				max: 65535,
				min: 1
			}
		}
	});

	add('plan.plannedDeviceEdit', {
		rules : {
			'hostName' : {
				required : true
			}
		},
		errorPlacement : function(label, element) {
			var labelContainer = domConstruct.create("div", {
				className: 'form-error-wrp',
			});
			labelContainer.appendChild(label);
			domConstruct.place(labelContainer, element, 'after');
		}
	});

	add('plan.folderClone', {
		rules : {
			'name' : {
				required : true
			}
		},
		errorPlacement : function(label, element) {
			var labelContainer = domConstruct.create("div", {
				className: 'form-error-wrp',
			});
			labelContainer.appendChild(label);
			domConstruct.place(labelContainer, element, 'after');
		}
	});

	add('plan.globalSettings',{
		rules: {
			'pollingInterval' : {
				required: true,
				integer : true,
				range: [30,900]
			},
			'locationWindow' : {
				number : true,
				maxlength : 2,
				range: [1,99],
				required : function(el) {
					return this.intervalReported.checked;
				}
			}
		},
		errorPlacement : function(label, element) {
			var labelContainer = domConstruct.create("div", {
				className: 'form-error-wrp',
			});
			labelContainer.appendChild(label);
			domConstruct.place(labelContainer, element.parentNode, 'last');
		}
	});

	add('plan.location', {
		rules : {
			'locationName' : {
				required : true,
				maxlength: 32
			},
			'deviceElevationAsLoc' : {
				positiveAnd0: function(el) {
					if (!this.isOutdoor.checked) {
						return false;
					}

					return true;
				}
			},
			'metricWidthAsLoc' : {
				required : function(el) {
					if (!this.isOutdoor.checked || this.backgroundAsLoc.innerHTML != '') {
						return false;
					}

					return true;
				},
				range: function() {
					var min = 1, max=this.lengthUnit1AsLoc.domNode.value == mapConstant.LengthUnit.METERS?1000:utils.metersToFeet(1000, 5);
					return [min, max]
				}
			},
			'metricHeightAsLoc' : {
				required : function(el) {
					if (!this.isOutdoor.checked || this.backgroundAsLoc.innerHTML != '') {
						return false;
					}

					var reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
					return reg.test(this.metricWidthAsLoc.value);
				},
				range: function() {
					var min = 1, max=this.lengthUnit1AsLoc.domNode.value == mapConstant.LengthUnit.METERS?1000:utils.metersToFeet(1000, 5);
					return [min, max]
				}
			},
			'mapWidthAsLoc' : {
				required : function(el) {
					if (!this.isOutdoor.checked || this.backgroundAsLoc.innerHTML != '') {
						return true;
					}

					return false;
				},
				range: function() {
					var min = 1, max=this.lengthUnit2AsLoc.domNode.value == mapConstant.LengthUnit.METERS?1000:utils.metersToFeet(1000, 5);
					return [min, max]
				}
			}
		},
		messages : {
			'metricWidth': {
				range: Validate.format(speValidMsg.plan.metricWidthMax)
			},
			'metricHeight': {
				range: Validate.format(speValidMsg.plan.metricHeightMax)
			},
			'mapWidth': {
				range: Validate.format(speValidMsg.plan.mapWidthMax)
			}
		},
		errorPlacement : function(label, element) {
			var labelContainer = domConstruct.create("div", {
				className: 'form-error-wrp',
			});
			labelContainer.appendChild(label);

			if (element.getAttribute("data-dojo-attach-point") == "metricWidthAsLoc"
				|| element.getAttribute("data-dojo-attach-point") == "metricHeightAsLoc"
					|| element.getAttribute("data-dojo-attach-point") == "floorLossAsLoc"
						|| element.getAttribute("data-dojo-attach-point") == "deviceElevationAsLoc"
							|| element.getAttribute("data-dojo-attach-point") == "mapWidthAsLoc") {
				domConstruct.place(labelContainer, element.parentNode, 'last');
			} else {
				domConstruct.place(labelContainer, element, 'after');
			}
		}
	});

	add('plan.building', {
		rules : {
			'buildingName' : {
				required : true,
				maxlength: 32
			},
			'locationName1' : {
				required : function(el) {
					return this.parentId10.domNode.value == "new";
				},
				maxlength: 32
			},
			'parentId11.domNode' : {
				required : function(el) {
					return this.parentId10.domNode.value == "new";
				}
			}
		},
		errorPlacement : function(label, element) {
			var labelContainer = domConstruct.create("div", {
				className: 'form-error-wrp',
			});
			labelContainer.appendChild(label);
			domConstruct.place(labelContainer, element, 'after');
		}
	});

	add('plan.floor', {
		ignore: false,
		rules : {
			'floorName' : {
				required : true,
				maxlength: 32
			},
			'parentId2.domNode' : {
				required : true
			},
			'floorLoss' : {
				positiveAnd0: true
			},
			'deviceElevation' : {
				positiveAnd0: true
			},
			'metricWidth' : {
				required : function(el) {
					if (this.background.innerHTML != '') {
						return false;
					}

					return true;
				},
				range: function() {
					var min = 1, max=this.lengthUnit1.domNode.value == mapConstant.LengthUnit.METERS?1000:utils.metersToFeet(1000, 5);
					return [min, max]
				}
			},
			'metricHeight' : {
				required : function(el) {
					if (this.background.innerHTML != '') {
						return false;
					}

					var reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
					return reg.test(this.metricWidth.value);
				},
				range: function() {
					var min = 1, max=this.lengthUnit1.domNode.value == mapConstant.LengthUnit.METERS?1000:utils.metersToFeet(1000, 5);

					return this.background.innerHTML != '' ? [-Infinity,Infinity] : [min, max]
				}
			},
			'mapWidth' : {
				required : function(el) {
					if (this.background.innerHTML != '') {
						return true;
					}

					return false;
				},
				range: function() {
					var min = 1, max=this.lengthUnit2.domNode.value == mapConstant.LengthUnit.METERS?1000:utils.metersToFeet(1000, 5);
					return [min, max]
				}
			}
		},
		messages : {
			'parentId2.domNode' : {
				required : speValidMsg.plan.floor.parentId2Required
			},
			'metricWidth': {
				range: Validate.format(speValidMsg.plan.metricWidthMax)
			},
			'metricHeight': {
				range: Validate.format(speValidMsg.plan.metricHeightMax)
			},
			'mapWidth': {
				range: Validate.format(speValidMsg.plan.mapWidthMax)
			}
		},
		errorPlacement : function(label, element) {
			var labelContainer = domConstruct.create("div", {
				className: 'form-error-wrp',
			});
			labelContainer.appendChild(label);

			if (element.getAttribute("data-dojo-attach-point") == "metricWidth"
				|| element.getAttribute("data-dojo-attach-point") == "metricHeight"
					|| element.getAttribute("data-dojo-attach-point") == "floorLoss"
						|| element.getAttribute("data-dojo-attach-point") == "deviceElevation"
							|| element.getAttribute("data-dojo-attach-point") == "mapWidth"
								|| element.getAttribute("data-dojo-attach-point") == "parentId2") {
				domConstruct.place(labelContainer, element.parentNode, 'last');
			} else {
				domConstruct.place(labelContainer, element, 'after');
			}
		}
	});

	add('plan.library', {
		rules : {
			'information' : {
				maxlength: 64
			}
		},
		errorPlacement : function(label, element) {
			var labelContainer = domConstruct.create("div", {
				className: 'form-error-wrp',
			});
			labelContainer.appendChild(label);
			domConstruct.place(labelContainer, element, 'after');
		}
	});

	add('plan.afterPerimeter', {
		rules : {
			'floorLoss' : {
				required : true,
				positiveAnd0: true
			},
			'deviceElevation' : {
				required : true,
				positiveAnd0: true
			}
		},
		errorPlacement : function(label, element) {
			var labelContainer = domConstruct.create("div", {
				className: 'form-error-wrp',
			});
			labelContainer.appendChild(label);

			if (element.getAttribute("data-dojo-attach-point") == "floorLoss"
						|| element.getAttribute("data-dojo-attach-point") == "deviceElevation") {
				domConstruct.place(labelContainer, element.parentNode, 'last');
			} else {
				domConstruct.place(labelContainer, element, 'after');
			}
		}
	});

	add('plan.deviceLocation', {
		rules : {
			'latitude' : {
				range:[-90,90]
			},
			'longitude' : {
				range:[-180,180]
			}
		}
	});

	add('plan.scalingTool', {
		rules : {
			'width' : {
				required : function(el) {
					if (this.cbSizeManually.checked) {
						return false;
					}

					return true;
				},
				positive: function(el) {
					if (this.cbSizeManually.checked) {
						return false;
					}

					return true;
				},
				maxSF: function(el) {
					var maxValue = this.lengthUnit0.domNode.value == mapConstant.LengthUnit.METERS ? 1000 : utils.metersToFeet(1000, 5);
					return Math.floor(maxValue);
				}
			},
			'height' : {
				positive: function(el) {
					if (this.cbSizeManually.checked) {
						return false;
					}

					var reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
					return reg.test(this.width.value);
				},
				maxSF: function(el) {
					var maxValue = this.lengthUnit0.domNode.value == mapConstant.LengthUnit.METERS ? 1000 : utils.metersToFeet(1000, 5);
					return Math.floor(maxValue);
				}
			},
			'size' : {
				required : function(el) {
					if (this.cbSizeManually.checked) {
						return true;
					}

					return false;
				},
				positive: true,
				maxSF: function(el) {
					var isHorizontal = this._isHorizontal,
						pixels = (this.scalingCrosser && this.scalingCrosser.getPixelLength()) || (isHorizontal ? this.imageWH.w : this.imageWH.h),
						maxValue = (1000 * pixels) / (isHorizontal ? this.imageWH.w : this.imageWH.h);

                	if (this.lengthUnit1.domNode.value == mapConstant.LengthUnit.FEET) {
                		maxValue = utils.metersToFeet(maxValue, 5);
                	}

					return Math.floor(maxValue);
				}
			}
		},
		messages : {
			'width': {
				maxSF: Validate.format(speValidMsg.plan.metricWidthMax)
			},
			'height': {
				maxSF: Validate.format(speValidMsg.plan.metricHeightMax)
			},
			'size': {
				maxSF: Validate.format(validMsg.max)
			}
		},
		errorPlacement : function(label, element) {
			var labelContainer = domConstruct.create("div", {
				className: 'form-error-wrp',
			});
			labelContainer.appendChild(label);

			if (element.getAttribute("data-dojo-attach-point") == "width"
				|| element.getAttribute("data-dojo-attach-point") == "height"
					|| element.getAttribute("data-dojo-attach-point") == "size") {
				domConstruct.place(labelContainer, element.parentNode, 'last');
			} else {
				domConstruct.place(labelContainer, element, 'after');
			}
		}
	});



	add('maps.startPage', {
		rules: {
			'organization': {
				required: true
			},
			'street': {
				required: true
			},
			'city': {
				required: true
			}
		},
		errorPlacement : function(label, element) {
			var labelContainer = domConstruct.create("div", {
				className: 'form-error-wrp',
			});
			labelContainer.appendChild(label);
			domConstruct.place(labelContainer, element.parentNode, 'last');
		}
	});

	add('config.createCert', {
		rules: {
			'commName': {
				required: true,
				maxlength: 64,
				speCharacter: true
			},
			'orgName': {
				required: true,
				maxlength: 64,
				speCharacter: true
			},
			'orgUnit': {
				required: true,
				maxlength: 64,
				speCharacter: true
			},
			'locName':{
				required: true,
				maxlength: 64,
				speCharacter: true
			},
			'prvName': {
				required: true,
				maxlength: 64,
				speCharacter: true
			},
			'description': {
				maxlength: 64
			},
			'email': {
				email: true,
				maxlength: 64
			},
			'countryCode': {
				required: true,
				textchar: true,
				minlength: 2,
				maxlength: 2
			},
			'validity': {
				required: true,
				number: true,
				range: [1,7300]
			},
			'CSRValid': {
				number: true,
				range: [1,7300]
			},
			'certPwd.norEl': {
				required: function(){
					var certType = this.radioVal(this.certEls);
					return certType !== '1' && certType !== '2';
				},
				maxlength: 20,
				minlength: 4
			},
			'certPwd.cfmEl' : {
				equalTo : 'certPwd.norEl'
			},
			'httpsName': {
				required: true,
				speCharacter: true,
				maxlength: 20
			},
			'userFQDN': {
				minlength: 0,
				maxlength: 128,
				speCharacter: true
			},
			'FQDN': {
				minlength: 0,
				maxlength: 128,
				speCharacter: true
			},
			'IPAddress': {
				ip : true
			},
			'csrFileName': {
				required: true
			}

		},
		messages : {
			'certPwd.cfmEl' : {
				equalTo : speValidMsg.passwordNotMatch
			}
		}
	});

	add('config.deviceUpdate', {
		rules: {
			'rebootAfter': {
				required: function(el){
					return this.radioVal(this.rebootEls) == '1';
				},
				range: [0,3600]
			},
			'activeDate.focusNode': {
				required: function(){
					return this.radioVal(this.rebootEls) == '2';
				}
			},
			'activeTime.focusNode': {
				required: function(){
					return this.radioVal(this.rebootEls) == '2';
				}
			}
		},
		errorPlacement: function(label, element){
			var attr = element.getAttribute('data-dojo-attach-point').replace(/\-\w+$/,'');
			domConstruct.place(label,this[attr + 'Error'],'first');
		}
	});

	add('config.radiusserver.userDatabase', {
		ignore: false,
		rules: {
			'retryInterval': {
				number: true
			},
			'localInterval': {
				number: true
			},
			'remoteInterval': {
				number: true
			},
			'cacheLife': {
				number: true
			},
			'groupAttr': {
				required: true,
				hmChar : true,
				maxlength: 32
			}
		},
		errorPlacement: function (label, element) {
			domConstruct.place(label, element.parentNode, 'last');
		}
	});

	add('config.radiusserver.approvedRadius', {
		rules: {
			'ipAddress.ipEl' : {
				required : true,
				ipObjectSaved : 'ipAddress'
			},
			'secret.norEl': {
				required: true,
				maxlength: 31
			},
			'secret.cfmEl': {
				equalTo: 'secret.norEl'
			},
			'description': {
				maxlength: 128
			}
		}
	});

	add('config.radiusserver.LDAPServer', {
		rules : {
			'name' : {
				required : true,
				maxlength: 32
			},
			'description' : {
				maxlength: 64
			},
			'serverIp.ipEl': {
				required: true,
				ipObjectSaved: 'serverIp'
			},
			'baseDN' : {
				required: true,
				maxlength: 256
			},
			'bindDN': {
				required: true,
				maxlength: 256
			},
			'bindDnPassword.norEl': {
				required: true,
				maxlength: 64
			},
			'bindDnPassword.cfmEl' : {
				equalTo : 'bindDnPassword.norEl'
			},
			'destinationPort': {
				number: true,
				range: [1, 65535]
			},
			'keyFilePWD.norEl': {
				maxlength: 64
			},
			'keyFilePWD.cfmEl' : {
				equalTo : 'keyFilePWD.norEl'
			}
		},
		messages: {
			'bindDnPassword.cfmEl':{
				equalTo: speValidMsg.passwordNotMatch
			},
			'keyFilePWD.cfmEl' : {
				equalTo : speValidMsg.passwordNotMatch
			}
		}
	});

	add('config.radiusserver.SecurityOptions', {
		ignore: false,
		rules: {
			'keyFilePWD.norEl': {
				maxlength: 64
			},
			'keyFilePWD.cfmEl': {
				equalTo: 'keyFilePWD.norEl'
			},
			'authPort': {
				number: true,
				range: [1, 65535]
			},
			'activeSessionLimit': {
				number: true,
				range: [0, 15]
			},
			'activeSessionAgeTimeout': {
				number: true,
				range: [30, 300000000]
			}
		},
		messages: {
			'keyFilePWD.cfmEl':{
				equalTo: speValidMsg.passwordNotMatch
			}
		}
	});

	add('config.radiusserver.ADStep0', {
		rules: {
			'name': {
				required: true,
				maxlength: 32
			},
			'domain': {
				required: true,
				maxlength: 64
			},
			'ip.ipEl': {
				required: true,
				ipObjectSaved : 'ip'
			},
			'basedn': {
				required: true,
				maxlength: 256
			},
			'shortDomain': {
				required: true,
				maxlength: 64
			},
			'realm': {
				required: true,
				maxlength: 64
			},
			'computerOu': {
				maxlength: 256
			}
		}
	});

	add('config.radiusserver.ADStep1', {
		rules: {
			'dns.ipEl': {
				required: function () {
					return this.updateCheck.checked;
				},
				ipObjectSaved : 'dns'
			}
		}
	});

	add('config.radiusserver.ADStep3', {
		rules: {
			'domain': {
				required: true,
				maxlength: 32
			},
			'domainPassword.norEl': {
				required: true,
				maxlength: 64
			},
			'domainPassword.cfmEl': {
				equalTo: 'domainPassword.norEl'
			}
		},
		messages: {
			'domainPassword.cfmEl':{
				equalTo: speValidMsg.passwordNotMatch
			}
		}
	});

	add('config.radiusserver.ADStep5', {
		rules: {
			'userDomain': {
				required: true,
				maxlength: 256
			},
			'userPassword.norEl': {
				required: true,
				maxlength: 64
			},
			'userPassword.cfmEl': {
				equalTo: 'userPassword.norEl'
			}
		},
		messages: {
			'userPassword.cfmEl':{
				equalTo: speValidMsg.passwordNotMatch
			}
		}
	});

	add('config.radius.optionSettings', {
		rules: {
			'retryInterval': {
				required: true,
				range : [60,100000000]
			},
			'updatedInterval': {
				required: true,
				range : [10,100000000]
			}
		}
	});

	add('config.createOSObject', {
		rules: {
			'nameNode': {
				required: true,
				hmChar : true,
				maxlength: 32
			},
			'descriptionNode': {
				maxlength: 64
			},
			'dhcpOSTypeNode.ipEl': {
				required: true,
				maxlength: 32
			},
			'dhcpOption55Node': {
				required: true,
				hmChar : true,
				paramRequestList: true
			},
			'httpOSTypeNode.ipEl': {
				required: true,
				maxlength: 32
			},
			'httpDescNode': {
				maxlength: 64
			}
		}
	});


	/*idm begin*/
	add('config.idm.userGroup', {
		rules: {
			'userGroupName': {
				required: true,
				maxlength: 32
			},
			'sessionCacheTime': {
				required: true,
				number: true,
				range: [0, 7200]
			},
			'passwordLength': {
				required: true,
				number: true,
				range: [8, 63]
			},
			'description': {
				maxlength: 64
			},
			'reauthorizationTime': {
				required: function() {
					return this.enableReauthorization.checked;
				},
				number: true,
				range: function() {
					if (this.enableReauthorization.checked) {
						return [600, 86400];
					} else {
						return [0, Math.pow(2, 31)];
					}
				}
			},
			'timeAfterCreateValue': {
				required: true,
				number: true,
				range: [1, 100]
			},
			'dropDeadValue': {
				required: true,
				number: true,
				range: [1, 30]
			}
		},
		errorPlacement: function(label, element){
			var attr = element.getAttribute('data-dojo-attach-point');
			if(attr === 'passwordLength') {
				domConstruct.place(label, element, 'after');
			}else if(attr === 'sessionCacheTime') {
				domConstruct.place(label, element.parentNode, 4);
			}else {
				domConstruct.place(label, element.parentNode, 'last');
			}
		}
	});

	add('config.idm.user', {
		rules: {
			name: {
				required: true
			}
		}
	});

	/*idm end*/

	add('config.dataTimeLimit', {
		rules: {
			'timeLimitCnt': {
				required: true,
				number: true,
				range: function() {
					var timeLimitUnitVal = +this.timeLimitUnit.domNode.value,
						timeLastUnitVal = +this['lastUnit-time'].domNode.value,
						max = Math.ceil(timeLastUnitVal / timeLimitUnitVal * this.timeLastCnt.value);

					if (max === 1) {
						return [0, Math.pow(2, 31) - 1];
					} else {
						return [1, max - 1];
					}
				},
				shorterTo: function() {
					var timeLimitUnitVal = this.timeLimitUnit.domNode.value - 0,
						timeLastUnitVal = this['lastUnit-time'].domNode.value - 0,
						difVal = timeLimitUnitVal - timeLastUnitVal;

					switch(true) {
						case difVal === 0:
							return {
								value: this.timeLastCnt.value
							};
							break;
						case difVal < 0:
							return {
								value: parseInt(this.timeLastCnt.value) * timeLastUnitVal/timeLimitUnitVal
							};
							break;
					}
				},
				positiveInt: true
			},
			'timeLastCnt': {
				required: true,
				number: true,
				range: function() {
					var max = 2592000 / this['lastUnit-time'].domNode.value;
					return [1, parseInt(max)];
				}
			},
			'dataLimitCnt': {
				required: true,
				number: true,
				range: function() {
					var max = (Math.pow(2, 31) - 1) / this.dataLimitUnit.domNode.value;
					return [1, parseInt(max)];
				}
			},
			'dataLastCnt': {
				required: true,
				number: true,
				range: function() {
					var max = 2592000 / this['lastUnit-data'].domNode.value;
					return [1, parseInt(max)];
				}
			},
			'timeGraceCnt': {
				required: true,
				number: true,
				range: function() {
					var max = 2592000 / this.timeGraceUnit.domNode.value;
					return [1, parseInt(max)];
				}
			},
			'dataGraceCnt': {
				required: true,
				number: true,
				range: function() {
					var max = 2592000 / this.dataGraceUnit.domNode.value;
					return [1, parseInt(max)];
				}
			}
		},
		errorPlacement: function(label, element){
			var attr = element.getAttribute('data-dojo-attach-point');
			if(attr === 'timeLimitCnt' || attr === 'dataLimitCnt') {
				domConstruct.place(label, element.parentNode, 'after');
			}else {
				domConstruct.place(label, element.parentNode, 'last');
			}
		}
	});

	add('config.idm.user', {
		rules: {
			'name': {
				required: true
			},
			'passwordEl.norEl': {
				required: true,
				authPassword: function() {
					var curVal = this.group.get('value'),
						curGroup, authObj;
					if (!curVal) {
						return;
					}
					curGroup = this.group.get('idData')[curVal];
					authObj = {
						bLetter: curGroup.passwordRuleSettings.enableCharTypesIncludeLetters,
						bNum: curGroup.passwordRuleSettings.enableCharTypesIncludeDigits,
						bSpecial: curGroup.passwordRuleSettings.enableCharTypesIncludeSpecialChars,
						length: curGroup.passwordRuleSettings.passwordLength
					};
					return authObj;
				}
			},
			'passwordEl.cfmEl': {
				equalTo: 'passwordEl.norEl'
			}
		}
	});
	/*idm end*/

	add('cert.importCert', {
		rules: {
			certFile: {
				required: true
			}
		},
		errorPlacement: function(label, element){
			label.style.marginLeft = '0';
			domConstruct.place(label, this.errorCtn, 'first');
		}
	});

	add('troubleshooting.issueNotes', {
		rules: {
			comments: {
				required: true
			},
			emailTextBox: {
				required : function(el) {
					return this.emailCheckBox.checked;
				},
				multipleEmail : function(el) {
					return this.emailCheckBox.checked;
				}
			}
		},
		errorPlacement: function(label, element){
			if(name == 'emailTextBox') {
				domConstruct.place(label, this.textError);
			} else {
				domConstruct.place(label,element,'after');
			}
		}
	});

	add('troubleshooting.takeActionForm', {
		rules: {
			// comments: {
			// 	required: true
			// },
			emailTextBox: {
				required : function(el) {
					return this.emailCheckBox.checked;
				},
				multipleEmail : function(el) {
					return this.emailCheckBox.checked;
				}
			}
		},
		errorPlacement: function(label, element){
			// if(this.textError) {
			// 	domConstruct.place(label, this.textError);
			// } else {
				domConstruct.place(label,element,'after');
			// }
		}
	});

	add('commonObject.appDetectionRules', {
		rules: {
			'txtAppNameNode': {
				required: true,
				hmChar : true,
				maxlength: 32
			},
			'txtDescriptionNode': {
				maxlength: 64
			},
			'appGroupNode.ipEl': {
				required: true,
				ipObjectSaved : 'appGroupNode'
			},
			'hostNameNode': {
				required: true,
				hmChar : true,
				wildcardHostName: true
			},
			'serverIPAddressNode': {
				required: true,
				ipOrIpRange: true
			},
			'portNode': {
				required: function () {
					// required if `serverIPAddressNode` is hidden
					var el = this.serverIPAddressNode;

					return (el.offsetWidth == 0 && el.offsetHeight == 0) ||
						el.style.display == 'none';
				},
				hmChar : true,
				range: [1, 65535]
			}
		},
		messages: {
			'appGroupNode.ipEl': {
				ipObjectSaved: speValidMsg.commonObject.appDetectionRules.appGroupNodeIpElIpObjectSaved
			}
		},
		errorPlacement: function (label, element) {
			domConstruct.place(label, element.parentNode, 'last');
		}
	});

	add('device.settings.netdumpRules', {
		rules: {
			'serverIp': {
				required: function () {
					return this.enable.checked;
				},
				ip: true
			},
			'filename': {
				maxlength: 32
			},
			'vlanId': {
				range : [1,4094]
			},
			'nativeVlanId': {
				range : [1,4094]
			},
			'deviceIp': {
				required: function () {
					return this.staticIp.checked;
				},
				ip: true
			},
			'deviceIpNetmask': {
				required: function () {
					return this.staticIp.checked;
				},
				netmask: true
			},
			'gatewayIp': {
				required: function () {
					return this.staticIp.checked;
				},
				ip: true
			}
		},
		errorPlacement: function (label, element) {
			domConstruct.place(label, element.parentNode, 'last');
		}
	});

	add('util.reusableObject', {
		rules: {
			'nameEl': {
				required: true,
				maxlength: 32
			}
		},
		errorElement : 'p'
	});

	add('privateapp.info', {
		 ignore: false,
		rules: {
			'organization': {
				'required': true
			},
			'industry.selEl': {
				'required': true
			},
			'address': {
				'required': true
			},
			'email': {
				'required': true,
				'email': true
			},
			'termsCheck': {
				'required' : true
			},
			'entitlekey': {
				'required' : function () {
					return !this.trialCheck.checked;
				}
			}
		},
		messages: {
			'termsCheck' : {
				required : speValidMsg.privateapp.info.errors.noTermsAccepted
			},
			'entitlekey' : {
				required : speValidMsg.privateapp.info.errors.noLicenseKey
			}
		},
		errorPlacement: function (label, element) {
			domConstruct.place(label, element.parentNode, 'last');
		}
	});

	add('privateapp.setting', {
		rules: {
			'hostname': {
				'required': true,
				'domain' : true
			},
			'port': {
				number : true,
				range: [1,65535]
			},
			'senderaddress': {
				'required': true,
				'email': true
			}
		},
		errorPlacement: function (label, element) {
			var attr = element.getAttribute('data-dojo-attach-point');
			label.style.marginLeft = "0";
			errorNode = this[attr+'Error'];
			errorNode && (attr == 'hostname' || attr == 'port') && dojo.removeClass(this.emailServerErrorSpace, 'fn-hidden');
			errorNode && errorNode.appendChild(label);
		}
	});

	add('privateapp.csr', {
		rules: {
			'commonName': {
				'required': true,
				'domain' : true
			}
		}
	});

	add('system.setting', {
		rules: {
			'hostname': {
				'required': true,
				'domain' : true
			},
			'port': {
				number : true,
				range: [1,65535]
			},
			'senderaddress': {
				'required': true,
				'email': true
			},
			'ntpHostName': {
				'required': true,
				'domain' : true
			}
		},
		errorPlacement: function (label, element) {
			var attr = element.getAttribute('data-dojo-attach-point');
			if (attr == 'ntpHostName') {
				domConstruct.place(label, element.parentNode, 'last');
				return;
			}
			label.style.marginLeft = "0";
			errorNode = this[attr+'Error'];
			errorNode && (attr == 'hostname' || attr == 'port') && dojo.removeClass(this.emailServerErrorSpace, 'fn-hidden');
			errorNode && errorNode.appendChild(label);
		}
	});


	add('config.radiusClient', {
		rules: {
			'name': {
				required: true,
				maxlength: 32,
			},
			'description': {
				maxlength: 64
			}
		}
	});

	add('report.create', {
		rules: {
			'shareEmail.inputEl': {
				email: true
			}
		},
		errorPlacement : function(label,element){
			label.style.marginLeft = '0';
			domConstruct.place(label,this.emailErr,'last');
		}
	});


	add('config.notification', {
		rules: {
			'userName': {
				required: true,
				maxlength: 32
			},
			'smsContent': {
				required: true,
				maxlength: 200
			},
			'iconURL': {
				required: true,
				validURL: true,
				maxlength: 50
			},
			'logoURL': {
				required: true,
				validURL: true,
				maxlength: 50
			},
			'emailContent': {
				required: true,
				maxlength: 1024
			}
		}
	});

	add('config.linkrule', {
		rules: {
			'text': {
				required: true,
				maxlength: 32,
			},
			'url': {
				required: true,
				validURL: true,
				maxlength: 50
			}
		}
	});

	add('config.pseprofile', {
		rules : {
			'nameEl' : {
				required : true,
				maxlength : 32
			},
			'powerLimit' : {
				required : true,
				number : true,
				range : function() {
					if(this.powerMode.domNode.value == "_8023AF") {
						return [100, 16000];
					} else if(this.powerMode.domNode.value == "_8023AT") {
						return [100,32000];
					}

					return [100,32000];
				}

			}
		}
	});

	add('config.cwpDomain', {
		rules: {
			'dName': {
				required: true,
				domain: true
			}
		}
	});


	add('config.cliSupplementObject',{
		rules : {
			'name' : {
				required : true,
				maxlength: 32,
				hmChar : true
			},
			'description' : {
				maxlength : 64
			},
			'cli': {
				required : true
			}
		}
	});
	/*** for registerUI ***/
	add('registerGuest',{
		rules : {
			'val-firstName' : {
				// required : true,
				maxlength: 128
			},
			'val-lastName': {
				maxlength: 128
			},
			'val-representing': {
				maxlength: 128
			},
			'val-toVisit' : {
				required : function(){
					return this.enableEmailApproval;
				},
				email: function(){
					return this.enableEmailApproval;
				},
				maxlength: 128
			},
			'val-email': {
				email: true,
				maxlength: 128
			},
			'numArea': {
				required: true
			},
			'phoneNum': {
			},
			'phone' : {
				phone: true
			}
		}
	});

	add('registerGroup',{
		rules : {
			'purpose' : {
				required : true,
				maxlength: 128,
				hmChar : true
			}
		}
	});

	add('registerInformation',{
		rules : {
			'name' : {
				required : true,
				maxlength: 31,
				nameChar: true
			},
			'contact' : {
				required : true,
				emailAndPhone: true
			}
		}
	});

	add('operationDialog',{
		rules : {
			'telphone': {
				required: true
			},
			'phone' : {
				phone: true
			},
			'email' : {
				required : true,
				email: true,
				maxlength: 128
			}
		}
	});

	return obj;
});
