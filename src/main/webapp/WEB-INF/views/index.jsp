<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page session="false" %>

<%
    boolean isDev = Boolean.FALSE;
    String isDevParam = request.getParameter("isDev");
    if (isDevParam != null) {
      	try {
          	isDev = Boolean.parseBoolean(isDevParam);
        }catch(Exception e) {
          	return;
        }
    }
%>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<title>Registrator</title>
	<link rel="icon" href="../../resources/images/favicon.ico" />

	<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/scripts/dojo/resources/dojo.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/scripts/dijit/themes/claro/claro.css"/>
	<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/styles/common/font.css" />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/scripts/dgrid/css/dgrid.css" />
	<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/scripts/dgrid/css/skins/claro.css" />

		<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/styles/common/common.css" />
		<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/styles/widget/widget.css" />
		<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/styles/content.css" />
		<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/styles/font-awesome.min.css" />

		<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/styles/configuration/configuration.css" />

	<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/guestmgmtapp.css"/>
	<script src="${pageContext.request.contextPath}/resources/js/lib/jquery-2.1.3.js"></script>
	<script src="${pageContext.request.contextPath}/resources/js/app/auth.js"></script>
  <script src="${pageContext.request.contextPath}/resources/js/app/apiclient.js"></script>

  <!-- phoneValidate start -->
  <script src="${pageContext.request.contextPath}/resources/scripts/libphone/base.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/error.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/string.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/asserts.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/array.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/useragent.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/browserfeature.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/tagname.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/classes.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/math.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/coordinate.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/size.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/object.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/dom.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/json.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/descriptor.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/util.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/fielddescriptor.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/message.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/serializer.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/objectserializer.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/stringbuffer.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/phonemetadata.pb.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/phonenumber.pb.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/metadata.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/phonenumberutil.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/lazydeserializer.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/pbliteserializer.js" ></script>
	<script src="${pageContext.request.contextPath}/resources/scripts/libphone/asyoutypeformatter.js" ></script>
	<!-- phoneValidate end -->

	<script type="text/javascript">
	  var dojoConfig = {
			async : true,
			locale: 'en-us',
			paths : {
				"ah" : "${pageContext.request.contextPath}/${version_path}/resources/scripts/ah",
				"i18n" : "${pageContext.request.contextPath}/${version_path}/resources/i18n"
				}
	    }, GDATA = {
	        ctx : '${pageContext.request.contextPath}'
	  };

	   var GDATA = {
	        ctx : '${pageContext.request.contextPath}',
	        webappProps: {
	            apolloUrlBase:'${webappUiProperties.apolloUrlBase}',
	            apolloUrlThirdPartyLogin: '${webappUiProperties.apolloUrlThirdPartyLogin}',
	            apolloClientId: '${webappUiProperties.apolloClientId}',
	            apolloRedirectUri: '${webappUiProperties.apolloRedirectUri}',
	            oauthLoginIsAd: '${webappUiProperties.oauthLoginIsAd}',
	            oauthLoginAdUrl: '${webappUiProperties.oauthLoginAdUrl}',
	            oauthLoginIdpUrl: '${webappUiProperties.oauthLoginIdpUrl}',
	            oauthLoginTargetResourceUrl:'${webappUiProperties.oauthLoginTargetResourceUrl}'
	        },
	        useIFrameAuth: false
	    };

		$( document ).ready(initOAuth);

		function userAuthResult(success, code) {
		    if (GDATA.useIFrameAuth) {
		        //$('#apolloLoginFrame').remove();
		        $('#apolloLoginDiv').css('display', 'none');
		    }
		    if (success) {
		        //$('#thanks').show();
		        //$('#authCode').text("accessToken = " + code);
		        //fetchApolloData("/services/config/policy/networkpolicies/filter", 1006, showApiResponse);
		    } else {
		        $('#nothanks').show();
		    }
		}
		function showApiResponse(data) {
		    $('#apiResult').text(JSON.stringify(data));
		}

	</script>
</head>
<body class="claro" id='main'> <!--4-->
	<div id="J-msg-holder" style="width:1220px"></div>
	<div style='z-index:999; position:absolute; margin-top:-170px; top:50%; margin-left:-200px; margin-left:-200px; left:50%; display:none;' id="apolloLoginDiv">
	<!-- 	<h2 style='width:254px; font-size:20px; margin-left:75px; color:#fff;'>Hive API with Ping Identity</h2> -->
		<div>
	      <iframe id="apolloLoginFrame" width="400" height="400"
	             scrolling="auto" frameborder="1">

	      </iframe>
	  </div>
  <!-- <div id="apiResult" style="color: blue; border: 1px solid blue;"></div> -->
  </div>
	<h4 id="thanks" style="display:none; color:#fff;">Thank you for granting access! <span id="authCode"></span></h4>
  <h4 id="nothanks" style="display:none; color:#fff;">Sorry, we cannot display your VHM data without access.</h4>

	<div data-dojo-type="ah/app/RegisterHome" style='position:relative;' data-dojo-props="parent: this"></div>

		<script src="${pageContext.request.contextPath}/resources/scripts/dojo/dojo.js"></script>

  <script>
    require(["dojo/parser","ah/app/RegisterHome"], function(parser) {
			parser.parse();
		});
	</script>

</body>
</html>
