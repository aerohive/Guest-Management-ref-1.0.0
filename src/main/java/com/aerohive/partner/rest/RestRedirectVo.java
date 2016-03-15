/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.rest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Workaround for the issue that UI Ajax can not handle 302 properly
 */
@Data @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class RestRedirectVo {
    private String redirect;
}
