/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import com.aerohive.partner.web.util.OAuthLoginUtil;

/**
 * Register Guest/Kiosk Reference Application - View Controller
 */
@Controller
public class ViewController {

    @Value("${oauth.login.at.same.page:true}")
    private boolean oauthLoginAtSamePage;

    @Value("${app.kiosk.enable}")
    private boolean appEnableKiosk;

    @RequestMapping(value = {"/view/error"}, method = RequestMethod.GET)
    public ModelAndView loadErrorPage() {
        return new ModelAndView("error");
    }

    @RequestMapping(value = {"", "/", "/view"}, method = RequestMethod.GET)
    public ModelAndView loadIndexPage(HttpServletRequest request, HttpServletResponse response) {
        ModelAndView mav = null;
        System.out.println("App is running on "
                               + (appEnableKiosk ? "Kiosk" : "Self Registration")
                               + " mode.");
        if (OAuthLoginUtil.hasAccessToken(request) || !oauthLoginAtSamePage) {
            mav = new ModelAndView("index");
        } else {
            if (appEnableKiosk) {
                mav = new ModelAndView("welcome");
                mav.addObject("kiosk", appEnableKiosk);
            } else {
                mav = new ModelAndView("welcome");
                mav.addObject("oauthLoginUrl", OAuthLoginUtil.getOauthLoginUrl());
            }
        }
        return mav;
    }

}
