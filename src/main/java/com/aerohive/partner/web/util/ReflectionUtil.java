/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */
package com.aerohive.partner.web.util;

import java.util.Map;

public class ReflectionUtil {

    @SuppressWarnings("unchecked")
    public static <TARGET> TARGET convertToObject(Class<TARGET> voClass, Object o) {
        if(o == null) {
            return null;
        }
        else if(voClass.isAssignableFrom(o.getClass())) {
            return (TARGET) o;
        }
        else if(o instanceof Map) {
            String s = JsonUtil.toJsonString(o);
            return (TARGET) JsonUtil.toObject(s, voClass);
        }
        else {
            throw new RuntimeException(String.format("Can't convert type %s to %s", 
                    o.getClass().getName(), voClass.getName()));
        }
    }
    
}
