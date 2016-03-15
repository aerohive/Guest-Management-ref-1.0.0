var userOAuthToken = document.cookie.indexOf('hmAT') > -1 ? true : false;

function initUserAuth() {
	// Setup a login form the user. Also a registration form for the user if the pingapp does not know about him.
}

function initOAuth() {
	if (!userOAuthToken) {
		// load iframe or open in new window

	    // URL for authentication on Apollo
//	    var apolloUrl = GDATA.webappProps.apolloUrlBase + GDATA.webappProps.apolloUrlThirdPartyLogin + '?';
//        apolloUrl += 'client_id=' + GDATA.webappProps.apolloClientId + '&';
//        apolloUrl += 'redirect_uri=' + GDATA.webappProps.apolloRedirectUri;

	    // URL for Ping ID / federated ID authentication
	    //TODO: Make this configurable similar to apolloUrl above.
	    //var apolloUrl = 'https://sso-dev.aerohive.com:9031/sp/startSSO.ping?PartnerIdpId=http://innovation.aerohive.com/adfs/services/trust&TargetResource=https://10.16.134.154/acct-webapp/services/acct/idfederation/pf';
	    var apolloUrl;
	    if (GDATA.webappProps.oauthLoginIsAd == true || GDATA.webappProps.oauthLoginIsAd == 'true') {
	        apolloUrl = GDATA.webappProps.oauthLoginAdUrl + '?';
			apolloUrl += 'PartnerIdpId=' + GDATA.webappProps.oauthLoginIdpUrl + '&';
			apolloUrl += 'TargetResource=' + GDATA.webappProps.oauthLoginTargetResourceUrl;
	    } else {
			apolloUrl = GDATA.webappProps.apolloUrlBase + GDATA.webappProps.apolloUrlThirdPartyLogin + '?';
	        apolloUrl += 'client_id=' + GDATA.webappProps.apolloClientId + '&';
	        apolloUrl += 'redirect_uri=' + GDATA.webappProps.apolloRedirectUri;
		}

		if (GDATA.useIFrameAuth) {
	        $('#apolloLoginFrame').attr('src', apolloUrl);
	        $('#apolloLoginDiv').show();
	    } else {
	        window.open(apolloUrl);
	    }

	}
}
