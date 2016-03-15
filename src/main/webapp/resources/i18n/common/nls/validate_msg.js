define({
	root : ({

		def : {
			// From validate widget
			required : 'This field is required.',
			textchar : 'Must be A to Z and a to z.',
			maxlength: "Please enter no more than {0} characters.",
			minlength: "Please enter at least {0} characters.",
			range: "Please enter a value from {0} to {1}.",
			max: "Please enter a value less than or equal to {0}.",
			min: "Please enter a value greater than or equal to {0}.",
			number : 'Please enter a valid number.',
			equalTo : 'The two fields must be equal.',
			email: 'The value must be an email address.',
			length: 'Please enter {0} characters exactly.',
			speCharacter: '$ and # are not allowed here.'
			// From our customer method
		},

		spe : {
			name: "The value cannot contain spaces or double quotes",
			multicastMac: "The value must be a multicast MAC address.",
			notMulticastMac: "The value must not be a multicast MAC address.",
			inviteKey: "Invalid Invite Key.",
			validatePassword: "Password requires at least 1 numeral and 1 capital letter.",
			maxPasswordLength: "Password exceeds 32 characters.",
			allowedVlans: 'The value can be "all" (all VLANs in the network policy), individual VLANs, or VLAN ranges. SR series devices support up to 255 VLANs, from 1 to 4094. Separate entries by commas. For example, enter "1, 3", "5-12", or "all".',
			ipInSubnet: "The {0} must be in the same subnet as {1}.",
			netmask: "The value must be a netmask.",
			multicastIp: "The value must be a valid multicast IP address.",
			ipObjectSaved: "The IP object must be saved first.",
			childLength: "Please select one IP object.",
			permission: "At least one permission type must be selected.",
			nameChar: "Please enter valid characters.",
			hmChar : '{0} is an invalid character.',
			snLength: "Only number or letter allowed and size must be {0}.",
			integer: "The value must be an integer.",
			positive: "The value must be a positive number.",
			positiveAnd0: "The value must be greater than or equal to 0.",
			positiveInt: 'The value must be a positive integer.',
			wordChar: "Illegal characters.",
			multipleEmail: "The email address is invalid.",
			ip: "Please enter a valid IP address.",
			hexNumber: "Please enter a valid hex number",
			domain: "Please enter a valid domain.",
			wildcardHostName: "Please enter a valid host name.",
			ipOrIpRange: "Please enter a valid IP address or IP address range.",
			macAddress: "The value must be a MAC address.",
			macoui: "The value must be a MAC OUI.",
			fn: "*********",
			accountPassword: "Password not match the group rules.",
			vlanrange: "The value is invalid.",
			paramRequestList: "The value is invalid.",
			stdRadAttrRange: 'Value must be similar to "1", "1,5" or "1,5-15,25", number range is {0}-{1}.',
			forbiddenWords: "Value can not be {0}.",
			passwordNotMatch: "The password fields must match.",
			asciikey: 'The value cannot contain spaces or colons ":".',
			shorter: 'The time limit must be shorter than the cycle',
			authPwd: {
				num: 'number',
				letter: 'letter',
				specChar: 'special character',
				andLetter: ' and letter',
				andSpeChar: ' and special character',
				//msg: 'This group password can not include {0} and at least {1} characters',
				msg: 'This group password can not include {0}',
			},
			authPwdLen: 'This group password need at least {0} characters',
			validURL: 'Please enter a valid URL.',
			validTelephoneNum: 'Please enter a valid telephone number.',
			telephoneAndEmail: 'Please enter a telephone or email.',
			validHttpsURL: 'Please enter a valid HTTPS URL.',
			config: {
				externalRadius: {
					authRequired: "You must select at least one server type.",
					autPortRange: "The port range must between {0} and {1}.",
					accountPortRange: "The port range must between {0} and {1}."
				},
				wips: {
					macOuiIpElIpObjectSaved: "The MAC Object must be saved first."
				},
				ppskUserGroup: {
					psElsRequired: "Please select at least one for the password."
				},
				customerRegistration: {
					termsConditionRequired: "Please accept Terms and Conditions"
				},
				directBuy: {
					termsConditionRequired: "Please accept Terms and Conditions"
				},
				ssid: {
					cwpPickerIpElIpObjectSaved: "Please save your captive web portal."
				},
				createMACFirewall: {
					sourceMacIpIpElIpObjectSaved: "The MAC Object must be saved first.",
					destinationMacIpIpElIpObjectSaved: "The MAC Object must be saved first.",
				},
				ntpServer: {
					syncIntervalRange: "Sync Interval must be between {0} and {1}."
				},
				portType: {
					cwpPickerIpElIpObjectSaved: "Please save your captive web portal profile.",
					vlanIpElIpObjectSaved: "Please save your own VLAN.",
					voiceVlanIpElIpObjectSaved: "Please save your own VLAN.",
					dataVlanIpElIpObjectSaved: "Please save your own VLAN."
				},
				createRadioProfile: {
					limitChannel_1Range: "Channel numbers must be between {0} and {1}.",
					limitChannel_2Range: "Channel numbers must be between {0} and {1}.",
					limitChannel_3Range: "Channel numbers must be between {0} and {1}.",
					limitChannel_4Range: "Channel numbers must be between {0} and {1}."
				},
				hiveProfile: {
					hiveNameMinlength: "The length of name must not be shorter than {0}.",
					hiveNameMaxlength: "The length of name must not be longer than {0}.",
					trafficPortRange: "The value of this field must be between {0} and {1}.",
					passwordObsNorElMinlength: "The length of password must be between {0} and 63.",
					passwordObsNorElMaxlength: "The length of password must be between 8 and {0}.",
					passwordObsCfgElMinlength: "The length of password must be between {0} and 63.",
					passwordObsCfgElMaxlength: "The length of password must be between 8 and {0}.",
					rtsThresholdRange: "Please enter a value from {0} to {1}.",
					fragThresholdRange: "Please enter a value from {0} to {1}.",
					strengthPollIntervalRange: "Please enter a value from {0} to {1}.",
					sendBeatsSpecRange: "Please enter a value from 5 to 360000 seconds.",
					sendInfoSpecRange: "Please enter a value from 10 to 36000 seconds."
				},
				userProfileMgt: {
					vlanObjIpElIpObjectSaved: "Please save your own VLAN."
				},
				userProfileQoS: {
					horizontalSlider1Range: "The value must be larger than the value in the Rate Limit Per User.",
					horizontalSlider2Range: "The value must be larger than the value in the Rate Limit Per User.",
					horizontalSlider3Range: "The value must be larger than the value in the Rate Limit Per User."
				},
				trunkSettings: {
					sourceVlanIpElIpObjectSaved: "The VLAN Object must saved first!"
				},
				nativeVlan: {
					mgtVlanIpElIpObjectSaved: "MGT Interface VLAN must be saved.",
					naVlanIpElIpObjectSaved: "Native (untagged) VLAN must be saved."
				},
				accessConsole: {
					macObjIpElIpObjectSaved: "Please save your MAC object first."
				},
				addBonjourFilterRule: {
					serviceNodeIpElIpObjectSaved: "The Bonjour Service object must be saved firstly.",
					fromVlanGroupNodeIpElIpObjectSaved: "The VLAN Group object must be saved firstly.",
					toVlanGroupNodeIpElIpObjectSaved: "The VLAN Group object must be saved firstly."
				}
			},
			deviceonboarding: {
				simulatedDevices: {
					numOfDevicesRange: "The number must be between {0} and {1}."
				},
				defaultNetworkPolicy: {
					numOfDevicesRange: "The number must be between {0} and {1}."
				}
			},
			device: {
				deviceConfiguration: {
					mgt0MtuRange: "The MTU for MGT0 Interface range must be between {0} and {1}.",
					vlanBlockStartRange: "The Reserved VLAN Block range must be between {0} and {1}."
				},
				pseProfile: {
					pseObjIpElIpObjectSaved: "Please save your own PSE Profile."
				},
			},
			plan: {
				metricWidthMax: "The metric width must between {0} and {1}.",
				metricHeightMax: "The metric height must between {0} and {1}.",
				mapWidthMax: "The map size must between {0} and {1}.",
				floor: {
					parentId2Required: "This field is required to select a building node."
				}
			},
			commonObject: {
				appDetectionRules: {
					appGroupNodeIpElIpObjectSaved: "The Application Group object must be saved first."
				}
			},
			privateapp: {
				info: {
					errors: {
						noTermsAccepted: "The terms of use and privacy policy must be accepted to continue.",
						noLicenseKey: "You must enter a valid entitlement key or select the check box to start a 30-day trial."
					}
				}
			}
		}
   	})/*,
	'zh-cn' : true*/
});
