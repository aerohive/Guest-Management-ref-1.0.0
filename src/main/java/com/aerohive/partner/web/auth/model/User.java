/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web.auth.model;

import lombok.Getter;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

/**
 * Define user
 */
public class User {
    
    public static final String ROLE_USER = "ROLE_USER";
    
    @Id
    @Getter private String id;
    
    @Indexed(unique = true)
    @Getter private String   username;
    
    @Getter private String   password;
    @Getter private String   role;

    protected User() {
    }

    public User(String username, String password, String role) {
        this.username = username;
        this.password = DigestUtils.sha1Hex(password);
        this.role = role;
    }

    public void setId() {
        //return id;
    }

    public String getSHA1Password() {
        return password;
    }

}
