/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import lombok.Getter;

/**
 * Define internal exeption to custom error mapping
 */
@Getter
public class CustomResponseException extends IOException {
    
    Map<String, Object> properties = new HashMap<String, Object>();
}
