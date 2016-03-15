/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web.auth.model;

import lombok.Data;

/**
 * Define register guest/kiosk reference application settings
 */
@Data
public class RegistrationSettingVo {
    private boolean enableKiosk;

    private boolean enableSingle;

    private boolean enableGroup;
    
    private Long keepTime;

    public RegistrationSettingVo(boolean kiosk, boolean single, boolean group,Long time) {
        enableKiosk = kiosk;
        enableSingle = single;
        enableGroup = group;
        keepTime = time;
    }
}
