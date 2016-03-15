<html>
<head>

<script src="${pageContext.request.contextPath}/resources/js/lib/jquery-2.1.3.js"></script>
<script type="text/javascript">
var result = '${result}';
var hmAT = '${hmAT}';
var errorCode = '${errorCode}';

// Check if window was opened by another window or if this is an iframe
var parentWin = (window.opener ? window.opener : (window.parent == window.top ? window.parent : null));
if (window.opener) {
    window.close();
}

console.log("parentWin is " + parentWin);

if (parentWin != null) {
    if (result == true || result == 'true') {
        parentWin.userAuthResult(true, hmAT);
    } else {
        parentWin.userAuthResult(false, errorCode);
    }
}
</script>
</head>
<body></body>

</html>
