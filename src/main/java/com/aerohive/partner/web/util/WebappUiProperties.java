/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web.util;

import lombok.Getter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Define register guest/kiosk reference application properties
 *
 * @author thimmayyaame
 */
@Getter
@Component("webappUiProperties")
public class WebappUiProperties {
    
    @Value("${app.apollo.url.base:}")
    private String apolloUrlBase;

    @Value("${app.apollo.url.thirdpartylogin:}")
    private String apolloUrlThirdPartyLogin;

    @Value("${app.apollo.clientId:}")
    private String apolloClientId;

    @Value("${app.apollo.clientRedirectUri:}")
    private String apolloRedirectUri;

    @Value("${oauth.login.ad.enable:true}")
    private boolean oauthLoginIsAd;

    @Value("${oauth.login.ad.url:}")
    private String oauthLoginAdUrl;

    @Value("${oauth.login.idp.url:}")
    private String oauthLoginIdpUrl;

    @Value("${oauth.login.target.resource.url:}")
    private String oauthLoginTargetResourceUrl;

    @Value("${oauth.login.at.same.page:true}")
    private boolean oauthLoginAtSamePage;
}
