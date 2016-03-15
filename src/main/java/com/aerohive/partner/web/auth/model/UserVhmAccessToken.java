/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web.auth.model;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

/**
 * Define account and access token
 *
 * @author thimmayyaame
 */
public class UserVhmAccessToken {

    @Id
    @Getter private String id;
    
    @Indexed(unique = true)
    @Getter private String   userId;
    
    protected UserVhmAccessToken() {
        
    }
    
    public UserVhmAccessToken(String userId) {
        this.userId = userId;
    }
    
    @Getter
    private Map<Long, ApolloAccessTokenVo> tokens = new HashMap<Long, ApolloAccessTokenVo>();
    
}
