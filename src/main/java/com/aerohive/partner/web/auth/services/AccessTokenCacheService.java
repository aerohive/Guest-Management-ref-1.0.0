/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web.auth.services;

import com.aerohive.partner.web.auth.model.ApolloAccessTokenVo;

/**
 * Define access token cache service
 *
 * @author Roger Weng <rweng@aerohive.com>
 */
public interface AccessTokenCacheService {
    ApolloAccessTokenVo getAccessTokenByValue(String accessTokenValue);
    void storeAccessToken(ApolloAccessTokenVo accessTokenVo);
}
