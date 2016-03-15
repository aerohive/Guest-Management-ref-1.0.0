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

    <script type="text/javascript">
        var dojoConfig = {
            async : true,
            locale: 'en-us',
            paths : {
                "ah" : "${pageContext.request.contextPath}/${version_path}/resources/scripts/ah",
                "i18n" : "${pageContext.request.contextPath}/${version_path}/resources/i18n"
            }
        }, GDATA = {
            ctx : '${pageContext.request.contextPath}',
            kiosk : '${kiosk}',
            authError : '${authError}',
            oauthLoginUrl : '${oauthLoginUrl}'
        };

    </script>
</head>
<body class="claro" id='main'> <!--4-->
<div id="J-msg-holder" style="width:1220px"></div>
<div style='z-index:999; position:absolute; margin-top:-170px; top:50%; margin-left:-200px; margin-left:-200px; left:50%; display:none;' id="apolloLoginDiv">
</div>

<div data-dojo-type="ah/app/WelcomeHome" style='position:relative;' data-dojo-props="parent: this"></div>

<script src="${pageContext.request.contextPath}/resources/scripts/dojo/dojo.js"></script>

<script>
    require(["dojo/parser","ah/app/WelcomeHome"], function(parser) {
        parser.parse();
    });
</script>

</body>
</html>
