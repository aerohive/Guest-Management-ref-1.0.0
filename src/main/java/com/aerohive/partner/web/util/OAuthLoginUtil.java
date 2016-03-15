/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web.util;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author Roger Weng <rweng@aerohive.com>
 */
@Component
public class OAuthLoginUtil {

    /* For use autowired component in static method. */
    private static WebappUiProperties staticWebappUiProperties;

    @Autowired
    private WebappUiProperties webappUiProperties;

    @PostConstruct
    public void init() {
        OAuthLoginUtil.staticWebappUiProperties = webappUiProperties;
    }

    public static String getOauthLoginUrl() {
        StringBuilder oauthLoginUrl = new StringBuilder();
        if (staticWebappUiProperties.isOauthLoginIsAd()) {
            oauthLoginUrl.append(staticWebappUiProperties.getOauthLoginAdUrl())
                .append('?').append("PartnerIdpId=").append(staticWebappUiProperties.getOauthLoginIdpUrl())
                .append('&').append("TargetResource=").append(staticWebappUiProperties.getOauthLoginTargetResourceUrl());
        }
        else {
            oauthLoginUrl.append(staticWebappUiProperties.getApolloUrlBase())
                .append(staticWebappUiProperties.getApolloUrlThirdPartyLogin())
                .append('?').append("client_id=").append(staticWebappUiProperties.getApolloClientId())
                .append('&').append("redirect_uri=").append(staticWebappUiProperties.getApolloRedirectUri());
        }
        return oauthLoginUrl.toString();
    }

    public static boolean hasAccessToken(final HttpServletRequest request) {
        return CookieUtil.getCookieByName(request, "hmAT") != null&&CookieUtil.getCookieByName(request, "hmAT").getValue() != null;
    }
}

