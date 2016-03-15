/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web.auth;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.util.Arrays;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import lombok.extern.log4j.Log4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import com.aerohive.partner.rest.ResponseEnvelope;
import com.aerohive.partner.web.auth.model.ApolloAccessTokenVo;
import com.aerohive.partner.web.util.CookieUtil;
import com.aerohive.partner.web.util.OAuthLoginUtil;
import com.aerohive.partner.web.util.ReflectionUtil;

/**
 * OAuth authentication Controller
 * - handle oauth exchange authtoken to accesstoken
 * - handle https SSL
 * - handle kiosk login/logout 
 * 
 * @author thimmayyaame
 */
@Controller @Log4j
@RequestMapping("/oauth")
public class OAuthController {
    
    @Value("${app.webapp.protocol:}")
    private String protocol;
    
    @Value("${app.webapp.hostname:}")
    private String hostname;
    
    @Value("${app.webapp.port:}")
    private String port;

    @Value("${app.webapp.contextroot:}")
    private String contextroot;

    @Value("${app.apollo.url.base:}")
    private String apolloAccessTokenUrlBase;
    
    @Value("${app.apollo.url.accesstoken:}")
    private String apolloAccessTokenUri;
    
    @Value("${app.apollo.clientId:}")
    private String apolloClientId;

    @Value("${app.apollo.clientSecret:}")
    private String apolloClientSecret;
    
    @Value("${app.apollo.clientId.header:}")
    private String apolloClientIdHeader;

    @Value("${app.apollo.clientSecret.header:}")
    private String apolloClientSecretHeader;
    
    @Value("${app.apollo.clientRedirectUri:}")
    private String apolloClientRedirectUri;
    
    @Value("${app.apollo.clientRedirectUri.header:}")
    private String apolloClientRedirectUriHeader;
    
    @Value("${app.disable.ssl.verification:false}")
    private boolean disableSslVerification;

    @Value("${app.service.path}")
    private String cookiePath;

    @Value("${app.server.address}")
    private String cookieDomain;

    @Value("${app.cookie.expire}")
    private int cookieExpire;

    @Value("${oauth.login.at.same.page:true}")
    private boolean oauthLoginAtSamePage;

    @Value("${app.kiosk.enable}")
    private boolean appEnableKiosk;

    @Value("${app.kiosk.password}")
    private String kioskPassword;

    @PostConstruct
    private void disableSslVerification() {
        if (!disableSslVerification) {
            return;
        }
        
        try
        {
            // Create a trust manager that does not validate certificate chains
            TrustManager[] trustAllCerts = new TrustManager[] {new X509TrustManager() {
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

                public void checkClientTrusted(java.security.cert.X509Certificate[] arg0, String arg1)
                        throws CertificateException {
                    // TODO Auto-generated method stub
                    
                }
                public void checkServerTrusted(java.security.cert.X509Certificate[] arg0, String arg1)
                        throws CertificateException {
                    // TODO Auto-generated method stub
                    
                }
            }
            };

            // Install the all-trusting trust manager
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            // Create all-trusting host name verifier
            HostnameVerifier allHostsValid = new HostnameVerifier() {
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            };

            // Install the all-trusting host verifier
            HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        }
    }
    
    @RequestMapping(value="authcode", method=RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE })
    public ModelAndView handleAuthCode(
        @RequestParam(value = "authCode", required = false) String authCode,
        @RequestParam(value = "error", required = false) String error,
            HttpServletRequest req, HttpServletResponse response) {
        ModelAndView mav = null;
        if (oauthLoginAtSamePage) {
            mav = new ModelAndView("index");
        } else {
            mav = new ModelAndView("oauthresult");
        }
        if (authCode != null) {
            System.out.println("AuthCode = " + authCode);
        }
        if (error != null) {
            mav.addObject("authError", error);
        }
        if (!StringUtils.isEmpty(authCode)) {
            // call acct-webapp with authcode to get access_token
            String url = apolloAccessTokenUrlBase + apolloAccessTokenUri + "?"
                    + "authCode=" + authCode
                    + "&redirectUri=" + apolloClientRedirectUri;//getRedirectUri();
            
            HttpSession session = req.getSession(false);
            //if (null == session)
            
            
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();   
            headers.set(apolloClientIdHeader, apolloClientId);
            headers.set(apolloClientSecretHeader, apolloClientSecret);
            headers.set(apolloClientRedirectUriHeader, apolloClientRedirectUri);
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
            HttpEntity<Void> requestEntity = new HttpEntity<Void>(null, headers);
            
            try {
                ResponseEnvelope<?> re = restTemplate.postForObject(url, requestEntity, ResponseEnvelope.class);
                Map<String, Map> tokens = ReflectionUtil.convertToObject(Map.class, re.getData());
                if (tokens.size() > 0) {
                    session = req.getSession(true);
                }
                for (String key : tokens.keySet()) {
                    ApolloAccessTokenVo atvo = ReflectionUtil.convertToObject(ApolloAccessTokenVo.class, tokens.get(key));
                    session.setAttribute("hmAT", atvo.getAccessToken()); // TODO: Send hashed/encrypted token
                    Cookie cookie = new Cookie("hmAT", atvo.getAccessToken()); // TODO: hash/encrypt session token in cookie
                    // cookie.setDomain(pattern);// TODO: Set domain appropriately. Do not set root domain.
                    cookie.setPath(cookiePath);
                    cookie.setDomain(cookieDomain);
                    cookie.setMaxAge(cookieExpire);
                    response.addCookie(cookie);
//                    accessTokenCacheService.storeAccessToken(atvo);
                }
                
                if (tokens.size() > 0) {
                    System.out.println("cookie: " + tokens.toString());
                    mav.addObject("result", true);
                } else {
                    System.out.println("No access token has been granted.");
                    mav = new ModelAndView("welcome");
                    mav.addObject("result", false);
                    mav.addObject("errorCode", 401);
                    mav.addObject("authError", "No access token has been granted.");
                }
            } catch(HttpStatusCodeException he) {
                mav = new ModelAndView("redirect:/");
                he.printStackTrace();
                mav.addObject("errorCode", he.getStatusCode().value());
            } catch (RestClientException e) {
                mav = new ModelAndView("redirect:/");
                mav.addObject("result", false);
                mav.addObject("errorCode", 500);
            }
        }
        
        return mav;
    }

    @RequestMapping(value="logout", method=RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE })
    public ModelAndView logout(HttpServletRequest req, HttpServletResponse response) {
        Cookie tokenInCookie = getAccessTokenInCookie(req);
        if (tokenInCookie != null) {
            // delete access token from apollo
            String logoutUrl = getLogoutUrl();
            HttpHeaders headers = createHeaders();
            HttpEntity<?> requestEntity = new HttpEntity<Void>(null, headers);
            final RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<ResponseEnvelope> re = restTemplate.exchange(
                    logoutUrl + "?token=" + tokenInCookie.getValue(),
                    HttpMethod.DELETE, requestEntity, ResponseEnvelope.class);
            if (re.getStatusCode() != HttpStatus.OK) {
                System.out.println("Revoke access token failed");
            } else {
                System.out.println("Access token revoked: " + tokenInCookie.getValue());
            }
            // delete access token in cookie
            deleteAccessTokenInCookie(tokenInCookie,response);
//            response.addCookie(tokenInCookie);
        }
        return new ModelAndView("redirect:/view");
    }

    @RequestMapping(value="/login/kiosk", method=RequestMethod.POST,
        produces = { MediaType.APPLICATION_JSON_VALUE })
    public ModelAndView loginKiosk(@RequestBody String vo,
                                   HttpServletRequest req, HttpServletResponse response) {
        ModelAndView mav = null;
        if (("password=" + kioskPassword).equals(vo)) {
            String oauthLoginUrl = OAuthLoginUtil.getOauthLoginUrl();
            mav = new ModelAndView("redirect:" + oauthLoginUrl);
        } else {
            mav = new ModelAndView("welcome");
            mav.addObject("kiosk", appEnableKiosk);
            mav.addObject("authError", "Kiosk passcode error.");
        }
        return mav;
    }

    private Cookie getAccessTokenInCookie(HttpServletRequest request) {
        Cookie cookieAccessToken = CookieUtil.getCookieByName(request, "hmAT");
        if (cookieAccessToken != null) {
            return cookieAccessToken;
        }
        return null;
    }

    private void deleteAccessTokenInCookie(Cookie cookie,HttpServletResponse response) {
        cookie.setMaxAge(0);
        cookie.setDomain(cookieDomain);
        cookie.setPath(cookiePath);
        cookie.setValue(null);
        cookie.setComment("EXPIRING COOKIE at " + System.currentTimeMillis());
        response.addCookie(cookie);
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.set(HttpHeaders.CONTENT_TYPE.toString(), MediaType.APPLICATION_JSON_VALUE);
        headers.set(HttpHeaders.ACCEPT.toString(), MediaType.APPLICATION_JSON_VALUE);

        headers.set(apolloClientIdHeader, apolloClientId);
        headers.set(apolloClientSecretHeader, apolloClientSecret);
        headers.set(apolloClientRedirectUriHeader, apolloClientRedirectUri);
        return headers;
    }

    private String getLogoutUrl() {
        return apolloAccessTokenUrlBase + "/services/acct/thirdparty/accesstoken";
    }
}
