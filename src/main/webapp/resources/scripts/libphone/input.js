







<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>

    	<title>Input Guest Info</title>








<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
<link rel="stylesheet" href="/idmanager/static/style/prettyUI.css" type="text/css" />
<script src="/idmanager/static/src/js/hm.util.js"></script>
<script src="/idmanager/static/src/js/jquery.min.js"></script>
<script src="/idmanager/static/src/js/jquery.blockUI.js"></script>

<!--[if IE]><script src="/idmanager/static/jquery/utils/excanvas.js" type="text/javascript" charset="utf-8"></script><![endif]-->
<script>
    var secToken = "-252842393";
	var locale = "zh_CN";
	var ctx = "/idmanager";
</script>


    </head>
    <body



    			style="background-color:#0e1218"


    	  >








<form id="singleReg" action="singleReg" method="post">
<input type="hidden" name="loginname" id="loginname" />
<input type="hidden" name="guestKind" id="guestKind" value="single"/>
<input type="hidden" name="operation" id="operation"/>
<input id="phonenumber" name="phoneNumber" type="hidden" value=""/>
<input type="hidden" name="templateId" id="templateId" value='6'/>
<div class="container">
	<a href="javascript:submitAction('');" alt="return to Home" title="return to Home"><div class="header" ></div></a>
	<div class="mainbody">
		<div class="content">
			<div class="contentTitle">
				<div class="contentTitle1">
					<img src="/idmanager/static/images/prettyUI/gmol-guesttype1.png" />
				</div>
				<div class="contentTitle2">
					<span class="h12">


					Register a Guest

					</span>
					<span class="h1Img2"></span>
					<div class="p2">


					Please enter credentials.


					</div>
				</div>
			</div>
			<div class="contentDetail">
			<!-- ============================================================== -->

				<div class="field">
					<div class="fieldName">
						First Name<span class="organge">*</span>
					</div>
					<div>
						<input type="text" id="firstname" onkeypress="return hm.util.keyPressPermit(event,'idm');"  value='' name="firstname" autocorrect = "off" maxlength="32" class="init focus" onkeyup="removeAlert(this);"/>
					</div>
					<div id="firstnameErr" class="inputErr"></div>
				</div>


				<div class="field">
					<div class="fieldName">
						Last Name<span class="organge">*</span>
					</div>
					<div>
						<input type="text" id="lastname" onkeypress="return hm.util.keyPressPermit(event,'idm');" name="lastname" value='' autocorrect = "off" maxlength="32" class="init focus" onkeyup="removeAlert(this);"/>
					</div>
					<div id="lastnameErr" class="inputErr"></div>
				</div>


				<div class="field">
					<div class="fieldName">
						Representing
					</div>
					<div>
						<input id="organization" name="organization" onkeypress="return hm.util.keyPressPermit(event,&#39;idm&#39;);" onkeyup="removeAlert(this);" autocorrect="off" class="init focus" type="text" value="" maxlength="128"/>
					</div>
					<div id="organizationErr" class="inputErr"></div>
				</div>


				<div class="field">
					<div class="fieldName">
						Here to Visit
					</div>
					<div>
						<input id="visitpurpose" name="visitPurpose" onkeypress="return hm.util.keyPressPermit(event,&#39;idm&#39;);" onkeyup="removeAlert(this);" autocorrect="off" class="init focus" type="text" value="xliang7@test.com" maxlength="128"/>
					</div>
					<div id="visitpurposeErr" class="inputErr"></div>
				</div>


				<div class="field">
					<div class="fieldName">
						Email Address<span class="organge">*</span>
					</div>
					<div>
						<input id="email" name="email" onkeypress="return hm.util.keyPressPermit(event,&#39;idm&#39;);" onkeyup="removeAlert(this);" autocorrect="off" class="init focus" type="email" value="" maxlength="128"/>
					</div>
					<div id="emailErr" class="inputErr"></div>
				</div>


				<div class="field">
					<div class="fieldName">
						Phone Number
					</div>
					<div>
						<div class="fl" style="width:235px;">
							<div style="position:relative;" class="fl">
								<input type="text" id="countryCode" name="countryCode" autocorrect = "off" class="phonenumerInput radiusLeft phoneCountryCode cursor countryCodeInit focus" readonly="readonly" maxlength="5" onkeyup="removeTelAlert('countryCode');"/>
								<div style="position:absolute;z-index:3000;text-align:left;display:none;width:300px;border:1px solid #666;background-color:#fff;" id="ac_results" class="ac_results">
								</div>
								</div>
								<div class="fl" style="width:100px;">
									<input type="tel" id="telNoCode" name="telNoCode" value='' autocorrect = "off" class="telNoCodeInit focus" value='' style="border-radius: 0 10px 10px 0;" onkeyup="removeTelAlert('telNoCode');"/>
								</div>
			     		</div>
					</div>
					<div id="phonenumberErr" class="inputErr"></div>
				</div>

				<div id="emailTelErr" class="actionErr" style="padding-left:20px;"></div>
			<!-- ============================================================== -->
			</div>
			<div class="contenFoot">
				<a href="javascript:submitAction('singleGuestChoice');">
					<img class="backImg" src="/idmanager/static/images/prettyUI/gmol-small-back.png" />
					<span class="backSpan">Back</span>
				</a>
				<a href="javascript:submitAction('doSingleGuestInput');">
					<img class="continueImg" src="/idmanager/static/images/prettyUI/gmol-big-continue.png" ></img>
					<span id="continue" class="continueSpan">Next</span>
				</a>
			</div>

		</div>
	</div>
	<div class="footer"><div class="footer_img" ></div></div>
</div>
</form>

<script src="/idmanager/static/src/js/libphone/base.js" ></script>
<script src="/idmanager/static/src/js/libphone/error.js" ></script>
<script src="/idmanager/static/src/js/libphone/string.js" ></script>
<script src="/idmanager/static/src/js/libphone/asserts.js" ></script>
<script src="/idmanager/static/src/js/libphone/array.js" ></script>
<script src="/idmanager/static/src/js/libphone/useragent.js" ></script>
<script src="/idmanager/static/src/js/libphone/browserfeature.js" ></script>
<script src="/idmanager/static/src/js/libphone/tagname.js" ></script>
<script src="/idmanager/static/src/js/libphone/classes.js" ></script>
<script src="/idmanager/static/src/js/libphone/math.js" ></script>
<script src="/idmanager/static/src/js/libphone/coordinate.js" ></script>
<script src="/idmanager/static/src/js/libphone/size.js" ></script>
<script src="/idmanager/static/src/js/libphone/object.js" ></script>
<script src="/idmanager/static/src/js/libphone/dom.js" ></script>
<script src="/idmanager/static/src/js/libphone/json.js" ></script>
<script src="/idmanager/static/src/js/libphone/descriptor.js" ></script>
<script src="/idmanager/static/src/js/libphone/util.js" ></script>
<script src="/idmanager/static/src/js/libphone/fielddescriptor.js" ></script>
<script src="/idmanager/static/src/js/libphone/message.js" ></script>
<script src="/idmanager/static/src/js/libphone/serializer.js" ></script>
<script src="/idmanager/static/src/js/libphone/objectserializer.js" ></script>
<script src="/idmanager/static/src/js/libphone/stringbuffer.js" ></script>

<script src="/idmanager/static/src/js/libphone/phonemetadata.pb.js" ></script>
<script src="/idmanager/static/src/js/libphone/phonenumber.pb.js" ></script>
<script src="/idmanager/static/src/js/libphone/metadata.js" ></script>
<script src="/idmanager/static/src/js/libphone/phonenumberutil.js" ></script>

<script src="/idmanager/static/src/js/libphone/lazydeserializer.js" ></script>
<script src="/idmanager/static/src/js/libphone/pbliteserializer.js" ></script>
<script src="/idmanager/static/src/js/libphone/asyoutypeformatter.js" ></script>
<script type="text/javascript">
<!--
var countrycodeData = [
            			{'sname':'US','name':'United States','value':'1'},
            			{'sname':'CA','name':'Canada','value':'1'},
            			{'sname':'NL','name':'Netherlands','value':'31'},
            			{'sname':'BE','name':'Belgium','value':'32'},
            			{'sname':'FR','name':'France','value':'33'},
            			{'sname':'ES','name':'Spain','value':'34'},
            			{'sname':'AT','name':'Austria','value':'43'},
            			{'sname':'GB','name':'United Kingdom','value':'44'},
            			{'sname':'DK','name':'Denmark','value':'45'},
            			{'sname':'SE','name':'Sweden','value':'46'},
            			{'sname':'DE','name':'Germany','value':'49'},
            			{'sname':'MX','name':'Mexico','value':'52'},
            			{'sname':'BR','name':'Brazil','value':'55'},
            			{'sname':'AU','name':'Australia','value':'61'},
            			{'sname':'NZ','name':'New Zealand','value':'64'},
            			{'sname':'KR','name':'Korea, Republic Of','value':'82'},
            			{'sname':'CN','name':'China','value':'86'}
            	 ];
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
function createCountryCodeButton(countryBtn,menuList,phoneInput){
	var codehtml = "<ul style=\"max-height: 180px; overflow: auto;\">";
	var otherText = 'Others';
 	 var od = "";
 	var i=0;
 	 for(;i<countrycodeData.length;i++){
 		 if(i % 2 == 0){
 			 od =  "ac_even";
 		 }else{
 			 od = "ac_odd";
 		 }
 		 codehtml += "<li class='"+od+" cursor'><div class='fl align-r' style='width:50px;'>+"+countrycodeData[i].value+"</div><div class='fl align-l' style='width:220px;'>&nbsp;-&nbsp; "+countrycodeData[i].name+"</div></li>";
 	 }
 	if(i % 2 == 0){
		 od =  "ac_even";
	 }else{
		 od = "ac_odd";
	 }
 	codehtml += "<li id='cothers' class='"+od+" cursor'><div class='fl align-r' style='width:50px;'>&nbsp;</div><div class='fl align-l' style='width:220px;'>&nbsp;-&nbsp; "+otherText+"</div></li>";
 	 codehtml += "</ul>";
 	 $("#"+menuList).html(codehtml);
	 $("#"+countryBtn).click(function(){
		if($("#"+menuList).css("display") == "block"){
			$("#"+menuList).css("display","none");
		}else{
			$("#"+menuList).css("display","block");
		}
		//$("#"+phoneInput).focus();
	 });

	 $("#"+menuList+" ul li").each(function(i){
		 $(this).click(function(){
			 	var firstDiv = $(this).children().eq(0);
				var t = firstDiv.text().trim();
				if(t != ""){
					$("#"+countryBtn).val(t);
					$("#"+countryBtn).attr("readonly","readonly");
					$("#"+phoneInput).focus();
				}else{
					 $("#"+countryBtn).removeAttr("readonly");
					 $("#"+countryBtn).focus();
					 $("#"+countryBtn).val("+");
				}
				$("#"+menuList).css("display","none");
			});
	 });

	 $("#"+phoneInput).click(function(){
		 if($("#"+menuList).css("display") == "block"){
			 $("#"+menuList).css("display","none");
		 }
	 });
}

function getRegionSimpleName(ctryCode){
	ctryCode = ctryCode.trim();
	var sn="";
	if(ctryCode.indexOf("+")>=0){
		ctryCode = ctryCode.substring(1);
	}
	for(var i=0;i<countrycodeData.length;i++){
		if(ctryCode == countrycodeData[i].value){
		 	sn = countrycodeData[i].sname;
		 	break;
		}
	 }
	return sn;
}

function validatePhoneAndCountryCode(phoneNum,countCode){
	countCode = countCode.trim();
	if(countCode.indexOf("+")>=0){
		countCode = countCode.substring(1);
	}
	var result = false;
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
}
//-->
</script>
<script type="text/javascript">
<!--
$(document).ready(function(){

	//add csrf token
	$('form').each(function(){
		$(this).append('<input type="hidden" name="secToken" value="-252842393" />');
	});
});
//-->
</script>
<script>
var formName = 'singleReg';
function submitAction(operation) {
	if (validate(operation)) {
		document.forms[formName].operation.value = operation;

		var countryCode = document.getElementById("countryCode").value.trim();
		var telNoCode = document.getElementById("telNoCode").value.trim();
		if("" != telNoCode && telNoCode.indexOf("0")==0){
			telNoCode = telNoCode.substring(1);
		}
		document.getElementById("phonenumber").value = hm.util.getNumber(countryCode+telNoCode);
		if(telNoCode == ""){
			document.getElementById("phonenumber").value = "";

				var email = document.getElementById("email").value.trim();
				document.getElementById("loginname").value = email;

		}else{
			var phonenumber = document.getElementById("phonenumber").value.trim();
			document.getElementById("loginname").value = hm.util.getNumber(phonenumber);
		}

		var preUrl = 'single';
		if(operation=="doSingleGuestInput"){
			document.forms[formName].action = ctx+'/register/single/confirm';
		}else if(operation=="singleGuestChoice"){
			document.forms[formName].action = ctx+'/register/single';
		}else{
			document.forms[formName].action = ctx+'/register/backWelcome';
		}
		document.forms[formName].submit();
	}
}

function clearErr(){

		document.getElementById('firstnameErr').innerHTML ="";
		$("#firstname").removeClass("alert");
		$("#firstname").addClass("init");


		document.getElementById('lastnameErr').innerHTML ="";
		$("#lastname").removeClass("alert");
		$("#lastname").addClass("init");


		document.getElementById('organizationErr').innerHTML ="";
		$("#organization").removeClass("alert");
		$("#organization").addClass("init");


		document.getElementById('visitpurposeErr').innerHTML ="";
		$("#visitpurpose").removeClass("alert");
		$("#visitpurpose").addClass("init");


		document.getElementById('emailErr').innerHTML ="";
		$("#email").removeClass("alert");
		$("#email").addClass("init");


		document.getElementById('phonenumberErr').innerHTML ="";
        $("#telNoCode").removeClass("telNoCodeAlert");
    	$("#telNoCode").addClass("telNoCodeInit");
        $("#countryCode").removeClass("countryCodeAlert");
    	$("#countryCode").addClass("countryCodeInit");

	if(document.getElementById('emailTelErr') != null){
		document.getElementById('emailTelErr').innerHTML ="";
	}
	if(document.getElementById('actionErr') != null){
		document.getElementById('actionErr').innerHTML ="";
	}
}

function checkEmail(str){
	var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
	return pattern.test(str);
}


function validate(operation) {
	clearErr();
	if ("doSingleGuestInput" != operation)
	{
		return true;
	}

	//First Name

	var firstname = document.getElementById("firstname");
	if (firstname.value.trim().length == 0)
	{
		$("#firstname").removeClass("init");
		$("#firstname").addClass("alert");
		document.getElementById('firstnameErr').innerHTML ="Required";
        return false;
    }


	//Last Name

		var lastname = document.getElementById("lastname");
		if (lastname.value.trim().length == 0)
		{
			$("#lastname").removeClass("init");
			$("#lastname").addClass("alert");
			document.getElementById('lastnameErr').innerHTML ="Required";
	        return false;
	    }



	    var firstname = document.getElementById("firstname");
	    var lastname = document.getElementById("lastname");
	    if((firstname.value.trim().length+lastname.value.trim().length) > 31){
			$("#firstname").removeClass("init");
			$("#firstname").addClass("alert");
			$("#lastname").removeClass("init");
			$("#lastname").addClass("alert");
	    	document.getElementById('emailTelErr').innerHTML ="First Name + Last Name cannot be larger than 31.";
	        return false;
	    }


	//organization




	//Email

		var emailAddr = document.getElementById("email");

			if (emailAddr.value.trim().length == 0)
			{
				$("#email").removeClass("init");
				$("#email").addClass("alert");
				document.getElementById('emailErr').innerHTML ="Required";
		        return false;
		    }

		if (emailAddr.value.trim().length != 0 && !hm.util.checkEmail(emailAddr.value.trim()))
		{
			$("#email").removeClass("init");
			$("#email").addClass("alert");
			document.getElementById('emailErr').innerHTML ="Invalid Format";
			return false;
		}


	//Phone Number

		var telNoCode = document.getElementById("telNoCode");
	    var phoneValue = telNoCode.value.trim();
	    var ccode = $("#countryCode").val().trim();

	    var ccode = $("#countryCode").val().trim();
	    if (phoneValue.length != 0 && (ccode.length <= 0 || ccode == "+"))
		{
	        document.getElementById('phonenumberErr').innerHTML ="Required";
	        $("#countryCode").removeClass("countryCodeInit");
	    	$("#countryCode").addClass("countryCodeAlert");
	        return false;
	    }
	    if (phoneValue.length != 0 && !hm.util.checkPhoneNumber(phoneValue))
		{
	    	document.getElementById('phonenumberErr').innerHTML ="Invalid Format";
	        $("#telNoCode").removeClass("telNoCodeInit");
	    	$("#telNoCode").addClass("telNoCodeAlert");
			return false;
		}
	    if(phoneValue.length != 0 && !validatePhoneAndCountryCode(phoneValue, ccode)){
			document.getElementById('phonenumberErr').innerHTML ="Invalid Format";
	        $("#telNoCode").removeClass("telNoCodeInit");
	    	$("#telNoCode").addClass("telNoCodeAlert");
			return false;
		}



	//visit for check


	return true;
}

function removeAlert(e){
	$("#"+ e.id).removeClass("alert");
	$("#"+ e.id).addClass("init");
}
function removeTelAlert(id){
	$("#"+ id).removeClass(id+"Alert");
	$("#"+ id).addClass(id+"Init");
}

function onLoadPage() {
	document.title="Single Registration";
	locationBtn();
	createCountryCodeButton("countryCode","ac_results","telNoCode");
	var ptext = '1';
	if(ptext != ''){
		if(ptext.indexOf("+") < 0){
			ptext = "+"+ptext;
		}
		$("#countryCode").val(ptext);
	}else{
		$("#countryCode").val('+1');
	}
}
function locationBtn(){
	var width = document.getElementById('continue').offsetWidth;
	var left = (300-width/2)+"px";
	$("#continue").css({ "left": left});
}
$(document).ready(function(){
	onLoadPage();
	$("#countryCode").keypress(function(event) {
		$('#phonenumberErr').html("");
		return hm.util.keyPressPermit(event,'phoneNum');
    }).focus(function() {
        this.style.imeMode='disabled';
    });
	$("#telNoCode").keypress(function(event) {
		$('#phonenumberErr').html("");
		return hm.util.keyPressPermit(event,'phoneNum');
    }).focus(function() {
        this.style.imeMode='disabled';
    });

});
</script>
    </body>
</html>
