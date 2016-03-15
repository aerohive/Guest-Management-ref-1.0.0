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
 * Define user view object from form 
 *
 * @author thimmayyaame
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVo {
    
    private String username;
    private String password;

}
