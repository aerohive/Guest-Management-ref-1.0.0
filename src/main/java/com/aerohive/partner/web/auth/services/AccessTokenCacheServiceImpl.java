/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web.auth.services;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

import com.aerohive.partner.web.auth.model.ApolloAccessTokenVo;

/**
 * Implement access token cache 
 *
 * @author Roger Weng <rweng@aerohive.com>
 */
@Service("accessTokenCacheService")
public class AccessTokenCacheServiceImpl implements AccessTokenCacheService {

    private final static Map<String, ApolloAccessTokenVo> cacheInMemory = new HashMap<String, ApolloAccessTokenVo>();

    public ApolloAccessTokenVo getAccessTokenByValue(String accessTokenValue) {
        ApolloAccessTokenVo apolloAccessTokenVo = null;
        if (cacheInMemory.containsKey(accessTokenValue)) {
            apolloAccessTokenVo = cacheInMemory.get(accessTokenValue);
        }
        return apolloAccessTokenVo;
    }

    public synchronized void storeAccessToken(ApolloAccessTokenVo accessTokenVo) {
        cacheInMemory.put(accessTokenVo.getAccessToken(), accessTokenVo);
    }
}
