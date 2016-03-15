/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web.auth.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Define api access token 
 *
 * @author thimmayyaame
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApolloAccessTokenVo {

    private Long ownerId;
    
    private String vhmId;
    
    private String vpcUrl;
    
    private Long expireAt;
    
    private String accessToken;
    
    private String refreshToken;
    
}
